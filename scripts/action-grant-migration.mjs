const MODULE_ID = "cyberpunk-equipment-library";
const SOURCE_RE = /^Compendium\.cyberpunk-equipment-library\.(gear|weapons|implants)\.Item\.[A-Za-z0-9]+$/;
const ACTION_PREFIX = "Compendium.cyberpunk-equipment-library.actions.Item.";
const PHYSICAL_TYPES = new Set(["ammo", "armor", "backpack", "consumable", "equipment", "shield", "treasure", "weapon"]);
const LEGACY_FLAG_SCOPE = "world";
const LEGACY_FLAG_KEY = "cpelAG";
const RECONCILE_DEBOUNCE_MS = 120;
const pendingActorReconciles = new Map();

const EXOSKELETON_ACTIONS = new Map([
  ["fee27e5d563588a4", ["0d74e387329d275b"]],
  ["c42790427ec84a77", ["c379135042bd3485"]],
  ["63b9b4c8d9fe58a8", ["31b1e229bdb74a59"]],
  ["19b2f1ce61ffdbf0", ["d36c21b799df83fc"]],
  ["8e86a45a935ccea1", ["618714c7530a1ff5", "aa10f8d9e4d3adf2"]],
  ["bc1141db6d48f470", ["6ea30a27abe80fce"]],
  ["8417f5cd6e1bde84", ["bfc1aa889a323b59", "2db0b04f426b4fd0"]],
  ["3ad4485e225e65e5", ["9689da67c79222ad"]],
  ["de925035255f3f15", ["f53f1f2c9cfd7801"]],
]);
const preDeleteActors = new WeakMap();

function sourceItemId(item) {
  for (const ref of sourceReferences(item)) {
    const match = ref.match(/\.Item\.([A-Za-z0-9]{16})$/u);
    if (match) return match[1];
  }
  const id = item?.flags?.[MODULE_ID]?.sourceItemId ?? item?._source?.flags?.[MODULE_ID]?.sourceItemId;
  return typeof id === "string" && id.length === 16 ? id : null;
}

export function exoskeletonActionUuids(item) {
  const id = sourceItemId(item);
  return (EXOSKELETON_ACTIONS.get(id) ?? []).map((actionId) => `${ACTION_PREFIX}${actionId}`);
}

export function sourceReferences(item) {
  return [
    item?._stats?.compendiumSource,
    item?.flags?.core?.sourceId,
    item?.getFlag?.("core", "sourceId"),
  ].filter((value, index, array) =>
    typeof value === "string" && SOURCE_RE.test(value) && array.indexOf(value) === index,
  );
}

export function isImplantLibrarySource(item) {
  if (!item || typeof item !== "object") return false;
  if (sourceReferences(item).some((ref) => ref.includes(".implants.Item."))) return true;

  const remaster = item?.flags?.["cyberpunk-remaster"];
  if (remaster?.cyberware === true || remaster?.pktOnly === true) return true;

  const creator = item?.flags?.["cyberpunk-implant-creator"];
  return Boolean(
    creator &&
    (remaster?.implantType || remaster?.pktFamily || remaster?.pktParentFamily)
  );
}

export function iterateItemSourceTree(itemLike) {
  const root = itemLike?.toObject ? itemLike.toObject(false) : itemLike;
  if (!root || typeof root !== "object") return [];
  const out = [];
  const visit = (source) => {
    if (!source || typeof source !== "object") return;
    out.push(source);
    for (const subitem of source?.system?.subitems ?? []) visit(subitem);
  };
  visit(root);
  return out;
}

function isLibraryActionUuid(value) {
  return typeof value === "string" && value.startsWith(ACTION_PREFIX);
}

function metadataActionUuids(sourceItem) {
  const raw = sourceItem?.flags?.[LEGACY_FLAG_SCOPE]?.[LEGACY_FLAG_KEY];
  return Array.isArray(raw) ? raw.filter(isLibraryActionUuid) : [];
}

