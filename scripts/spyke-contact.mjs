import { isLibraryPhysicalItem } from './library-item-scope.mjs';

const MODULE_ID = 'cyberpunk-equipment-library';
const processed = new Set();
const items = actor => Array.from(actor?.items?.values?.() ?? actor?.items?.contents ?? []);

function strongestSpyke(actor, isActive) {
  return items(actor).filter(item => isLibraryPhysicalItem(item)
    && item.flags?.[MODULE_ID]?.external1626?.kind === 'spyke' && isActive(item))
    .map(item => ({ item, die: item._source?.system?.rules?.find(rule => rule.key === 'Strike')?.damage?.base?.die }))
    .filter(({ die }) => ['d4', 'd6'].includes(die))
    .sort((a, b) => Number(b.die.slice(1)) - Number(a.die.slice(1)))[0] ?? null;
}

/** Contact is a fixed damage roll, not a Strike: no attack modifiers or extra dice. */
export async function rollSpykeContact(actor, { isActive, target = null, triggerMessage = null } = {}) {
  if (typeof isActive !== 'function') return null;
  const selected = strongestSpyke(actor, isActive);
  if (!selected) return null;
  const DamageRoll = globalThis.game?.sf2e?.DamageRoll ?? globalThis.game?.pf2e?.DamageRoll
    ?? globalThis.CONFIG?.Dice?.rolls?.find(RollType => RollType.name === 'DamageRoll');
  if (!DamageRoll) throw new Error('SF2e DamageRoll недоступен для контактного урона Spyke.');
  const roll = await new DamageRoll(`{1${selected.die}[piercing]}`, actor.getRollData?.() ?? {}).evaluate();
  const whisper = [...(triggerMessage?.whisper ?? [])];
  if (whisper.length && !triggerMessage.blind && triggerMessage.author?.id) whisper.push(triggerMessage.author.id);
  return roll.toMessage({
    speaker: globalThis.ChatMessage.getSpeaker({ actor }),
    flavor: '<strong>Spyke: контактный урон</strong><p>Существо, успешно схватившее владельца, получает колющий урон от одного комплекта шипов.</p>',
    ...(triggerMessage ? { whisper: [...new Set(whisper)], blind: Boolean(triggerMessage.blind) } : {}),
    flags: { [MODULE_ID]: { spykeContact: {
      parentId: selected.item.id, targetActor: target?.uuid ?? null, triggerMessage: triggerMessage?.uuid ?? null,
    } } },
  }, { messageMode: triggerMessage ? triggerMessage.blind ? 'blind' : triggerMessage.whisper?.length ? 'gm' : 'public' : undefined });
}

/** Observe native Grapple outcomes; never update its effect, conditions or rule elements. */
export async function handleSpykeGrapple(message, { isActive } = {}) {
  const context = message?.flags?.sf2e?.context ?? message?.flags?.pf2e?.context;
  if (!context?.options?.includes?.('action:grapple') || !['success', 'criticalSuccess'].includes(context.outcome)) return;
  if (!context.target?.actor || typeof globalThis.fromUuid !== 'function') return;
  const key = message.uuid ?? message.id;
  if (!key || processed.has(key)) return;
  processed.add(key);
  if (processed.size > 512) processed.delete(processed.values().next().value);
  const target = await globalThis.fromUuid(context.target.actor);
  if (!target || !strongestSpyke(target, isActive)) return;
  const originRef = context.origin?.actor;
  const grappler = originRef ? await globalThis.fromUuid(originRef) : globalThis.game?.actors?.get?.(context.actor);
  if (!grappler || grappler.uuid === target.uuid) return;
  try { return await rollSpykeContact(target, { isActive, target: grappler, triggerMessage: message }); }
  catch (error) { processed.delete(key); throw error; }
}
