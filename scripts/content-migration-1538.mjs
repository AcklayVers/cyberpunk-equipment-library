const MODULE_ID = "cyberpunk-equipment-library";

const GRENADE_PRICES = new Map([
  ["Граната «Торнадо сюрикенов»", 200],
  ["Граната «Торнадо сюрикенов» [Продвинутая]", 1000],
  ["Граната «Торнадо сюрикенов» [Превосходная]", 2000],
  ["Граната: Осколочная", 200],
  ["Граната: Осколочная [Продвинутая]", 1000],
  ["Граната: Осколочная [Превосходная]", 2000],
  ["Граната: Зажигательная", 200],
  ["Граната: Зажигательная [Продвинутая]", 1000],
  ["Граната: Зажигательная [Превосходная]", 2000],
  ["Граната: С ядом", 200],
  ["Граната: С ядом [Продвинутая]", 1000],
  ["Граната: С ядом [Превосходная]", 2000],
  ["Граната: С биотоксином", 500],
  ["Граната: С биотоксином [Продвинутая]", 1500],
  ["Граната: С биотоксином [Превосходная]", 3000],
  ["КТех Охранная граната", 500],
  ["КТех Охранная граната [Продвинутая]", 1500],
  ["КТех Охранная граната [Превосходная]", 3000],
  ["Граната Арахнид", 200],
  ["Граната: Дымовая", 150],
  ["Граната с CO2", 150],
  ["Граната: Светошумовая", 200],
  ["Граната: Усыпляющая", 500],
  ["Граната: Слезоточивая", 150],
  ["Коктейль Молотова", 100],
  ["Граната: ЭМИ", 500],
]);

const LAUNCHER_AMMO_PRICES = new Map([
  ["Гранатомётный боеприпас: «Торнадо сюрикенов»", 200],
  ["Гранатомётный боеприпас: «Торнадо сюрикенов» [Продвинутая]", 1000],
  ["Гранатомётный боеприпас: «Торнадо сюрикенов» [Превосходная]", 2000],
  ["Гранатомётный боеприпас: Осколочная", 200],
  ["Гранатомётный боеприпас: Осколочная [Продвинутая]", 1000],
  ["Гранатомётный боеприпас: Осколочная [Превосходная]", 2000],
  ["Гранатомётный боеприпас: Зажигательная", 200],
  ["Гранатомётный боеприпас: Зажигательная [Продвинутая]", 1000],
  ["Гранатомётный боеприпас: Зажигательная [Превосходная]", 2000],
  ["Гранатомётный боеприпас: С биотоксином", 500],
  ["Гранатомётный боеприпас: С биотоксином [Продвинутая]", 1500],
  ["Гранатомётный боеприпас: С биотоксином [Превосходная]", 3000],
  ["Гранатомётный боеприпас: КТех Охранная", 500],
  ["Гранатомётный боеприпас: КТех Охранная [Продвинутая]", 1500],
  ["Гранатомётный боеприпас: КТех Охранная [Превосходная]", 3000],
  ["Гранатомётный боеприпас: Арахнид", 200],
  ["Гранатомётный боеприпас: Дымовая", 150],
  ["Гранатомётный боеприпас: CO2", 150],
  ["Гранатомётный боеприпас: Светошумовая", 200],
  ["Гранатомётный боеприпас: Усыпляющая", 500],
  ["Гранатомётный боеприпас: Слезоточивая", 150],
  ["Гранатомётный боеприпас: ЭМИ", 500],
]);

const ROCKET_PRICES = new Map([
  ["Ракета • Грейд I", 300],
  ["Ракета • Грейд II", 1500],
  ["Ракета • Грейд III", 3000],
  ["Ракета: Бронебойная • Грейд I", 500],
  ["Ракета: Бронебойная • Грейд II", 2000],
  ["Ракета: Бронебойная • Грейд III", 3500],
  ["Ракета: Умная • Грейд I", 600],
  ["Ракета: Умная • Грейд II", 2200],
  ["Ракета: Умная • Грейд III", 4000],
  ["Ракета: Улучшенная умная • Грейд I", 700],
  ["Ракета: Улучшенная умная • Грейд II", 2700],
  ["Ракета: Улучшенная умная • Грейд III", 4500],
]);

export function launcherAmmoName(name) {
  if (typeof name !== "string" || !name.startsWith("Гранатомётный боеприпас")) return name;
  if (name.startsWith("Гранатомётный боеприпас: ")) return name;

  let payload = name.includes("•") ? name.split("•", 2)[1].trim() : name.replace(/^Гранатомётный боеприпас\s*:?\s*/u, "");
  if (payload.startsWith("Граната: ")) payload = payload.slice("Граната: ".length);
  else if (payload.startsWith("Граната «")) payload = payload.slice("Граната ".length);
  else if (payload.startsWith("Граната с ")) payload = payload.slice("Граната с ".length);
  else if (payload.startsWith("Граната ")) payload = payload.slice("Граната ".length);
  else if (payload.startsWith("КТех Охранная граната")) payload = `КТех Охранная${payload.slice("КТех Охранная граната".length)}`;
  return `Гранатомётный боеприпас: ${payload}`;
}

function isNativeGrenade(source) {
  return source?.type === "weapon" && !!source?.flags?.world?.neonForgeSourceMeta?.nativeGrenade;
}

