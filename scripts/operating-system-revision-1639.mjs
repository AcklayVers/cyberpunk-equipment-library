import {OPERATING_SYSTEM_REVISIONS_1639 as revisions} from './data/operating-system-revision-1639.mjs';
import './chrome-compression-1637.mjs';
export function costFooter1639(html,slots,stress,hard){
 return String(html)
 .replace(/((?:<strong>|<b>)\s*Слоты\s*:\s*(?:<\/strong>|<\/b>)\s*)\d+/giu,(_m,p)=>p+slots)
 .replace(/((?:<strong>|<b>)\s*Stress\s+Cost\s*:\s*(?:<\/strong>|<\/b>)\s*(?:\[\[\/r\s*)?)(?:\d+d\d+(?:\s*\+\s*\d+d\d+)*|0)/giu,(_m,p)=>p+stress)
 .replace(/((?:<strong>|<b>)\s*Hard\s+Cost\s*:\s*(?:<\/strong>|<\/b>)\s*)\d+/giu,(_m,p)=>p+hard);
}
const MOD='cyberpunk-equipment-library',REM='cyberpunk-remaster',CIC='cyberpunk-implant-creator';
const sourceOf=item=>item?._source??item?.toObject?.(true)??item??{};
const values=collection=>Array.isArray(collection)?collection:Array.isArray(collection?.contents)?collection.contents:[...(collection?.values?.()??[])];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function revision(source){
 if(source.type!=='equipment')return null;
 const refs=[source._stats?.compendiumSource,source._stats?.duplicateSource,source.flags?.core?.sourceId,source.sourceId].filter(ref=>typeof ref==='string'&&ref.startsWith('Compendium.'));
 if(refs.some(ref=>!ref.startsWith('Compendium.'+MOD+'.')))return null;
 for(const ref of refs)if(ref.startsWith('Compendium.'+MOD+'.implants.')){const row=revisions.find(row=>row.id===ref.split('.').at(-1));if(row)return row;}
 return refs.length?null:revisions.find(row=>row.id===source._id)??null;
}
export function patchOperatingSystem1639(input){
 const source=structuredClone(sourceOf(input)),row=revision(source);
 if(row&&!(source.flags?.[MOD]?.costs1639?.provider===MOD&&source.flags?.[MOD]?.costs1639?.version==='1.6.39')){
  const {before,after}=row;
  // Profile selection is player state from 1.6.35, not a custom rules edit.
  const normalized=structuredClone(source.system?.rules??[]);
  for(const rule of normalized)if(rule.key==='RollOption'&&rule.option==='cpel-chrome-compressor-profile')rule.selection='mobility';
  const managed=[...before,after].some(old=>same(normalized,old.system.rules));
  if(managed){
   source.system.rules=structuredClone(after.system.rules);
   if(before.some(old=>source.system.description?.value===old.system.description.value))source.system.description.value=after.system.description.value;
   if(before.some(old=>same(source.flags?.[CIC]?.activation,old.flags?.[CIC]?.activation))&&after.flags?.[CIC]?.activation)source.flags[CIC].activation=structuredClone(after.flags[CIC].activation);
   if(before.some(old=>source.flags?.[REM]?.hardCost===old.flags[REM].hardCost))source.flags[REM].hardCost=after.flags[REM].hardCost;
  }
  if(before.some(old=>source.name===old.name))source.name=after.name;
  if(before.some(old=>source.system.level?.value===old.system.level.value))source.system.level.value=after.system.level.value;
  if(before.some(old=>same(source.system.price?.value,old.system.price.value)))source.system.price.value=structuredClone(after.system.price.value);
  const price=source.system.price?.value;
  if(source.flags?.[REM]&&before.some(old=>source.flags[REM].priceEddies===old.flags[REM].priceEddies)&&price&&Object.keys(price).length===1&&Number.isFinite(price.sp))source.flags[REM].priceEddies=price.sp;
  if(after.flags?.[MOD]?.chromeCompression1637&&managed){
   source.flags[MOD]??={};source.flags[MOD].chromeCompression1637=structuredClone(after.flags[MOD].chromeCompression1637);
   if(after.flags[MOD].chromeCapacity1636)source.flags[MOD].chromeCapacity1636=structuredClone(after.flags[MOD].chromeCapacity1636);
  }
  if(after.flags?.[MOD]?.costs1639){
   source.flags??={};source.flags[REM]??={};source.flags[MOD]??={};
   const costs=after.flags[REM];Object.assign(source.flags[REM],{slotsUsed:costs.slotsUsed,stressFormula:costs.stressFormula,hardCost:costs.hardCost});
   source.system.description.value=costFooter1639(source.system.description?.value??'',costs.slotsUsed,costs.stressFormula,costs.hardCost);
   source.flags[MOD].costs1639=structuredClone(after.flags[MOD].costs1639);
  }
 }
 if(Array.isArray(source.system?.subitems))source.system.subitems=source.system.subitems.map(patchOperatingSystem1639);
 return source;
}
function difference(a,b,prefix='',update={}){
 if(same(a,b))return update;
 if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)||Array.isArray(b)){update[prefix]=b;return update;}
 for(const key of new Set([...Object.keys(a),...Object.keys(b)])){
  if(!Object.hasOwn(b,key))update[(prefix?prefix+'.':'')+'-='+key]=null;
  else difference(a[key],b[key],prefix?prefix+'.'+key:key,update);
 }
 return update;
}
const contains=source=>Boolean(revision(source))||Boolean(source.system?.subitems?.some(contains));
export function operatingSystem1639EffectUpdate(item){
 const source=sourceOf(item),flags=source.flags?.[CIC];
 if(source.type!=='effect'||flags?.activationEffect!==true||item.isExpired===true||source.system?.expired===true)return null;
 const actor=item.actor??item.parent;
 const owner=values(actor?.items).find(candidate=>(candidate.id??sourceOf(candidate)._id)===flags.activationSourceItemId);
 const row=revision(sourceOf(owner));if(!row)return null;
 const after=row.after.flags?.[CIC]?.activation,known=row.before.map(old=>old.flags?.[CIC]?.activation).filter(Boolean);
 if(!after||![...known,after].some(config=>same(config.effectRules,source.system.rules)))return null;
 const next=structuredClone(source);next.system.rules=structuredClone(after.effectRules);
 if(known.some(config=>source.system.description?.value===config.effectDescription))next.system.description.value=after.effectDescription;
 if(known.some(config=>source.name===config.effectName))next.name=after.effectName;
 if(source.system.duration?.unit==='rounds'&&known.some(config=>same(source.system.duration,config.duration)))next.system.duration.value=after.duration.value;
 if(row.before.some(old=>source.system.level?.value===old.system.level.value))next.system.level.value=row.after.system.level.value;
 // Native start time, expiry mode and effect state are retained; no activation is replayed.
 const update=difference(source,next);return Object.keys(update).length?update:null;
}
export function operatingSystem1639Update(item){const before=sourceOf(item);if(before.type==='effect')return operatingSystem1639EffectUpdate(item);if(!contains(before))return null;const update=difference(before,patchOperatingSystem1639(before));return Object.keys(update).length?update:null;}
export async function migrateOperatingSystems1639(){
 const users=values(globalThis.game?.users).filter(user=>user.active&&user.isGM).sort((a,b)=>String(a.id).localeCompare(String(b.id)));
 const result={updated:0,failed:0};if(!game.user?.isGM||users[0]?.id!==game.user.id)return result;
 const actors=new Map(values(game.actors).map(actor=>[actor.uuid??actor,actor]));
 for(const scene of values(game.scenes))for(const token of values(scene.tokens))if(!token.actorLink&&token.actor)actors.set(token.actor.uuid??token.actor,token.actor);
 const seen=new Set();for(const item of [...values(game.items),...[...actors.values()].flatMap(actor=>values(actor.items))]){
  if(seen.has(item.uuid??item))continue;seen.add(item.uuid??item);const update=operatingSystem1639Update(item);if(!update)continue;
  try{await item.update(update,{[MOD]:{operatingSystems1639:true}});result.updated++;}catch(error){result.failed++;console.error('['+MOD+'] OS migration',error);}
 }
 return result;
}
if(globalThis.Hooks?.on)Hooks.on('preCreateItem',item=>{const update=operatingSystem1639Update(item);if(update)item.updateSource(update);});
if(globalThis.Hooks?.once)Hooks.once('ready',()=>{migrateOperatingSystems1639().catch(error=>console.error('['+MOD+'] 1.6.36',error));});
