const MODULE_ID = "cyberpunk-equipment-library";
const DEAFENED_UUID = "Compendium.sf2e.conditions.Item.Deafened";
const SOURCE_PREFIX = `Compendium.${MODULE_ID}.weapons.Item.`;

const RIDERS = new Map([
  ["46UyjhQizja76l45", {
    id: "46UyjhQizja76l45",
    label: "Bouncer: микроволновое подавление",
    save: "fortitude",
    requiredOption: "neon-forge:bouncer-microwave",
    apply: {
      kind: "effect",
      name: "Подавление техники — Bouncer",
      description: "Один переносимый технический предмет цели подавлен до конца её следующего хода. Выберите подходящий предмет; пока эффект активен, он считается подавленным.",
    },
  }],
  ["BGcjVWoPxR31ziWZ", {
    id: "BGcjVWoPxR31ziWZ",
    label: "Thundercat: акустический удар",
    save: "fortitude",
    apply: { kind: "deafened", name: "Оглушающий акустический разряд — Thundercat" },
  }],
  ["QzYiD86mY6zs1SfO", {
    id: "QzYiD86mY6zs1SfO",
    label: "Magna-Knuckle: ЭМИ-подавление",
    save: "fortitude",
    requiredOption: "neon-forge:magna-primed",
    apply: {
      kind: "effect",
      name: "ЭМИ-подавление кибермодуля — Magna-Knuckle",
      description: "Один внешний кибермодуль цели подавлен на 1 раунд. Выберите подходящий установленный внешний модуль; пока эффект активен, он считается подавленным.",
    },
  }],
  ["XDPwwWu09TMPrQZz", {
    id: "XDPwwWu09TMPrQZz",
    label: "Сверчок: акустическое подавление",
    save: "fortitude",
    apply: { kind: "deafened", name: "Акустическое подавление — Сверчок" },
  }],
]);

const RIDER_SLUG_TO_ID = new Map([
  ["заводское-улучшение-микроволновый-режим-bouncer", "46UyjhQizja76l45"],
  ["заводское-улучшение-акустический-разряд-thundercat", "BGcjVWoPxR31ziWZ"],
  ["заводское-улучшение-эми-конденсатор-magna-knuckle", "QzYiD86mY6zs1SfO"],
  ["заводское-улучшение-акустический-подавитель-сверчок", "XDPwwWu09TMPrQZz"],
]);

const RIDER_NAME_TO_ID = new Map([
  ["Заводское улучшение • Микроволновый режим Bouncer", "46UyjhQizja76l45"],
  ["Заводское улучшение • Акустический разряд Thundercat", "BGcjVWoPxR31ziWZ"],
  ["Заводское улучшение • ЭМИ-конденсатор Magna-Knuckle", "QzYiD86mY6zs1SfO"],
  ["Заводское улучшение • Акустический подавитель «Сверчок»", "XDPwwWu09TMPrQZz"],
]);

function sourceId(source) {
  const refs = [source?._stats?.compendiumSource, source?.flags?.core?.sourceId];
  for (const ref of refs) {
    if (typeof ref === "string" && ref.startsWith(SOURCE_PREFIX)) return ref.slice(SOURCE_PREFIX.length);
  }
  if (typeof source?._id === "string" && RIDERS.has(source._id)) return source._id;
  const slug = source?.system?.slug;
  if (typeof slug === "string" && RIDER_SLUG_TO_ID.has(slug)) return RIDER_SLUG_TO_ID.get(slug);
  const name = source?.name;
  if (typeof name === "string" && RIDER_NAME_TO_ID.has(name)) return RIDER_NAME_TO_ID.get(name);
  return null;
}

export function findCriticalRiders(weaponLike, contextOptions = []) {
  const source = weaponLike?.toObject ? weaponLike.toObject(false) : weaponLike;
  const options = new Set(contextOptions ?? []);
  const found = [];
  for (const subitem of source?.system?.subitems ?? []) {
    const id = sourceId(subitem);
    const rider = id ? RIDERS.get(id) : null;
    if (!rider) continue;
    if (rider.requiredOption && !options.has(rider.requiredOption)) continue;
    found.push(rider);
  }
  return found;
}

export function isFailedSaveDegree(degree) {
  return Number.isInteger(degree) && degree <= 1;
}

function firstActiveGM() {
  const users = Array.from(game.users ?? []);
  return users.find((user) => user.active && user.isGM) ?? null;
}

function classDC(actor) {
  const statistic = actor?.getStatistic?.("class");
  return statistic?.dc?.value
    ?? actor?.system?.attributes?.classDC?.value
    ?? actor?.system?.attributes?.classDC
    ?? null;
}

