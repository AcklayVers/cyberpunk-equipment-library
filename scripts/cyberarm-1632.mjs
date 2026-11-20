import {CYBERARMS_1632, MONOWIRE_ACTIONS_1632} from './data/cyberarm-1632.mjs';

const MOD = 'cyberpunk-equipment-library';
const REM = 'cyberpunk-remaster';
const rows = new Map(CYBERARMS_1632.map(row => [row.id, row]));
const values = collection => Array.isArray(collection) ? collection :
  Array.isArray(collection?.contents) ? collection.contents : [...(collection?.values?.() ?? [])];
const sourceOf = item => item?._source ?? item?.toObject?.(true) ?? item ?? {};
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const ownOptions = {[MOD]: {cyberarm1632: true}};
const pending = new Map();
const processed = new Set();

export function cyberarm1632Identity(item) {
  const source = sourceOf(item);
  if (source.type !== 'weapon') return null;
  const references = [
    source._stats?.compendiumSource, source._stats?.duplicateSource,
    source.flags?.core?.sourceId, item?.sourceId,
  ].filter(ref => typeof ref === 'string' && ref.startsWith('Compendium.'));
  if (references.some(ref => !ref.startsWith('Compendium.' + MOD + '.'))) return null;
  for (const ref of references) {
    if (!ref.startsWith('Compendium.' + MOD + '.implants.')) continue;
    const row = rows.get(ref.split('.').at(-1));
    if (row) return row;
  }
  if (references.length) return null;
  const marker = source.flags?.[MOD]?.cyberarm1632;
  if (marker?.provider === MOD && rows.has(marker.sourceId)) return rows.get(marker.sourceId);
  const direct = rows.get(source._id);
  if (direct) return direct;
  return String(source.img ?? '').startsWith('modules/' + MOD + '/assets/')
    ? CYBERARMS_1632.find(row => row.name === source.name) ?? null : null;
}

function appendDescription(html, paragraph) {
  if (typeof html !== 'string' || html.includes('data-cpel-cyberarm-1632=')) return html;
  const index = html.search(/<hr\b/iu);
  return index < 0 ? html + paragraph : html.slice(0, index) + paragraph + html.slice(index);
}

export function patchCyberarm1632(input) {
  const source = structuredClone(sourceOf(input));
  const row = cyberarm1632Identity(source);
  if (row) {
    const system = source.system;
    let traits = [...(system.traits?.value ?? [])];
    if (row.deadly) traits = traits.filter(trait => !/^deadly-d\d+$/u.test(trait)).concat(row.deadly);
    if (row.fatal) traits = traits.filter(trait => !/^fatal-d\d+$/u.test(trait)).concat(row.fatal);
    if (row.parry) traits = traits.filter(trait => trait !== 'parry').concat('parry');
    if (row.boost) traits = traits.filter(trait => !/^boost-\d+d\d+$/u.test(trait)).concat(row.boost);
    system.traits.value = [...new Set(traits)];
    if (row.family === 'gorilla') {
      system.damage.die = 'd12';
      system.usage.value = 'worn';
      system.equipped.handsHeld = 0;
      if (system.equipped.carryType === 'held') system.equipped.carryType = 'worn';
    }
    system.description.value = appendDescription(system.description.value, row.paragraph);
    source.flags ??= {};
    source.flags[MOD] ??= {};
    source.flags[MOD].cyberarm1632 = {provider: MOD, sourceId: row.id};
  }
  if (Array.isArray(source.system?.subitems)) source.system.subitems = source.system.subitems.map(patchCyberarm1632);
  return source;
}

function difference(before, after, prefix = '', update = {}) {
  if (same(before, after)) return update;
  if (!before || !after || typeof before !== 'object' || typeof after !== 'object' ||
      Array.isArray(before) || Array.isArray(after)) {
    update[prefix] = after;
    return update;
  }
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    difference(before[key], after[key], prefix ? prefix + '.' + key : key, update);
  }
  return update;
}

export function cyberarm1632Update(item) {
  const before = sourceOf(item);
  const update = difference(before, patchCyberarm1632(before));
  return Object.keys(update).length ? update : null;
}

