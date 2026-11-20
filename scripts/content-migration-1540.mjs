const MODULE_ID = "cyberpunk-equipment-library";

const SMART_RE = /^Ракета: Умная • Грейд (?:I|II|III)$/u;
const IMPROVED_SMART_RE = /^Ракета: Улучшенная умная • Грейд (?:I|II|III)$/u;

function areaFireDcModifier(value) {
  return {
    key: "FlatModifier",
    selector: ["area-fire-dc"],
    type: "status",
    value,
    slug: "neon-smart-rocket-area-dc",
    label: "Умное наведение",
  };
}

function normalizeSmartRocket(source, value) {
  if (source?.flags?.world?.neonForgeRocket?.version === "15.41") return;

  source.system ??= {};
  source.system.rules ??= [];
  source.system.description ??= { value: "" };

  source.system.rules = source.system.rules.filter((rule) => {
    if (rule?.key !== "FlatModifier") return true;
    const selectors = Array.isArray(rule.selector) ? rule.selector : [rule.selector];
    if (rule?.slug === "neon-smart-rocket-class-dc") return false;
    if (rule?.slug === "neon-smart-rocket-area-dc") return false;
    if (selectors.includes("class-dc") && /умн|smart/iu.test(String(rule?.label ?? rule?.slug ?? ""))) return false;
    if (selectors.includes("area-fire-dc") && /умн|smart/iu.test(String(rule?.label ?? rule?.slug ?? ""))) return false;
    return true;
  });
  source.system.rules.push(areaFireDcModifier(value));

  const text =
    `<p><strong>Смарт-наведение:</strong> +${value} бонус состояния к КС класса при Атаке по области.</p>`;
  const description = String(source.system.description.value ?? "");
  source.system.description.value = /<p><strong>Смарт-наведение:<\/strong>.*?<\/p>/u.test(description)
    ? description.replace(/<p><strong>Смарт-наведение:<\/strong>.*?<\/p>/u, text)
    : `${description}${text}`;

  source.flags ??= {};
  source.flags.world ??= {};
  source.flags.world.neonForgeRocket ??= {};
  source.flags.world.neonForgeRocket.smart = value;
  source.flags.world.neonForgeRocket.version = "15.40";
}

function migrateInPlace(source) {
  if (!source || typeof source !== "object") return false;
  const before = JSON.stringify(source);

  const name = String(source.name ?? "");
  if (SMART_RE.test(name)) normalizeSmartRocket(source, 1);
  if (IMPROVED_SMART_RE.test(name)) normalizeSmartRocket(source, 2);

  if (source.type === "weapon" && name === "Ракетная установка") {
    source.system ??= {};
    source.system.grade = "commercial";
    source.system.level ??= { value: 1 };
    source.system.level.value = 1;

    source.flags ??= {};
    source.flags.world ??= {};
    source.flags.world.neonForgeSf2eRebuild ??= {};
    source.flags.world.neonForgeSf2eRebuild.grade = "commercial";
  }

  for (const subitem of source.system?.subitems ?? []) {
    migrateInPlace(subitem);
  }

  return JSON.stringify(source) !== before;
}

function clone(value) {
  return globalThis.foundry?.utils?.deepClone ? foundry.utils.deepClone(value) : structuredClone(value);
}

export function migrateSource1540(source) {
  const copy = clone(source);
  migrateInPlace(copy);
  return copy;
}

function buildUpdate(item, migrated) {
  const original = item._source ?? item.toObject(false);
  const update = {};

  if (migrated.system?.grade !== original.system?.grade) {
    update["system.grade"] = migrated.system?.grade;
  }
  if (migrated.system?.level?.value !== original.system?.level?.value) {
    update["system.level.value"] = migrated.system?.level?.value;
  }
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
  if (
    JSON.stringify(migrated.flags?.world?.neonForgeSf2eRebuild) !==
    JSON.stringify(original.flags?.world?.neonForgeSf2eRebuild)
  ) {
    update["flags.world.neonForgeSf2eRebuild"] = migrated.flags?.world?.neonForgeSf2eRebuild;
  }

  return update;
}

async function migrateDocument(item) {
  const source = item._source ?? item.toObject(false);
  const migrated = migrateSource1540(source);
  const update = buildUpdate(item, migrated);
  if (!Object.keys(update).length) return false;

  await item.update(update, {
    render: false,
    [MODULE_ID]: { migration1540: true },
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
        console.warn(`[${MODULE_ID}] v1.5.40: не удалось обновить «${item?.name ?? "предмет"}»`, error);
      }
    }
  }

  for (const item of game.items ?? []) {
    try {
      if (await migrateDocument(item)) updated += 1;
    } catch (error) {
      console.warn(`[${MODULE_ID}] v1.5.40: не удалось обновить мировой предмет «${item?.name ?? "предмет"}»`, error);
    }
  }

  if (updated) console.info(`[${MODULE_ID}] v1.5.40: обновлено предметов: ${updated}`);
});
