const MODULE_ID = "cyberpunk-equipment-library";
const RUNTIME_FLAG = "fumaBlade";
const TEMPLATE_FLAG = "fumaBladeTemplates";
const RUNTIME_VERSION = 2;
const INTERNAL_OPTION = "fumaBladeSync";
const RECONCILE_DELAY_MS = 60;

const FUMA_IDS = new Set(["8e86a45a935ccea1", "3ad4485e225e65e5"]);
const MIXED_SUFFIX = ":mixed-loadout";
const DEPLOYED_SUFFIX = ":blades-deployed";
const PROFILE_ORDER = ["right-heavy", "left-heavy", "light", "enhanced-heavy"];
const STANDARD_PROFILES = new Set(["right-heavy", "left-heavy"]);
const MIXED_PROFILES = new Set(["light", "enhanced-heavy"]);

const pending = new Map();
const preDeleteActors = new WeakMap();

function clone(value) {
  if (globalThis.foundry?.utils?.deepClone) return foundry.utils.deepClone(value);
  return structuredClone(value);
}

function itemId(item) {
  return item?.id ?? item?._id ?? item?._source?._id ?? null;
}

function sourceObject(item) {
  if (!item) return null;
  if (typeof item.toObject === "function") return item.toObject(false);
  if (item._source && typeof item._source === "object") return clone(item._source);
  return clone(item);
}

function canonicalSourceId(item) {
  const direct = item?._stats?.compendiumSource ?? item?._source?._stats?.compendiumSource ?? item?.flags?.core?.sourceId ?? item?._source?.flags?.core?.sourceId;
  const match = String(direct ?? "").match(/\.Item\.([A-Za-z0-9]{16})$/u);
  if (match) return match[1];
  const id = itemId(item);
  return FUMA_IDS.has(id) ? id : null;
}

export function isFumaFrame(item) {
  if (!item || item.type !== "equipment") return false;
  const cpel = item?.flags?.[MODULE_ID] ?? item?._source?.flags?.[MODULE_ID] ?? {};
  if (cpel.baseFrame === "Fūma Kotarō") return true;
  if (cpel.auditName === "Fūma Kotarō") return true;
  return FUMA_IDS.has(canonicalSourceId(item));
}

export function isManagedFumaBlade(item) {
  return item?.flags?.[MODULE_ID]?.[RUNTIME_FLAG]?.managed === true || item?._source?.flags?.[MODULE_ID]?.[RUNTIME_FLAG]?.managed === true;
}

function frameOptionPrefix(frame) {
  const sourceId = canonicalSourceId(frame) ?? itemId(frame) ?? "fuma";
  return `cpel:fuma:${sourceId}`;
}

export function fumaToggleRules(frame) {
  const prefix = frameOptionPrefix(frame);
  return [
    {
      key: "RollOption",
      domain: "all",
      option: `${prefix}${MIXED_SUFFIX}`,
      toggleable: true,
      value: false,
      label: "Fūma Kotarō — комплект клинков: смешанный",
      phase: "beforeDerived",
      priority: 30,
      requiresEquipped: true,
    },
    {
      key: "RollOption",
      domain: "all",
      option: `${prefix}${DEPLOYED_SUFFIX}`,
      toggleable: true,
      value: false,
      label: "Fūma Kotarō — клинки: выдвинуты",
      phase: "beforeDerived",
      priority: 31,
      requiresEquipped: true,
    },
  ];
}

export function withFumaToggleRules(frame) {
  const source = sourceObject(frame);
  if (!source) return source;
  source.system ??= {};
  const rules = Array.isArray(source.system.rules) ? clone(source.system.rules) : [];
  const hasMixed = rules.some((rule) => rule?.key === "RollOption" && String(rule.option ?? "").endsWith(MIXED_SUFFIX));
  const hasDeployed = rules.some((rule) => rule?.key === "RollOption" && String(rule.option ?? "").endsWith(DEPLOYED_SUFFIX));
  const [mixed, deployed] = fumaToggleRules(frame);
  if (!hasMixed) rules.push(mixed);
  if (!hasDeployed) rules.push(deployed);
  source.system.rules = rules;
  return source;
}

