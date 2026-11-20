import { ABILITY_LIBRARY, abilityById, abilityPackage, packagesForAbility } from '../neon-forge/forge/ability-packages.mjs';
import { GENERATOR_SCHEMA, MODULE_ID, FORGE_FLAG } from '../neon-forge/forge/constants.mjs';

const VERSION = '1.6.13';
const LEGACY_TIER_SUFFIX = Object.freeze({ enhanced:1, elite:2, apex:3 });

// v1.6.12 role-core entries that were replaced by explicit canonical role mechanics.
// The alias points at the root of the new family; requested legacy tiers are then
// clamped to the highest explicit upgrade that actually exists in that family.
const LEGACY_ROOT_ALIASES = Object.freeze({
  'assault-combat-rush':'assault-signature-action',
  'assault-fireteam':'assault-signature-passive',
  'defender-hold-line':'defender-signature-passive',
  'defender-interpose':'defender-signature-reaction',
  'defender-brace':'combat-brace',
  'heavy-lock-sector':'heavy-signature-action',
  'heavy-braced-fire':'heavy-signature-passive',
  'sniper-cold-shot':'sniper-signature-passive',
  'sniper-relocate':'combat-reposition',
  'skirmisher-light-step':'skirmisher-signature-free',
  'infiltrator-silent-entry':'infiltrator-signature-passive',
  'netrunner-uplink':'netrunner-signature-passive',
  'netrunner-isolate':'netrunner-signature-reaction',
  'tech-field-repair':'technician-signature-action',
  'medic-combat-stim':'medic-signature-action',
  'leader-command':'leader-signature-action',
  'civilian-seek-cover':'civilian-signature-action',
  'civilian-call-help':'civilian-signature-free',
  'civilian-freeze':'civilian-signature-passive',
  'civilian-find-exit':'civilian-signature-action',
  'civilian-help-neighbor':'civilian-signature-reaction',
  'civilian-not-a-hero':'civilian-signature-passive',
  'cyberpsycho-break-line':'cyberpsycho-signature-action',
  'pkt-combat-loop':'pkt-signature-action',
  'combat-watch-sector':'combat-cover-discipline',
  'combat-cover-drill':'combat-cover-settle',
});

function sourceOf(item) {
  return item?._source ?? item?.toObject?.(false) ?? item ?? {};
}
function values(collection) {
  if (Array.isArray(collection?.contents)) return collection.contents;
  if (typeof collection?.values === 'function') return [...collection.values()];
  return [...(collection ?? [])];
}
function isPrimaryActiveGM() {
  const active = values(globalThis.game?.users)
    .filter((user) => user?.active && user?.isGM)
    .sort((a,b) => String(a.id).localeCompare(String(b.id)));
  return Boolean(active.length && globalThis.game?.user?.id === active[0].id);
}
function forgeMeta(source) {
  return source?.flags?.[MODULE_ID]?.[FORGE_FLAG] ?? null;
}
function isGeneratedPlannedAbility(source) {
  const meta = forgeMeta(source);
  return Boolean(meta?.generated && meta?.kind === 'planned-ability');
}

function splitLegacyTier(id) {
  const raw = String(id ?? '');
  const match = raw.match(/^(.*)-(enhanced|elite|apex)$/u);
  if (!match) return { root:raw, requestedTier:0 };
  return { root:match[1], requestedTier:LEGACY_TIER_SUFFIX[match[2]] ?? 0 };
}

function familyRoot(ability) {
  return ability?.upgradeOf || ability?.variantOf || ability?.id || '';
}

function explicitFamily(rootId) {
  const root = abilityById(rootId);
  if (!root) return [];
  const rootFamily = familyRoot(root);
  return Object.values(ABILITY_LIBRARY)
    .filter((entry) => familyRoot(entry) === rootFamily)
    .sort((a,b) => Number(a.tier ?? 0) - Number(b.tier ?? 0));
}

/** Resolve a v1.6.12 generated ability ID to the best legal explicit v1.6.13 ability. */
export function resolveLegacyAbilityId1613(id) {
  const { root:legacyRoot, requestedTier } = splitLegacyTier(id);
  const canonicalRoot = LEGACY_ROOT_ALIASES[legacyRoot] ?? legacyRoot;
  const direct = abilityById(canonicalRoot);
  if (!direct) return null;

  const family = explicitFamily(canonicalRoot);
  if (!family.length || requestedTier <= 0) return direct.id;

  const legal = family.filter((entry) => Number(entry.tier ?? 0) <= requestedTier);
  return (legal.at(-1) ?? direct).id;
}

function canonicalMeta(ability, oldMeta={}) {
  const availableFrom = packagesForAbility(ability.id);
  const selectedFrom = availableFrom.includes(oldMeta.selectedFrom)
    ? oldMeta.selectedFrom
    : availableFrom.includes(oldMeta.packageId)
      ? oldMeta.packageId
      : (availableFrom[0] ?? '');
  return {
    generated:true,
    version:Number(oldMeta.version ?? 1),
    generatorSchema:GENERATOR_SCHEMA,
    kind:'planned-ability',
    packageId:selectedFrom,
    selectedFrom,
    availableFrom:[...availableFrom],
    abilityId:ability.id,
    sourceKind:abilityPackage(selectedFrom)?.sourceKind ?? oldMeta.sourceKind ?? 'canonical',
    sourceRef:ability.sourceRef ?? oldMeta.sourceRef ?? '',
    tier:Number(ability.tier ?? 0),
    upgradeOf:ability.upgradeOf ?? '',
    exclusiveGroup:ability.exclusiveGroup ?? '',
    requirements:structuredClone(ability.requirements ?? {}),
    numericTarget:ability.numericTarget ?? '',
  };
}

