const MODULE_ID = "cyberpunk-equipment-library";
const VERSION = "1.5.87";
const WEAPON_SOURCE_PREFIX = `Compendium.${MODULE_ID}.weapons.Item.`;

const HIGH_VELOCITY_IDS = new Set(["eH7e04uOAUExwAC7", "sElAPO3dTELHSvdT"]);
const TRACER_IDS = new Set(["bkX4BlWfysEidZJd", "3gqkyGqJgvpi6kI7"]);
const HIGH_VELOCITY_NAMES = new Set([
  "Пистолетные патроны: Высокоскоростные",
  "Винтовочные патроны: Высокоскоростные",
]);
const TRACER_NAMES = new Set([
  "Пистолетные патроны: Трассирующие",
  "Винтовочные патроны: Трассирующие",
]);
const SPECIAL_WEAPONS = new Map([
  ["fy9yQF5q7N7dE87E", "Sternmeyer M-04 «Изменяемая штурмовка»"],
  ["cdc9oKbmkw84zD0D", "Tsunami Arms «Спираль»"],
]);
const SPECIAL_NAMES = new Set(SPECIAL_WEAPONS.values());

const HIGH_RULE = Object.freeze({
  key: "FlatModifier",
  type: "circumstance",
  value: 2,
  hideIfDisabled: false,
  selector: ["class"],
});
const TRACER_RULE = Object.freeze({
  key: "FlatModifier",
  type: "status",
  value: 1,
  hideIfDisabled: false,
  selector: ["class"],
});

function sourceOf(item) {
  return item?._source ?? item?.toObject?.(false) ?? item ?? {};
}
function values(collection) {
  if (Array.isArray(collection?.contents)) return collection.contents;
  if (typeof collection?.values === "function") return [...collection.values()];
  return [...(collection ?? [])];
}
function isPrimaryActiveGM() {
  const active = values(globalThis.game?.users)
    .filter((user) => user?.active && user?.isGM)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  return Boolean(active.length && globalThis.game?.user?.id === active[0].id);
}
function sourceId(source) {
  for (const ref of [source?._stats?.compendiumSource, source?.flags?.core?.sourceId, source?.sourceId]) {
    if (typeof ref === "string" && ref.startsWith(WEAPON_SOURCE_PREFIX)) return ref.slice(WEAPON_SOURCE_PREFIX.length);
  }
  return source?._id ?? null;
}
function fromLibraryWeapons(source) {
  const refs = [source?._stats?.compendiumSource, source?.flags?.core?.sourceId, source?.sourceId];
  if (refs.some((ref) => typeof ref === "string" && ref.startsWith(WEAPON_SOURCE_PREFIX))) return true;
  const pack = source?.flags?.world?.neonForgeArsenal?.sourcePack;
  return typeof pack === "string" && pack.startsWith("arsenal-");
}
function selectors(rule) {
  if (Array.isArray(rule?.selector)) return rule.selector;
  return typeof rule?.selector === "string" ? [rule.selector] : [];
}
function installRule(rules, wanted) {
  const out = [];
  let inserted = false;
  for (const rule of rules ?? []) {
    if (rule?.key === "FlatModifier" && rule?.type === wanted.type && selectors(rule).includes("class")) {
      if (!inserted) {
        out.push(structuredClone(wanted));
        inserted = true;
      }
      continue;
    }
    out.push(rule);
  }
  if (!inserted) out.push(structuredClone(wanted));
  return out;
}
function replaceEffectParagraph(description, html) {
  return String(description ?? "").replace(
    /<p><strong>Эффект боеприпаса<\/strong><\/p><p>.*?<\/p>/su,
    html,
  );
}
function patchAmmo(source, kind) {
  const system = (source.system ??= {});
  const rules = structuredClone(system.rules ?? []);
  if (kind === "high") {
    for (const rule of rules) {
      if (rule?.key === "Note" && rule?.title === "Высокоскоростной боеприпас") {
        rule.text = "Высокоскоростные боеприпасы дают +2 бонус обстоятельства к КС класса.";
      }
    }
    system.rules = installRule(rules, HIGH_RULE);
    system.description ??= {};
    system.description.value = replaceEffectParagraph(
      system.description.value,
      '<p><strong>Эффект боеприпаса</strong></p><p>Высокая скорость снаряда повышает сложность уклонения: пока эти патроны используются для выстрела, вы получаете <strong>+2 бонус обстоятельства к КС класса</strong> для связанной проверки.</p>',
    );
  } else {
    for (const rule of rules) {
      if (rule?.key === "Note" && rule?.title === "Трассирующие боеприпасы") {
        rule.text = "Трассирующие боеприпасы дают +1 бонус состояния к КС класса.";
      }
    }
    system.rules = installRule(rules, TRACER_RULE);
    system.description ??= {};
    system.description.value = replaceEffectParagraph(
      system.description.value,
      '<p><strong>Эффект боеприпаса</strong></p><p>Трассирующий след помогает корректировать огонь: пока эти патроны используются для выстрела, вы получаете <strong>+1 бонус состояния к КС класса</strong> для связанной проверки.</p>',
    );
  }
}
function normalizeWeaponDamage(source) {
  if (source?.type !== "weapon") return;
  const system = (source.system ??= {});
  const damage = system.damage;
  if (damage && Number(damage.dice) > 0) damage.dice = 1;

  const rebuild = source?.flags?.world?.neonForgeSf2eRebuild;
  if (rebuild && typeof rebuild === "object") {
    rebuild.baseDamageDice = 1;
    rebuild.derivedDamageDice = 1;
  }

  for (const subitem of system.subitems ?? []) {
    if (subitem?.type !== "weapon") continue;
    const subDamage = subitem.system?.damage;
    if (subDamage && Number(subDamage.dice) > 0) subDamage.dice = 1;
    const subRebuild = subitem?.flags?.world?.neonForgeSf2eRebuild;
    if (subRebuild && typeof subRebuild === "object") {
      subRebuild.baseDamageDice = 1;
      subRebuild.derivedDamageDice = 1;
    }
  }
}
function patchSpecialWeapon(source) {
  const system = (source.system ??= {});
  system.range = 100;
  system.damage ??= {};
  system.damage.dice = 1;
  system.damage.die = "d8";

  source.flags ??= {};
  source.flags.world ??= {};
  const rebuild = source.flags.world.neonForgeSf2eRebuild;
  if (rebuild && typeof rebuild === "object") {
    rebuild.baseDamageDice = 1;
    rebuild.derivedDamageDice = 1;
  }
  const meta = source.flags.world.neonForgeSourceMeta;
  if (meta && typeof meta === "object") {
    meta.damage = "1d8 piercing";
    meta.range = 100;
    meta.rangeFeet = 100;
  }
}

