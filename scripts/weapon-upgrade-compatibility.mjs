import { prepareParentRuleState } from "./parent-item-rule-guard.mjs";
import { isLibraryPhysicalItem, isLibraryWeaponContext } from "./library-item-scope.mjs";

const MODULE_ID = "cyberpunk-equipment-library";
const AREA_TRAIT_RE = /^area-(?:burst|cone|line)(?:-\d+)?$/;
const LAUNCHER_BASE_ITEMS = new Set(["grenade-launcher", "reaktivnyy-granatomyot"]);
const ROCKET_LAUNCHER_NAMES = new Set([
  "Ракетная Установка Красотка",
  "Карманная Ракетница Това",
  "Ракетная установка",
  "Сигнальная Ракетница",
]);
const ROCKET_DYNAMIC_TRAITS = new Set(["tracking-1", "tracking-2", "concussive", "razing"]);

const getUpgrade = (subitem) => subitem?.flags?.world?.neonForgeUpgrade ?? null;

function conflictKey(upgrade) {
  // v1.5.29: physically separate families can share one mounting point.
  // Example: underbarrel-weapon and underbarrel-utility both consume the same lower rail.
  return upgrade?.mountGroup ?? upgrade?.family ?? null;
}

function conflictLabel(upgrade) {
  if (upgrade?.mountGroup === "underbarrel-mount") return upgrade.mountGroupLabel ?? "Нижний монтажный узел";
  if (upgrade?.mountGroup === "bayonet") return upgrade.mountGroupLabel ?? "Штыковое крепление";
  return upgrade?.familyLabel ?? upgrade?.family ?? upgrade?.mountGroup ?? "Неизвестное семейство";
}

export function collectUpgradeFamilyConflicts(weaponSource) {
  if (!weaponSource || weaponSource.type !== "weapon") return [];
  const groups = new Map();
  for (const subitem of weaponSource.system?.subitems ?? []) {
    const upgrade = getUpgrade(subitem);
    if (!upgrade || upgrade.factoryInstalled || upgrade.factoryOnly) continue;
    const key = conflictKey(upgrade);
    if (!key) continue;
    const entry = groups.get(key) ?? {
      conflictKey: key,
      family: upgrade.family ?? null,
      mountGroup: upgrade.mountGroup ?? null,
      label: conflictLabel(upgrade),
      items: [],
    };
    entry.items.push(subitem.name ?? subitem._id ?? "Безымянное улучшение");
    groups.set(key, entry);
  }
  return Array.from(groups.values()).filter((entry) => entry.items.length > 1);
}

function rawItemSource(item) {
  return foundry.utils.deepClone(item?._source ?? item.toObject(false));
}

function mergedItemSource(item, change) {
  const source = rawItemSource(item);
  const expanded = foundry.utils.expandObject(change ?? {});
  return foundry.utils.mergeObject(source, expanded, {
    inplace: false,
    insertKeys: true,
    insertValues: true,
    overwrite: true,
    recursive: true,
    applyOperators: true,
  });
}

function parentRuleStateUpdate(source, hasParentItem) {
  if (!isLibraryPhysicalItem(source)) return null;
  const working = structuredClone(source);
  if (!prepareParentRuleState(working, hasParentItem)) return null;
  return {
    rules: working.system?.rules ?? [],
    backup: working.flags?.world?.neonForgeParentRollOptions ?? [],
  };
}

function writeParentRuleState(change, state) {
  if (!state) return false;
  foundry.utils.setProperty(change, "system.rules", state.rules);
  foundry.utils.setProperty(change, "flags.world.neonForgeParentRollOptions", state.backup);
  return true;
}

function normalizeStandaloneParentRules(item, change) {
  if (item?.parentItem || !isLibraryPhysicalItem(item)) return false;
  const source = mergedItemSource(item, change);
  return writeParentRuleState(change, parentRuleStateUpdate(source, false));
}

function normalizeCreateParentRules(item, data) {
  if (!isLibraryPhysicalItem(item)) return false;
  const source = foundry.utils.mergeObject(rawItemSource(item), foundry.utils.expandObject(data ?? {}), {
    inplace: false, insertKeys: true, insertValues: true, overwrite: true, recursive: true, applyOperators: true,
  });
  return writeParentRuleState(data, parentRuleStateUpdate(source, !!item?.parentItem));
}

function synchronizeLibraryParentSubitems(source) {
  if (source?.type !== "weapon") return false;
  let changed = false;
  for (const subitem of source.system?.subitems ?? []) {
    if (isLibraryPhysicalItem(subitem) && prepareParentRuleState(subitem, true)) changed = true;
  }
  return changed;
}

