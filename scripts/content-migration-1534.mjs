const MODULE_ID = "cyberpunk-equipment-library";
const WEAPON_PREFIX = `Compendium.${MODULE_ID}.weapons.Item.`;

const RANGE_SOURCE_IDS = new Set([
  "7IrEZw2No0VLvORO", // Eagletech Scorpion
  "9x6qgmtJY24LUR5J", // Eagletech Arbelest
  "nYLt6Ywm8UAlaHrB", // Арбалет
  "l49v9vQOA6kPjTNn", // Eagletech Bearcat
  "mF3cCDFW49NNDBy7", // Eagletech Tomcat
]);

const SHOTGUN_SOURCE_IDS = new Set([
  "8Ix3pBetCQVi4fFc", "EEDCOhe8OZzBdWeS", "FPt9s4owthwwW6mC", "FUIOtZyjjpOVrr9t",
  "G819WMuE2b7Dimvd", "LFWCHIXj7UFs87IB", "MV06BXM7tPSCaqaq", "WzqzCd63wQJ4YBaB",
  "ecoktCFAVBVQbaa3", "fyjZA0IdwEE83udp", "mzklUulaKNnScU53", "s1owrnkiaJbXiYxA",
  "x0GdeCg5zCYmEIKv", "x11bFV6H1fv8c5yQ",
]);

const NAME_TO_SOURCE_ID = new Map([
  ["Eagletech Scorpion", "7IrEZw2No0VLvORO"],
  ["Eagletech Arbelest", "9x6qgmtJY24LUR5J"],
  ["Арбалет", "nYLt6Ywm8UAlaHrB"],
  ["Eagletech Bearcat", "l49v9vQOA6kPjTNn"],
  ["Eagletech Tomcat", "mF3cCDFW49NNDBy7"],
  ["Дробовик Зверь", "8Ix3pBetCQVi4fFc"],
  ["Arasaka Neo Rapid 16", "EEDCOhe8OZzBdWeS"],
  ["Трах Бабах", "FPt9s4owthwwW6mC"],
  ["Сваха", "FUIOtZyjjpOVrr9t"],
  ["SlamDance ElectroMag", "G819WMuE2b7Dimvd"],
  ["Constitutional Arms «Ураган»", "LFWCHIXj7UFs87IB"],
  ["Многоцелевой штурмовой дробовик Аид", "MV06BXM7tPSCaqaq"],
  ["GunMart Home Defender", "WzqzCd63wQJ4YBaB"],
  ["Militech Bulldog", "ecoktCFAVBVQbaa3"],
  ["Rostović DB-2 Satara", "fyjZA0IdwEE83udp"],
  ["Mustang Arms Deathstalker", "mzklUulaKNnScU53"],
  ["Arasaka Rapid Assault", "s1owrnkiaJbXiYxA"],
  ["Budget Arms Carnage", "x0GdeCg5zCYmEIKv"],
  ["Ктех ТехноМолот", "x11bFV6H1fv8c5yQ"],
]);

function sourceIdFor(item) {
  const refs = [item?._stats?.compendiumSource, item?.flags?.core?.sourceId, item?.getFlag?.("core", "sourceId")];
  for (const ref of refs) {
    if (typeof ref === "string" && ref.startsWith(WEAPON_PREFIX)) return ref.slice(WEAPON_PREFIX.length);
  }
  return NAME_TO_SOURCE_ID.get(item?.name) ?? null;
}

function clone(value) {
  return globalThis.foundry?.utils?.deepClone ? foundry.utils.deepClone(value) : structuredClone(value);
}

export function build1534WeaponMigration(item, canonical) {
  if (!item || item.type !== "weapon" || !canonical || canonical.type !== "weapon") return {};
  const id = sourceIdFor(item);
  if (!id) return {};
  const changes = {};

  if (RANGE_SOURCE_IDS.has(id)) {
    const desiredRange = canonical.system?.range;
    if (typeof desiredRange === "number" && item.system?.range !== desiredRange) {
      changes["system.range"] = desiredRange;
    }
  }

  if (SHOTGUN_SOURCE_IDS.has(id) || SHOTGUN_SOURCE_IDS.has(NAME_TO_SOURCE_ID.get(item.name))) {
    const desiredConfigs = canonical.system?.traits?.config?.modular;
    if (Array.isArray(desiredConfigs) && desiredConfigs.length === 2) {
      const currentConfigs = item.system?.traits?.config?.modular ?? [];
      if (JSON.stringify(currentConfigs) !== JSON.stringify(desiredConfigs)) {
        changes["system.traits.config.modular"] = clone(desiredConfigs);
      }

      const values = Array.isArray(item.system?.traits?.value) ? item.system.traits.value : [];
      if (!values.includes("modular")) changes["system.traits.value"] = [...values, "modular"];

      const selected = item.system?.traits?.toggles?.modular?.selected;
      if (!Number.isInteger(selected) || selected < 0 || selected >= desiredConfigs.length || currentConfigs.length !== 2) {
        changes["system.traits.toggles.modular.selected"] = 0;
      }
    }
  }

  return changes;
}

async function canonicalWeapon(item) {
  const id = sourceIdFor(item);
  if (!id) return null;
  try {
    return await fromUuid(`${WEAPON_PREFIX}${id}`);
  } catch (error) {
    console.warn(`[${MODULE_ID}] Не удалось получить эталон оружия ${item.name}`, error);
    return null;
  }
}

async function migrateWeapon(item) {
  if (item?.type !== "weapon") return false;
  const id = sourceIdFor(item);
  if (!id || (!RANGE_SOURCE_IDS.has(id) && !SHOTGUN_SOURCE_IDS.has(id))) return false;
  const canonical = await canonicalWeapon(item);
  if (!canonical) return false;
  const changes = build1534WeaponMigration(item, canonical);
  if (!Object.keys(changes).length) return false;
  await item.update(changes, { render: false, [MODULE_ID]: { migration1534: true } });
  return true;
}

Hooks.once("ready", async () => {
  if (!game.user?.isGM) return;
  let updated = 0;
  const candidates = [];
  for (const actor of game.actors ?? []) candidates.push(...(actor.items ?? []));
  candidates.push(...(game.items ?? []));
  for (const item of candidates) {
    try {
      if (await migrateWeapon(item)) updated += 1;
    } catch (error) {
      console.warn(`[${MODULE_ID}] Не удалось обновить ${item?.name ?? "оружие"} до v1.5.34`, error);
    }
  }
  if (updated) console.info(`[${MODULE_ID}] v1.5.34: обновлено оружий в мире/акторах: ${updated}`);
});