export function fumaState(frame) {
  const rules = sourceObject(frame)?.system?.rules ?? [];
  const mixed = rules.find((rule) => rule?.key === "RollOption" && String(rule.option ?? "").endsWith(MIXED_SUFFIX));
  const deployed = rules.find((rule) => rule?.key === "RollOption" && String(rule.option ?? "").endsWith(DEPLOYED_SUFFIX));
  return { loadout: mixed?.value === true ? "mixed" : "standard", deployed: deployed?.value === true };
}

function profileFromName(name) {
  const text = String(name ?? "").toLocaleLowerCase("ru-RU");
  if (text.includes("усиленный тяжёлый")) return "enhanced-heavy";
  if (text.includes("лёгкий")) return "light";
  if (text.includes("левый")) return "left-heavy";
  if (text.includes("правый")) return "right-heavy";
  return null;
}

function selectedProfiles(state) {
  return state.loadout === "mixed" ? MIXED_PROFILES : STANDARD_PROFILES;
}

function normalizeProfileTraits(source, profile) {
  source.system ??= {};
  source.system.traits ??= { value: [], otherTags: [], rarity: "uncommon" };
  const current = Array.isArray(source.system.traits.value) ? [...source.system.traits.value] : [];
  const withoutTwin = current.filter((trait) => trait !== "twin");
  source.system.traits.value = STANDARD_PROFILES.has(profile) ? [...withoutTwin, "twin"] : withoutTwin;
  return source;
}

function equippedState(active) {
  return { carryType: active ? "held" : "worn", invested: null, handsHeld: active ? 1 : 0 };
}

function sanitizeBladeSource(subitem, frame, profile, state) {
  const source = clone(subitem);
  delete source._id;
  delete source._key;
  delete source._stats;
  delete source.folder;
  delete source.sort;
  delete source.ownership;
  source.type = "weapon";
  source.system ??= {};
  normalizeProfileTraits(source, profile);
  source.system.containerId = null;
  const active = state.deployed && selectedProfiles(state).has(profile);
  source.system.equipped = { ...(source.system.equipped ?? {}), ...equippedState(active) };
  source.flags ??= {};
  source.flags[MODULE_ID] = {
    ...(source.flags[MODULE_ID] ?? {}),
    [RUNTIME_FLAG]: {
      managed: true,
      frameItemId: itemId(frame),
      frameSourceId: canonicalSourceId(frame),
      profile,
      loadout: state.loadout,
      deployed: state.deployed,
      runtimeVersion: RUNTIME_VERSION,
    },
  };
  return source;
}

function bladeTemplatesForFrame(frame) {
  const source = sourceObject(frame);
  const stored = source?.flags?.[MODULE_ID]?.[TEMPLATE_FLAG];
  if (Array.isArray(stored) && stored.length) return clone(stored);
  return clone(source?.system?.subitems ?? []);
}

function normalizedBladeTemplates(templates) {
  const found = new Map();
  for (const candidate of templates ?? []) {
    if (candidate?.type !== "weapon") continue;
    const profile = profileFromName(candidate.name);
    if (!profile || found.has(profile)) continue;
    const source = clone(candidate);
    normalizeProfileTraits(source, profile);
    found.set(profile, source);
  }
  return PROFILE_ORDER.map((profile) => found.get(profile)).filter(Boolean);
}

async function migrateActorFumaTemplates(actor, frame) {
  const source = sourceObject(frame);
  const visible = Array.isArray(source?.system?.subitems) ? source.system.subitems : [];
  const stored = source?.flags?.[MODULE_ID]?.[TEMPLATE_FLAG];
  const base = Array.isArray(stored) && stored.length ? stored : visible;
  const templates = normalizedBladeTemplates(base);
  if (templates.length !== 4 || typeof actor?.updateEmbeddedDocuments !== "function") return templates;

  const needsStore = !Array.isArray(stored) || JSON.stringify(stored) !== JSON.stringify(templates);
  const needsStrip = visible.length > 0;
  if (needsStore || needsStrip) {
    const update = { _id: itemId(frame) };
    if (needsStore) update[`flags.${MODULE_ID}.${TEMPLATE_FLAG}`] = templates;
    if (needsStrip) update["system.subitems"] = [];
    await actor.updateEmbeddedDocuments("Item", [update], { [MODULE_ID]: { [INTERNAL_OPTION]: true }, render: false });
  }
  return templates;
}

