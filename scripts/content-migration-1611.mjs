const MODULE_ID = "cyberpunk-equipment-library";
const VERSION = "1.6.11";
const WEAPON_SOURCE_PREFIX = `Compendium.${MODULE_ID}.weapons.Item.`;
const TRACER_IDS = new Set(["bkX4BlWfysEidZJd", "3gqkyGqJgvpi6kI7"]);
const TRACER_NAMES = new Set([
  "Пистолетные патроны: Трассирующие",
  "Винтовочные патроны: Трассирующие",
]);

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
function isTracer(source) {
  const id = sourceId(source);
  return TRACER_IDS.has(id) || TRACER_NAMES.has(String(source?.name ?? ""));
}

export function patch1611Source(input) {
  const source = input ?? {};
  if (!isTracer(source)) return { source, changed: false };
  const system = (source.system ??= {});
  const price = (system.price ??= { value: {}, per: 10 });
  price.value ??= {};
  const before = JSON.stringify(price);
  price.value.sp = 20;
  price.per = 10;
  return { source, changed: before !== JSON.stringify(price) };
}

function updateDataForDocument(item) {
  const original = sourceOf(item);
  const patched = patch1611Source(structuredClone(original));
  if (!patched.changed) return null;
  return { "system.price": patched.source.system.price };
}

async function migrateDocument(item) {
  const update = updateDataForDocument(item);
  if (!update || !item?.update) return false;
  await item.update(update, { render: false, [MODULE_ID]: { migration1611: true } });
  return true;
}

export async function migrate1611Copies() {
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
      console.warn(`[${MODULE_ID}] ${VERSION}: не удалось обновить цену ${item?.name ?? item?.id}`, error);
    }
  }
  return updated;
}

if (globalThis.Hooks?.once) Hooks.once("ready", migrate1611Copies);