function effectiveBaseItem(source) {
  return source?.system?.baseItem ?? source?.flags?.world?.neonForgeSf2eRebuild?.canonicalBaseItem ?? null;
}

function isRocketLauncherSource(source) {
  if (!source || source.type !== "weapon") return false;
  const system = source.system ?? {};
  const ammo = system.ammo ?? {};
  return ammo.baseType === "projectile-ammo" && ROCKET_LAUNCHER_NAMES.has(String(source.name ?? ""));
}

function isAmmoDrivenLauncherSource(source) {
  if (!source || source.type !== "weapon") return false;
  const system = source.system ?? {};
  const ammo = system.ammo ?? {};
  if (ammo.baseType !== "projectile-ammo") return false;
  return system.group === "grenade" || LAUNCHER_BASE_ITEMS.has(effectiveBaseItem(source)) || isRocketLauncherSource(source);
}

function isUsableLoadedAmmoSource(ammo, weaponSource) {
  if (!ammo || !["ammo", "weapon"].includes(ammo.type)) return false;
  if (Number(ammo.system?.quantity ?? 1) <= 0) return false;

  const requiredBaseType = weaponSource?.system?.ammo?.baseType ?? null;
  if (ammo.type === "ammo") {
    if (requiredBaseType && ammo.system?.baseItem && ammo.system.baseItem !== requiredBaseType) return false;
    const uses = ammo.system?.uses;
    if (Number(uses?.max ?? 1) > 1 && Number(uses?.value ?? 0) <= 0) return false;
    return true;
  }

  return !!ammo.system?.usage?.canBeAmmo && (!requiredBaseType || ammo.system?.baseItem === requiredBaseType);
}

function loadedAmmoSources(source) {
  return (source?.system?.subitems ?? [])
    .filter((subitem) => isUsableLoadedAmmoSource(subitem, source))
    .sort((a, b) => Number(a?.sort ?? 0) - Number(b?.sort ?? 0));
}

function areaTraitFromAmmoSource(ammo) {
  for (const rule of ammo?.system?.rules ?? []) {
    const value = String(rule?.value ?? "");
    if (rule?.key === "AdjustStrike" && rule?.property === "weapon-traits" && AREA_TRAIT_RE.test(value)) {
      return value;
    }
  }
  return (ammo?.system?.traits?.value ?? []).find((trait) => AREA_TRAIT_RE.test(String(trait))) ?? null;
}


function rocketDynamicTraitsFromAmmo(ammo) {
  if (!ammo) return [];
  const out = [];

  const ruleTraits = new Set(
    (ammo?.system?.rules ?? [])
      .filter((rule) => rule?.key === "AdjustStrike" && rule?.property === "weapon-traits")
      .map((rule) => String(rule?.value ?? "")),
  );
  if (ruleTraits.has("concussive") || /Бронебойная/iu.test(String(ammo?.name ?? ""))) out.push("concussive");
  if (ruleTraits.has("razing") || /Бронебойная/iu.test(String(ammo?.name ?? ""))) out.push("razing");
  return out;
}

function shotgunModularSelectionForAmmo(source, ammo) {
  const traits = source?.system?.traits ?? {};
  if (!(traits.value ?? []).includes("modular")) return null;
  const configs = traits.config?.modular;
  if (!Array.isArray(configs) || configs.length < 2) return null;

  const slugIndex = configs.findIndex((config) => config?.damageType === "piercing");
  const shotIndex = configs.findIndex(
    (config) => config?.damageType === "bludgeoning" && (config?.traits ?? []).includes("area-cone"),
  );
  if (slugIndex < 0 || shotIndex < 0) return null;

  const ammoName = String(ammo?.name ?? "").trim();
  if (/^Дробь(?:\s|:|$)/iu.test(ammoName)) return shotIndex;
  if (/^Жакан(?:\s|:|$)/iu.test(ammoName)) return slugIndex;
  return null;
}

/**
 * Synchronize weapon state that must be controlled by the ammunition currently loaded into it.
 * Mutates the provided source and returns true when something changed.
 */
