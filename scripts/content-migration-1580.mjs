const MODULE_ID = "cyberpunk-equipment-library";
const VERSION = "1.5.80";
const SOURCE_PREFIX = `Compendium.${MODULE_ID}.implants.Item.`;
const TARGET_SELECTORS = new Set(["acrobatics", "athletics", "computers", "crafting", "deception", "diplomacy", "intimidation", "medicine", "perception", "piloting", "society", "stealth", "thievery"]);
const LEGACY_IDS = new Set(["2uDsJr0ucsnADwWo", "4VaecoCuc1H3RzuU", "5UzG5En2fMFo5XPC", "5mtUx8nmnHKjbax5", "5qUXt6895sLJBFj6", "5s6lxCJqNtVK7Efb", "6GXvyMiS9Bm0Wz4l", "8A2VU7oOiHueS5c6", "9ZZm9SOs1ji7bFiR", "9p6ZesRgq9Tx2WWd", "BTDxv5F9XhR0OGhX", "CDObbqQqMcNzZFoa", "CQCMUw9CtxV1SLNb", "CVaZdDwExUlrfHmg", "CtbRLaOxC03UvIMx", "DwTEZdF9PINee9bJ", "Ek4YwtZFKExTUBb3", "H8DPxu6mnPm1BzXr", "HjUZ8tJMUzQOC3wj", "IdvSKfsXjJ4VrCGC", "Nc5XyH4upymGWYhG", "OG9bjGCiYW66886n", "QJSqQW6HcII3iY3l", "QPg6woP3GOcLCSYj", "QUDfDXoE59S794Z5", "ThRSjWkUI2J4M9KT", "ToSdn4z5rddQisXI", "UjlZBSMlgoTK1Uqd", "XMJPftdEuKj3sJSx", "YUGQG6VZDM9RqDnt", "ZdKSgiWr5bGFY5ja", "bH7eM6RtJXejt1KF", "f7hMsB3fzVa53Dcv", "fGpNyHisGbeFC6X1", "hgy1buNNB1C4u9lA", "i3MfUg0DLq4YJeEK", "k8QYrtcPTppLp4Kr", "oVyhVg7TAPheefgL", "rIUa6i0nNugMRrtm", "toBJ5PBTWwZkJx9g", "tuQZuR78gTF03INr", "vJy6Bfc6fpDA5MrA", "x1ycdZyXClpjCQI1", "xdupxryPz2KxsQR0", "xfdFeXsbjnwqTGCw", "z9Ql6anoT0sisdaL", "zmR2q76bwXn7jyKD"]);
const STATUS_BY_ID = new Map(Object.entries({"4VaecoCuc1H3RzuU": ["athletics"], "5qUXt6895sLJBFj6": ["crafting", "medicine", "thievery"], "6GXvyMiS9Bm0Wz4l": ["acrobatics"], "CVaZdDwExUlrfHmg": ["athletics"], "ThRSjWkUI2J4M9KT": ["acrobatics"], "UjlZBSMlgoTK1Uqd": ["crafting", "medicine"], "rIUa6i0nNugMRrtm": ["athletics"], "vJy6Bfc6fpDA5MrA": ["intimidation"], "zmR2q76bwXn7jyKD": ["deception"]}).map(([id, selectors]) => [id, new Set(selectors)]));
const LEGACY_NAME_TO_ID = new Map(Object.entries({"Raven Microcybernetics \"Анубис\"": "2uDsJr0ucsnADwWo", "Киберпозвоночник «Вектор»": "4VaecoCuc1H3RzuU", "Окуломодуль «Parallax Gauge»": "5UzG5En2fMFo5XPC", "Сдвиг Цвета": "5mtUx8nmnHKjbax5", "Быстрые пальцы Rocklin Augmentics": "5qUXt6895sLJBFj6", "Реверсивный коленный узел «Раптор»": "5s6lxCJqNtVK7Efb", "Sycust Киберпозвоночник": "6GXvyMiS9Bm0Wz4l", "Рука-мультитул": "8A2VU7oOiHueS5c6", "Окуломодуль «Аргус»": "9ZZm9SOs1ji7bFiR", "Модулятор голоса": "9p6ZesRgq9Tx2WWd", "Окуломодуль «Призма»": "BTDxv5F9XhR0OGhX", "Паркурный узел «Вертикаль»": "CDObbqQqMcNzZFoa", "Окуломодуль «Мимик»": "CQCMUw9CtxV1SLNb", "Киберпозвоночник «Атлас»": "CVaZdDwExUlrfHmg", "Медсканер киберруки": "CtbRLaOxC03UvIMx", "АудиоВокс": "DwTEZdF9PINee9bJ", "Окуломодуль «Глубиномер»": "Ek4YwtZFKExTUBb3", "Шифратор/Дешифратор": "H8DPxu6mnPm1BzXr", "Улучшенная киберстопа": "HjUZ8tJMUzQOC3wj", "Окуломодуль «Трассер»": "IdvSKfsXjJ4VrCGC", "Модуль ИК/УФ v.II": "Nc5XyH4upymGWYhG", "Анализатор голосового стресса": "OG9bjGCiYW66886n", "Радар/Сканер": "QJSqQW6HcII3iY3l", "Силовая муфта «Домкрат»": "QPg6woP3GOcLCSYj", "Встроенный Агент «Вергилий»": "QUDfDXoE59S794Z5", "Экстра-сочленение конечности": "ThRSjWkUI2J4M9KT", "Техсканер киберруки": "ToSdn4z5rddQisXI", "Рука Норн Rocklin Augmentics": "UjlZBSMlgoTK1Uqd", "Управление дронами": "XMJPftdEuKj3sJSx", "Окуломодуль «Сфинкс»": "YUGQG6VZDM9RqDnt", "Контактный сейсмофон «Крот»": "ZdKSgiWr5bGFY5ja", "Микрокузня «Паяльник»": "bH7eM6RtJXejt1KF", "Фильтр голосов «Хор»": "f7hMsB3fzVa53Dcv", "Детектор прослушки «Сверчок»": "fGpNyHisGbeFC6X1", "Адгезивная ладонь «Геккон»": "hgy1buNNB1C4u9lA", "Окуломодуль «Гиростабилизатор»": "i3MfUg0DLq4YJeEK", "Акустический триангулятор «Гончая»": "k8QYrtcPTppLp4Kr", "Усиленный слух": "oVyhVg7TAPheefgL", "Киберпозвоночник «Голиаф»": "rIUa6i0nNugMRrtm", "Окуломодуль «Диагност»": "toBJ5PBTWwZkJx9g", "Подошвенный демпфер «Кошачий шаг»": "tuQZuR78gTF03INr", "Усилитель голоса": "vJy6Bfc6fpDA5MrA", "Синтезатор голосовых слепков «Мим»": "x1ycdZyXClpjCQI1", "Окуломодуль «Скриптор»": "xdupxryPz2KxsQR0", "Окуломодуль «Криминалист»": "xfdFeXsbjnwqTGCw", "Усилитель картинки": "z9Ql6anoT0sisdaL", "Соматическая маска «Монах»": "zmR2q76bwXn7jyKD"}));
const ROMAN = new Map([[1,"I"],[2,"II"],[3,"III"]]);