async function resolveActor(uuid, fallbackId = null) {
  if (uuid) {
    try {
      const doc = await fromUuid(uuid);
      if (doc?.documentName === "Actor" || doc?.type) return doc;
    } catch (_error) { /* try fallback */ }
  }
  return fallbackId ? game.actors?.get?.(fallbackId) ?? null : null;
}

function effectSource(rider, originActor, sourceImg) {
  const rules = rider.apply.kind === "deafened"
    ? [{
        key: "GrantItem",
        uuid: DEAFENED_UUID,
        onDeleteActions: { granter: "cascade", grantee: "cascade" },
      }]
    : [];
  const description = rider.apply.kind === "deafened"
    ? "Провал спасброска Стойкости после критического попадания. Цель получает состояние Глухота на 1 раунд."
    : rider.apply.description;

  return {
    name: rider.apply.name,
    type: "effect",
    img: sourceImg ?? "icons/svg/daze.svg",
    system: {
      description: { value: `<p>${description}</p>` },
      duration: { expiry: "turn-end", sustained: false, unit: "rounds", value: 1 },
      level: { value: Number(originActor?.level ?? 1) || 1 },
      publication: { title: "Cyberpunk Equipment Library", authors: "", license: "", remaster: true },
      rules,
      start: { initiative: null, value: 0 },
      tokenIcon: { show: true },
      traits: { rarity: "common", value: [] },
    },
    flags: {
      [MODULE_ID]: {
        criticalHitRider: { id: rider.id, source: `${SOURCE_PREFIX}${rider.id}` },
      },
    },
  };
}

async function applyRiderEffect(targetActor, originActor, rider, sourceImg) {
  const existing = targetActor.items
    ?.filter?.((item) => item.type === "effect" && item.flags?.[MODULE_ID]?.criticalHitRider?.id === rider.id)
    ?.map?.((item) => item.id) ?? [];
  if (existing.length) await targetActor.deleteEmbeddedDocuments("Item", existing, { render: false });
  await targetActor.createEmbeddedDocuments("Item", [effectSource(rider, originActor, sourceImg)]);
}

async function runRiderSave({ targetActor, originActor, rider, sourceImg }) {
  const dc = classDC(originActor);
  const save = targetActor?.getStatistic?.(rider.save);
  if (!save || !Number.isFinite(Number(dc))) {
    ui.notifications?.warn?.(`${rider.label}: не удалось определить Стойкость цели или КС класса владельца.`);
    return;
  }

  const roll = await save.roll({
    dc: { value: Number(dc), label: `КС класса ${originActor.name}` },
    title: `${rider.label} — спасбросок Стойкости`,
    skipDialog: true,
    extraRollOptions: ["critical-hit", `origin:critical-hit-rider:${rider.id}`],
  });
  if (isFailedSaveDegree(roll?.options?.degreeOfSuccess)) {
    await applyRiderEffect(targetActor, originActor, rider, sourceImg);
  }
}

Hooks.on("createChatMessage", async (message) => {
  if (!game.user?.isGM) return;
  const activeGM = firstActiveGM();
  if (activeGM && activeGM.id !== game.user.id) return;

  const context = message?.flags?.pf2e?.context;
  if (context?.type !== "attack-roll" || context?.outcome !== "criticalSuccess") return;
  if (message.flags?.[MODULE_ID]?.criticalHitRidersProcessed) return;

  const originActor = await resolveActor(context?.origin?.actor, context?.actor);
  const targetActor = await resolveActor(context?.target?.actor, null);
  if (!originActor || !targetActor) return;

  const itemId = String(context?.identifier ?? "").split(".")[0];
  const weapon = originActor.items?.get?.(itemId) ?? null;
  if (!weapon || weapon.type !== "weapon") return;

  const riders = findCriticalRiders(weapon, context?.options ?? []);
  if (!riders.length) return;

  try {
    await message.update({ [`flags.${MODULE_ID}.criticalHitRidersProcessed`]: true });
  } catch (_error) { /* create hook already runs once per client; flag is an extra guard */ }

  const sourceById = new Map((weapon.system?.subitems ?? []).map((subitem) => [sourceId(subitem), subitem]));
  for (const rider of riders) {
    try {
      await runRiderSave({
        targetActor,
        originActor,
        rider,
        sourceImg: sourceById.get(rider.id)?.img ?? weapon.img,
      });
    } catch (error) {
      console.error(`[${MODULE_ID}] Ошибка критического эффекта ${rider.label}`, error);
    }
  }
});