function actorItems(actor) {
  const result = [];
  const visit = item => {
    result.push(item);
    for (const child of values(item.subitems ?? item.system?.subitems)) visit(child);
  };
  for (const item of values(actor?.items)) visit(item);
  return result;
}

function activeWire(item, minimum = 2) {
  const row = cyberarm1632Identity(item);
  if (row?.family !== 'monowire' || row.tier < minimum || item.isBroken || item.isDestroyed) return false;
  const source = sourceOf(item);
  return source.flags?.[REM]?.installed === true || item.isEquipped === true ||
    source.system?.equipped?.carryType === 'held';
}

function generatedAction(item) {
  return sourceOf(item).flags?.[MOD]?.monowireAction1632;
}

async function reconcile(actor) {
  if (!actor?.isOwner) return;
  const items = actorItems(actor);
  const wanted = new Set(items.filter(item => activeWire(item, 3)).map(item =>
    cyberarm1632Identity(item).tier === 4 ? 'any' : 'combat'));
  const remove = [];
  for (const item of values(actor.items)) {
    const action = generatedAction(item);
    if (action?.generated && !wanted.has(action.mode)) remove.push(item.id);
    const link = sourceOf(item).flags?.[MOD]?.monowireConnection1632;
    if (link && !items.some(parent => (parent.id ?? sourceOf(parent)._id) === link.sourceItemId && activeWire(parent))) {
      remove.push(item.id);
    }
  }
  if (remove.length) await actor.deleteEmbeddedDocuments('Item', [...new Set(remove)], ownOptions);
  for (const mode of wanted) {
    if (values(actor.items).some(item => generatedAction(item)?.mode === mode)) continue;
    const action = structuredClone(MONOWIRE_ACTIONS_1632.find(item => generatedAction(item)?.mode === mode));
    delete action._id;
    delete action.folder;
    action.flags[MOD].monowireAction1632.generated = true;
    await actor.createEmbeddedDocuments('Item', [action], ownOptions);
  }
}

function queueActor(actor, callback) {
  const task = (pending.get(actor) ?? Promise.resolve()).catch(() => {}).then(callback);
  pending.set(actor, task);
  task.finally(() => { if (pending.get(actor) === task) pending.delete(actor); }).catch(report);
  return task;
}

export function syncMonowire1632(actor) {
  return queueActor(actor, () => reconcile(actor));
}

export function monowireConnection1632Source(weapon, target, message) {
  return {
    name: 'Моноструна — прямое подключение к ' + target.name,
    type: 'effect',
    img: weapon.img ?? sourceOf(weapon).img,
    system: {
      description: {value: '<p>Успешное попадание моноструной установило прямое подключение к цели. ' +
        'Снимите этот маркер при разрыве соединения.</p>'},
      duration: {value: -1, unit: 'unlimited', expiry: null, sustained: false},
      rules: [],
      tokenIcon: {show: false},
    },
    flags: {[MOD]: {monowireConnection1632: {
      sourceItemId: weapon.id ?? sourceOf(weapon)._id,
      targetActorUuid: target.uuid,
      triggerMessageUuid: message.uuid ?? message.id,
      hitMessageUuids: [message.uuid ?? message.id],
    }}},
  };
}

