/** CPEL 1.6.16: restore intended mutagen effects without overwriting unrelated item data. */
import {MUTAGEN_EFFECT_IDS_1616} from './data/mutagen-effect-ids-1616.mjs';
const MOD='cyberpunk-equipment-library';
const FAMILIES_BY_ID=new Map(Object.entries(MUTAGEN_EFFECT_IDS_1616));
const IDs=new Set(FAMILIES_BY_ID.keys());
const MUTAGEN_NAME=/^Эффект: Боевой мутаген «([^»]+)»/u;
const asList=coll=>Array.isArray(coll?.contents)?coll.contents:Array.isArray(coll)?coll:typeof coll?.values==='function'?[...coll.values()]:[];
const currentSource=doc=>doc?._source??doc?.toObject?.(false)??doc??{};
const clone=x=>structuredClone(x);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const keyOf=(x)=>x?.key;
const originalId=src=>{
 const refs=[src?._stats?.compendiumSource,src?.flags?.core?.sourceId,src?.sourceId];
 for(const r of refs){
  if(!r)continue;
  const m=String(r).match(/^Compendium\.cyberpunk-equipment-library\.gear\.Item\.([A-Za-z0-9]{16})$/u);
  return m?.[1]??null; // Explicit foreign provenance must never fall back to a matching document ID.
 }
 return src?._id??null;
};
const isOurEffect=src=>src?.type==='effect'&&IDs.has(originalId(src));
const addRule=(rules,rule,already=()=>false)=>{if(!rules.some(r=>already(r)))rules.push(rule);};
const speed=(v)=>({key:'FlatModifier',selector:'all-speeds',type:'status',value:v});