export function synchronizeAmmoDrivenWeaponState(source) {
  if (!source || source.type !== "weapon") return false;

  const system = (source.system ??= {});
  const traits = (system.traits ??= {});
  const loadedAmmo = loadedAmmoSources(source)[0] ?? null;
  let changed = false;

  if (isAmmoDrivenLauncherSource(source)) {
    const currentTraits = Array.isArray(traits.value) ? traits.value : [];
    const desiredArea = loadedAmmo ? areaTraitFromAmmoSource(loadedAmmo) : null;
    const rocketLauncher = isRocketLauncherSource(source);
    const nextTraits = currentTraits.filter((trait) => {
      const value = String(trait);
      if (AREA_TRAIT_RE.test(value)) return false;
      if (rocketLauncher && ROCKET_DYNAMIC_TRAITS.has(value)) return false;
      return true;
    });

    if (desiredArea && !nextTraits.includes(desiredArea)) nextTraits.push(desiredArea);
    if (rocketLauncher && loadedAmmo) {
      for (const trait of rocketDynamicTraitsFromAmmo(loadedAmmo)) {
        if (!nextTraits.includes(trait)) nextTraits.push(trait);
      }
    }

    if (
      currentTraits.length !== nextTraits.length ||
      currentTraits.some((trait, index) => trait !== nextTraits[index])
    ) {
      traits.value = nextTraits;
      changed = true;
    }
  }

  if (loadedAmmo) {
    const selection = shotgunModularSelectionForAmmo(source, loadedAmmo);
    if (selection !== null) {
      const toggles = (traits.toggles ??= {});
      const modular = (toggles.modular ??= {});
      if (modular.selected !== selection) {
        modular.selected = selection;
        changed = true;
      }
    }
  }

  return changed;
}

function writeSynchronizedStateToChange(change, source) {
  if (isAmmoDrivenLauncherSource(source)) {
    foundry.utils.setProperty(change, "system.traits.value", source.system?.traits?.value ?? []);
  }

  const selected = source.system?.traits?.toggles?.modular?.selected;
  if (Number.isInteger(selected)) {
    foundry.utils.setProperty(change, "system.traits.toggles.modular.selected", selected);
  }
}

function conflictMessage(weaponName, conflicts) {
  const detail = conflicts
    .map((entry) => `${entry.label}: ${entry.items.join(" + ")}`)
    .join("; ");
  return `На «${weaponName}» занято взаимоисключающее семейство или монтажный узел. ${detail}`;
}

Hooks.on("preCreateItem", (item, data, _options, userId) => {
  if (userId !== game.user?.id) return true;
  normalizeCreateParentRules(item, data);
  if (item.type !== "weapon") return true;

  const source = foundry.utils.mergeObject(rawItemSource(item), data ?? {}, { inplace: false, recursive: true });
  if (!isLibraryWeaponContext(source)) return true;
  synchronizeAmmoDrivenWeaponState(source);
  if (synchronizeLibraryParentSubitems(source)) {
    foundry.utils.setProperty(data, "system.subitems", source.system?.subitems ?? []);
  }
  const conflicts = collectUpgradeFamilyConflicts(source);
  if (!conflicts.length) return true;
  ui.notifications?.error(conflictMessage(source.name ?? item.name, conflicts));
  return false;
});

Hooks.on("preUpdateItem", (item, change, _options, userId) => {
  if (userId !== game.user?.id) return true;
  normalizeStandaloneParentRules(item, change);
  if (item.type !== "weapon") return true;

  const source = mergedItemSource(item, change);
  if (!isLibraryWeaponContext(source)) return true;
  if (synchronizeAmmoDrivenWeaponState(source)) {
    writeSynchronizedStateToChange(change, source);
  }
  if (synchronizeLibraryParentSubitems(source)) {
    foundry.utils.setProperty(change, "system.subitems", source.system?.subitems ?? []);
  }
  const conflicts = collectUpgradeFamilyConflicts(source);
  if (!conflicts.length) return true;
  ui.notifications?.error(conflictMessage(source.name ?? item.name, conflicts));
  return false;
});

async function synchronizeExistingWeapon(item) {
  if (!isLibraryWeaponContext(item?._source ?? item)) return false;
  const before = item.toObject(false);
  const source = structuredClone(before);
  if (!synchronizeAmmoDrivenWeaponState(source)) return false;

  const update = {};
  const beforeTraits = before.system?.traits?.value ?? [];
  const afterTraits = source.system?.traits?.value ?? [];
  if (
    beforeTraits.length !== afterTraits.length ||
    beforeTraits.some((trait, index) => trait !== afterTraits[index])
  ) {
    foundry.utils.setProperty(update, "system.traits.value", afterTraits);
  }

  const beforeSelected = before.system?.traits?.toggles?.modular?.selected;
  const afterSelected = source.system?.traits?.toggles?.modular?.selected;
  if (Number.isInteger(afterSelected) && beforeSelected !== afterSelected) {
    foundry.utils.setProperty(update, "system.traits.toggles.modular.selected", afterSelected);
  }

  if (!Object.keys(update).length) return false;
  await item.update(update, { render: false, [MODULE_ID]: { ammoSync: true } });
  return true;
}

