const MODULE_ID = "cyberpunk-equipment-library";

const AMMO_PREFIXES = [
  "Винтовочные патроны",
  "Пистолетные патроны",
  "Жакан",
  "Дробь",
  "Стрелы",
];

const SMARTLINK_NAME = "Коннектор Smartlink";
const SMARTLINK_ATTACK_TEXT =
  "При включённом захвате цели Смартлинк даёт +1 бонус обстоятельства к атакам именно этого оружия.";

function isNegligibleAmmo(source) {
  if (source?.type !== "ammo") return false;
  const name = String(source.name ?? "");
  return AMMO_PREFIXES.some((prefix) => name.startsWith(prefix));
}

function cleanSmartlink(source) {
  if (source?.name !== SMARTLINK_NAME) return false;
  let changed = false;

  const description = source.system?.description?.value;
  if (typeof description === "string" && description.includes(SMARTLINK_ATTACK_TEXT)) {
    const paragraph = `<p>${SMARTLINK_ATTACK_TEXT}</p>`;
    source.system.description.value = description.includes(paragraph)
      ? description.replace(paragraph, "")
      : description.replace(SMARTLINK_ATTACK_TEXT, "");
    changed = true;
  }

  const sourceMeta = source.flags?.world?.neonForgeSourceMeta;
  const mechanical = sourceMeta?.mechanical;
  if (mechanical && Object.prototype.hasOwnProperty.call(mechanical, "attackBonus")) {
    delete mechanical.attackBonus;
    changed = true;
  }

  const upgrade = source.flags?.world?.neonForgeUpgrade;
  const actualRuleCount = Array.isArray(source.system?.rules) ? source.system.rules.length : null;
  if (upgrade && Number.isInteger(actualRuleCount) && upgrade.ruleCount !== actualRuleCount) {
    upgrade.ruleCount = actualRuleCount;
    changed = true;
  }

  return changed;
}

function migrateInPlace(source) {
  if (!source || typeof source !== "object") return false;
  let changed = false;

  if (isNegligibleAmmo(source)) {
    source.system ??= {};
    source.system.bulk ??= {};
    if (source.system.bulk.value !== 0) {
      source.system.bulk.value = 0;
      changed = true;
    }
  }

  if (source.type === "weapon" && source.name === "IMI UZ 2045 Pro") {
    source.system ??= {};
    source.system.ammo ??= {};
    if (source.system.ammo.capacity !== 40) {
      source.system.ammo.capacity = 40;
      changed = true;
    }
  }

  if (cleanSmartlink(source)) changed = true;

  for (const subitem of source.system?.subitems ?? []) {
    if (migrateInPlace(subitem)) changed = true;
  }

  return changed;
}

function clone(value) {
  return globalThis.foundry?.utils?.deepClone ? foundry.utils.deepClone(value) : structuredClone(value);
}

export function migrateSource1542(source) {
  const copy = clone(source);
  migrateInPlace(copy);
  return copy;
}

function buildUpdate(item, migrated) {
  const original = item._source ?? item.toObject(false);
  const update = {};

  if (migrated.system?.bulk?.value !== original.system?.bulk?.value) {
    update["system.bulk.value"] = migrated.system?.bulk?.value;
  }
  if (migrated.system?.ammo?.capacity !== original.system?.ammo?.capacity) {
    update["system.ammo.capacity"] = migrated.system?.ammo?.capacity;
  }
  if (migrated.system?.description?.value !== original.system?.description?.value) {
    update["system.description.value"] = migrated.system?.description?.value;
  }
  if (JSON.stringify(migrated.system?.subitems ?? []) !== JSON.stringify(original.system?.subitems ?? [])) {
    update["system.subitems"] = migrated.system?.subitems ?? [];
  }
  if (
    JSON.stringify(migrated.flags?.world?.neonForgeSourceMeta) !==
    JSON.stringify(original.flags?.world?.neonForgeSourceMeta)
  ) {
    update["flags.world.neonForgeSourceMeta"] = migrated.flags?.world?.neonForgeSourceMeta;
  }
  if (
    JSON.stringify(migrated.flags?.world?.neonForgeUpgrade) !==
    JSON.stringify(original.flags?.world?.neonForgeUpgrade)
  ) {
    update["flags.world.neonForgeUpgrade"] = migrated.flags?.world?.neonForgeUpgrade;
  }

  return update;
}

async function migrateDocument(item) {
  const source = item._source ?? item.toObject(false);
  const migrated = migrateSource1542(source);
  const update = buildUpdate(item, migrated);
  if (!Object.keys(update).length) return false;

  await item.update(update, {
    render: false,
    [MODULE_ID]: { migration1542: true },
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
        console.warn(`[${MODULE_ID}] v1.5.42: не удалось обновить «${item?.name ?? "предмет"}»`, error);
      }
    }
  }

  for (const item of game.items ?? []) {
    try {
      if (await migrateDocument(item)) updated += 1;
    } catch (error) {
      console.warn(`[${MODULE_ID}] v1.5.42: не удалось обновить мировой предмет «${item?.name ?? "предмет"}»`, error);
    }
  }

  if (updated) console.info(`[${MODULE_ID}] v1.5.42: обновлено предметов: ${updated}`);
});