function abilitySystem(ability, current={}) {
  return {
    ...current,
    actionType:{ value:ability.actionType },
    actions:{ value:ability.actions },
    category:ability.category ?? 'interaction',
    description:{
      ...(current.description ?? {}),
      gm:ability.sourceRef ? `<p><strong>Источник:</strong> ${ability.sourceRef}</p>` : '',
      value:ability.description,
    },
    rules:structuredClone(ability.rules ?? []),
    slug:`cyberpunk-forge-${ability.id.replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase()}`,
    traits:{ value:[...(ability.traits ?? [])], otherTags:[] },
  };
}

/** Pure source migration used both by Foundry ready-hook and tests. */
export function patch1613Source(input) {
  const source = input ?? {};
  if (!isGeneratedPlannedAbility(source)) return { source, changed:false, delete:false };
  const oldMeta = forgeMeta(source);
  if (Number(oldMeta.generatorSchema ?? 0) >= GENERATOR_SCHEMA && abilityById(oldMeta.abilityId)) {
    return { source, changed:false, delete:false };
  }

  const canonicalId = resolveLegacyAbilityId1613(oldMeta.abilityId);
  if (!canonicalId) return { source, changed:true, delete:true };
  const ability = abilityById(canonicalId);
  if (!ability) return { source, changed:true, delete:true };

  const patched = structuredClone(source);
  patched.name = ability.name;
  patched.type = 'action';
  patched.flags ??= {};
  patched.flags[MODULE_ID] ??= {};
  patched.flags[MODULE_ID][FORGE_FLAG] = canonicalMeta(ability, oldMeta);
  patched.system = abilitySystem(ability, patched.system ?? {});
  return { source:patched, changed:true, delete:false };
}

/** Patch a set of embedded sources and collapse generated legacy duplicates that
 * resolve to the same canonical ability. Manual/user-authored actions are never
 * deduplicated by this migration. */
export function patch1613SourceBatch(inputs = []) {
  const seen = new Set();
  return [...inputs].map((input) => {
    const patched = patch1613Source(input);
    if (patched.delete) return patched;
    const meta = forgeMeta(patched.source);
    if (!meta?.generated || meta?.kind !== 'planned-ability') return patched;
    const canonicalId = meta.abilityId;
    if (!canonicalId) return patched;
    if (seen.has(canonicalId)) return { source:patched.source, changed:true, delete:true };
    seen.add(canonicalId);
    return patched;
  });
}

function updateDataForDocument(item) {
  const original = sourceOf(item);
  const patched = patch1613Source(structuredClone(original));
  if (!patched.changed) return { action:'none' };
  if (patched.delete) return { action:'delete' };
  return {
    action:'update',
    data:{
      name:patched.source.name,
      [`flags.${MODULE_ID}.${FORGE_FLAG}`]:patched.source.flags[MODULE_ID][FORGE_FLAG],
      system:patched.source.system,
    },
  };
}

async function migrateEmbedded(actor) {
  let changed=0;
  const items=values(actor?.items);
  const patches=patch1613SourceBatch(items.map((item)=>sourceOf(item)));
  const deleteIds=[];
  for (let i=0;i<items.length;i+=1) {
    const item=items[i]; const patched=patches[i];
    if (!patched?.changed) continue;
    if (patched.delete) { deleteIds.push(item.id); changed += 1; continue; }
    if (item?.update) {
      await item.update({
        name:patched.source.name,
        [`flags.${MODULE_ID}.${FORGE_FLAG}`]:patched.source.flags[MODULE_ID][FORGE_FLAG],
        system:patched.source.system,
      },{render:false,[MODULE_ID]:{migration1613:true}});
      changed += 1;
    }
  }
  if (deleteIds.length && actor?.deleteEmbeddedDocuments) {
    await actor.deleteEmbeddedDocuments('Item',deleteIds,{render:false,[MODULE_ID]:{migration1613:true}});
  }
  return changed;
}

/** Migrate world copies only; compendium packs remain immutable and are rebuilt separately. */
export async function migrate1613Copies() {
  if (!isPrimaryActiveGM()) return 0;
  let changed=0;
  for (const item of values(globalThis.game?.items)) {
    try {
      const op=updateDataForDocument(item);
      if (op.action === 'update' && item?.update) {
        await item.update(op.data,{render:false,[MODULE_ID]:{migration1613:true}});
        changed += 1;
      } else if (op.action === 'delete' && item?.delete) {
        await item.delete({render:false,[MODULE_ID]:{migration1613:true}});
        changed += 1;
      }
    } catch (error) {
      console.warn(`[${MODULE_ID}] ${VERSION}: не удалось мигрировать способность ${item?.name ?? item?.id}`,error);
    }
  }
  for (const actor of values(globalThis.game?.actors)) {
    try { changed += await migrateEmbedded(actor); }
    catch (error) { console.warn(`[${MODULE_ID}] ${VERSION}: не удалось мигрировать способности NPC ${actor?.name ?? actor?.id}`,error); }
  }
  return changed;
}

if (globalThis.Hooks?.once) Hooks.once('ready',migrate1613Copies);
