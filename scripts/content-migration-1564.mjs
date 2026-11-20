const MODULE_ID = "cyberpunk-equipment-library";
const RELEASES = new Map([
  ["007967d41a1b1950", 1],
  ["87129485b933243f", 2],
  ["e3d4fec7d1500a16", 3],
]);
const SOURCE_PREFIX = `Compendium.${MODULE_ID}.gear.Item.`;

function collectionValues(collection) {
  if (Array.isArray(collection?.contents)) return collection.contents;
  if (typeof collection?.values === "function") return [...collection.values()];
  return [...(collection ?? [])];
}

export function emergencyReleaseId(item) {
  const refs = [item?.sourceId, item?._stats?.compendiumSource, item?.flags?.core?.sourceId, item?.getFlag?.("core", "sourceId")];
  for (const ref of refs) {
    if (typeof ref !== "string" || !ref.startsWith(SOURCE_PREFIX)) continue;
    const id = ref.slice(SOURCE_PREFIX.length);
    if (RELEASES.has(id)) return id;
  }
  const name = String(item?.name ?? "");
  for (const [id, value] of RELEASES) {
    const suffix = value === 1 ? "[Серийный]" : value === 2 ? "[Тактический]" : "[Продвинутый]";
    if (name === `Аварийный сброс бронесекции ${suffix}`) return id;
  }
  return null;
}

export function emergencyReleaseRules(id) {
  const value = RELEASES.get(id);
  if (!value) return null;
  const option = `armor-emergency-release-${value}`;
  return [
    {
      key: "RollOption",
      domain: "all",
      option,
      label: "Аварийный сброс бронесекции",
      toggleable: true,
    },
    {
      key: "FlatModifier",
      selector: ["acrobatics", "athletics"],
      type: "circumstance",
      value,
      predicate: ["action:escape", option],
      label: "Аварийный сброс бронесекции",
    },
  ];
}

function isPrimaryActiveGM() {
  const active = collectionValues(globalThis.game?.users)
    .filter((user) => user?.active && user?.isGM)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  return Boolean(active.length && globalThis.game?.user?.id === active[0].id);
}

async function migrateItem(item) {
  const id = emergencyReleaseId(item);
  if (!id || !item?.update) return false;
  const rules = emergencyReleaseRules(id);
  if (JSON.stringify(item.system?.rules ?? []) === JSON.stringify(rules)) return false;
  await item.update({ "system.rules": rules }, { render: false, [MODULE_ID]: { migration1564: true } });
  return true;
}

export async function migrateEmergencyReleaseCopies() {
  if (!isPrimaryActiveGM()) return 0;
  let updated = 0;
  const items = [
    ...collectionValues(globalThis.game?.items),
    ...collectionValues(globalThis.game?.actors).flatMap((actor) => collectionValues(actor?.items)),
  ];
  for (const item of items) {
    try {
      if (await migrateItem(item)) updated += 1;
    } catch (error) {
      console.warn(`[${MODULE_ID}] v1.5.64: не удалось обновить ${item?.name ?? item?.id}`, error);
    }
  }
  if (updated) console.info(`[${MODULE_ID}] v1.5.64: обновлено копий аварийного сброса: ${updated}.`);
  return updated;
}

if (globalThis.Hooks?.once) Hooks.once("ready", migrateEmergencyReleaseCopies);
