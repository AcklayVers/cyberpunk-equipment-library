const MODULE_ID = "cyberpunk-equipment-library";
const SOURCE_PREFIX = `Compendium.${MODULE_ID}.`;
const PHYSICAL_TYPES = new Set(["armor", "weapon", "equipment", "ammo", "consumable", "backpack", "treasure"]);

/** Recognize library provenance without treating ordinary SF2e data as ours. */
export function isLibraryItemSource(item) {
  const source = item?._source ?? item ?? {};
  const flags = item?.flags ?? source.flags ?? {};
  if (Object.keys(flags[MODULE_ID] ?? {}).length > 0) return true;
  if (flags["cyberpunk-implant-creator"]?.sourceModule === MODULE_ID) return true;
  const world = flags.world ?? {};
  if (world.neonForgeUpgrade || world.neonForgeArsenal || world.neonForgeSf2eRebuild) return true;
  const refs = [item?.sourceId, source._stats?.compendiumSource, flags.core?.sourceId, source._stats?.duplicateSource]
    .filter(ref => typeof ref === "string");
  if (refs.some(ref => ref.startsWith(SOURCE_PREFIX))) return true;
  // Older world copies predate compendium provenance. Their own asset path is
  // only a fallback when no other compendium has explicitly claimed the item.
  return !refs.some(ref => ref.startsWith("Compendium."))
    && String(source.img ?? item?.img ?? "").startsWith(`modules/${MODULE_ID}/assets/`);
}

export function isLibraryPhysicalItem(item) {
  return PHYSICAL_TYPES.has(item?.type ?? item?._source?.type) && isLibraryItemSource(item);
}

export function isLibraryWeaponContext(source) {
  return source?.type === "weapon" && (isLibraryPhysicalItem(source)
    || (source.system?.subitems ?? []).some(isLibraryPhysicalItem));
}