export function actionGrantUuids(sourceItem) {
  const exoskeleton = exoskeletonActionUuids(sourceItem);
  if (exoskeleton.length) return exoskeleton;
  if (isImplantLibrarySource(sourceItem)) return [];

  const fromRules = (sourceItem?.system?.rules ?? [])
    .filter((rule) => rule?.key === "GrantItem" && isLibraryActionUuid(rule.uuid))
    .map((rule) => rule.uuid);
  return Array.from(new Set([...metadataActionUuids(sourceItem), ...fromRules]));
}

/** Kept for compatibility with earlier audit tooling. */
export function actionGrants(sourceItem) {
  return actionGrantUuids(sourceItem).map((uuid) => ({ uuid }));
}

function libraryActionSourceUuid(item) {
  const sourceId = item?._stats?.compendiumSource ?? item?.flags?.core?.sourceId ?? item?.getFlag?.("core", "sourceId");
  if (isLibraryActionUuid(sourceId)) return sourceId;
  const migration = item?.flags?.[MODULE_ID]?.actionGrantMigration;
  return isLibraryActionUuid(migration?.sourceActionUuid) ? migration.sourceActionUuid : null;
}

function actorActionForUuid(actor, uuid) {
  return actor.items.find((item) => item.type === "action" && libraryActionSourceUuid(item) === uuid) ?? null;
}

async function grantsForSource(source) {
  const direct = actionGrantUuids(source);
  if (direct.length) return direct;
  if (isImplantLibrarySource(source)) return [];

  for (const ref of sourceReferences(source)) {
    try {
      const canonical = await fromUuid(ref);
      if (isImplantLibrarySource(canonical)) return [];
      const grants = actionGrantUuids(canonical);
      if (grants.length) return grants;
    } catch (error) {
      console.warn(`[${MODULE_ID}] Не удалось прочитать источник ${ref}`, error);
    }
  }
  return [];
}

async function desiredActionUuids(actor) {
  const desired = new Set();
  for (const item of actor.items ?? []) {
    if (item.type === "action") continue;

    const rootSource = item?.toObject ? item.toObject(false) : item;

    for (const source of iterateItemSourceTree(rootSource)) {
      for (const uuid of await grantsForSource(source)) desired.add(uuid);
    }
  }
  return desired;
}

async function createMigratedAction(actor, uuid) {
  const sourceAction = await fromUuid(uuid);
  if (!sourceAction) {
    console.warn(`[${MODULE_ID}] Не найдено служебное действие ${uuid}`);
    return false;
  }

  const data = sourceAction.toObject();
  delete data._id;
  delete data._key;
  delete data.folder;
  delete data.sort;
  delete data._stats;
  data.flags ??= {};
  data.flags.core = { ...(data.flags.core ?? {}), sourceId: uuid };
  data.flags[MODULE_ID] = {
    ...(data.flags[MODULE_ID] ?? {}),
    actionGrantMigration: { sourceActionUuid: uuid },
  };
  await actor.createEmbeddedDocuments("Item", [data], { [MODULE_ID]: { actionGrantSync: true } });
  return true;
}

function migrateLegacyPhysicalSource(source) {
  if (!source || typeof source !== "object") return false;
  let changed = false;

  if (PHYSICAL_TYPES.has(source.type)) {
    const rules = source?.system?.rules ?? [];
    const grants = rules
      .filter((rule) => rule?.key === "GrantItem" && isLibraryActionUuid(rule.uuid))
      .map((rule) => rule.uuid);

    if (grants.length) {
      const existing = metadataActionUuids(source);
      const merged = Array.from(new Set([...existing, ...grants]));
      source.flags ??= {};
      source.flags[LEGACY_FLAG_SCOPE] ??= {};
      source.flags[LEGACY_FLAG_SCOPE][LEGACY_FLAG_KEY] = merged;
      source.system.rules = rules.filter(
        (rule) => !(rule?.key === "GrantItem" && isLibraryActionUuid(rule.uuid)),
      );
      changed = true;
    }
  }

  for (const subitem of source?.system?.subitems ?? []) {
    if (migrateLegacyPhysicalSource(subitem)) changed = true;
  }
  return changed;
}

