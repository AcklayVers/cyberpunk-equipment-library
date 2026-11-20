import { isLibraryItemSource } from "./library-item-scope.mjs";
const MODULE_ID = "cyberpunk-equipment-library";

const TARGETED_EFFECTS = new Set([
  "Встроенный лечебный резервуар «Панацея» — лечебная доза",
  "Встроенный лечебный резервуар «Укус Асклепия» — лечебная доза",
]);

function getSingleUserTarget() {
  const targets = Array.from(game.user?.targets ?? []);
  if (targets.length !== 1) return null;
  return targets[0]?.actor ?? targets[0]?.document?.actor ?? null;
}

Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | Targeted healing runtime ready`);
});

Hooks.on("createItem", async (item, _options, userId) => {
  try {
    if (userId !== game.user?.id) return;
    if (item?.type !== "effect") return;
    if (!TARGETED_EFFECTS.has(item.name)) return;
    if (item.getFlag?.(MODULE_ID, "targetTransfer")) return;

    const sourceActor = item.parent?.documentName === "Actor" ? item.parent : null;
    if (!sourceActor) return;
    const activation = item.flags?.["cyberpunk-implant-creator"];
    const grantedBy = item.flags?.["pf2e-item-activations"]?.grantedBy;
    const parentIds = [activation?.activationSourceItemId, grantedBy?._id].filter(Boolean);
    const libraryParent = parentIds.some(id => isLibraryItemSource(sourceActor.items?.get?.(id)));
    if (!isLibraryItemSource(item) && !isLibraryItemSource(grantedBy) && !libraryParent) return;

    const targetActor = getSingleUserTarget();
    if (!targetActor) {
      // Keep self-use compatible when no single Target is selected.
      ui.notifications?.info?.(`${item.name}: не выбрана ровно одна цель — эффект оставлен на владельце импланта.`);
      return;
    }
    if (targetActor === sourceActor || (targetActor.uuid && targetActor.uuid === sourceActor.uuid)) return;

    if (!targetActor.isOwner && !game.user?.isGM) {
      ui.notifications?.warn?.(`Нет прав на изменение цели «${targetActor.name}». Эффект оставлен на владельце.`);
      return;
    }

    const source = item.toObject();
    delete source._id;
    delete source.folder;
    delete source.sort;
    source.flags ??= {};
    source.flags[MODULE_ID] ??= {};
    source.flags[MODULE_ID].targetTransfer = {
      transferred: true,
      sourceActorUuid: sourceActor.uuid,
      targetActorUuid: targetActor.uuid,
      transferredBy: game.user.id,
    };

    const created = await targetActor.createEmbeddedDocuments("Item", [source]);
    if (!created?.length) throw new Error("Target effect was not created");
    await item.delete();
    ui.notifications?.info?.(`${item.name}: эффект применён к цели «${targetActor.name}».`);
  } catch (error) {
    console.error(`${MODULE_ID} | targeted healing transfer failed`, error);
    ui.notifications?.error?.(`Не удалось перенести лечебный эффект на выбранную цель: ${error?.message ?? error}`);
  }
});
