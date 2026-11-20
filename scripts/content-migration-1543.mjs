const MODULE_ID = "cyberpunk-equipment-library";

const CAPACITY_BY_NAME = new Map(Object.entries({"Hello Cutie ModBall Gun": 5, "Militech Viper": 40, "Faisal’s Convenience": 8, "Dai Lung Streetmaster": 12, "Faisal’s Escape Plan": 12, "Mustang Arms Mark II": 14, "Nomad .357 Magnum": 18, "Pursuit Security E-TACK Rapid Responder": 18, "Sanroo Hello Cutie Happy Dancer": 40, "Трах Бабах": 4}));

function migrateInPlace(source) {
  if (!source || typeof source !== "object") return false;
  let changed = false;

  if (source.type === "weapon" && CAPACITY_BY_NAME.has(source.name)) {
    source.system ??= {};
    source.system.ammo ??= {};
    const capacity = CAPACITY_BY_NAME.get(source.name);
    if (source.system.ammo.capacity !== capacity) {
      source.system.ammo.capacity = capacity;
      changed = true;
    }
  }

  for (const subitem of source.system?.subitems ?? []) {
    if (migrateInPlace(subitem)) changed = true;
  }

  return changed;
}

function clone(value) {
  return globalThis.foundry?.utils?.deepClone ? foundry.utils.deepClone(value) : structuredClone(value);
}

export function migrateSource1543(source) {
  const copy = clone(source);
  migrateInPlace(copy);
  return copy;
}

function buildUpdate(item, migrated) {
  const original = item._source ?? item.toObject(false);
  const update = {};

  if (migrated.system?.ammo?.capacity !== original.system?.ammo?.capacity) {
    update["system.ammo.capacity"] = migrated.system?.ammo?.capacity;
  }
  if (JSON.stringify(migrated.system?.subitems ?? []) !== JSON.stringify(original.system?.subitems ?? [])) {
    update["system.subitems"] = migrated.system?.subitems ?? [];
  }

  return update;
}

async function migrateDocument(item) {
  const source = item._source ?? item.toObject(false);
  const migrated = migrateSource1543(source);
  const update = buildUpdate(item, migrated);
  if (!Object.keys(update).length) return false;

  await item.update(update, {
    render: false,
    [MODULE_ID]: { migration1543: true },
  });
  return true;
}

Hooks.once("ready", async () => {
  if (!game.user?.isGM) return;
  let updated = 0;

  for (const actor of game.actors ?? []) {
    for (const item of actor.items ?? []) {
      try {
        if (await migrateDocument(item)) updated += 1;
      } catch (error) {
        console.warn(`[${MODULE_ID}] v1.5.43: не удалось обновить «${item?.name ?? "предмет"}»`, error);
      }
    }
  }

  for (const item of game.items ?? []) {
    try {
      if (await migrateDocument(item)) updated += 1;
    } catch (error) {
      console.warn(`[${MODULE_ID}] v1.5.43: не удалось обновить мировой предмет «${item?.name ?? "предмет"}»`, error);
    }
  }

  if (updated) console.info(`[${MODULE_ID}] v1.5.43: обновлено предметов: ${updated}`);
});
