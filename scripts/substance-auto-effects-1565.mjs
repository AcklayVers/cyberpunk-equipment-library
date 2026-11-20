const MODULE_ID = "cyberpunk-equipment-library";
const GEAR_PREFIX = `Compendium.${MODULE_ID}.gear.Item.`;
const APPLICABLE_LABEL = /^Применить\s+(?:эффект|стадию)(?=\s|:|$)/iu;

export function extractCpelEffectUuid(description) {
  const source = String(description ?? "");
  const pattern = /@UUID\[(Compendium\.cyberpunk-equipment-library\.gear\.Item\.[A-Za-z0-9]+)\]\{([^}]*)\}/giu;
  for (const match of source.matchAll(pattern)) {
    if (APPLICABLE_LABEL.test(String(match[2] ?? "").trim())) return match[1];
  }
  return null;
}

const SELF_USE_CATEGORIES = new Set(["drug", "elixir", "mutagen"]);

export function shouldAutoApplyConsumable(item) {
  if (item?.type !== "consumable") return false;
  const category = String(item?.system?.category ?? "").toLowerCase();
  if (category === "poison") return false;
  if (SELF_USE_CATEGORIES.has(category)) return true;

  const traits = new Set(item?.system?.traits?.value ?? []);
  return traits.has("drug") || traits.has("elixir") || traits.has("mutagen");
}

function currentUserOwnsEvent(userId) {
  const current = globalThis.game?.user?.id;
  return Boolean(current && userId && current === userId);
}

function originData(message) {
  return message?.flags?.sf2e?.origin
    ?? message?.flags?.pf2e?.origin
    ?? message?._source?.flags?.sf2e?.origin
    ?? message?._source?.flags?.pf2e?.origin
    ?? null;
}

function sourceUuidOf(item, origin = null) {
  const candidates = [
    origin?.sourceId,
    item?.sourceId,
    item?._stats?.compendiumSource,
    item?.flags?.core?.sourceId,
    item?.getFlag?.("core", "sourceId"),
  ];
  return candidates.find((value) => typeof value === "string" && value.startsWith(GEAR_PREFIX)) ?? null;
}

async function resolveConsumedItem(origin) {
  for (const uuid of [origin?.uuid, origin?.sourceId]) {
    if (typeof uuid !== "string" || !uuid.length) continue;
    try {
      const doc = await globalThis.fromUuid?.(uuid);
      if (doc?.type === "consumable") return doc;
    } catch (error) {
      console.debug?.(`[${MODULE_ID}] v1.5.65: не удалось разрешить источник расходника ${uuid}`, error);
    }
  }
  return null;
}

function speakerActor(message) {
  if (message?.speakerActor) return message.speakerActor;
  if (message?.actor) return message.actor;
  const speaker = message?.speaker ?? {};
  const scene = speaker.scene ? globalThis.game?.scenes?.get?.(speaker.scene) : null;
  const tokenActor = scene && speaker.token ? scene.tokens?.get?.(speaker.token)?.actor : null;
  if (tokenActor) return tokenActor;
  return speaker.actor ? globalThis.game?.actors?.get?.(speaker.actor) ?? null : null;
}

function effectSourceId(item) {
  return item?.sourceId
    ?? item?._stats?.compendiumSource
    ?? item?.flags?.core?.sourceId
    ?? item?.getFlag?.("core", "sourceId")
    ?? null;
}

function cloneEffectSource(effect, effectUuid) {
  const source = effect.toObject ? effect.toObject() : structuredClone(effect);
  delete source._id;
  delete source._key;
  delete source.folder;
  delete source.sort;
  delete source._stats;
  source.flags ??= {};
  source.flags.core = { ...(source.flags.core ?? {}), sourceId: effectUuid };
  source.flags[MODULE_ID] = {
    ...(source.flags[MODULE_ID] ?? {}),
    autoAppliedSubstance: true,
    autoAppliedAt: Date.now(),
  };
  return source;
}

async function applyEffect(actor, effect, effectUuid) {
  if (!actor?.createEmbeddedDocuments) return false;
  const actorItems = actor.items?.contents ?? [...(actor.items?.values?.() ?? actor.items ?? [])];
  const existing = actorItems.filter(
    (item) => item?.type === "effect" && effectSourceId(item) === effectUuid,
  );
  if (existing.length && actor.deleteEmbeddedDocuments) {
    await actor.deleteEmbeddedDocuments("Item", existing.map((item) => item.id), {
      render: false,
      [MODULE_ID]: { substanceAutoEffect: true, refresh: true },
    });
  }
  await actor.createEmbeddedDocuments("Item", [cloneEffectSource(effect, effectUuid)], {
    [MODULE_ID]: { substanceAutoEffect: true },
  });
  return true;
}

export function isConsumableDeclarationMessage(message) {
  const markup = `${String(message?.content ?? "")} ${String(message?.flavor ?? "")}`;
  return /\bchat-card\b/iu.test(markup) && /\bitem-card\b/iu.test(markup);
}

export async function handleSubstanceConsumptionMessage(message, options = {}, userId = null) {
  if (!currentUserOwnsEvent(userId)) return false;
  if (options?.[MODULE_ID]?.substanceAutoEffect) return false;
  // A normal item declaration has the same consumable origin flag as a real use.
  // Ignore the card itself; ConsumablePF2e.consume() creates a second, plain chat
  // message only after the user presses the system's “Use” button.
  if (isConsumableDeclarationMessage(message)) return false;

  const origin = originData(message);
  if (!origin || origin.type !== "consumable") return false;

  const consumable = await resolveConsumedItem(origin);
  if (!consumable || !sourceUuidOf(consumable, origin) || !shouldAutoApplyConsumable(consumable)) return false;

  const description = consumable?.system?.description?.value ?? "";
  const effectUuid = extractCpelEffectUuid(description);
  if (!effectUuid) return false;

  let effect = null;
  try {
    effect = await globalThis.fromUuid?.(effectUuid);
  } catch (error) {
    console.warn(`[${MODULE_ID}] v1.5.65: не удалось открыть эффект вещества ${effectUuid}`, error);
    return false;
  }
  if (!effect || effect.type !== "effect") return false;

  const actor = speakerActor(message);
  if (!actor) {
    console.warn(`[${MODULE_ID}] v1.5.65: не найден актёр для применения ${effect.name ?? effectUuid}`);
    return false;
  }

  try {
    await applyEffect(actor, effect, effectUuid);
    return true;
  } catch (error) {
    console.warn(`[${MODULE_ID}] v1.5.65: не удалось автоматически применить ${effect.name ?? effectUuid}`, error);
    return false;
  }
}

if (globalThis.Hooks?.on) {
  Hooks.on("createChatMessage", (message, options, userId) =>
    handleSubstanceConsumptionMessage(message, options, userId));
}
