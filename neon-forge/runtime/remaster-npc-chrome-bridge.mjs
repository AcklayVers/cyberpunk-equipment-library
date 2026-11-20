import {
  FORGE_FLAG,
  MODULE_ID,
  REMASTER_MODULE_ID,
} from "../forge/constants.mjs";

let registered = false;

function collectionValues(collection) {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  if (Array.isArray(collection.contents)) return collection.contents;
  if (collection instanceof Map) return [...collection.values()];
  try {
    return [...collection].map((value) =>
      Array.isArray(value) && value.length === 2 ? value[1] : value,
    );
  } catch {
    return [];
  }
}

function collectionHas(collection, id) {
  if (!collection || !id) return false;
  if (typeof collection.has === "function") return collection.has(id);
  if (typeof collection.get === "function") return Boolean(collection.get(id));
  return collectionValues(collection).some((item) => item?.id === id);
}

function remasterModule() {
  return globalThis.game?.modules?.get?.(REMASTER_MODULE_ID) ?? null;
}

export function remasterCyberwareTab() {
  const module = remasterModule();
  if (!module?.active) return null;
  return module.api?.CyberwareTab ?? null;
}

export function isForgeNpc(actor) {
  return Boolean(
    actor?.type === "npc" &&
      actor.flags?.[MODULE_ID]?.[FORGE_FLAG]?.generated === true,
  );
}

function sheetElement(html) {
  const ElementClass = globalThis.HTMLElement;
  if (ElementClass && html instanceof ElementClass) return html;
  if (ElementClass && html?.[0] instanceof ElementClass) return html[0];
  if (html?.querySelector) return html;
  if (html?.[0]?.querySelector) return html[0];
  return null;
}

/**
 * Forge NPCs deliberately reuse Cyberpunk Remaster's real Chrome tab.  CPEL
 * does not render or maintain a second copy of that UI.
 */
export function injectRemasterChromeForForgeNpc(app, html) {
  if (!isForgeNpc(app?.actor)) return false;
  const CyberwareTab = remasterCyberwareTab();
  const element = sheetElement(html);
  if (!CyberwareTab?.inject || !element) return false;
  CyberwareTab.inject(app, element);
  return true;
}

export function forgeImplantContainerId(item) {
  const actor = item?.actor;
  if (!isForgeNpc(actor)) return null;
  if (!["equipment", "armor", "weapon", "consumable", "ammo", "treasure", "backpack", "shield"].includes(item.type)) return null;
  const flagged = item?.flags?.[MODULE_ID]?.implantContainerId;
  if (!flagged || flagged === item.id || item.flags?.[MODULE_ID]?.[FORGE_FLAG]?.kind === "implant-container") return null;
  const CyberwareTab = remasterCyberwareTab();
  const cyberware = typeof CyberwareTab?.isCyberware === "function"
    ? CyberwareTab.isCyberware(item)
    : Boolean(item?.flags?.[REMASTER_MODULE_ID]?.cyberware);
  if (!cyberware) return null;
  if (flagged && collectionHas(actor.items, flagged)) return flagged;

  const fallback = collectionValues(actor.items).find(
    (candidate) =>
      candidate?.type === "backpack" &&
      candidate?.flags?.[MODULE_ID]?.[FORGE_FLAG]?.kind === "implant-container",
  );
  return fallback?.id ?? null;
}

function setContainerChange(changes, containerId) {
  if (!changes || typeof changes !== "object") return;
  if (
    changes.system &&
    typeof changes.system === "object" &&
    Object.prototype.hasOwnProperty.call(changes.system, "containerId")
  ) {
    changes.system.containerId = containerId;
  } else {
    changes["system.containerId"] = containerId;
  }
}

/**
 * Remaster's normal installationUpdate() clears system.containerId for
 * implanted equipment.  Forge NPC chrome must remain inside the dedicated
 * «Импланты» backpack, so every update of a Forge-managed implant reasserts
 * that container while leaving Remaster's installed/parentId state intact.
 */
export function preserveForgeImplantContainer(item, changes) {
  const containerId = forgeImplantContainerId(item);
  if (!containerId) return false;
  setContainerChange(changes, containerId);
  return true;
}

function managedForgeCyberware(actor, CyberwareTab) {
  return collectionValues(actor?.items).filter((item) => {
    if (!item?.flags?.[MODULE_ID]?.implantContainerId) return false;
    return typeof CyberwareTab?.isCyberware === "function"
      ? CyberwareTab.isCyberware(item)
      : Boolean(item?.flags?.[REMASTER_MODULE_ID]?.cyberware);
  });
}

/**
 * Finalize Forge-created chrome against Remaster's live API.  This is called
 * after Neon-Кузница has created the backpack and linked PKT/modules, so the
 * Remaster tab opens with every generated implant already installed and with
 * module parent links preserved.
 */
export async function reconcileForgeNpcChrome(actor) {
  if (!isForgeNpc(actor)) return { managed: 0, installed: 0, restored: 0 };
  const CyberwareTab = remasterCyberwareTab();
  if (!CyberwareTab) return { managed: 0, installed: 0, restored: 0 };

  const managed = managedForgeCyberware(actor, CyberwareTab);
  const updates = [];
  let installed = 0;
  let restored = 0;

  for (const item of managed) {
    const containerId = forgeImplantContainerId(item);
    if (!containerId) continue;

    const update = { _id: item.id };
    const alreadyInstalled =
      typeof CyberwareTab.isInstalled === "function"
        ? CyberwareTab.isInstalled(item)
        : item?.flags?.[REMASTER_MODULE_ID]?.installed === true;

    if (!alreadyInstalled && typeof CyberwareTab.installationUpdate === "function") {
      Object.assign(update, CyberwareTab.installationUpdate(item, true));
      update._id = item.id;
      installed += 1;
    }

    if (item.system?.containerId !== containerId || update["system.containerId"] !== undefined) {
      update["system.containerId"] = containerId;
      restored += item.system?.containerId === containerId ? 0 : 1;
    }

    if (Object.keys(update).length > 1) updates.push(update);
  }

  if (updates.length && typeof actor.updateEmbeddedDocuments === "function") {
    await actor.updateEmbeddedDocuments("Item", updates, {
      cyberpunkForgeOperation: true,
      cpelNeonForgeManaged: true,
      cyberpunkRemasterManaged: true,
    });
  }

  if (typeof CyberwareTab.reconcileHumanity === "function") {
    await CyberwareTab.reconcileHumanity(actor);
  }
  if (typeof CyberwareTab.reconcileGrantedItems === "function") {
    await CyberwareTab.reconcileGrantedItems(actor);
  }

  return { managed: managed.length, installed, restored };
}

export function registerRemasterNpcChromeBridge() {
  if (registered || !globalThis.Hooks?.on) return false;
  registered = true;

  globalThis.Hooks.on("renderActorSheet", injectRemasterChromeForForgeNpc);
  globalThis.Hooks.on("renderActorSheetV2", injectRemasterChromeForForgeNpc);
  globalThis.Hooks.on("preUpdateItem", (item, changes) => {
    preserveForgeImplantContainer(item, changes);
  });
  return true;
}