export function cleanupImplantActionMetadata(source) {
  if (!source || typeof source !== "object") return false;
  let changed = false;

  const worldFlags = source?.flags?.[LEGACY_FLAG_SCOPE];
  if (worldFlags && Object.prototype.hasOwnProperty.call(worldFlags, LEGACY_FLAG_KEY)) {
    delete worldFlags[LEGACY_FLAG_KEY];
    changed = true;
  }

  const rules = source?.system?.rules ?? [];
  const cleanedRules = rules.filter(
    (rule) => !(rule?.key === "GrantItem" && isLibraryActionUuid(rule.uuid)),
  );
  if (cleanedRules.length !== rules.length) {
    source.system.rules = cleanedRules;
    changed = true;
  }

  for (const subitem of source?.system?.subitems ?? []) {
    if (cleanupImplantActionMetadata(subitem)) changed = true;
  }
  return changed;
}

async function migrateLegacyActorItem(item) {
  if (!item || item.type === "action") return false;
  const source = item.toObject(false);
  const implantSource = isImplantLibrarySource(item) || isImplantLibrarySource(source);
  const changed = implantSource
    ? cleanupImplantActionMetadata(source)
    : migrateLegacyPhysicalSource(source);
  if (!changed) return false;

  const update = {};
  if (JSON.stringify(source.system?.rules ?? []) !== JSON.stringify(item._source.system?.rules ?? [])) {
    update["system.rules"] = source.system?.rules ?? [];
  }
  if (JSON.stringify(source.system?.subitems ?? []) !== JSON.stringify(item._source.system?.subitems ?? [])) {
    update["system.subitems"] = source.system?.subitems ?? [];
  }

  const oldWorld = item._source.flags?.[LEGACY_FLAG_SCOPE] ?? {};
  const newWorld = source.flags?.[LEGACY_FLAG_SCOPE] ?? {};
  const oldHasMeta = Object.prototype.hasOwnProperty.call(oldWorld, LEGACY_FLAG_KEY);
  const newHasMeta = Object.prototype.hasOwnProperty.call(newWorld, LEGACY_FLAG_KEY);
  const oldMeta = oldWorld[LEGACY_FLAG_KEY];
  const newMeta = newWorld[LEGACY_FLAG_KEY];

  if (oldHasMeta && !newHasMeta) {
    update[`flags.${LEGACY_FLAG_SCOPE}.-=${LEGACY_FLAG_KEY}`] = null;
  } else if (JSON.stringify(oldMeta ?? []) !== JSON.stringify(newMeta ?? [])) {
    update[`flags.${LEGACY_FLAG_SCOPE}.${LEGACY_FLAG_KEY}`] = newMeta ?? [];
  }

  if (!Object.keys(update).length) return false;
  await item.update(update, { render: false, [MODULE_ID]: { actionGrantLegacyCleanup: true } });
  return true;
}

export async function reconcileActorActions(actor) {
  if (!actor || !["character", "npc"].includes(actor.type)) return { created: 0, updated: 0, removed: 0 };
  const desired = await desiredActionUuids(actor);
  let created = 0;
  let updated = 0;

  for (const uuid of desired) {
    const existing = actorActionForUuid(actor, uuid);
    if (!existing) {
      if (await createMigratedAction(actor, uuid)) created += 1;
      continue;
    }

    try {
      const canonical = await fromUuid(uuid);
      if (canonical?.name && canonical.name !== existing.name) {
        await existing.update(
          { name: canonical.name },
          { render: false, [MODULE_ID]: { actionGrantSync: true } },
        );
        updated += 1;
      }
    } catch (error) {
      console.warn(`[${MODULE_ID}] Не удалось синхронизировать название действия ${uuid}`, error);
    }
  }

  const orphanIds = actor.items
    .filter((item) => {
      const uuid = item.type === "action" ? libraryActionSourceUuid(item) : null;
      return uuid && !desired.has(uuid);
    })
    .map((item) => item.id);
  if (orphanIds.length) {
    await actor.deleteEmbeddedDocuments("Item", orphanIds, { [MODULE_ID]: { actionGrantSync: true } });
  }
  return { created, updated, removed: orphanIds.length };
}

