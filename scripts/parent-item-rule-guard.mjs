const PARENT_ITEM_INJECTION = /\{item\|parentItem(?:\.|\})/u;
const BACKUP_SCOPE = "world";
const BACKUP_KEY = "neonForgeParentRollOptions";

function valueContainsParentItemInjection(value) {
  if (typeof value === "string") return PARENT_ITEM_INJECTION.test(value);
  if (Array.isArray(value)) return value.some((entry) => valueContainsParentItemInjection(entry));
  if (!value || typeof value !== "object") return false;
  return Object.values(value).some((entry) => valueContainsParentItemInjection(entry));
}

/** Return true when a PF2e rule element contains an injected property that needs item.parentItem. */
export function ruleDependsOnParentItem(rule) {
  return !!rule && typeof rule === "object" && valueContainsParentItemInjection(rule);
}

function cloneRule(rule) {
  return globalThis.structuredClone ? structuredClone(rule) : JSON.parse(JSON.stringify(rule));
}

function sameRule(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function backupArray(source) {
  source.flags ??= {};
  source.flags[BACKUP_SCOPE] ??= {};
  const current = source.flags[BACKUP_SCOPE][BACKUP_KEY];
  if (!Array.isArray(current)) source.flags[BACKUP_SCOPE][BACKUP_KEY] = [];
  return source.flags[BACKUP_SCOPE][BACKUP_KEY];
}

/**
 * RollOption resolves injected properties in its constructor in SF2e 1.4+, even
 * when ignored=true.  A standalone upgrade therefore must not contain a
 * RollOption with {item|parentItem...} at all.  Keep such rules in flags until
 * the item becomes an installed weapon subitem.
 */
export function prepareParentRuleState(source, hasParentItem) {
  if (!source || typeof source !== "object") return false;
  source.system ??= {};
  const originalRules = Array.isArray(source.system.rules) ? source.system.rules : [];
  const backup = backupArray(source);
  let changed = false;

  if (!hasParentItem) {
    const kept = [];
    for (const rule of originalRules) {
      if (rule?.key === "RollOption" && ruleDependsOnParentItem(rule)) {
        const clean = cloneRule(rule);
        delete clean.ignored;
        if (!backup.some((entry) => sameRule(entry, clean))) backup.push(clean);
        changed = true;
        continue;
      }
      if (ruleDependsOnParentItem(rule)) {
        const next = { ...rule, ignored: true };
        if (rule.ignored !== true) changed = true;
        kept.push(next);
      } else {
        kept.push(rule);
      }
    }
    if (kept.length !== originalRules.length) changed = true;
    source.system.rules = kept;
    return changed;
  }

  const restored = [...originalRules];
  for (const stored of backup) {
    if (!stored || stored.key !== "RollOption" || !ruleDependsOnParentItem(stored)) continue;
    if (!restored.some((entry) => sameRule({ ...entry, ignored: undefined }, { ...stored, ignored: undefined }))) {
      const next = cloneRule(stored);
      delete next.ignored;
      restored.push(next);
      changed = true;
    }
  }
  source.system.rules = restored.map((rule) => {
    if (!ruleDependsOnParentItem(rule)) return rule;
    if (rule.ignored === false) return rule;
    changed = true;
    return { ...rule, ignored: false };
  });
  return changed;
}

/**
 * SF2e constructs RollOption rule elements before it can honor an ignored flag.
 * Existing actor/world copies from older releases can therefore throw during the
 * very first data preparation, before setup/ready migrations are able to run.
 * Strip only the unsafe standalone RollOption from the prepared system data.
 * The persisted _source is intentionally left untouched here so the normal
 * setup/ready migration can back the rule up and restore it when installed.
 */
export function sanitizeStandaloneItemForRulePreparation(item) {
  if (!item || item.parentItem) return 0;
  const rules = item.system?.rules;
  if (!Array.isArray(rules) || rules.length === 0) return 0;

  let removed = 0;
  for (let index = rules.length - 1; index >= 0; index -= 1) {
    const rule = rules[index];
    if (rule?.key !== "RollOption" || !ruleDependsOnParentItem(rule)) continue;
    rules.splice(index, 1);
    removed += 1;
  }
  return removed;
}

/**
 * Legacy helper retained for existing migrations/tests.  It is safe for rule
 * types that do not resolve parentItem in the constructor; RollOption rules are
 * handled by prepareParentRuleState at the item-source level.
 */
export function normalizeParentDependentRules(rules, hasParentItem) {
  if (!Array.isArray(rules) || rules.length === 0) return { rules: Array.isArray(rules) ? rules : [], changed: false };

  let changed = false;
  const nextRules = rules.map((rule) => {
    if (!ruleDependsOnParentItem(rule)) return rule;
    const desiredIgnored = !hasParentItem;
    if (rule?.ignored === desiredIgnored) return rule;
    changed = true;
    return { ...rule, ignored: desiredIgnored };
  });

  return { rules: nextRules, changed };
}

/** Reactivate parent-dependent rule elements for subitems embedded in a weapon source. */
export function synchronizeParentDependentSubitemRules(weaponSource) {
  if (!weaponSource || weaponSource.type !== "weapon") return false;
  const subitems = weaponSource.system?.subitems;
  if (!Array.isArray(subitems) || subitems.length === 0) return false;

  let changed = false;
  for (const subitem of subitems) {
    if (prepareParentRuleState(subitem, true)) changed = true;
  }
  return changed;
}