/** Observe successful native Strikes and create only this library's connection marker. */
export async function handleMonowireHit1632(message, _options = {}, userId = null) {
  if ((userId ?? message.author?.id) !== globalThis.game?.user?.id) return false;
  const context = message.flags?.sf2e?.context ?? message.flags?.pf2e?.context;
  if (!context || !['success', 'criticalSuccess'].includes(context.outcome) ||
      !(context.type === 'attack-roll' || context.options?.includes('action:strike'))) return false;
  let weapon = message.item;
  const origin = message.flags?.sf2e?.origin?.uuid ?? message.flags?.pf2e?.origin?.uuid;
  if (!weapon && origin) weapon = await globalThis.fromUuid?.(origin);
  const actor = weapon?.actor ?? globalThis.ChatMessage?.getSpeakerActor?.(message.speaker);
  weapon ??= actor?.items?.get?.(context.item);
  if (!actor?.isOwner || !activeWire(weapon) || !context.target?.actor) return false;
  const target = await globalThis.fromUuid?.(context.target.actor);
  if (!target?.uuid || target.uuid === actor.uuid) return false;
  const key = message.uuid ?? message.id;
  if (!key || processed.has(key)) return false;
  processed.add(key);
  if (processed.size > 512) processed.delete(processed.values().next().value);
  try {
    return await queueActor(actor, async () => {
      const existing = values(actor.items).find(item =>
        sourceOf(item).flags?.[MOD]?.monowireConnection1632?.targetActorUuid === target.uuid);
      const data = monowireConnection1632Source(weapon, target, message);
      if (existing) {
        const previous = sourceOf(existing).flags[MOD].monowireConnection1632;
        data.flags[MOD].monowireConnection1632.hitMessageUuids = [...new Set([
          ...(previous.hitMessageUuids ?? [previous.triggerMessageUuid]),
          message.uuid ?? message.id,
        ].filter(Boolean))];
        await existing.update({
          ['flags.' + MOD + '.monowireConnection1632']: data.flags[MOD].monowireConnection1632,
        }, ownOptions);
      } else await actor.createEmbeddedDocuments('Item', [data], ownOptions);
      return true;
    });
  } catch (error) {
    processed.delete(key);
    throw error;
  }
}

/** A GM can resolve or correct the Strike after its chat message was created. */
export async function handleMonowireOutcome1633(message, changes, userId) {
  if (userId !== globalThis.game?.user?.id) return false;
  const contexts = ['sf2e', 'pf2e'].flatMap(scope => [
    changes?.flags?.[scope]?.context,
    changes?.['flags.' + scope]?.context,
    changes?.['flags.' + scope + '.context'],
    {'outcome': changes?.['flags.' + scope + '.context.outcome']},
  ]);
  const outcome = contexts.find(context => context?.outcome !== undefined)?.outcome;
  if (['success', 'criticalSuccess'].includes(outcome)) {
    processed.delete(message.uuid ?? message.id);
    return handleMonowireHit1632(message, {}, userId);
  }
  if (!['failure', 'criticalFailure'].includes(outcome)) return false;
  const actor = message.item?.actor ?? globalThis.ChatMessage?.getSpeakerActor?.(message.speaker);
  if (!actor?.isOwner) return false;
  const key = message.uuid ?? message.id;
  return queueActor(actor, async () => {
    let changed = false;
    for (const effect of values(actor.items)) {
      const link = sourceOf(effect).flags?.[MOD]?.monowireConnection1632;
      if (!link) continue;
      const hits = link.hitMessageUuids ?? [link.triggerMessageUuid];
      if (!hits.includes(key)) continue;
      const remaining = hits.filter(uuid => uuid !== key);
      if (remaining.length) {
        await effect.update({
          ['flags.' + MOD + '.monowireConnection1632.hitMessageUuids']: remaining,
          ['flags.' + MOD + '.monowireConnection1632.triggerMessageUuid']: remaining.at(-1),
        }, ownOptions);
      } else await effect.delete(ownOptions);
      changed = true;
    }
    processed.delete(key);
    return changed;
  });
}

async function useMonowireAction(message, userId) {
  if (userId !== globalThis.game?.user?.id) return;
  const origin = message.flags?.sf2e?.origin?.uuid ?? message.flags?.pf2e?.origin?.uuid;
  if (!origin) return;
  const action = await globalThis.fromUuid?.(origin);
  const mode = generatedAction(action)?.mode;
  if (!mode || !action.actor?.isOwner) return;
  const actor = action.actor;
  const items = actorItems(actor);
  const usable = items.some(item => activeWire(item, mode === 'any' ? 4 : 3));
  const selected = values(globalThis.game?.user?.targets);
  const target = selected.length === 1 ? selected[0].actor : null;
  const connected = target && values(actor.items).some(item =>
    sourceOf(item).flags?.[MOD]?.monowireConnection1632?.targetActorUuid === target.uuid);
  if (!usable || !connected) {
    globalThis.ui?.notifications?.warn?.('Выберите одну цель с действующим прямым подключением моноструны.');
    return;
  }
  const api = globalThis.game.modules?.get?.('sf2e-netrunning')?.api;
  if (api?.openNetrunnerInterface) await api.openNetrunnerInterface(actor);
  else globalThis.ui?.notifications?.warn?.('Для выбора скрипта требуется активный NET-интерфейс модуля sf2e-netrunning.');
}

