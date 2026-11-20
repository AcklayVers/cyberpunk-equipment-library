import {UNIQUE_PKT_CONTENT_1622} from './data/unique-pkt-content-1622.mjs';
import {uniquePktEconomy1621Identity} from './unique-pkt-economy-1621.mjs';
import {dragoonProtection1630Update,patchDragoonProtection1630Profile} from './dragoon-protection-1630.mjs';
const MOD='cyberpunk-equipment-library',C='cyberpunk-implant-creator';
const rows=new Map(UNIQUE_PKT_CONTENT_1622.map(row=>[row.key,row]));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const values=c=>Array.isArray(c)?c:Array.isArray(c?.contents)?c.contents:typeof c?.values==='function'?[...c.values()]:[];
const sourceOf=d=>d?._source??d?.toObject?.(true)??d??{};
function matchRule(rule,spec){return rule?.key==='FlatModifier'&&same(rule.selector,spec.selector)&&rule.type===spec.type&&(!spec.predicate||same(rule.predicate,spec.predicate));}
function changeRules(rules,spec){return (rules??[]).map(rule=>matchRule(rule,spec)&&rule.value===spec.before?{...rule,value:spec.value}:structuredClone(rule));}
/** Profile override before the installed creator renders canonical metadata. */
export function uniquePktProfile1622(profile,key){
 const p=structuredClone(profile),row=rows.get(key);if(!row)return p;p.bodyHtml=row.bodyHtml;
 if(row.bonus){const s=row.bonus,field=s.scope==='activation'?'activationEffectRulesJson':'rulesJson';p[field]=JSON.stringify(changeRules(JSON.parse(p[field]||'[]'),s));if(row.effectDescription)p.activationEffectDescription=row.effectDescription;}
 if(row.weapon){Object.assign(p,{weaponDamageDice:1,weaponGrade:'paragon',weaponAmmoBaseType:'projectile-ammo',weaponTraits:row.weapon.traits,weaponRange:row.weapon.range});p.traits=(Array.isArray(p.traits)?p.traits:String(p.traits??'').split(/[\n,;]/u)).filter(t=>t.trim()!=='fatal-d12');p.weaponTraitsCustom=String(p.weaponTraitsCustom??'').split(/[\n,;]/u).filter(t=>t.trim()!=='fatal-d12').join(',');const patch=JSON.parse(p.weaponSystemPatchJson||'{}');patch.specific={material:{type:null,grade:null},runes:{potency:0,striking:0,property:[]}};p.weaponSystemPatchJson=JSON.stringify(patch);}
 return patchDragoonProtection1630Profile(p,row.id);
}
function body(html){return String(html??'').split(/<hr\b[^>]*>/iu)[0];}
function stockWeapon(system,row){
 const w=row.weapon;if(!w)return true;
 const special=(system.traits?.value??[]).filter(trait=>/^(?:fatal-|deadly-|boost-|unwieldy$)/u.test(trait));
 return system.damage?.die==='d12'&&system.damage.damageType==='piercing'&&[w.before.dice,w.dice].includes(system.damage.dice)&&[w.before.grade,w.grade].includes(system.grade)&&[w.before.range,w.range].includes(system.range)&&[null,undefined,w.ammoBaseType].includes(system.ammo?.baseType)&&special.every(trait=>w.traits.includes(trait)||(row.key==='iec-91-optional-rail'&&trait==='fatal-d12'));
}
export function patchUniquePktContent1622(input){
 const source=structuredClone(input??{}),identity=uniquePktEconomy1621Identity(source),row=rows.get(identity?.key);
 if(row&&source.flags?.[MOD]?.uniquePktContent1622?.version!=='1.6.22'){
  source.system??={};source.flags??={};let bonusManaged=true;const weaponManaged=stockWeapon(source.system,row);
  if(row.bonus){
   const spec=row.bonus,activation=source.flags[C]?.activation,current=spec.scope==='activation'?activation?.effectRules:source.system.rules;
   bonusManaged=(current??[]).some(rule=>matchRule(rule,spec)&&[spec.before,spec.value].includes(rule.value));
   if(bonusManaged){
    if(spec.scope==='activation'){
     activation.effectRules=changeRules(current,spec);
     if(activation.effectDescription===row.beforeEffectDescription)activation.effectDescription=row.effectDescription;
    }else source.system.rules=changeRules(current,spec);
   }
  }
  if(typeof source.system.description?.value==='string'&&bonusManaged&&weaponManaged){
   let html=source.system.description.value;
   if(body(html)===row.beforeBodyHtml)html=row.bodyHtml+html.slice(row.beforeBodyHtml.length);
   if(row.beforeEffectDescription)html=html.replaceAll(row.beforeEffectDescription,row.effectDescription);
   source.system.description.value=html;
  }
  if(row.weapon&&weaponManaged){
   const s=source.system,w=row.weapon;
   if(s.damage?.dice===w.before.dice)s.damage.dice=w.dice;
   if(s.grade===w.before.grade)s.grade=w.grade;
   if(s.range===w.before.range)s.range=w.range;
   if(s.ammo==null)s.ammo={baseType:w.ammoBaseType,builtIn:false};else if(s.ammo.baseType==null)s.ammo.baseType=w.ammoBaseType;
   // Named technical models retain their explicit economy price instead of adding SF2e's grade valuation.
   if(s.specific==null)s.specific={material:structuredClone(s.material??{type:null,grade:null}),runes:structuredClone(s.runes??{potency:0,striking:0,property:[]})};
   if(Array.isArray(s.traits?.value))s.traits.value=[...new Set([...s.traits.value.filter(trait=>trait!=='fatal-d12'),...w.traits])];
  }
  source.flags[MOD]??={};source.flags[MOD].uniquePktContent1622={version:'1.6.22',key:row.key};
 }
 const protection=dragoonProtection1630Update(source);
 if(protection?.['system.rules'])source.system.rules=protection['system.rules'];
 if(protection?.['system.description.value'])source.system.description.value=protection['system.description.value'];
 if(Array.isArray(source.system?.subitems))source.system.subitems=source.system.subitems.map(patchUniquePktContent1622);
 return source;
}
function difference(before,after){
 const update={};function walk(a,b,path=''){if(same(a,b))return;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)||Array.isArray(b)){update[path]=b;return;}for(const key of new Set([...Object.keys(a),...Object.keys(b)]))walk(a[key],b[key],path?path+'.'+key:key);}walk(before,after);return Object.keys(update).length?update:null;
}
export function uniquePktContent1622Update(document){
 const before=sourceOf(document);
 function needed(s){return(rows.has(uniquePktEconomy1621Identity(s)?.key)&&s.flags?.[MOD]?.uniquePktContent1622?.version!=='1.6.22')||dragoonProtection1630Update(s)||s.system?.subitems?.some?.(needed);}
 return needed(before)?difference(before,patchUniquePktContent1622(before)):null;
}
/** Update live effect rules without changing duration, start time or frequency consumption. */
export function uniquePktActiveEffect1622Update(effect,owner){
 const original=sourceOf(effect),parent=sourceOf(owner),row=rows.get(uniquePktEconomy1621Identity(parent)?.key),spec=row?.bonus;
 if(original.type!=='effect'||!original.flags?.[C]?.activationEffect||spec?.scope!=='activation')return null;
 const ownerRules=parent.flags?.[C]?.activation?.effectRules??[];
 if(!ownerRules.some(rule=>matchRule(rule,spec)&&rule.value===spec.value))return null;
 const updated=structuredClone(original);updated.system.rules=changeRules(updated.system.rules,spec);
 if(updated.system.description?.value===row.beforeEffectDescription)updated.system.description.value=row.effectDescription;
 return difference(original,updated);
}
export async function migrateUniquePktContent1622(){
 const game=globalThis.game,gms=values(game?.users).filter(u=>u.isGM&&u.active).sort((a,b)=>String(a.id).localeCompare(String(b.id))),result={scanned:0,updated:0,effects:0,failed:0};
 if(!game?.user?.isGM||gms[0]?.id!==game.user.id)return result;
 // Cost migration may replace the entire description footer; serialize these two passes.
 await game.modules?.get?.(MOD)?.api?.uniquePktEconomy1621Ready;
 const actors=new Map(values(game.actors).map(a=>[a.uuid??a,a]));for(const scene of values(game.scenes))for(const token of values(scene.tokens))if(!token.actorLink&&token.actor)actors.set(token.actor.uuid??token.actor,token.actor);
 const seen=new Set();for(const item of[...values(game.items),...[...actors.values()].flatMap(a=>values(a.items))]){
  if(seen.has(item.uuid??item))continue;seen.add(item.uuid??item);result.scanned++;const update=uniquePktContent1622Update(item);if(!update||!item.update)continue;
  try{await item.update(update,{[MOD]:{migration1622:true}});result.updated++;}catch(error){result.failed++;console.error('['+MOD+']1.6.22 content',error);}
 }
 for(const actor of actors.values())for(const effect of values(actor.items)){
  const sourceId=sourceOf(effect).flags?.[C]?.activationSourceItemId;if(!sourceId)continue;
  const owner=values(actor.items).find(d=>(d.id??d._id??sourceOf(d)._id)===sourceId);if(!owner)continue;
  const update=uniquePktActiveEffect1622Update(effect,owner);if(!update||!effect.update)continue;
  try{await effect.update(update,{[MOD]:{migration1622:true}});result.effects++;}catch(error){result.failed++;console.error('['+MOD+']1.6.22 active effect',error);}
 }
 if(result.updated||result.effects||result.failed)console.info('['+MOD+']1.6.22',result);return result;
}
if(globalThis.Hooks?.on)Hooks.on('preCreateItem',(document,data)=>{
 const current=sourceOf(document),input=Object.keys(current).length?current:data,update=uniquePktContent1622Update(input);if(update)document.updateSource(update);
});
if(globalThis.Hooks?.once)Hooks.once('ready',async()=>{const module=globalThis.game?.modules?.get?.(MOD);if(module)module.api={...(module.api??{}),migrateUniquePktContent1622};await migrateUniquePktContent1622();});
