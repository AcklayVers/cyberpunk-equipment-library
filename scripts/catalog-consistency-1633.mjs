import {CATALOG_METADATA_1633, CATALOG_DOCUMENT_REPAIRS_1633, RETIRED_CATALOG_UUIDS_1633} from './data/catalog-consistency-1633.mjs';

const MOD = 'cyberpunk-equipment-library';
const REM = 'cyberpunk-remaster';
const rows = new Map(CATALOG_METADATA_1633.map(row => [row.id, row]));
const repairs = new Map(CATALOG_DOCUMENT_REPAIRS_1633.map(row => [row.id, row]));
const values = collection => Array.isArray(collection) ? collection :
  Array.isArray(collection?.contents) ? collection.contents : [...(collection?.values?.() ?? [])];
const sourceOf = document => document?._source ?? document?.toObject?.(true) ?? document ?? {};
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const ownOptions = {[MOD]: {catalog1633: true}};
const types = {база: 'base', модуль: 'module', внутренний: 'internal', внешний: 'external', стилевой: 'fashion'};

/** Match the canonical footer precedence used by Cyberpunk Remaster. */
export function readCatalogMetadata1633(source) {
  const lines = String(source.system?.description?.value ?? '')
    .replace(/<br\s*\/?>|<hr\b[^>]*>/giu, '\n')
    .replace(/<\/(?:div|h[1-6]|li|p|section|tr)>/giu, '\n')
    .replace(/<[^>]*>/gu, '').replace(/&nbsp;|&#160;/giu, ' ')
    .split(/\n/u).map(line => line.trim()).filter(Boolean);
  const text = lines.join(' ');
  const match = (canonical, fallback) =>
    [...lines].reverse().map(line => line.match(canonical)).find(Boolean) ?? text.match(fallback);
  const hard = match(/^Hard\s*Cost\s*:?\s*(\d+)\s*$/iu, /Hard\s*Cost\s*:?\s*(\d+)/iu);
  const stress = match(/^Stress\s*Cost\s*:?\s*(?:\[\[\/r\s*)?((?:\d*d(?:4|6))(?:\s*\+\s*\d*d(?:4|6))*|0)/iu,
    /Stress\s*Cost\s*:?\s*(?:\[\[\/r\s*)?((?:\d*d(?:4|6))(?:\s*\+\s*\d*d(?:4|6))*|0)/iu);
  const slots = match(/^Слот[А-Яа-яЁё]*\s*:?\s*(\d+)\s*$/iu, /Слот[А-Яа-яЁё]*\s*:?\s*(\d+)/iu);
  const type = match(/^Тип\s*импланта\s*:?\s*([А-Яа-яЁёA-Za-z]+)\s*$/iu,
    /Тип\s*импланта\s*:?\s*([А-Яа-яЁёA-Za-z]+)/iu);
  return {
    hardCost: hard ? Number(hard[1]) : null,
    stressFormula: stress ? stress[1].replace(/\s*\+\s*/gu, ' + ') : null,
    implantType: type ? types[type[1].toLocaleLowerCase('ru')] ?? null : null,
    slots: slots ? Number(slots[1]) : null,
  };
}

function identity(source) {
  if (!['equipment', 'weapon', 'armor', 'consumable', 'backpack'].includes(source.type)) return null;
  const refs = [source._stats?.compendiumSource, source._stats?.duplicateSource, source.flags?.core?.sourceId, source.sourceId]
    .filter(ref => typeof ref === 'string' && ref.startsWith('Compendium.'));
  if (refs.some(ref => !ref.startsWith('Compendium.' + MOD + '.'))) return null;
  for (const ref of refs) {
    if (ref.startsWith('Compendium.' + MOD + '.implants.')) {
      const row = rows.get(ref.split('.').at(-1));
      if (row) return row;
    }
  }
  if (refs.length) return null;
  return rows.get(source._id) ?? (String(source.img ?? '').startsWith('modules/' + MOD + '/')
    ? CATALOG_METADATA_1633.find(row => row.name === source.name) ?? null : null);
}

function containsCatalogItem(source) {
  return Boolean(identity(source)) || Boolean(source.system?.subitems?.some(containsCatalogItem));
}

export function patchCatalogMetadata1633(input) {
  const source = structuredClone(sourceOf(input));
  const row = identity(source);
  if (row) {
    const repair = repairs.get(row.id);
    const rulesManaged = !repair?.rules || same(source.system.rules, repair.rules.before) || same(source.system.rules, repair.rules.value);
    if (repair?.rules && same(source.system.rules, repair.rules.before)) {
      source.system.rules = structuredClone(repair.rules.value);
    }
    if (repair?.description && rulesManaged && source.system.description?.value === repair.description.before) {
      source.system.description.value = repair.description.value;
    }
    if (repair?.price && same(source.system.price?.value, repair.price.before)) {
      source.system.price.value = structuredClone(repair.price.value);
    }
    const described = readCatalogMetadata1633(source);
    const flags = source.flags?.[REM];
    for (const [field, change] of Object.entries(row.fields)) {
      const price = source.system?.price?.value;
      const actual = field === 'priceEddies'
        ? (price && Object.hasOwn(price, 'sp') && Object.keys(price).every(key => key === 'sp') ? Number(price.sp) : null)
        : ['slots', 'slotsUsed'].includes(field) ? described.slots : described[field];
      if (flags && same(flags[field], change.before) && same(actual, change.value)) flags[field] = change.value;
    }
  }
  if (Array.isArray(source.system?.subitems)) source.system.subitems = source.system.subitems.map(patchCatalogMetadata1633);
  return source;
}

function difference(before, after, prefix = '', update = {}) {
  if (same(before, after)) return update;
  if (!before || !after || typeof before !== 'object' || typeof after !== 'object' || Array.isArray(before) || Array.isArray(after)) {
    update[prefix] = after;
    return update;
  }
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    difference(before[key], after[key], prefix ? prefix + '.' + key : key, update);
  }
  return update;
}

export function catalogMetadata1633Update(document) {
  const before = sourceOf(document);
  if (!containsCatalogItem(before)) return null;
  const update = difference(before, patchCatalogMetadata1633(before));
  return Object.keys(update).length ? update : null;
}

export function repairCatalogLinks1633(html) {
  return String(html ?? '').replace(/<tr\b[^>]*>[\s\S]*?<\/tr>/giu, row => {
    let repaired = false;
    const next = row.replace(/@UUID\[([^\]]+)\]\{([^}]*)\}/gu, (match, uuid, label) => {
      if (!RETIRED_CATALOG_UUIDS_1633.includes(uuid)) return match;
      repaired = true;
      return label;
    });
    return repaired ? next.replace(/<td\b[^>]*>[^<]*<\/td>\s*<\/tr>$/iu,
      '<td>Требует карточки</td></tr>') : next;
  });
}

function journalPageUpdate(page) {
  const source = sourceOf(page);
  const ref = source._stats?.compendiumSource ?? source.flags?.core?.sourceId ??
    sourceOf(page.parent)._stats?.compendiumSource;
  if (!String(ref ?? '').startsWith('Compendium.' + MOD + '.journals.')) return null;
  const html = source.text?.content;
  if (typeof html !== 'string') return null;
  const repaired = repairCatalogLinks1633(html);
  return repaired === html ? null : {'text.content': repaired};
}

function primaryGM() {
  const users = values(globalThis.game?.users).filter(user => user.active && user.isGM)
    .sort((left, right) => String(left.id).localeCompare(String(right.id)));
  return globalThis.game?.user?.isGM && users[0]?.id === globalThis.game.user.id;
}

export async function migrateCatalog1633() {
  const result = {items: 0, pages: 0, failed: 0};
  if (!primaryGM()) return result;
  const actors = new Map(values(game.actors).map(actor => [actor.uuid ?? actor, actor]));
  for (const scene of values(game.scenes)) for (const token of values(scene.tokens)) {
    if (!token.actorLink && token.actor) actors.set(token.actor.uuid ?? token.actor, token.actor);
  }
  const seen = new Set();
  for (const item of [...values(game.items), ...[...actors.values()].flatMap(actor => values(actor.items))]) {
    if (seen.has(item.uuid ?? item)) continue;
    seen.add(item.uuid ?? item);
    const update = catalogMetadata1633Update(item);
    if (update) {
      try { await item.update(update, ownOptions); result.items++; }
      catch (error) { result.failed++; console.error('[' + MOD + '] metadata migration', error); }
    }
  }
  for (const journal of values(game.journal)) for (const page of values(journal.pages)) {
    const update = journalPageUpdate(page);
    if (update) {
      try { await page.update(update, ownOptions); result.pages++; }
      catch (error) { result.failed++; console.error('[' + MOD + '] journal migration', error); }
    }
  }
  return result;
}

function writeChange(changes, path, value) {
  const parts = path.split('.');
  for (let length = parts.length; length > 0; length--) {
    const prefix = parts.slice(0, length).join('.');
    if (!Object.hasOwn(changes, prefix)) continue;
    if (length === parts.length) changes[prefix] = value;
    else globalThis.foundry.utils.setProperty(changes[prefix], parts.slice(length).join('.'), value);
    return;
  }
  changes[path] = value;
}

if (globalThis.Hooks?.on) {
  Hooks.on('preCreateItem', document => {
    const update = catalogMetadata1633Update(document);
    if (update) document.updateSource(update);
  });
  Hooks.on('preUpdateItem', (document, changes, options = {}) => {
    if (options[MOD]?.catalog1633) return;
    const subitems = changes['system.subitems'] ?? changes.system?.subitems ?? [];
    if (!containsCatalogItem(sourceOf(document)) && !subitems.some(containsCatalogItem)) return;
    const future = foundry.utils.mergeObject(structuredClone(sourceOf(document)), foundry.utils.expandObject(changes), {inplace: false});
    const update = catalogMetadata1633Update(future);
    for (const [path, value] of Object.entries(update ?? {})) writeChange(changes, path, value);
  });
  Hooks.on('preCreateJournalEntryPage', page => {
    const update = journalPageUpdate(page);
    if (update) page.updateSource(update);
  });
}
if (globalThis.Hooks?.once) Hooks.once('ready', () => {
  const module = globalThis.game?.modules?.get?.(MOD);
  if (module) module.api = {...module.api, migrateCatalog1633};
  migrateCatalog1633().catch(error => console.error('[' + MOD + '] 1.6.33', error));
});