async function migrateExistingParentDependentRules() {
  if (!game.user?.isGM) return { standalone: 0, weapons: 0 };

  const documents = [];
  for (const actor of game.actors ?? []) {
    for (const item of actor.items ?? []) documents.push(item);
  }
  for (const item of game.items ?? []) documents.push(item);

  let standalone = 0;
  let weapons = 0;
  for (const item of documents) {
    if (!item || item.parentItem) continue;
    const source = item.toObject(false);
    const update = {};

    const ownState = parentRuleStateUpdate(source, false);
    if (ownState) writeParentRuleState(update, ownState);

    if (source.type === "weapon" && synchronizeLibraryParentSubitems(source)) {
      foundry.utils.setProperty(update, "system.subitems", source.system?.subitems ?? []);
    }

    if (!Object.keys(update).length) continue;
    try {
      await item.update(update, { render: false, [MODULE_ID]: { parentRuleGuard: true } });
      if (update.system?.rules) standalone += 1;
      if (update.system?.subitems) weapons += 1;
    } catch (error) {
      console.warn(`[${MODULE_ID}] Не удалось нормализовать parentItem-зависимые правила «${item.name}»`, error);
    }
  }

  return { standalone, weapons };
}

function sanitizeExistingParentRulesInMemory() {
  const documents = [];
  for (const actor of game.actors ?? []) for (const item of actor.items ?? []) documents.push(item);
  for (const item of game.items ?? []) documents.push(item);

  let changed = 0;
  for (const item of documents) {
    if (!item || item.parentItem) continue;
    const source = rawItemSource(item);
    const state = parentRuleStateUpdate(source, false);
    if (!state) continue;
    try {
      item.updateSource?.({
        system: { rules: state.rules },
        flags: { world: { neonForgeParentRollOptions: state.backup } },
      });
      changed += 1;
    } catch (error) {
      console.warn(`[${MODULE_ID}] Не удалось заранее обезопасить parentItem-правила «${item.name}»`, error);
    }
  }
  return changed;
}

Hooks.once("setup", () => {
  const changed = sanitizeExistingParentRulesInMemory();
  if (changed) console.info(`[${MODULE_ID}] До подготовки мира обезопасено улучшений оружия: ${changed}.`);
});

Hooks.once("ready", async () => {
  if (!game.user?.isGM) return;
  const migratedParentRules = await migrateExistingParentDependentRules();
  if (migratedParentRules.standalone || migratedParentRules.weapons) {
    console.info(
      `[${MODULE_ID}] Нормализованы parentItem-зависимые правила: отдельно ${migratedParentRules.standalone}, в оружии ${migratedParentRules.weapons}`,
    );
  }
  const found = [];
  const weapons = [];

  for (const actor of game.actors ?? []) {
    for (const item of actor.items ?? []) {
      if (item.type !== "weapon") continue;
      weapons.push(item);
      const conflicts = collectUpgradeFamilyConflicts(item.toObject(false));
      if (conflicts.length) {
        found.push({ actor: actor.name, weapon: item.name, conflicts });
      }
    }
  }
  for (const item of game.items ?? []) {
    if (item.type !== "weapon") continue;
    weapons.push(item);
    const conflicts = collectUpgradeFamilyConflicts(item.toObject(false));
    if (conflicts.length) found.push({ actor: "Мировой предмет", weapon: item.name, conflicts });
  }

  let synchronized = 0;
  for (const weapon of weapons) {
    try {
      if (await synchronizeExistingWeapon(weapon)) synchronized += 1;
    } catch (error) {
      console.warn(`[${MODULE_ID}] Не удалось синхронизировать оружие «${weapon.name}» с боеприпасом`, error);
    }
  }
  if (synchronized > 0) {
    console.info(`[${MODULE_ID}] С загруженными боеприпасами синхронизировано оружий: ${synchronized}`);
  }

  if (found.length) {
    console.group(`[${MODULE_ID}] Конфликты семейств/монтажных узлов улучшений оружия`);
    console.table(found.map((entry) => ({
      actor: entry.actor,
      weapon: entry.weapon,
      conflicts: entry.conflicts.map((c) => `${c.label}: ${c.items.join(" + ")}`).join("; "),
    })));
    console.groupEnd();
    ui.notifications?.warn(
      `Cyberpunk Equipment Library: найдено ${found.length} уже существующих сборок с конфликтующими семействами или монтажными узлами. Ничего не удалено; подробности в консоли.`,
      { permanent: true },
    );
  }
});
