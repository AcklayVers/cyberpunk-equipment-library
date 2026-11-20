const MODULE_ID = "cyberpunk-equipment-library";

function isQat(source) {
  const conversion = source?.flags?.[MODULE_ID]?.substanceConversion;
  return conversion?.source_name === "Qat" || source?.name === "Наркопрепарат «Кат»";
}

function buildUpdate(item) {
  const source = item?._source ?? item?.toObject?.(false);
  if (!source || !isQat(source) || source.name === "Кат (Qat)") return null;
  return { name: "Кат (Qat)" };
}

async function migrateDocument(item) {
  const update = buildUpdate(item);
  if (!update) return false;
  await item.update(update, { render: false, [MODULE_ID]: { migration1547: true } });
  return true;
}

Hooks.once("ready", async () => {
  if (!game.user?.isGM) return;
  let updated = 0;
  for (const actor of game.actors ?? []) {
    for (const item of actor.items ?? []) {
      try { if (await migrateDocument(item)) updated += 1; }
      catch (error) { console.warn(`[${MODULE_ID}] v1.5.47: не удалось переименовать «${item?.name ?? "предмет"}»`, error); }
    }
  }
  for (const item of game.items ?? []) {
    try { if (await migrateDocument(item)) updated += 1; }
    catch (error) { console.warn(`[${MODULE_ID}] v1.5.47: не удалось переименовать мировой предмет «${item?.name ?? "предмет"}»`, error); }
  }
  if (updated) console.info(`[${MODULE_ID}] v1.5.47: переименовано предметов Кат (Qat): ${updated}`);
});
