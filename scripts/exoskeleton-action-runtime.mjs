const MODULE_ID = "cyberpunk-equipment-library";
const INTERNAL_OPTION = "exoskeletonActionRuntime";

function sourceObject(item) {
  if (!item) return null;
  if (typeof item.toObject === "function") return item.toObject(false);
  return item._source ?? item;
}

function sourceItemId(item) {
  const source = sourceObject(item);
  const refs = [
    item?._stats?.compendiumSource,
    source?._stats?.compendiumSource,
    item?.flags?.core?.sourceId,
    source?.flags?.core?.sourceId,
  ];
  for (const ref of refs) {
    const match = String(ref ?? "").match(/\.Item\.([A-Za-z0-9]{16})$/u);
    if (match) return match[1];
  }
  return null;
}

function actionMeta(action) {
  return action?.flags?.[MODULE_ID] ?? action?._source?.flags?.[MODULE_ID] ?? {};
}

function matchesActivation(rule, activationKey) {
  if (rule?.key !== "RollOption") return false;
  const option = String(rule.option ?? "");
  if (activationKey === "power") return option.endsWith(":powered");
  if (activationKey === "blades") return option.endsWith(":blades-deployed");
  if (activationKey === "rollers") return option.endsWith(":skating");
  return false;
}

function actorItems(actor) {
  return Array.from(actor?.items ?? []);
}

export function matchingExoskeletonFrame(action) {
  const meta = actionMeta(action);
  if (meta.exoskeletonAction !== true || typeof meta.sourceItemId !== "string") return null;
  const actor = action?.actor ?? action?.parent ?? null;
  return actorItems(actor).find((item) => item.type !== "action" && sourceItemId(item) === meta.sourceItemId) ?? null;
}

export async function activateExoskeletonAction(action) {
  const meta = actionMeta(action);
  if (meta.exoskeletonAction !== true) return { changed: false, reason: "not-exoskeleton-action" };
  const frame = matchingExoskeletonFrame(action);
  if (!frame) return { changed: false, reason: "frame-not-found" };

  const source = sourceObject(frame);
  const rules = structuredClone(source?.system?.rules ?? []);
  const index = rules.findIndex((rule) => matchesActivation(rule, meta.activationKey));
  if (index < 0) return { changed: false, reason: "activation-rule-not-found" };

  rules[index].value = rules[index].value !== true;
  if (typeof frame.update === "function") {
    await frame.update({ "system.rules": rules }, { render: true, [MODULE_ID]: { [INTERNAL_OPTION]: true } });
  } else {
    frame.system ??= {};
    frame.system.rules = rules;
  }
  return { changed: true, value: rules[index].value, frame };
}

export async function handleExoskeletonActionMessage(message, _options = {}, userId = null) {
  if (userId && globalThis.game?.user?.id && userId !== game.user.id) return false;
  const originUuid = message?.flags?.pf2e?.origin?.uuid;
  if (typeof originUuid !== "string" || typeof globalThis.fromUuid !== "function") return false;
  const action = await fromUuid(originUuid);
  if (actionMeta(action).exoskeletonAction !== true) return false;
  const result = await activateExoskeletonAction(action);
  if (!result.changed && globalThis.ui?.notifications) {
    const text = result.reason === "frame-not-found"
      ? "Не найден связанный экзоскелет на персонаже."
      : "На экзоскелете не найден переключатель этой активации.";
    ui.notifications.warn(text);
  }
  return result.changed;
}

if (globalThis.Hooks?.on) {
  Hooks.on("createChatMessage", (message, options = {}, userId = null) => {
    handleExoskeletonActionMessage(message, options, userId).catch((error) => {
      console.error(`[${MODULE_ID}] Ошибка активации действия экзоскелета`, error);
    });
  });
}
