const MODULE_ID = "cyberpunk-equipment-library";
const VERSION = "1.5.54";
const CYBERKNUCKLES_ID = "zrPM2QbyQK1OgGu7";

function sourceOf(item) {
  return item?._source ?? item?.toObject?.(false) ?? item ?? {};
}

function normalizeName(name) {
  return String(name ?? "")
    .normalize("NFKC")
    .replace(/[‐‑‒–—−]/g, "-")
    .trim();
}

export function isCyberKnuckles(item) {
  const src = sourceOf(item);
  if (src?.type !== "weapon") return false;
  if (src?._id === CYBERKNUCKLES_ID) return true;
  const name = normalizeName(src?.name);
  const slug = String(src?.system?.slug ?? "").toLowerCase();
  return /^(?:армированные\s+костяшки|кибер\s*-?\s*костяшки)$/iu.test(name) ||
    ["армированные-костяшки", "кибер-костяшки", "киберкостяшки"].includes(slug);
}

export function patchCyberKnuckleSource(input) {
  const source = input ?? {};
  if (!isCyberKnuckles(source)) return { source, changed: false };

  source.system ??= {};
  source.system.traits ??= { value: [], otherTags: [], rarity: "common" };
  source.system.usage ??= {};
  source.flags ??= {};
  source.flags["cyberpunk-remaster"] ??= {};

  const before = JSON.stringify({
    category: source.system.category,
    usage: source.system.usage,
    traits: source.system.traits.value,
    remaster: source.flags["cyberpunk-remaster"],
  });

  source.system.category = "unarmed";
  source.system.usage.value = "worngloves";
  if ("canBeAmmo" in source.system.usage) source.system.usage.canBeAmmo = false;

  const traits = Array.isArray(source.system.traits.value) ? source.system.traits.value : [];
  source.system.traits.value = Array.from(new Set([...traits, "unarmed"]));

  const remaster = source.flags["cyberpunk-remaster"];
  remaster.cyberware = true;
  remaster.installed = Boolean(remaster.installed ?? false);
  remaster.implantType = "module";
  remaster.hardCost = Number.isFinite(Number(remaster.hardCost)) ? Number(remaster.hardCost) : 0;
  remaster.stressFormula = String(remaster.stressFormula ?? "0");
  remaster.slotsUsed = 0;
  remaster.pktFamily = remaster.pktFamily || "cyber-arm-module";
  remaster.pktParentFamily = remaster.pktParentFamily || "cyber-arm";
  remaster.priceEddies = Number.isFinite(Number(remaster.priceEddies)) ? Number(remaster.priceEddies) : 100;

  const after = JSON.stringify({
    category: source.system.category,
    usage: source.system.usage,
    traits: source.system.traits.value,
    remaster: source.flags["cyberpunk-remaster"],
  });
  return { source, changed: before !== after };
}

function updateDataForDocument(item) {
  const original = sourceOf(item);
  if (!isCyberKnuckles(original)) return null;
  const patched = patchCyberKnuckleSource(structuredClone(original));
  if (!patched.changed) return null;
  const remaster = patched.source.flags["cyberpunk-remaster"];
  return {
    "system.category": patched.source.system.category,
    "system.usage": patched.source.system.usage,
    "system.traits.value": patched.source.system.traits.value,
    "flags.cyberpunk-remaster.cyberware": remaster.cyberware,
    "flags.cyberpunk-remaster.installed": remaster.installed,
    "flags.cyberpunk-remaster.implantType": remaster.implantType,
    "flags.cyberpunk-remaster.hardCost": remaster.hardCost,
    "flags.cyberpunk-remaster.stressFormula": remaster.stressFormula,
    "flags.cyberpunk-remaster.slotsUsed": remaster.slotsUsed,
    "flags.cyberpunk-remaster.pktFamily": remaster.pktFamily,
    "flags.cyberpunk-remaster.pktParentFamily": remaster.pktParentFamily,
    "flags.cyberpunk-remaster.priceEddies": remaster.priceEddies,
  };
}

async function updateDocument(item, label) {
  const update = updateDataForDocument(item);
  if (!update) return 0;
  try {
    await item.update(update, { render: false, [MODULE_ID]: { migration1554: true } });
    return 1;
  } catch (error) {
    console.warn(`[${MODULE_ID}] ${VERSION}: не удалось обновить ${label} «${item?.name ?? "?"}»`, error);
    return 0;
  }
}

function isOriginatingClient(userId) {
  const currentUserId = globalThis.game?.user?.id;
  return !userId || !currentUserId || userId === currentUserId;
}

async function handleCreatedItem(item, options = {}, userId = null) {
  if (options?.[MODULE_ID]?.migration1554) return;
  if (!isOriginatingClient(userId)) return;
  await updateDocument(item, "новую копию Киберкостяшек");
}

async function runMigration() {
  if (!globalThis.game?.user?.isGM) return;
  let updated = 0;
  for (const item of globalThis.game?.items ?? []) updated += await updateDocument(item, "мировой предмет");
  for (const actor of globalThis.game?.actors ?? []) {
    for (const item of actor.items ?? []) updated += await updateDocument(item, `предмет актёра ${actor.name}`);
  }
  if (updated) console.info(`[${MODULE_ID}] ${VERSION}: Киберкостяшки обновлены: ${updated}`);
}

if (globalThis.Hooks?.once) Hooks.once("ready", runMigration);
if (globalThis.Hooks?.on) Hooks.on("createItem", handleCreatedItem);
