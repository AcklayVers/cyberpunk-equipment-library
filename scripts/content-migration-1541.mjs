const MODULE_ID = "cyberpunk-equipment-library";

const SMART_RE = /^Ракета: Умная • Грейд (?:I|II|III)$/u;
const IMPROVED_SMART_RE = /^Ракета: Улучшенная умная • Грейд (?:I|II|III)$/u;

function isSmartNarrativeRocket(source) {
  const name = String(source?.name ?? "");
  if (SMART_RE.test(name)) return -1;
  if (IMPROVED_SMART_RE.test(name)) return -2;
  return null;
}

function stripSmartAutomation(rules) {
  return (rules ?? []).filter((rule) => {
    if (rule?.key !== "FlatModifier") return true;
    const selectors = Array.isArray(rule?.selector) ? rule.selector : [rule?.selector];
    if (rule?.slug === "neon-smart-rocket-class-dc") return false;
    if (rule?.slug === "neon-smart-rocket-area-dc") return false;
    if (
      (selectors.includes("class-dc") || selectors.includes("area-fire-dc")) &&
      /умн|smart/iu.test(String(rule?.label ?? rule?.slug ?? ""))
    ) {
      return false;
    }
    return true;
  });
}

function normalizeNarrativeSmartRocket(source, penalty) {
  source.system ??= {};
  source.system.rules = stripSmartAutomation(source.system.rules);
  source.system.description ??= { value: "" };

  const text =
    `<p><strong>Смарт-наведение:</strong> ${penalty} штраф состояния к спасброску против Атаки по области, выполненной этой ракетой. Применяется вручную.</p>`;
  const description = String(source.system.description.value ?? "");
  source.system.description.value = /<p><strong>Смарт-наведение:<\/strong>.*?<\/p>/u.test(description)
    ? description.replace(/<p><strong>Смарт-наведение:<\/strong>.*?<\/p>/u, text)
    : `${description}${text}`;

  source.flags ??= {};
  source.flags.world ??= {};
  source.flags.world.neonForgeRocket ??= {};
  source.flags.world.neonForgeRocket.version = "15.41";
  source.flags.world.neonForgeRocket.narrativeSavePenalty = penalty;
}

function migrateInPlace(source) {
  if (!source || typeof source !== "object") return false;
  const before = JSON.stringify(source);

  const penalty = isSmartNarrativeRocket(source);
  if (penalty !== null) normalizeNarrativeSmartRocket(source, penalty);

  for (const subitem of source.system?.subitems ?? []) {
    migrateInPlace(subitem);
  }

  return JSON.stringify(source) !== before;
}

function clone(value) {
  return globalThis.foundry?.utils?.deepClone ? foundry.utils.deepClone(value) : structuredClone(value);
}

export function migrateSource1541(source) {
  const copy = clone(source);
  migrateInPlace(copy);
  return copy;
}

function buildUpdate(item, migrated) {
  const original = item._source ?? item.toObject(false);
  const update = {};

  if (JSON.stringify(migrated.system?.rules ?? []) !== JSON.stringify(original.system?.rules ?? [])) {
    update["system.rules"] = migrated.system?.rules ?? [];
  }
  if (migrated.system?.description?.value !== original.system?.description?.value) {
    update["system.description.value"] = migrated.system?.description?.value;
  }
  if (JSON.stringify(migrated.system?.subitems ?? []) !== JSON.stringify(original.system?.subitems ?? [])) {
    update["system.subitems"] = migrated.system?.subitems ?? [];
  }
  if (
    JSON.stringify(migrated.flags?.world?.neonForgeRocket) !==
    JSON.stringify(original.flags?.world?.neonForgeRocket)
  ) {
    update["flags.world.neonForgeRocket"] = migrated.flags?.world?.neonForgeRocket;
  }

  return update;
}

async function migrateDocument(item) {
  const source = item._source ?? item.toObject(false);
  const migrated = migrateSource1541(source);
  const update = buildUpdate(item, migrated);
  if (!Object.keys(update).length) return false;

  await item.update(update, {
    render: false,
    [MODULE_ID]: { migration1541: true },
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
        console.warn(`[${MODULE_ID}] v1.5.41: не удалось обновить «${item?.name ?? "предмет"}»`, error);
      }
    }
  }

  for (const item of game.items ?? []) {
    try {
      if (await migrateDocument(item)) updated += 1;
    } catch (error) {
      console.warn(`[${MODULE_ID}] v1.5.41: не удалось обновить мировой предмет «${item?.name ?? "предмет"}»`, error);
    }
  }

  if (updated) console.info(`[${MODULE_ID}] v1.5.41: обновлено предметов: ${updated}`);
});
