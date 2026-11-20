import { ABILITY_PACKAGES, ROLE_PACKAGE_MAP, abilityPackage, legacyPresetPackageId } from './ability-packages.mjs';

export function abilityCountBand(level) {
  const value = Math.max(0, Math.min(20, Math.trunc(Number(level) || 0)));
  if (value <= 4) return { min: 2, max: 3 };
  if (value <= 10) return { min: 3, max: 4 };
  if (value <= 15) return { min: 4, max: 5 };
  return { min: 5, max: 6 };
}

function requirementsMet(requirements = {}, tags = new Set()) {
  if ((requirements.allTags ?? []).some((tag) => !tags.has(tag))) return false;
  if ((requirements.anyTags ?? []).length && !(requirements.anyTags ?? []).some((tag) => tags.has(tag))) return false;
  if ((requirements.forbiddenTags ?? []).some((tag) => tags.has(tag))) return false;
  return true;
}
function equipmentPackages(tags) {
  const result = [];
  const map = [
    ['has:shield','shield-core'],['has:shotgun','shotgun-breach'],['has:rifle','rifle-fireteam'],
    ['has:heavy-weapon','heavy-weapon-control'],['has:medical-gear','medical-kit-support'],
    ['has:jump-boosters','jump-boosters-mobile'],['has:cyberdeck','cyberdeck-support'],['has:smart-weapon','smart-weapon-link'],
  ];
  for (const [tag,id] of map) if (tags.has(tag)) result.push(id);
  return result;
}
function rankPackages(level, role, preset, adjustment) {
  const ids = [];
  if (level >= 11 || Number(adjustment) >= 1 || ['elite','boss','apex'].includes(String(preset?.quality ?? ''))) ids.push('elite-operator');
  if (role?.id === 'leader' || /leader|commander/u.test(String(role?.id ?? ''))) ids.push('commander');
  if (role?.id === 'cyberpsycho') ids.push('cyberpsycho-pressure');
  if (role?.id === 'pkt') ids.push('pkt-operator');
  return ids;
}

const SOURCE_WEIGHT = Object.freeze({ doctrine:30, equipment:22, rank:18, legacy:14, role:12, common:10 });
function sourceEntry(packageId, ability, loreProfile) {
  const pack = abilityPackage(packageId);
  const sourceKind = pack?.sourceKind ?? 'role';
  const sourceRef = sourceKind === 'doctrine' ? (loreProfile?.sourceRef || ability.sourceRef || '') : (ability.sourceRef || '');
  return Object.freeze({packageId, sourceKind, sourceRef});
}
function bestSource(sources) {
  return [...sources].sort((a,b) => (SOURCE_WEIGHT[b.sourceKind] ?? 0) - (SOURCE_WEIGHT[a.sourceKind] ?? 0))[0] ?? {packageId:'',sourceKind:'role',sourceRef:''};
}

export function collectAbilityCandidates({ level, role, preset = {}, loreProfile = null, loadoutTags = new Set(), adjustment = 0 }) {
  const tags = loadoutTags instanceof Set ? loadoutTags : new Set(loadoutTags ?? []);
  const ids = [
    ...(ROLE_PACKAGE_MAP[role?.id] ?? ['role-combat-basics']),
    ...(loreProfile?.abilityPackages ?? []),
    ...equipmentPackages(tags),
    ...rankPackages(level, role, preset, adjustment),
  ];
  const legacy = legacyPresetPackageId(preset?.id);
  if (legacy) ids.push(legacy);

  const byAbility = new Map();
  for (const packageId of ids) {
    const pack = ABILITY_PACKAGES[packageId];
    if (!pack) continue;
    for (const ability of pack.abilities) {
      if (level < ability.minLevel || level > ability.maxLevel || !requirementsMet(ability.requirements, tags)) continue;
      let entry = byAbility.get(ability.id);
      if (!entry) {
        entry = {ability, sources:[]};
        byAbility.set(ability.id, entry);
      }
      if (!entry.sources.some((source)=>source.packageId === packageId)) entry.sources.push(sourceEntry(packageId, ability, loreProfile));
    }
  }

  const canonicalCandidates = [...byAbility.values()].map(({ability, sources}) => {
    const selectedSource = bestSource(sources);
    return Object.freeze({
      ...ability,
      packageId:selectedSource.packageId,
      abilityId:ability.id,
      sourceKind:selectedSource.sourceKind,
      sourceRef:selectedSource.sourceRef,
      selectedFrom:selectedSource.packageId,
      availableFrom:Object.freeze(sources.map((source)=>source.packageId)),
    });
  });

  const bestByFamily = new Map();
  for (const candidate of canonicalCandidates) {
    const familyId = candidate.upgradeOf || candidate.abilityId;
    const current = bestByFamily.get(familyId);
    if (!current || Number(candidate.tier ?? 0) > Number(current.tier ?? 0) ||
      (Number(candidate.tier ?? 0) === Number(current.tier ?? 0) && Number(candidate.weight ?? 0) > Number(current.weight ?? 0))) {
      bestByFamily.set(familyId, candidate);
    }
  }
  return [...bestByFamily.values()];
}