/** Make only identifiable, mechanically grounded changes; leave unknown user rules intact. */
export function patchMutagenEffect1616(input){
 if(!isOurEffect(input))return input;
 const src=clone(input);
 const family=FAMILIES_BY_ID.get(originalId(src));
 const rules=src.system?.rules;
 if(!Array.isArray(rules))return input;
 const desc=String(src.system?.description?.value??'').replace(/<[^>]+>/gu,' ');
 const some=(f)=>rules.some(f);
 const add=(r,match)=>addRule(rules,r,match);
 const newRule=(key,fields)=>({key,...fields});
 const targetSpeed=Number(desc.match(/бонус\s+состояния\s*\+(\d+)\s*(?:футов\s*)?к\s*(?:вашей\s*)?Скорости/iu)?.[1]);
 const basic=rules.find(r=>r.key==='FlatModifier'&&r.type==='item'&&typeof r.value==='number'&&r.value>0);
 switch(family){
 case 'Preyline':{
  // Old rule granted a +10/+20/+30/+40 status AC bonus, instead of Speed.
  for(const r of rules)if(r.key==='FlatModifier'&&r.selector==='ac'&&r.type==='status'&&[10,20,30,40].includes(r.value))r.selector='all-speeds';
  // This benefit belongs to attacking animals/beasts, not the wearer: adjudicated against the wearer.
  src.system.rules=rules.filter(r=>!(r.key==='FlatModifier'&&r.selector==='attack-roll'&&r.type==='circumstance'&&r.value===2));
  break;
 }
 case 'Longstep':
 case 'Persona':{
  if(Number.isFinite(targetSpeed) && targetSpeed>0)add(speed(targetSpeed),r=>r.key==='FlatModifier'&&r.selector==='all-speeds'&&r.value===targetSpeed);
  break;
 }
 case 'Stonebody':{
  for(const r of rules)if(r.key==='Resistance'&&r.type==='physical'&&!r.exceptions)r.exceptions=['bludgeoning'];
  for(const r of rules)if(r.key==='FlatModifier'&&r.selector==='all-speeds'&&r.value===-10&&r.type==='untyped')delete r.type;
  add(newRule('FlatModifier',{selector:'all-speeds',value:-10,slug:'stonebody-slow'}),r=>r.key==='FlatModifier'&&r.selector==='all-speeds'&&r.value===-10);
  break;
 }
 case 'Panopticon':
 case 'TremorSense':{
  // Their perception bonus is only for specific senses, not every Perception check.
  src.system.rules=rules.filter(r=>!(r.key==='FlatModifier'&&r.selector==='perception'&&r.type==='item'&&r.value===2));
  break;
 }
 case 'FlexJoint':{
  for(const r of rules)if(r.key==='FlatModifier'&&r.selector==='acrobatics'&&r.type==='item'&&!r.predicate){
   r.predicate=[{or:['action:balance','action:tumble-through','action:maneuver-in-flight']}];
  }
  break;
 }
 case 'Cortex':{
  if(!basic)break;
  if(Array.isArray(basic.selector)&&basic.selector.includes('arcana')&&basic.selector.includes('occultism'))basic.selector=['computers','crafting','society'];
  add(newRule('FlatModifier',{selector:'skill-check',predicate:['action:recall-knowledge'],type:'item',value:basic.value,slug:'cortex-knowledge'}),r=>r.key==='FlatModifier'&&r.selector==='skill-check'&&r.predicate?.includes('action:recall-knowledge'));
  add(newRule('AdjustDegreeOfSuccess',{selector:'skill-check',predicate:['action:recall-knowledge'],adjustment:{criticalFailure:'one-degree-better'}}),r=>r.key==='AdjustDegreeOfSuccess'&&r.selector==='skill-check'&&r.adjustment?.criticalFailure==='one-degree-better');
  break;
 }
 case 'Duplex':{
  for(const r of rules)if(r.key==='FlatModifier'&&Array.isArray(r.selector)&&r.selector.includes('int-skill-check'))r.selector=r.selector.map(s=>s==='int-skill-check'?'int-based':s==='wis-skill-check'?'wis-based':s);
  break;
 }
 case 'Hemofury':{
  const base=rules.find(r=>r.key==='FlatModifier'&&r.type==='item'&&Array.isArray(r.selector)&&r.selector.includes('fortitude')&&r.selector.includes('reflex')&&!r.predicate);
  for(const r of rules)if(r.key==='FlatModifier'&&r.type==='item'&&Array.isArray(r.selector)&&r.selector.includes('will')&&r.predicate?.length&&base){r.selector=['fortitude','reflex'];r.value=base.value+1;}
  break;
 }
 case 'Juggernaut':{
  const t=Number(desc.match(/(\d+)\s+временных\s+ОЗ/iu)?.[1]);
  if(Number.isFinite(t)&&t>0)add(newRule('TempHP',{value:t}),r=>r.key==='TempHP');
  for(const r of rules)if(r.key==='FlatModifier'&&Array.isArray(r.selector)&&r.selector.includes('will')&&r.selector.includes('perception')&&r.value===-2&&!r.selector.includes('initiative'))r.selector.push('initiative');
  break;
 }
 case 'Serenity':{
  const base=rules.find(r=>r.key==='FlatModifier'&&r.type==='item'&&Array.isArray(r.selector)&&r.selector.includes('will')&&r.selector.includes('medicine'));
  if(base)add(newRule('FlatModifier',{selector:'will',type:'item',value:base.value+1,predicate:['item:trait:mental'],slug:'serenity-mental'}),r=>r.key==='FlatModifier'&&r.slug==='serenity-mental');
  break;
 }
 case 'Silver Tongue':{
  for(const selector of ['diplomacy','deception','intimidation','performance'])add(newRule('AdjustDegreeOfSuccess',{selector,adjustment:{criticalFailure:'one-degree-better'}}),r=>r.key==='AdjustDegreeOfSuccess'&&r.selector===selector&&r.adjustment?.criticalFailure==='one-degree-better');
  break;
 }
 case 'Scale-Shed':{
  add(newRule('FastHealing',{value:2}),r=>r.key==='FastHealing');
  break;
 }
 }
 return same(src,input)?input:src;
}
export function auditMutagenEffect1616(input){
 return input.filter(i=>i?.type==='effect'&&MUTAGEN_NAME.test(i.name)).map(i=>({id:i._id,name:i.name,family:i.name.match(MUTAGEN_NAME)[1],rules:i.system?.rules?.length??0,
 manual:['Capacitor','Reactive Skin','Panopticon','TremorSense','Warblood','FlexJoint','Persona','Deadweight','Hemofury','Duplex','Dermal-Drake','Scale-Shed','Serenity','Juggernaut','Preyline','Stonebody'].includes(i.name.match(MUTAGEN_NAME)[1])}));
}
/** Return a dot-path update rather than replacing an item, preserving user fields and additional rules. */
export function migration1616UpdateForDocument(doc){
 const source=currentSource(doc);
 if(!isOurEffect(source))return null;
 const patched=patchMutagenEffect1616(source);
 return same(source?.system?.rules??[],patched?.system?.rules??[]) ? null:{'system.rules':patched.system.rules};
}
function primaryGM(){
 const g=globalThis.game;const active=asList(g?.users).filter(u=>u.active&&u.isGM).sort((a,b)=>String(a.id).localeCompare(String(b.id)));
 return Boolean(active[0]&&g.user?.id===active[0].id);
}
export async function migrate1616Copies(){
 const result={scanned:0,updated:0,failed:0};if(!primaryGM())return result;
 const seen=new Set();
 async function visit(doc){if(!doc||seen.has(doc))return;seen.add(doc);result.scanned++;
  const update=migration1616UpdateForDocument(doc);if(!update||typeof doc.update!=='function')return;
  try{await doc.update(update,{render:false,[MOD]:{migration1616:true}});result.updated++;}
  catch(error){result.failed++;console.warn(`[${MOD}] 1.6.16 migration failed for ${doc.name??doc.id}`,error);}
 }
 for(const doc of asList(globalThis.game?.items))await visit(doc);
 for(const actor of asList(globalThis.game?.actors))for(const item of asList(actor?.items))await visit(item);
 for(const scene of asList(globalThis.game?.scenes))for(const token of asList(scene?.tokens)){
  if(token.actorLink===true||token._source?.actorLink===true)continue;
  for(const item of asList((token.actor??token.delta?.syntheticActor)?.items))await visit(item);
 }
 console.info(`[${MOD}] 1.6.16 audit: scanned ${result.scanned}, updated ${result.updated}, failures ${result.failed}`);
 return result;
}
if(globalThis.Hooks?.once)Hooks.once('ready',async()=>{
 const module=globalThis.game?.modules?.get?.(MOD);
 if(module)module.api={...(module.api??{}),migrate1616Copies};
 await migrate1616Copies();
});