function setPrice(source, value) {
  source.system ??= {};
  source.system.price ??= {};
  source.system.price.value = { sp: value };
  source.system.price.per ??= 1;
}

function normalizeSmartRocket(source, bonus) {
  if (source?.flags?.world?.neonForgeRocket?.version === "15.41") return;

  const hasNewerSmartDc = (source.system?.rules ?? []).some((rule) => {
    const selectors = Array.isArray(rule?.selector) ? rule.selector : [rule?.selector];
    return (
      rule?.key === "FlatModifier" &&
      (
        (selectors.includes("class-dc") && rule?.slug === "neon-smart-rocket-class-dc") ||
        (selectors.includes("area-fire-dc") && rule?.slug === "neon-smart-rocket-area-dc")
      )
    );
  });
  if (hasNewerSmartDc) return;

  source.flags ??= {};
  source.flags.world ??= {};
  source.flags.world.neonForgeRocket ??= {};
  source.flags.world.neonForgeRocket.smart = bonus;
  source.flags.world.neonForgeRocket.version = "15.38";

  source.system.rules = (source.system.rules ?? []).filter((rule) => rule?.key !== "FlatModifier");
  const description = source.system?.description?.value;
  if (typeof description === "string") {
    const text = `<p><strong>Смарт-наведение:</strong> +${bonus} к КС Атаки по области.</p>`;
    source.system.description.value = /<p><strong>Смарт-наведение:<\/strong>.*?<\/p>/u.test(description)
      ? description.replace(/<p><strong>Смарт-наведение:<\/strong>.*?<\/p>/u, text)
      : `${description}${text}`;
  }
}

function migrateSourceInPlace(source) {
  if (!source || typeof source !== "object") return false;
  let changed = false;
  const before = JSON.stringify(source);

  if (isNativeGrenade(source)) source.system.grade = "commercial";
  if (GRENADE_PRICES.has(source.name)) setPrice(source, GRENADE_PRICES.get(source.name));

  if (source.type === "ammo" && typeof source.name === "string" && source.name.startsWith("Гранатомётный боеприпас")) {
    source.name = launcherAmmoName(source.name);
    if (LAUNCHER_AMMO_PRICES.has(source.name)) setPrice(source, LAUNCHER_AMMO_PRICES.get(source.name));
  }

  if (ROCKET_PRICES.has(source.name)) setPrice(source, ROCKET_PRICES.get(source.name));
  if (/^Ракета: Умная • Грейд (?:I|II|III)$/u.test(String(source.name ?? ""))) normalizeSmartRocket(source, 1);
  if (/^Ракета: Улучшенная умная • Грейд (?:I|II|III)$/u.test(String(source.name ?? ""))) normalizeSmartRocket(source, 2);

  for (const subitem of source.system?.subitems ?? []) {
    migrateSourceInPlace(subitem);
  }

  changed = JSON.stringify(source) !== before;
  return changed;
}

function clone(value) {
  return globalThis.foundry?.utils?.deepClone ? foundry.utils.deepClone(value) : structuredClone(value);
}

export function migrateSource1538(source) {
  const copy = clone(source);
  migrateSourceInPlace(copy);
  return copy;
}

function buildUpdate(item, migrated) {
  const original = item._source ?? item.toObject(false);
  const update = {};
  if (migrated.name !== original.name) update.name = migrated.name;
  if (migrated.system?.grade !== original.system?.grade) update["system.grade"] = migrated.system?.grade;
  if (JSON.stringify(migrated.system?.price) !== JSON.stringify(original.system?.price)) update["system.price"] = migrated.system?.price;
  if (JSON.stringify(migrated.system?.rules ?? []) !== JSON.stringify(original.system?.rules ?? [])) update["system.rules"] = migrated.system?.rules ?? [];
  if (migrated.system?.description?.value !== original.system?.description?.value) update["system.description.value"] = migrated.system?.description?.value;
  if (JSON.stringify(migrated.system?.subitems ?? []) !== JSON.stringify(original.system?.subitems ?? [])) update["system.subitems"] = migrated.system?.subitems ?? [];
  if (JSON.stringify(migrated.flags?.world?.neonForgeRocket) !== JSON.stringify(original.flags?.world?.neonForgeRocket)) {
    update["flags.world.neonForgeRocket"] = migrated.flags?.world?.neonForgeRocket;
  }
  return update;
}

async function migrateDocument(item) {
  const source = item._source ?? item.toObject(false);
  const migrated = migrateSource1538(source);
  const update = buildUpdate(item, migrated);
  if (!Object.keys(update).length) return false;
  await item.update(update, { render: false, [MODULE_ID]: { migration1538: true } });
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
        console.warn(`[${MODULE_ID}] v1.5.38: не удалось обновить «${item?.name ?? "предмет"}»`, error);
      }
    }
  }
  for (const item of game.items ?? []) {
    try {
      if (await migrateDocument(item)) updated += 1;
    } catch (error) {
      console.warn(`[${MODULE_ID}] v1.5.38: не удалось обновить мировой предмет «${item?.name ?? "предмет"}»`, error);
    }
  }
  if (updated) console.info(`[${MODULE_ID}] v1.5.38: обновлено предметов: ${updated}`);
});
