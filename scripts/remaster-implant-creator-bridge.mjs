const MODULE_ID = "cyberpunk-equipment-library";
const REMASTER_MODULE_ID = "cyberpunk-remaster";
const REMASTER_FLAG_SCOPE = "cyberpunk-remaster";
// Cyberpunk Remaster intentionally preserves this legacy scope for its integrated creator.
const REMASTER_CREATOR_SCOPE = "cyberpunk-implant-creator";
const REMASTER_MIN_VERSION = "2.8.33";
const REMASTER_CREATOR_VERSION = "1.13.31";
const IMPLANT_PACK_PREFIX = `Compendium.${MODULE_ID}.implants.Item.`;

function clone(value) {
  if (globalThis.foundry?.utils?.deepClone) return foundry.utils.deepClone(value);
  if (globalThis.structuredClone) return structuredClone(value);
  return JSON.parse(JSON.stringify(value ?? {}));
}

function remasterModule() {
  const module = game.modules.get(REMASTER_MODULE_ID);
  return module?.active === true ? module : null;
}

function remasterImplantCreator() {
  return game.modules.get(REMASTER_MODULE_ID)?.api?.implantCreator ?? null;
}

function sourceReferences(item) {
  return [
    item?.sourceId,
    item?._stats?.compendiumSource,
    item?.flags?.core?.sourceId,
  ]
    .filter(Boolean)
    .map(String);
}

function isLibraryCyberware(item) {
  const remasterFlags = item?.flags?.[REMASTER_FLAG_SCOPE];
  if (remasterFlags?.cyberware !== true) return false;

  if (item?.flags?.[REMASTER_CREATOR_SCOPE]?.sourceModule === MODULE_ID) return true;
  if (sourceReferences(item).some((value) => value.startsWith(IMPLANT_PACK_PREFIX))) return true;

  const image = String(item?.img ?? "");
  return ["implants/", "pictograms-detailed/implants/", "pictograms-detailed/quality-revision/implants/"]
    .some(folder => image.startsWith(`modules/${MODULE_ID}/assets/icons/${folder}`));
}

function normalizedCreatorFlags(item) {
  return {
    ...clone(item?.flags?.[REMASTER_CREATOR_SCOPE] ?? {}),
    createdWith: REMASTER_CREATOR_VERSION,
    provider: REMASTER_MODULE_ID,
    sourceModule: MODULE_ID,
  };
}

function creatorFlagsNeedUpdate(item) {
  const flags = item?.flags?.[REMASTER_CREATOR_SCOPE] ?? {};
  return (
    flags.createdWith !== REMASTER_CREATOR_VERSION ||
    flags.provider !== REMASTER_MODULE_ID ||
    flags.sourceModule !== MODULE_ID
  );
}

function applyCreatorMetadataToSource(item) {
  if (!isLibraryCyberware(item) || !creatorFlagsNeedUpdate(item)) return false;
  item.updateSource({
    [`flags.${REMASTER_CREATOR_SCOPE}`]: normalizedCreatorFlags(item),
  });
  return true;
}

async function migrateWorldItems() {
  let updated = 0;
  for (const item of game.items ?? []) {
    if (!isLibraryCyberware(item) || !creatorFlagsNeedUpdate(item)) continue;
    await item.update({
      [`flags.${REMASTER_CREATOR_SCOPE}`]: normalizedCreatorFlags(item),
    });
    updated += 1;
  }
  return updated;
}

async function migrateActorItems() {
  let updated = 0;
  for (const actor of game.actors ?? []) {
    const updates = [];
    for (const item of actor.items ?? []) {
      if (!isLibraryCyberware(item) || !creatorFlagsNeedUpdate(item)) continue;
      updates.push({
        _id: item.id,
        [`flags.${REMASTER_CREATOR_SCOPE}`]: normalizedCreatorFlags(item),
      });
    }
    if (!updates.length) continue;
    await actor.updateEmbeddedDocuments("Item", updates, {
      cpelRemasterCreatorMigration: true,
    });
    updated += updates.length;
  }
  return updated;
}

export async function migrateExistingLibraryCyberware() {
  if (!game.user?.isGM) return { worldItems: 0, actorItems: 0, skipped: true };
  const worldItems = await migrateWorldItems();
  const actorItems = await migrateActorItems();
  return { worldItems, actorItems, skipped: false };
}

function exposeBridgeApi() {
  const module = game.modules.get(MODULE_ID);
  if (!module) return;
  const creator = remasterImplantCreator();
  module.api = {
    ...(module.api ?? {}),
    implantCreator: creator,
    remasterImplantCreator,
    openImplantCreator: (...args) => {
      const api = remasterImplantCreator();
      if (typeof api?.open !== "function") {
        throw new Error(
          `${MODULE_ID} | Требуется Cyberpunk Remaster ${REMASTER_MIN_VERSION}+ со встроенным Implant Creator.`,
        );
      }
      return api.open(...args);
    },
    createImplantFromData: (data) => {
      const api = remasterImplantCreator();
      if (typeof api?.createFromData !== "function") {
        throw new Error(
          `${MODULE_ID} | Встроенный Implant Creator не предоставляет createFromData().`,
        );
      }
      return api.createFromData(data);
    },
    migrateExistingLibraryCyberware,
    remasterModuleId: REMASTER_MODULE_ID,
    remasterMinimumVersion: REMASTER_MIN_VERSION,
    remasterCreatorVersion: REMASTER_CREATOR_VERSION,
  };
}

Hooks.on("preCreateItem", (item, _data, _options, userId) => {
  if (userId && game.user?.id && userId !== game.user.id) return;
  applyCreatorMetadataToSource(item);
});

Hooks.once("init", () => {
  exposeBridgeApi();
});

Hooks.once("ready", async () => {
  exposeBridgeApi();

  const remaster = remasterModule();
  const creator = remasterImplantCreator();
  if (!remaster || typeof creator?.open !== "function" || typeof creator?.createFromData !== "function") {
    console.error(
      `${MODULE_ID} | Требуется ${REMASTER_MODULE_ID} ${REMASTER_MIN_VERSION}+ со встроенным Implant Creator API.`,
    );
    if (game.user?.isGM) {
      ui.notifications?.error?.(
        `Библиотека снаряжения: не найден встроенный Конструктор имплантов Cyberpunk Remaster ${REMASTER_MIN_VERSION}+.`,
      );
    }
    return;
  }

  const standaloneCreator = game.modules.get(REMASTER_CREATOR_SCOPE);
  if (standaloneCreator?.active) {
    console.warn(
      `${MODULE_ID} | Старый отдельный ${REMASTER_CREATOR_SCOPE} активен, но библиотека его игнорирует и использует только API ${REMASTER_MODULE_ID}.`,
    );
  }

  if (game.user?.isGM) {
    try {
      const result = await migrateExistingLibraryCyberware();
      const total = Number(result.worldItems ?? 0) + Number(result.actorItems ?? 0);
      if (total > 0) {
        console.info(
          `${MODULE_ID} | Remaster Implant Creator metadata migrated for ${total} existing cyberware item(s).`,
          result,
        );
      }
    } catch (error) {
      console.error(`${MODULE_ID} | Remaster Implant Creator metadata migration failed`, error);
    }
  }
});
