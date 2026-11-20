import { sanitizeStandaloneItemForRulePreparation } from "./parent-item-rule-guard.mjs";
import { isLibraryPhysicalItem } from "./library-item-scope.mjs";

const MODULE_ID = "cyberpunk-equipment-library";
const PATCH_MARK = Symbol.for(`${MODULE_ID}.armorResilientZero`);
const RULE_PREPARE_PATCH_MARK = Symbol.for(`${MODULE_ID}.parentItemRulePrepareGuard`);

export function ensureArmorResilientConfig(item) {
  if (!item || item.type !== "armor" || !isLibraryPhysicalItem(item)) return false;
  const traits = item.system?.traits;
  if (!traits) return false;
  const config = (traits.config ??= {});
  if (Number.isFinite(Number(config.resilient))) return false;
  config.resilient = 0;
  return true;
}

Hooks.once("init", () => {
  const proto = CONFIG.Item?.documentClass?.prototype;

  const originalPrepareBaseData = proto?.prepareBaseData;
  if (typeof originalPrepareBaseData === "function" && !originalPrepareBaseData[PATCH_MARK]) {
    function patchedPrepareBaseData(...args) {
      const result = originalPrepareBaseData.apply(this, args);
      // SF2e issue #22075: Armor Expertise evaluates
      // @armor.system.traits.config.resilient even when commercial/tactical
      // armor has no resilient annotation. Treat that missing annotation as 0.
      ensureArmorResilientConfig(this);
      return result;
    }

    Object.defineProperty(patchedPrepareBaseData, PATCH_MARK, { value: true });
    proto.prepareBaseData = patchedPrepareBaseData;
  }

  // Existing standalone T-Link/weapon-upgrade copies can still contain a
  // RollOption with {item|parentItem.id}. SF2e resolves RollOption.option in
  // the constructor, so sanitize the prepared rule array immediately before
  // RuleElements.fromOwnedItem() is reached. This runs early enough to protect
  // the first Actor data preparation; setup/ready migration persists the fix.
  const originalPrepareRuleElements = proto?.prepareRuleElements;
  if (typeof originalPrepareRuleElements === "function" && !originalPrepareRuleElements[RULE_PREPARE_PATCH_MARK]) {
    function patchedPrepareRuleElements(...args) {
      if (isLibraryPhysicalItem(this)) sanitizeStandaloneItemForRulePreparation(this);
      return originalPrepareRuleElements.apply(this, args);
    }
    Object.defineProperty(patchedPrepareRuleElements, RULE_PREPARE_PATCH_MARK, { value: true });
    proto.prepareRuleElements = patchedPrepareRuleElements;
  }
});
