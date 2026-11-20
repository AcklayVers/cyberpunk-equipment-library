const MODULE_ID = "cyberpunk-equipment-library";
const VERSION = "1.5.58";

export const JURY_RIGGED_TRAIT = "jury-rigged";
export const JURY_RIGGED_LABEL = "Сварганенное";
export const JURY_RIGGED_DESCRIPTION =
  "Оружие собрано по дешёвым, упрощённым или импровизированным производственным схемам GunMart. Конструкция функциональна, но рассчитана прежде всего на массовость, ремонтопригодность и низкую цену.";

const CYBERSKULL_BLOCK_RE = /<section data-cpel-cyberskull="[^"]+">[\s\S]*?<\/section>/giu;
const CYBERSKULL_BLOCK = `<section data-cpel-cyberskull="${VERSION}"><hr><p><strong>Усиленная краниальная защита:</strong> Киберчереп заменяет и усиливает естественные кости черепа композитным каркасом, амортизирующими вставками и внутренними креплениями. Он рассеивает самые опасные ударные нагрузки прежде, чем они достигнут мозга и уязвимых нейронных интерфейсов.</p><p><strong>Критическое попадание:</strong> каждый раз, когда по вам критически попадают, сделайте @Check[flat|dc:17|showDC:all]{чистую проверку КС 17}. При успехе критическое попадание становится обычным попаданием. Эта защита не уменьшает урон обычного попадания и не отменяет дополнительные эффекты, которые применяются независимо от степени успеха.</p></section>`;

function sourceOf(item) {
  return item?._source ?? item?.toObject?.(false) ?? item ?? {};
}

function normalizeName(name) {
  return String(name ?? "")
    .normalize("NFKC")
    .replace(/[‐‑‒–—−]/g, "-")
    .trim();
}

export function registerJuryRiggedTrait(config = globalThis.CONFIG?.PF2E) {
  if (!config) return false;
  let changed = false;
  for (const key of ["weaponTraits", "npcAttackTraits"]) {
    const table = config[key];
    if (table && typeof table === "object" && table[JURY_RIGGED_TRAIT] !== JURY_RIGGED_LABEL) {
      table[JURY_RIGGED_TRAIT] = JURY_RIGGED_LABEL;
      changed = true;
    }
  }
  const descriptions = config.traitsDescriptions;
  if (descriptions && typeof descriptions === "object" && descriptions[JURY_RIGGED_TRAIT] !== JURY_RIGGED_DESCRIPTION) {
    descriptions[JURY_RIGGED_TRAIT] = JURY_RIGGED_DESCRIPTION;
    changed = true;
  }
  return changed;
}

export function isGunMart(item) {
  const src = sourceOf(item);
  if (src?.type !== "weapon") return false;
  const name = normalizeName(src?.name);
  const slug = String(src?.flags?.world?.neonForgeSourceMeta?.slug ?? src?.system?.slug ?? "").toLowerCase();
  return /^gunmart(?:\s|\b|-)/iu.test(name) || slug.startsWith("gunmart-");
}

export function patchGunMartSource(input) {
  const source = input ?? {};
  if (!isGunMart(source)) return { source, changed: false };
  source.system ??= {};
  source.system.traits ??= { value: [], rarity: "common" };
  const traits = Array.isArray(source.system.traits.value) ? source.system.traits.value : [];
  if (traits.includes(JURY_RIGGED_TRAIT)) return { source, changed: false };
  source.system.traits.value = [...traits, JURY_RIGGED_TRAIT];
  return { source, changed: true };
}

export function isCyberSkull(item) {
  const src = sourceOf(item);
  const name = normalizeName(src?.name);
  const remaster = src?.flags?.["cyberpunk-remaster"] ?? {};
  const family = String(remaster.pktFamily ?? remaster.family ?? "").toLowerCase();
  const nameMatch = /(?:кибер\s*-?\s*череп|cyber\s*-?\s*skull|cyberskull)/iu.test(name);
  const familyMatch = /(?:^|-)cyber-?skull(?:-|$)/u.test(family);
  const looksLikeBase = remaster.implantType === "base" || familyMatch;
  return Boolean((nameMatch && looksLikeBase) || familyMatch);
}

function replaceCyberSkullBlock(description) {
  let base = String(description ?? "").replace(CYBERSKULL_BLOCK_RE, "").trim();
  const slotsLine = /<p><strong>Слоты:<\/strong>\s*[^<]*<\/p>/iu;
  if (slotsLine.test(base)) {
    base = base.replace(slotsLine, "<p><strong>Слоты:</strong> 3</p>");
  } else {
    base += "<p><strong>Слоты:</strong> 3</p>";
  }
  return `${base}${CYBERSKULL_BLOCK}`;
}

export function patchCyberSkullSource(input) {
  const source = input ?? {};
  if (!isCyberSkull(source)) return { source, changed: false };

  source.flags ??= {};
  source.flags["cyberpunk-remaster"] ??= {};
  source.system ??= {};
  source.system.description ??= { value: "" };

  const remaster = source.flags["cyberpunk-remaster"];
  const oldSlots = Number(remaster.slots ?? 0);
  const oldDescription = String(source.system.description.value ?? "");
  const newDescription = replaceCyberSkullBlock(oldDescription);

  remaster.slots = 3;
  source.system.description.value = newDescription;

  return {
    source,
    changed: oldSlots !== 3 || oldDescription !== newDescription,
  };
}

function updateDataForDocument(item) {
  const original = sourceOf(item);
  if (isGunMart(original)) {
    const patched = patchGunMartSource(structuredClone(original));
    if (!patched.changed) return null;
    return { "system.traits.value": patched.source.system.traits.value };
  }
  if (isCyberSkull(original)) {
    const patched = patchCyberSkullSource(structuredClone(original));
    if (!patched.changed) return null;
    return {
      "flags.cyberpunk-remaster.slots": 3,
      "system.description.value": patched.source.system.description.value,
    };
  }
  return null;
}

async function updateDocument(item, label) {
  const update = updateDataForDocument(item);
  if (!update) return 0;
  try {
    await item.update(update, { render: false, [MODULE_ID]: { migration1553: true } });
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
  if (options?.[MODULE_ID]?.migration1553) return;
  if (!isOriginatingClient(userId)) return;
  await updateDocument(item, "новую копию предмета");
}

async function runMigration() {
  if (!globalThis.game?.user?.isGM) return;
  registerJuryRiggedTrait();

  let updated = 0;
  for (const item of globalThis.game?.items ?? []) updated += await updateDocument(item, "мировой предмет");
  for (const actor of globalThis.game?.actors ?? []) {
    for (const item of actor.items ?? []) updated += await updateDocument(item, `предмет актёра ${actor.name}`);
  }

  if (updated) console.info(`[${MODULE_ID}] ${VERSION}: обновлено предметов: ${updated}`);
}

if (globalThis.Hooks?.once) {
  Hooks.once("init", () => registerJuryRiggedTrait());
  Hooks.once("ready", runMigration);
}
if (globalThis.Hooks?.on) Hooks.on("createItem", handleCreatedItem);
