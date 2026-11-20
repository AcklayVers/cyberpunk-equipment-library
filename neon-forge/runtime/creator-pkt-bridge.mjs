const CREATOR_SCOPE = "cyberpunk-implant-creator";
const REMASTER_SCOPE = "cyberpunk-remaster";
const HOST_SCOPE = "cyberpunk-equipment-library";
const LEGACY_SCOPE = "cyberpunk-cyberware";

function collectionValues(collection) {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  if (Array.isArray(collection.contents)) return collection.contents;
  if (typeof collection.values === "function") return [...collection.values()];
  return [...collection].map((value) =>
    Array.isArray(value) && value.length === 2 ? value[1] : value,
  );
}

function flagValue(item, key) {
  return (
    item?.flags?.[HOST_SCOPE]?.[key] ??
    item?.flags?.[REMASTER_SCOPE]?.[key] ??
    item?.flags?.[LEGACY_SCOPE]?.[key] ??
    item?.flags?.[CREATOR_SCOPE]?.[key]
  );
}

export function isCreatorBuiltWorldPktBody(item) {
  if (!item || item.pack) return false;
  const creator = item.flags?.[CREATOR_SCOPE];
  if (!creator || typeof creator !== "object") return false;
  if (!item.id && !item._id) return false;
  return flagValue(item, "pktBody") === true;
}

export function creatorWorldPktBodies(game) {
  return collectionValues(game?.items).filter(isCreatorBuiltWorldPktBody);
}

export function creatorWorldPktModels(game) {
  return creatorWorldPktBodies(game).map((item) => {
    const id = String(item.id ?? item._id ?? "");
    const level = Math.max(0, Number(item.system?.level?.value ?? item.level) || 0);
    return {
      key: `creator-pkt:${id}`,
      name: item.name ?? `ПКТ ${id}`,
      description: "ПКТ-модель, созданная вручную через Конструктор Имплантов Cyberpunk Remaster.",
      creatorBuilt: true,
      sourceItemId: id,
      level,
    };
  });
}

export function creatorPktItemIdFromModelKey(value) {
  const key = String(value ?? "");
  return key.startsWith("creator-pkt:") ? key.slice("creator-pkt:".length) : "";
}

export function creatorPktWorldSignature(game) {
  return creatorWorldPktBodies(game)
    .map((item) => [
      String(item.id ?? item._id ?? ""),
      String(item._stats?.modifiedTime ?? item._stats?.createdTime ?? ""),
      String(item.name ?? ""),
      String(item.system?.level?.value ?? ""),
      String(flagValue(item, "pktQuality") ?? ""),
      String(flagValue(item, "slots") ?? item.system?.slots ?? ""),
    ].join(":"))
    .sort()
    .join("|");
}

export function pktModelPreference(form = {}) {
  const bodyId = String(form.pktBodyId ?? "");
  const modelKey = String(form.pktModelKey ?? "");
  if (modelKey) return modelKey;
  return bodyId && bodyId !== "random" ? "" : "random";
}

export function createCreatorBodyOnlyPktLoadout({
  body,
  biosystem,
  level = 0,
  levelAllowance = 0,
} = {}) {
  if (!body) throw new Error("Не выбрана ПКТ из Конструктора Имплантов.");
  if (!biosystem) {
    throw new Error(`Для ПКТ «${body.name ?? body.id}» не найдена Биосистема.`);
  }

  const bodyLevel = Math.max(0, Number(body.level) || 0);
  const npcLevel = Math.max(0, Number(level) || 0);
  const allowance = Math.max(0, Number(levelAllowance) || 0);
  if (bodyLevel > npcLevel + allowance) {
    throw new Error(
      `ПКТ «${body.name ?? body.id}» имеет ${bodyLevel}-й уровень. Для этого NPC допустимо не выше ${npcLevel + allowance}.`,
    );
  }

  const bodyId = String(body.id ?? "");
  return {
    model: {
      key: `creator-pkt:${bodyId}`,
      name: body.name ?? `ПКТ ${bodyId}`,
      description: "ПКТ, созданная вручную через Конструктор Имплантов Cyberpunk Remaster.",
      requiredBodyId: bodyId,
      requiredBodyName: body.name ?? "",
      creatorBodyOnly: true,
    },
    level: bodyLevel,
    selections: {},
    plan: [],
    biosystem,
    body,
    components: [],
    extras: [],
    creatorBodyOnly: true,
  };
}

export { CREATOR_SCOPE };