function sourceOf(item) { return item?._source ?? item?.toObject?.(false) ?? item ?? {}; }
function canonicalId(source) {
  const refs = [source?._stats?.compendiumSource, source?.flags?.core?.sourceId, source?.sourceId];
  for (const ref of refs) if (typeof ref === "string" && ref.startsWith(SOURCE_PREFIX)) return ref.slice(SOURCE_PREFIX.length);
  if (LEGACY_IDS.has(source?._id)) return source._id;
  return LEGACY_NAME_TO_ID.get(String(source?.name ?? "")) ?? null;
}
function isPkt(source) {
  const f = source?.flags?.["cyberpunk-remaster"] ?? {};
  return f.pktOnly === true || String(source?.name ?? "").startsWith("ПКТ:");
}
function selectorsOf(rule) { return typeof rule?.selector === "string" ? [rule.selector] : Array.isArray(rule?.selector) ? rule.selector : []; }

export function patch1580Source(input) {
  const source = input ?? {};
  source.system ??= {}; source.flags ??= {}; source.flags["cyberpunk-remaster"] ??= {};
  const f = source.flags["cyberpunk-remaster"];
  if (isPkt(source)) return { source, changed: false };
  const before = JSON.stringify({name:source.name,rules:source.system.rules,remaster:f});
  const id = canonicalId(source);
  if (!f.skillLine && id && LEGACY_IDS.has(id)) {
    const statusSelectors = STATUS_BY_ID.get(id) ?? new Set();
    for (const rule of source.system.rules ?? []) {
      if (rule?.key !== "FlatModifier" || rule.type !== "item") continue;
      const targets = selectorsOf(rule).filter((s) => TARGET_SELECTORS.has(s));
      if (!targets.length) continue;
      rule.type = targets.every((s) => statusSelectors.has(s)) ? "status" : "circumstance";
    }
  }
  const tier = Number(f.skillTier);
  if (f.skillLine === "acrobatics-legs" && ROMAN.has(tier)) source.name = `Гибкие мышцы ${ROMAN.get(tier)}`;
  if (f.skillLine === "athletics-arms" && ROMAN.has(tier)) source.name = `Усиленные мышцы ${ROMAN.get(tier)}`;
  if (["deception-audiovox","diplomacy-audiovox","intimidation-audiovox"].includes(f.skillLine)) {
    f.implantType = "internal";
    delete f.pktParentFamily;
  }
  const after = JSON.stringify({name:source.name,rules:source.system.rules,remaster:f});
  return { source, changed: before !== after };
}