export function bladeSourcesForFrame(frame, templates = null) {
  const state = fumaState(frame);
  const found = new Map();
  for (const subitem of normalizedBladeTemplates(templates ?? bladeTemplatesForFrame(frame))) {
    const profile = profileFromName(subitem.name);
    if (profile && !found.has(profile)) found.set(profile, sanitizeBladeSource(subitem, frame, profile, state));
  }
  return PROFILE_ORDER.map((profile) => found.get(profile)).filter(Boolean);
}

function currentEquip(item) {
  const system = item?.system ?? item?._source?.system ?? {};
  return { carryType: system.equipped?.carryType ?? null, handsHeld: Number(system.equipped?.handsHeld ?? 0) };
}

function managedMeta(item) {
  return item?.flags?.[MODULE_ID]?.[RUNTIME_FLAG] ?? item?._source?.flags?.[MODULE_ID]?.[RUNTIME_FLAG] ?? null;
}

export async function cleanupManagedFumaBlades(actor, frameId) {
  if (!actor || !frameId || typeof actor.deleteEmbeddedDocuments !== "function") return 0;
  const ids = Array.from(actor.items ?? [])
    .filter((item) => isManagedFumaBlade(item) && managedMeta(item)?.frameItemId === frameId)
    .map(itemId)
    .filter(Boolean);
  if (!ids.length) return 0;
  await actor.deleteEmbeddedDocuments("Item", ids, { [MODULE_ID]: { [INTERNAL_OPTION]: true }, render: true });
  return ids.length;
}

export async function reconcileFumaBlades(actor) {
  if (!actor || !["character", "npc"].includes(actor.type)) return { created: 0, updated: 0, removed: 0 };
  const items = Array.from(actor.items ?? []);
  const frames = items.filter(isFumaFrame);
  const frameIds = new Set(frames.map(itemId).filter(Boolean));
  const managed = items.filter(isManagedFumaBlade);
  let created = 0; let updated = 0; let removed = 0;

  const orphanIds = managed.filter((blade) => !frameIds.has(managedMeta(blade)?.frameItemId)).map(itemId).filter(Boolean);
  if (orphanIds.length && typeof actor.deleteEmbeddedDocuments === "function") {
    await actor.deleteEmbeddedDocuments("Item", orphanIds, { [MODULE_ID]: { [INTERNAL_OPTION]: true }, render: false });
    removed += orphanIds.length;
  }

  for (const frame of frames) {
    const frameId = itemId(frame);
    const state = fumaState(frame);
    const templates = await migrateActorFumaTemplates(actor, frame);
    const desired = bladeSourcesForFrame(frame, templates);
    if (desired.length !== 4) {
      console.warn(`[${MODULE_ID}] Fūma ${frame?.name ?? frameId}: ожидалось 4 профиля клинков, найдено ${desired.length}.`);
      continue;
    }

    const current = Array.from(actor.items ?? []).filter((item) => isManagedFumaBlade(item) && managedMeta(item)?.frameItemId === frameId);
    const byProfile = new Map(current.map((item) => [managedMeta(item)?.profile, item]));
    const creates = [];
    const updates = [];

    for (const source of desired) {
      const profile = source.flags[MODULE_ID][RUNTIME_FLAG].profile;
      const existing = byProfile.get(profile);
      if (!existing) {
        creates.push(source);
        continue;
      }
      const desiredEquip = source.system.equipped;
      const oldEquip = currentEquip(existing);
      const desiredCarry = desiredEquip.carryType;
      const desiredHands = Number(desiredEquip.handsHeld ?? 0);
      if (oldEquip.carryType !== desiredCarry || oldEquip.handsHeld !== desiredHands) {
        updates.push({
          _id: itemId(existing),
          "system.equipped.carryType": desiredCarry,
          "system.equipped.handsHeld": desiredHands,
          [`flags.${MODULE_ID}.${RUNTIME_FLAG}.loadout`]: state.loadout,
          [`flags.${MODULE_ID}.${RUNTIME_FLAG}.deployed`]: state.deployed,
        });
      }
    }

    if (creates.length && typeof actor.createEmbeddedDocuments === "function") {
      const made = await actor.createEmbeddedDocuments("Item", creates, { [MODULE_ID]: { [INTERNAL_OPTION]: true }, render: false });
      created += made?.length ?? creates.length;
    }
    if (updates.length && typeof actor.updateEmbeddedDocuments === "function") {
      await actor.updateEmbeddedDocuments("Item", updates, { [MODULE_ID]: { [INTERNAL_OPTION]: true }, render: false });
      updated += updates.length;
    }

    const desiredProfiles = new Set(desired.map((source) => source.flags[MODULE_ID][RUNTIME_FLAG].profile));
    const stale = current.filter((item) => !desiredProfiles.has(managedMeta(item)?.profile)).map(itemId).filter(Boolean);
    if (stale.length && typeof actor.deleteEmbeddedDocuments === "function") {
      await actor.deleteEmbeddedDocuments("Item", stale, { [MODULE_ID]: { [INTERNAL_OPTION]: true }, render: false });
      removed += stale.length;
    }
  }

  return { created, updated, removed };
}

