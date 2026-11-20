const MODULE_ID = "cyberpunk-equipment-library";
const PACK_IDS = ["implants", "weapons", "gear", "journals"];
const ACTIONS_ID = `${MODULE_ID}.actions`;
const FOLDER_NAME = "Cyberpunk Remaster — Библиотека снаряжения";

function collectionGet(packs, id) {
  return packs?.get?.(id) ?? null;
}

function collectionValues(collection) {
  if (Array.isArray(collection?.contents)) return collection.contents;
  if (typeof collection?.values === "function") return [...collection.values()];
  return [...(collection ?? [])];
}

export function findCanonicalLibraryFolder(packs) {
  const counts = new Map();
  for (const name of PACK_IDS) {
    const folder = collectionGet(packs, `${MODULE_ID}.${name}`)?.folder ?? null;
    if (!folder?.id) continue;
    const current = counts.get(folder.id) ?? { folder, count: 0 };
    current.count += 1;
    counts.set(folder.id, current);
  }
  return [...counts.values()]
    .sort((a, b) => b.count - a.count || Number(b.folder?.name === FOLDER_NAME) - Number(a.folder?.name === FOLDER_NAME))[0]?.folder ?? null;
}

function isPrimaryActiveGM() {
  const active = collectionValues(globalThis.game?.users)
    .filter((user) => user?.active && user?.isGM)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  return Boolean(active.length && globalThis.game?.user?.id === active[0].id);
}

function packsInFolder(folderId) {
  return collectionValues(globalThis.game?.packs).filter((pack) => pack?.folder?.id === folderId);
}

function childFolders(folderId) {
  return collectionValues(globalThis.game?.folders).filter((folder) => folder?.folder?.id === folderId);
}

async function deleteEmptyStaleFolder(folder) {
  if (!folder?.id || !folder?.delete) return;
  if (packsInFolder(folder.id).length || childFolders(folder.id).length) return;
  try {
    await folder.delete({ render: false });
  } catch (error) {
    console.debug?.(`[${MODULE_ID}] v1.5.64: пустая старая папка компендия оставлена`, error);
  }
}

export async function migrateActionsCompendiumFolder() {
  if (!isPrimaryActiveGM()) return false;
  const packs = globalThis.game?.packs;
  const actions = collectionGet(packs, ACTIONS_ID);
  const canonical = findCanonicalLibraryFolder(packs);
  if (!actions || !canonical?.id || actions.folder?.id === canonical.id) return false;

  const stale = actions.folder ?? null;
  try {
    await actions.setFolder(canonical);
    await deleteEmptyStaleFolder(stale);
    console.info(`[${MODULE_ID}] v1.5.64: «Служебные действия» перемещены в основную папку библиотеки.`);
    return true;
  } catch (error) {
    console.warn(`[${MODULE_ID}] v1.5.64: не удалось перенести компендий «Служебные действия»`, error);
    return false;
  }
}

if (globalThis.Hooks?.once) Hooks.once("ready", migrateActionsCompendiumFolder);