function scheduleActorReconcile(actor) {
  if (!actor?.id || !game.user?.isGM) return;
  const old = pendingActorReconciles.get(actor.id);
  if (old) clearTimeout(old);
  const timer = setTimeout(async () => {
    pendingActorReconciles.delete(actor.id);
    try {
      for (const item of actor.items ?? []) await migrateLegacyActorItem(item);
      const result = await reconcileActorActions(actor);
      if (result.created || result.updated || result.removed) {
        console.info(`[${MODULE_ID}] Действия ${actor.name}: +${result.created}, обновлено ${result.updated}, -${result.removed}`);
      }
    } catch (error) {
      console.error(`[${MODULE_ID}] Ошибка синхронизации действий ${actor.name}`, error);
    }
  }, RECONCILE_DEBOUNCE_MS);
  pendingActorReconciles.set(actor.id, timer);
}

function changeTouches(changes, path) {
  if (!changes || typeof changes !== "object") return false;
  if (Object.prototype.hasOwnProperty.call(changes, path)) return true;
  let cursor = changes;
  for (const part of path.split(".")) {
    if (!cursor || typeof cursor !== "object" || !Object.prototype.hasOwnProperty.call(cursor, part)) return false;
    cursor = cursor[part];
  }
  return true;
}

function isActionSourceCandidate(item) {
  if (!item || !PHYSICAL_TYPES.has(item.type)) return false;
  if (exoskeletonActionUuids(item).length > 0) return true;
  if (isImplantLibrarySource(item)) return false;
  if (actionGrantUuids(item).length > 0) return true;
  return sourceReferences(item).some((ref) => ref.includes(".gear.Item.") || ref.includes(".weapons.Item."));
}

export function shouldReconcileItemChange(item, { event = "update", changes = {}, options = {} } = {}) {
  if (!item || typeof item !== "object") return false;

  const internal = options?.[MODULE_ID] ?? {};
  if (internal.actionGrantSync || internal.actionGrantLegacyCleanup) return false;

  if (item.type === "action") {
    return event === "delete" && Boolean(libraryActionSourceUuid(item));
  }

  if (!isActionSourceCandidate(item)) return false;
  if (event === "create" || event === "delete") return true;
  if (event !== "update") return false;

  return [
    "system.rules",
    "system.subitems",
    `flags.${LEGACY_FLAG_SCOPE}.${LEGACY_FLAG_KEY}`,
    "flags.core.sourceId",
  ].some((path) => changeTouches(changes, path));
}

if (globalThis.Hooks?.on) {
  Hooks.on("createItem", (item, options) => {
    if (!shouldReconcileItemChange(item, { event: "create", options })) return;
    const actor = item?.actor ?? item?.parent ?? null;
    scheduleActorReconcile(actor);
  });

  Hooks.on("updateItem", (item, changes, options) => {
    if (!shouldReconcileItemChange(item, { event: "update", changes, options })) return;
    const actor = item?.actor ?? item?.parent ?? null;
    scheduleActorReconcile(actor);
  });

  Hooks.on("preDeleteItem", (item, options) => {
    if (!shouldReconcileItemChange(item, { event: "delete", options })) return;
    const actor = item?.actor ?? item?.parent ?? null;
    if (actor) preDeleteActors.set(item, actor);
  });

  Hooks.on("deleteItem", (item, options) => {
    if (!shouldReconcileItemChange(item, { event: "delete", options })) return;
    const actor = item?.actor ?? item?.parent ?? preDeleteActors.get(item) ?? null;
    scheduleActorReconcile(actor);
    preDeleteActors.delete(item);
  });
}

if (globalThis.Hooks?.once) Hooks.once("ready", async () => {
  if (!game.user?.isGM) return;
  let cleaned = 0;
  let created = 0;
  let updated = 0;
  let removed = 0;

  for (const actor of game.actors ?? []) {
    try {
      for (const item of actor.items ?? []) {
        if (await migrateLegacyActorItem(item)) cleaned += 1;
      }
      const result = await reconcileActorActions(actor);
      created += result.created;
      updated += result.updated;
      removed += result.removed;
    } catch (error) {
      console.error(`[${MODULE_ID}] Ошибка миграции действий у ${actor.name}`, error);
    }
  }

  if (cleaned || created || updated || removed) {
    console.info(
      `[${MODULE_ID}] v1.5.45 действия: очищено старых привязок ${cleaned}, создано ${created}, обновлено названий ${updated}, удалено устаревших ${removed}.`,
    );
  }
});
