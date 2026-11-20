const MODULE_ID = "cyberpunk-equipment-library";
const SOURCE_PREFIX = `Compendium.${MODULE_ID}.weapons.Item.`;

const TARGET_RANGES = new Map([
  ["7IrEZw2No0VLvORO", 180], // Eagletech Scorpion
  ["9x6qgmtJY24LUR5J", 150], // Eagletech Arbelest
  ["nYLt6Ywm8UAlaHrB", 140], // Арбалет
  ["l49v9vQOA6kPjTNn", 140], // Eagletech Bearcat
  ["mF3cCDFW49NNDBy7", 140], // Eagletech Tomcat
]);

const TARGET_RANGES_BY_NAME = new Map([
  ["Eagletech Scorpion", 180],
  ["Eagletech Arbelest", 150],
  ["Арбалет", 140],
  ["Eagletech Bearcat", 140],
  ["Eagletech Tomcat", 140],
]);

const OBSOLETE_POISON_AMMO_IDS = new Set([
  "g1524Ammo0000008",
  "g1524Ammo0000013",
  "g1524Ammo0000017",
]);

const OBSOLETE_POISON_AMMO_NAMES = new Set([
  "Гранатомётный боеприпас • Граната: С ядом",
  "Гранатомётный боеприпас • Граната: С ядом [Продвинутая]",
  "Гранатомётный боеприпас • Граната: С ядом [Превосходная]",
]);

const LABEL_SEQUENCE =
  String.raw`(?:Ревизия|Баланс|Механика)\s+v1\.5\.\d+(?:\s+(?:и|,|\/)\s+(?:(?:Ревизия|Баланс|Механика)\s+)?v1\.5\.\d+)*\s*:`;
const STRONG_LABEL_RE = new RegExp(String.raw`<strong>\s*${LABEL_SEQUENCE}\s*<\/strong>\s*`, "giu");
const MARKDOWN_LABEL_RE = new RegExp(String.raw`\*\*\s*${LABEL_SEQUENCE}\s*\*\*\s*`, "giu");
const PLAIN_LABEL_RE = new RegExp(String.raw`${LABEL_SEQUENCE}\s*`, "giu");

function sourceId(source) {
  const refs = [
    source?._stats?.compendiumSource,
    source?.flags?.core?.sourceId,
  ];
  for (const ref of refs) {
    if (typeof ref === "string" && ref.startsWith(SOURCE_PREFIX)) return ref.slice(SOURCE_PREFIX.length);
  }
  return typeof source?._id === "string" ? source._id : null;
}

export function cleanVersionLabels(value) {
  if (typeof value !== "string" || !value) return value;
  return value
    .replace(STRONG_LABEL_RE, "")
    .replace(MARKDOWN_LABEL_RE, "")
    .replace(PLAIN_LABEL_RE, "");
}

export function isObsoletePoisonAmmo(source) {
  if (!source || source.type !== "ammo") return false;
  const id = sourceId(source);
  return OBSOLETE_POISON_AMMO_IDS.has(id) || OBSOLETE_POISON_AMMO_NAMES.has(source.name);
}

function clone(value) {
  return globalThis.foundry?.utils?.deepClone
    ? foundry.utils.deepClone(value)
    : structuredClone(value);
}

function migrateSourceInPlace(source) {
  if (!source || typeof source !== "object") return false;
  let changed = false;

  const description = source.system?.description?.value;
  const cleaned = cleanVersionLabels(description);
  if (typeof description === "string" && cleaned !== description) {
    source.system.description.value = cleaned;
    changed = true;
  }

  if (source.type === "weapon") {
    const id = sourceId(source);
    const range = TARGET_RANGES.get(id) ?? TARGET_RANGES_BY_NAME.get(source.name);
    if (range && source.system?.range !== range) {
      source.system.range = range;
      changed = true;
    }
  }

  const subitems = source.system?.subitems;
  if (Array.isArray(subitems)) {
    const kept = [];
    for (const subitem of subitems) {
      if (isObsoletePoisonAmmo(subitem)) {
        changed = true;
        continue;
      }
      if (migrateSourceInPlace(subitem)) changed = true;
      kept.push(subitem);
    }
    if (kept.length !== subitems.length) source.system.subitems = kept;
  }

  return changed;
}

export function migrateSource1537(source) {
  const copy = clone(source);
  migrateSourceInPlace(copy);
  return copy;
}

function buildUpdate(item, migrated) {
  const update = {};
  const original = item._source ?? item.toObject(false);

  const oldDescription = original.system?.description?.value;
  const newDescription = migrated.system?.description?.value;
  if (newDescription !== oldDescription) {
    update["system.description.value"] = newDescription;
  }

  if (migrated.type === "weapon" && migrated.system?.range !== original.system?.range) {
    update["system.range"] = migrated.system.range;
  }

  const oldSubitems = original.system?.subitems ?? [];
  const newSubitems = migrated.system?.subitems ?? [];
  if (JSON.stringify(oldSubitems) !== JSON.stringify(newSubitems)) {
    update["system.subitems"] = newSubitems;
  }

  return update;
}

async function migrateDocument(item) {
  const source = item._source ?? item.toObject(false);
  if (isObsoletePoisonAmmo(source)) return "obsolete";

  const migrated = migrateSource1537(source);
  const update = buildUpdate(item, migrated);
  if (!Object.keys(update).length) return false;

  await item.update(update, {
    render: false,
    [MODULE_ID]: { migration1537: true },
  });
  return true;
}

Hooks.once("ready", async () => {
  if (!game.user?.isGM) return;

  let updated = 0;
  let removed = 0;

  for (const actor of game.actors ?? []) {
    const deleteIds = [];
    for (const item of [...(actor.items ?? [])]) {
      try {
        const result = await migrateDocument(item);
        if (result === "obsolete") deleteIds.push(item.id);
        else if (result) updated += 1;
      } catch (error) {
        console.warn(`[${MODULE_ID}] v1.5.37: не удалось обновить «${item?.name ?? "предмет"}»`, error);
      }
    }
    if (deleteIds.length) {
      await actor.deleteEmbeddedDocuments("Item", deleteIds, {
        render: false,
        [MODULE_ID]: { migration1537: true },
      });
      removed += deleteIds.length;
    }
  }

  for (const item of [...(game.items ?? [])]) {
    try {
      const result = await migrateDocument(item);
      if (result === "obsolete") {
        await item.delete({ render: false, [MODULE_ID]: { migration1537: true } });
        removed += 1;
      } else if (result) {
        updated += 1;
      }
    } catch (error) {
      console.warn(`[${MODULE_ID}] v1.5.37: не удалось обновить мировой предмет «${item?.name ?? "предмет"}»`, error);
    }
  }

  if (updated || removed) {
    console.info(`[${MODULE_ID}] v1.5.37: обновлено ${updated}, удалено устаревших ядовитых боеприпасов ${removed}.`);
  }
});