function updateDataForDocument(item) {
  const original = sourceOf(item); const patched = patch1580Source(structuredClone(original));
  if (!patched.changed) return null;
  const update = { name: patched.source.name, "system.rules": patched.source.system?.rules ?? [] };
  const oldF = original.flags?.["cyberpunk-remaster"] ?? {}; const newF = patched.source.flags?.["cyberpunk-remaster"] ?? {};
  if (oldF.implantType !== newF.implantType) update["flags.cyberpunk-remaster.implantType"] = newF.implantType;
  if (oldF.pktParentFamily && !newF.pktParentFamily) update["flags.cyberpunk-remaster.-=pktParentFamily"] = null;
  return update;
}
function collectionValues(collection) { if (Array.isArray(collection?.contents)) return collection.contents; if (typeof collection?.values === "function") return [...collection.values()]; return [...(collection ?? [])]; }
function isPrimaryActiveGM() {
  const active=collectionValues(globalThis.game?.users).filter((u)=>u?.active&&u?.isGM).sort((a,b)=>String(a.id).localeCompare(String(b.id)));
  return Boolean(active.length && globalThis.game?.user?.id===active[0].id);
}
async function migrateDocument(item) { const update=updateDataForDocument(item); if (!update || !item?.update) return false; await item.update(update,{render:false,[MODULE_ID]:{migration1580:true}}); return true; }
export async function migrate1580Copies() {
  if (!isPrimaryActiveGM()) return 0; let updated=0;
  const docs=[...collectionValues(globalThis.game?.items),...collectionValues(globalThis.game?.actors).flatMap((a)=>collectionValues(a?.items))];
  for (const item of docs) { try { if (await migrateDocument(item)) updated++; } catch (error) { console.warn(`[${MODULE_ID}] ${VERSION}: не удалось обновить ${item?.name ?? item?.id}`,error); } }
  if (updated) console.info(`[${MODULE_ID}] ${VERSION}: обновлено существующих имплантов: ${updated}.`); return updated;
}
async function onCreate(item, options={}, userId=null) { if (options?.[MODULE_ID]?.migration1580) return; if (userId && globalThis.game?.user?.id && userId!==globalThis.game.user.id) return; try { await migrateDocument(item); } catch (error) { console.warn(`[${MODULE_ID}] ${VERSION}: createItem migration failed`,error); } }
if (globalThis.Hooks?.once) Hooks.once("ready", migrate1580Copies);
if (globalThis.Hooks?.on) Hooks.on("createItem", onCreate);
