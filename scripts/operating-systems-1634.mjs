const MOD = 'cyberpunk-equipment-library';
const REM = 'cyberpunk-remaster';
const PLANNED = Symbol('cpelOperatingSystems1634');
const IDS = new Map([
  ['3d9d743e2257f5b7', 'berserk'],
  ['da6b47f0ef91a823', 'berserk'],
  ['6bf9c0fdbdf9e4c7', 'berserk'],
  ['f06916bbd3e997b4', 'berserk'],
  ['bf0c8796b423e160', 'berserk'],
  ['51e58f662c7da155', 'chrome-compressor'],
]);
const sourceOf = item => item?._source ?? item?.toObject?.(true) ?? item ?? {};
const itemsOf = actor => Array.isArray(actor?.items) ? actor.items :
  Array.isArray(actor?.items?.contents) ? actor.items.contents : [...(actor?.items?.values?.() ?? [])];

export function operatingSystem1634Kind(item) {
  const source = sourceOf(item);
  if (source.type !== 'equipment' && source.type !== 'backpack') return null;
  const references = [source._stats?.compendiumSource, source._stats?.duplicateSource, source.flags?.core?.sourceId, source.sourceId]
    .filter(ref => typeof ref === 'string' && ref.startsWith('Compendium.'));
  const foreign = references.some(ref => !ref.startsWith('Compendium.' + MOD + '.'));
  if (!foreign) {
    for (const ref of references) {
      if (ref.startsWith('Compendium.' + MOD + '.implants.')) {
        const kind = IDS.get(ref.split('.').at(-1));
        if (kind) return kind;
      }
    }
    const marker = source.flags?.[MOD]?.operatingSystem1634;
    if (marker?.provider === MOD && ['berserk', 'chrome-compressor'].includes(marker.kind)) return marker.kind;
    if (!references.length && IDS.has(source._id)) return IDS.get(source._id);
  }
  const flags = source.flags?.[REM] ?? {};
  if (flags.exclusiveFamily === 'sandevistan') return 'sandevistan';
  if (flags.exclusiveFamily === 'cyberdeck' || /cyberdeck/u.test(flags.pktFamily ?? '')) return 'cyberdeck';
  if (source.flags?.['sf2e-netrunning']?.category === 'cyberdecks') return 'cyberdeck';
  return null;
}

function installed(item) {
  const source = sourceOf(item);
  const state = source.flags?.[REM]?.installed;
  return typeof state === 'boolean' ? state : source.system?.equipped?.carryType === 'implanted';
}

export function operatingSystem1634Conflict(actor, candidate, planned = new Map()) {
  const kind = operatingSystem1634Kind(candidate);
  if (!kind || !installed(candidate)) return null;
  const source = sourceOf(candidate);
  const id = source._id ?? candidate.id;
  const own = ['berserk', 'chrome-compressor'].includes(kind);
  const current = new Map(itemsOf(actor).map(item => [item.id ?? sourceOf(item)._id, sourceOf(item)]));
  for (const [key, value] of planned) current.set(key, value);
  for (const [key, item] of current) {
    if (key === id || !installed(item)) continue;
    const other = operatingSystem1634Kind(item);
    if (other && (own || ['berserk', 'chrome-compressor'].includes(other))) {
      return 'Операционное место занято имплантом «' + item.name + '». Снимите его перед установкой «' + source.name + '».';
    }
  }
  return null;
}

function operationPlan(options, actor) {
  options[PLANNED] ??= new Map();
  const key = actor.uuid ?? actor;
  if (!options[PLANNED].has(key)) options[PLANNED].set(key, new Map());
  return options[PLANNED].get(key);
}

function validate(actor, source, options) {
  const planned = operationPlan(options, actor);
  const conflict = operatingSystem1634Conflict(actor, source, planned);
  if (conflict) {
    globalThis.ui?.notifications?.warn?.(conflict);
    return false;
  }
  planned.set(source._id, source);
}

if (globalThis.Hooks?.on) {
  Hooks.on('preCreateItem', (item, _data, options = {}) => {
    const actor = item.actor;
    const source = sourceOf(item);
    if (!actor || !operatingSystem1634Kind(source)) return;
    return validate(actor, source, options);
  });
  Hooks.on('preUpdateItem', (item, changes, options = {}) => {
    const actor = item.actor;
    if (!actor || !operatingSystem1634Kind(item)) return;
    const future = foundry.utils.mergeObject(structuredClone(sourceOf(item)), foundry.utils.expandObject(changes), {inplace: false});
    if (installed(future) === installed(item)) return;
    return validate(actor, future, options);
  });
}