export function patch1586Source(input) {
  const source = input ?? {};
  if (!fromLibraryWeapons(source)) return { source, changed: false };
  const before = JSON.stringify(source);
  const id = sourceId(source);
  const name = String(source.name ?? "");

  normalizeWeaponDamage(source);
  if (HIGH_VELOCITY_IDS.has(id) || HIGH_VELOCITY_NAMES.has(name)) patchAmmo(source, "high");
  if (TRACER_IDS.has(id) || TRACER_NAMES.has(name)) patchAmmo(source, "tracer");
  if (SPECIAL_WEAPONS.has(id) || SPECIAL_NAMES.has(name)) patchSpecialWeapon(source);

  return { source, changed: before !== JSON.stringify(source) };
}

function updateDataForDocument(item) {
  const original = sourceOf(item);
  const patched = patch1586Source(structuredClone(original));
  if (!patched.changed) return null;
  const update = {};
  const oldSystem = original.system ?? {};
  const newSystem = patched.source.system ?? {};

  if (JSON.stringify(oldSystem.damage ?? null) !== JSON.stringify(newSystem.damage ?? null)) update["system.damage"] = newSystem.damage;
  if (oldSystem.range !== newSystem.range) update["system.range"] = newSystem.range;
  if (JSON.stringify(oldSystem.rules ?? []) !== JSON.stringify(newSystem.rules ?? [])) update["system.rules"] = newSystem.rules ?? [];
  if (JSON.stringify(oldSystem.subitems ?? []) !== JSON.stringify(newSystem.subitems ?? [])) update["system.subitems"] = newSystem.subitems ?? [];
  if (oldSystem.description?.value !== newSystem.description?.value) update["system.description.value"] = newSystem.description?.value ?? "";

  const oldWorld = original.flags?.world ?? {};
  const newWorld = patched.source.flags?.world ?? {};
  if (JSON.stringify(oldWorld.neonForgeSf2eRebuild ?? null) !== JSON.stringify(newWorld.neonForgeSf2eRebuild ?? null)) {
    update["flags.world.neonForgeSf2eRebuild"] = newWorld.neonForgeSf2eRebuild;
  }
  if (JSON.stringify(oldWorld.neonForgeSourceMeta ?? null) !== JSON.stringify(newWorld.neonForgeSourceMeta ?? null)) {
    update["flags.world.neonForgeSourceMeta"] = newWorld.neonForgeSourceMeta;
  }
  return Object.keys(update).length ? update : null;
}
async function migrateDocument(item) {
  const update = updateDataForDocument(item);
  if (!update || !item?.update) return false;
  await item.update(update, { render: false, [MODULE_ID]: { migration1586: true } });
  return true;
}
export async function migrate1586Copies() {
  if (!isPrimaryActiveGM()) return 0;
  let updated = 0;
  const docs = [
    ...values(globalThis.game?.items),
    ...values(globalThis.game?.actors).flatMap((actor) => values(actor?.items)),
  ];
  for (const item of docs) {
    try {
      if (await migrateDocument(item)) updated += 1;
    } catch (error) {
      console.warn(`[${MODULE_ID}] ${VERSION}: не удалось обновить ${item?.name ?? item?.id}`, error);
    }
  }
  if (updated) console.info(`[${MODULE_ID}] ${VERSION}: обновлено копий оружия/боеприпасов: ${updated}.`);
  return updated;
}
async function onCreate(item, options = {}, userId = null) {
  if (options?.[MODULE_ID]?.migration1586) return;
  if (userId && globalThis.game?.user?.id && userId !== globalThis.game.user.id) return;
  try {
    await migrateDocument(item);
  } catch (error) {
    console.warn(`[${MODULE_ID}] ${VERSION}: createItem migration failed`, error);
  }
}
if (globalThis.Hooks?.once) Hooks.once("ready", migrate1586Copies);
if (globalThis.Hooks?.on) Hooks.on("createItem", onCreate);
