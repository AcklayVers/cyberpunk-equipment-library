import { buildSubstanceSources } from "./substances-1555.mjs";

const MODULE_ID = "cyberpunk-equipment-library";
const VERSION = "1.5.73";
const PACK_ID = `${MODULE_ID}.gear`;

const CANONICAL_SOURCES = buildSubstanceSources({ linkScope: "compendium" });
const BY_ID = new Map(CANONICAL_SOURCES.map((source) => [source._id, source]));
const BY_SIGNATURE = new Map(CANONICAL_SOURCES.map((source) => [substanceSignature(source), source]));

function sourceOf(documentOrSource) {
  return documentOrSource?.toObject?.() ?? documentOrSource?._source ?? documentOrSource ?? null;
}

function substanceFlags(documentOrSource) {
  return sourceOf(documentOrSource)?.flags?.[MODULE_ID] ?? {};
}

function normalizedStage(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : 0;
}

export function substanceSignature(documentOrSource) {
  const flags = substanceFlags(documentOrSource);
  const key = String(flags.dataPool1555Key ?? "").trim();
  const kind = String(flags.dataPool1555Kind ?? "").trim();
  if (!key || !kind) return "";
  return `${key}|${kind}|${normalizedStage(flags.stage)}`;
}

export function substance1571CanonicalFor(documentOrSource) {
  const source = sourceOf(documentOrSource);
  if (!source) return null;
  const id = String(source._id ?? source.id ?? "");
  if (id && BY_ID.has(id)) return BY_ID.get(id) ?? null;
  const signature = substanceSignature(source);
  return signature ? (BY_SIGNATURE.get(signature) ?? null) : null;
}

function sameValue(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

/**
 * Return a minimal Foundry update object that repairs a v1.5.55+ substance
 * without replacing unrelated user-editable fields such as quantity/equipped state.
 */
export function substance1571UpdateData(documentOrSource) {
  const source = sourceOf(documentOrSource);
  const canonical = substance1571CanonicalFor(source);
  if (!source || !canonical) return null;

  const update = {};
  const currentDescription = source.system?.description ?? {};
  const canonicalDescription = canonical.system?.description ?? {};

  if (!sameValue(currentDescription.value ?? "", canonicalDescription.value ?? "")) {
    update["system.description.value"] = canonicalDescription.value ?? "";
  }
  if (Object.hasOwn(canonicalDescription, "gm") && !sameValue(currentDescription.gm ?? "", canonicalDescription.gm ?? "")) {
    update["system.description.gm"] = canonicalDescription.gm ?? "";
  }

  const currentRules = source.system?.rules ?? [];
  const canonicalRules = canonical.system?.rules ?? [];
  if (!sameValue(currentRules, canonicalRules)) {
    update["system.rules"] = structuredClone(canonicalRules);
  }

  if (String(substanceFlags(source).version ?? "") !== VERSION) {
    update[`flags.${MODULE_ID}.version`] = VERSION;
  }

  return Object.keys(update).length ? update : null;
}

function isPrimaryGM() {
  const game = globalThis.game;
  const user = game?.user;
  if (!user?.isGM) return false;
  const activeGMs = [...(game?.users ?? [])]
    .filter((candidate) => candidate?.active && candidate?.isGM)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  return !activeGMs.length || activeGMs[0]?.id === user.id;
}

async function patchDocument(document, options = {}, { sourceFallback = false } = {}) {
  const update = substance1571UpdateData(document);
  if (!update) return false;

  if (typeof document?.update === "function") {
    try {
      await document.update(update, {
        diff: true,
        render: false,
        cpelConditionLinks1571: true,
        ...options,
      });
      return true;
    } catch (error) {
      if (!sourceFallback || typeof document?.updateSource !== "function") throw error;
      document.updateSource(update);
      return true;
    }
  }

  if (sourceFallback && typeof document?.updateSource === "function") {
    document.updateSource(update);
    return true;
  }
  return false;
}

async function patchWorldDocuments() {
  let updated = 0;
  for (const item of globalThis.game?.items ?? []) {
    if (await patchDocument(item)) updated += 1;
  }
  for (const actor of globalThis.game?.actors ?? []) {
    for (const item of actor?.items ?? []) {
      if (await patchDocument(item)) updated += 1;
    }
  }
  return updated;
}

async function patchGearCompendiumInMemory() {
  const pack = globalThis.game?.packs?.get?.(PACK_ID);
  if (!pack?.getDocuments) return 0;

  // Package compendiums are locked by Foundry. Never call Document#update() or
  // CompendiumCollection#configure() here: doing so produces the user-facing
  // "You may not update documents in the locked compendium" notification.
  // Instead repair the loaded document sources in memory. This fixes rendering
  // and drag/create operations for this session, while preCreateItem below and
  // the world migration persist the correction on editable copies.
  const documents = await pack.getDocuments();
  let updated = 0;
  for (const document of documents) {
    const update = substance1571UpdateData(document);
    if (!update || typeof document?.updateSource !== "function") continue;
    document.updateSource(update);
    updated += 1;
  }
  return updated;
}

export async function migrateConditionLinks1571() {
  if (!isPrimaryGM()) return { pack: 0, world: 0, skipped: true };

  let pack = 0;
  let world = 0;
  try {
    pack = await patchGearCompendiumInMemory();
  } catch (error) {
    // preCreateItem below still protects actor/world copies even if a locked package
    // installation cannot be rewritten in place.
    console.warn(`[${MODULE_ID}] v${VERSION}: не удалось исправить ссылки условий в памяти compendium`, error);
  }

  try {
    world = await patchWorldDocuments();
  } catch (error) {
    console.warn(`[${MODULE_ID}] v${VERSION}: не удалось обновить существующие копии веществ`, error);
  }

  if (pack || world) {
    console.info(`[${MODULE_ID}] v${VERSION}: исправлены ссылки условий новых веществ: compendium (в памяти) ${pack}, мир/актёры ${world}.`);
  }
  return { pack, world, skipped: false };
}

function patchSourceBeforeCreate(item) {
  if (!item?.updateSource) return;
  const update = substance1571UpdateData(item);
  if (update) item.updateSource(update);
}

if (globalThis.Hooks?.once && globalThis.Hooks?.on) {
  Hooks.once("ready", migrateConditionLinks1571);
  Hooks.on("preCreateItem", (item) => patchSourceBeforeCreate(item));
}