function actors() {
  const result = new Map(values(globalThis.game?.actors).map(actor => [actor.uuid ?? actor, actor]));
  for (const scene of values(globalThis.game?.scenes)) {
    for (const token of values(scene.tokens)) {
      if (!token.actorLink && token.actor) result.set(token.actor.uuid ?? token.actor, token.actor);
    }
  }
  return [...result.values()];
}

function primaryGM() {
  const users = values(globalThis.game?.users).filter(user => user.active && user.isGM)
    .sort((left, right) => String(left.id).localeCompare(String(right.id)));
  return globalThis.game?.user?.isGM && users[0]?.id === globalThis.game.user.id;
}

export async function migrateCyberarms1632() {
  const result = {scanned: 0, updated: 0, failed: 0};
  if (!primaryGM()) return result;
  const owned = actors();
  for (const item of [...values(globalThis.game.items), ...owned.flatMap(actor => values(actor.items))]) {
    result.scanned++;
    const update = cyberarm1632Update(item);
    if (!update || !item.update) continue;
    try { await item.update(update, ownOptions); result.updated++; }
    catch (error) { result.failed++; report(error); }
  }
  for (const actor of owned) {
    try { await syncMonowire1632(actor); }
    catch (error) { result.failed++; report(error); }
  }
  if (result.updated || result.failed) console.info('[' + MOD + '] 1.6.32', result);
  return result;
}

function report(error) {
  console.error('[' + MOD + '] 1.6.32 cyberarms', error);
}

if (globalThis.Hooks?.on) {
  Hooks.on('preCreateItem', (document, data) => {
    const current = sourceOf(document);
    const update = cyberarm1632Update(Object.keys(current).length ? current : data);
    if (update) document.updateSource(update);
  });
  Hooks.on('preUpdateItem', (item, changes) => {
    if (cyberarm1632Identity(item)?.family !== 'gorilla') return;
    const carry = changes['system.equipped.carryType'] ?? changes.system?.equipped?.carryType;
    if (carry === 'held') {
      if (changes.system?.equipped) changes.system.equipped.carryType = 'worn';
      changes['system.equipped.carryType'] = 'worn';
      changes['system.equipped.handsHeld'] = 0;
    }
  });
  for (const hook of ['createItem', 'updateItem', 'deleteItem']) {
    Hooks.on(hook, (item, ...args) => {
      const options = hook === 'updateItem' ? args[1] : args[0];
      const userId = hook === 'updateItem' ? args[2] : args[1];
      if (options?.[MOD]?.cyberarm1632 || (userId && userId !== globalThis.game?.user?.id)) return;
      const actor = item.actor;
      if (!actor?.isOwner) return;
      (async () => {
        if (hook !== 'deleteItem') {
          const update = cyberarm1632Update(item);
          if (update) await item.update(update, ownOptions);
        }
        await syncMonowire1632(actor);
      })().catch(report);
    });
  }
  Hooks.on('createChatMessage', (message, options, userId) => {
    handleMonowireHit1632(message, options, userId).catch(report);
    useMonowireAction(message, userId).catch(report);
  });
  Hooks.on('updateChatMessage', (message, changes, _options, userId) => {
    handleMonowireOutcome1633(message, changes, userId).catch(report);
  });
}
if (globalThis.Hooks?.once) Hooks.once('ready', () => {
  const module = globalThis.game?.modules?.get?.(MOD);
  if (module) module.api = {...module.api, migrateCyberarms1632};
  migrateCyberarms1632().catch(report);
});