function weightedPick(items, random) {
  if (!items.length) return null;
  const weights = items.map((item) => Math.max(1, Number(item.weight ?? 10) + (SOURCE_WEIGHT[item.sourceKind] ?? 0)));
  const total = weights.reduce((a,b)=>a+b,0);
  let n = random() * total;
  for (let i=0;i<items.length;i+=1) { n -= weights[i]; if (n < 0) return items[i]; }
  return items.at(-1);
}
function canAdd(candidate, selected) {
  if (selected.some((item) => item.abilityId === candidate.abilityId)) return false;
  const family = candidate.upgradeOf || candidate.abilityId;
  if (selected.some((item) => (item.upgradeOf || item.abilityId) === family)) return false;
  if (candidate.exclusiveGroup && selected.some((item) => item.exclusiveGroup === candidate.exclusiveGroup)) return false;
  return true;
}
function take(candidate, selected) { if (candidate && canAdd(candidate, selected)) selected.push(candidate); }

export function planNpcAbilities({ level, role, preset = {}, loreProfile = null, loadoutTags = new Set(), adjustment = 0, random = Math.random }) {
  const tags = loadoutTags instanceof Set ? loadoutTags : new Set(loadoutTags ?? []);
  const candidates = collectAbilityCandidates({ level, role, preset, loreProfile, loadoutTags:tags, adjustment });
  const band = abilityCountBand(level);
  const target = band.min + Math.floor(random() * (band.max - band.min + 1));
  const selected = [];
  const civilian = ['civilian','merchant','driver','laborer','service','clerk'].includes(role?.id);
  if (!civilian) {
    const shieldRole = role?.id === 'shieldDefender' && tags.has('has:shield');
    const rolePool = shieldRole
      ? candidates.filter((c) => c.sourceKind === 'role' && (c.requirements?.allTags ?? []).includes('has:shield'))
      : candidates.filter((c)=>c.sourceKind === 'role');
    take(weightedPick(rolePool.length ? rolePool : candidates.filter((c)=>c.sourceKind === 'role'), random), selected);
  }
  take(weightedPick(candidates.filter((c)=>c.sourceKind === 'doctrine' && canAdd(c, selected)), random), selected);

  const ensureType = (types) => {
    if (selected.length >= target || selected.some((item) => types.includes(item.actionType))) return;
    const pool = candidates.filter((candidate) => types.includes(candidate.actionType) && canAdd(candidate, selected));
    take(weightedPick(pool, random), selected);
  };
  if (target >= 3) {
    ensureType(['action']);
    ensureType(['reaction','free']);
    ensureType(['passive']);
  }

  while (selected.length < target) {
    const available = candidates.filter((candidate) => canAdd(candidate, selected));
    if (!available.length) break;
    take(weightedPick(available, random), selected);
  }

  if (selected.length < band.min && !civilian) {
    const fallbackIds = ['common-combat-movement','common-focus-fire','common-defense'];
    const fallback = fallbackIds.flatMap((packageId) => abilityPackage(packageId)?.abilities.map((ability)=>({packageId,ability})) ?? []);
    const byFamily = new Map();
    for (const {packageId, ability} of fallback) {
      if (level < ability.minLevel || level > ability.maxLevel || !requirementsMet(ability.requirements, tags)) continue;
      const family = ability.upgradeOf || ability.id;
      const existing = byFamily.get(family);
      const candidate = Object.freeze({...ability, abilityId:ability.id, packageId, selectedFrom:packageId, availableFrom:Object.freeze([packageId]), sourceKind:'common', sourceRef:ability.sourceRef || ''});
      if (!existing || Number(candidate.tier ?? 0) > Number(existing.tier ?? 0)) byFamily.set(family,candidate);
    }
    for (const candidate of byFamily.values()) {
      take(candidate, selected);
      if (selected.length >= Math.min(target, band.max)) break;
    }
  }

  const partition = (type) => selected.filter((item) => item.actionType === type);
  return Object.freeze({
    selected:Object.freeze(selected), actions:Object.freeze(partition('action')), reactions:Object.freeze(partition('reaction')),
    freeActions:Object.freeze(partition('free')), passives:Object.freeze(partition('passive')),
    citations:Object.freeze([...new Set(selected.map((item)=>item.sourceRef).filter(Boolean))]), band:Object.freeze(band), target,
  });
}