async function ensureActorFumaToggles(actor) {
  if (!actor || typeof actor.updateEmbeddedDocuments !== "function") return 0;
  const updates = [];
  for (const frame of Array.from(actor.items ?? []).filter(isFumaFrame)) {
    const before = sourceObject(frame)?.system?.rules ?? [];
    const after = withFumaToggleRules(frame)?.system?.rules ?? [];
    if (JSON.stringify(before) !== JSON.stringify(after)) updates.push({ _id: itemId(frame), "system.rules": after });
  }
  if (!updates.length) return 0;
  await actor.updateEmbeddedDocuments("Item", updates, { [MODULE_ID]: { [INTERNAL_OPTION]: true }, render: false });
  return updates.length;
}

function canHandleUser(userId) {
  if (!globalThis.game?.user) return true;
  if (!userId) return Boolean(game.user.isGM);
  return userId === game.user.id;
}

function schedule(actor) {
  if (!actor?.id) return;
  const previous = pending.get(actor.id);
  if (previous) clearTimeout(previous);
  const timer = setTimeout(async () => {
    pending.delete(actor.id);
    try {
      await ensureActorFumaToggles(actor);
      await reconcileFumaBlades(actor);
    } catch (error) {
      console.error(`[${MODULE_ID}] Ошибка синхронизации клинков Fūma у ${actor.name ?? actor.id}`, error);
    }
  }, RECONCILE_DELAY_MS);
  pending.set(actor.id, timer);
}

function relevant(item) {
  return isFumaFrame(item) || isManagedFumaBlade(item);
}

if (globalThis.Hooks?.on) {
  Hooks.on("createItem", (item, options = {}, userId = null) => {
    if (options?.[MODULE_ID]?.[INTERNAL_OPTION] || !relevant(item) || !canHandleUser(userId)) return;
    schedule(item.actor ?? item.parent);
  });
  Hooks.on("updateItem", (item, _changes, options = {}, userId = null) => {
    if (options?.[MODULE_ID]?.[INTERNAL_OPTION] || !relevant(item) || !canHandleUser(userId)) return;
    schedule(item.actor ?? item.parent);
  });
  Hooks.on("preDeleteItem", (item, options = {}, userId = null) => {
    if (options?.[MODULE_ID]?.[INTERNAL_OPTION] || !isFumaFrame(item) || !canHandleUser(userId)) return;
    const actor = item.actor ?? item.parent ?? null;
    if (actor) preDeleteActors.set(item, actor);
  });
  Hooks.on("deleteItem", async (item, options = {}, userId = null) => {
    if (options?.[MODULE_ID]?.[INTERNAL_OPTION] || !relevant(item) || !canHandleUser(userId)) return;
    const actor = item.actor ?? item.parent ?? preDeleteActors.get(item) ?? null;
    if (isFumaFrame(item)) {
      try {
        await cleanupManagedFumaBlades(actor, itemId(item));
      } catch (error) {
        console.error(`[${MODULE_ID}] Не удалось удалить клинки Fūma после удаления рамы`, error);
      } finally {
        preDeleteActors.delete(item);
      }
    } else {
      schedule(actor);
    }
  });
}

if (globalThis.Hooks?.once) {
  Hooks.once("ready", async () => {
    if (!globalThis.game?.user?.isGM) return;
    for (const actor of game.actors ?? []) {
      try {
        await ensureActorFumaToggles(actor);
        await reconcileFumaBlades(actor);
      } catch (error) {
        console.error(`[${MODULE_ID}] Не удалось подготовить клинки Fūma у ${actor.name ?? actor.id}`, error);
      }
    }
  });
}
