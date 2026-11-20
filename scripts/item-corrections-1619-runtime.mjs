/** Foundry integration for the 1.6.19 corrections. No Node dependencies. */
import {MODULE_1619 as MOD,CREATOR_1619 as CREATOR,correction1619Identity,correction1619Update,patch1619Source} from './item-corrections-1619.mjs';
const values=c=>Array.isArray(c?.contents)?c.contents:typeof c?.values==='function'?[...c.values()]:[...(c??[])];
const source=d=>d?._source??d?.toObject?.(true)??d??{};
const meta=d=>source(d).flags?.[MOD]??{};
const creator=d=>source(d).flags?.[CREATOR]??{};
const find=(actor,id)=>values(actor?.items).find(d=>(d.id??d._id)===id);
const installed=d=>source(d).flags?.['cyberpunk-remaster']?.installed===true||source(d).system?.equipped?.carryType==='implanted';
const actorOf=d=>d?.actor??(d?.parent?.items?d.parent:null);
const locks=new Set();
const internally={render:false,[MOD]:{migration1619:true}};
function same(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function liveEffect(actor,item){return values(actor?.items).find(d=>d.type==='effect'&&creator(d).activationEffect===true&&creator(d).activationSourceItemId===(item.id??item._id)&&!d.system?.expired&&!d.isExpired);}
function permission(actor,userId){return actor?.isOwner!==false&&(!userId||!globalThis.game?.user?.id||userId===game.user.id);}
function serviceSource(item,effect,kind){
 const name=kind==='renew'?'Панцирь — Обновить пластины':'Панцирь — Прикрыться бронёй';
 return {name,type:'action',img:item.img,system:{actionType:{value:'action'},actions:{value:1},category:'defensive',traits:{value:[]},description:{value:kind==='renew'?'<p>Пока активна Осадная геометрия: вновь получите 10 временных ОЗ. Они не складываются и не заменяют больший запас.</p>':'<p>Пока активна Осадная геометрия: +2 обстоятельства к КБ до начала вашего следующего хода.</p>'}},flags:{[MOD]:{release1619Action:kind,sourceItemId:item.id??item._id,activationEffectId:effect.id??effect._id}}};
}
export async function sync1619Carapace(actor){
 if(!actor||!permission(actor)||locks.has(actor))return false;locks.add(actor);
 try{
  const items=values(actor.items),sources=items.filter(d=>correction1619Identity(source(d))?.special==='carapace'&&installed(d));
  const active=new Map(sources.map(d=>[d.id??d._id,liveEffect(actor,d)]).filter(([,effect])=>effect));
  const remove=[];
  for(const d of items){const f=meta(d);if((f.release1619Action||f.release1619Cover)&&(!active.has(f.sourceItemId)||(f.activationEffectId&&f.activationEffectId!==(active.get(f.sourceItemId).id??active.get(f.sourceItemId)._id))))remove.push(d.id??d._id);}
  if(remove.length)await actor.deleteEmbeddedDocuments('Item',remove,internally);
  let changed=remove.length>0;
  for(const item of sources){const effect=active.get(item.id??item._id);if(!effect)continue;
   for(const kind of ['renew','cover']){
    const old=values(actor.items).filter(d=>meta(d).release1619Action===kind&&meta(d).sourceItemId===(item.id??item._id));
    if(old.length>1){await actor.deleteEmbeddedDocuments('Item',old.slice(1).map(d=>d.id??d._id),internally);changed=true;}
    if(!old.length){await actor.createEmbeddedDocuments('Item',[serviceSource(item,effect,kind)],internally);changed=true;}
   }
  }
  return changed;
 }finally{locks.delete(actor);}
}
export async function process1619Activation(effect,_options={},userId=null){
 const actor=actorOf(effect),f=creator(effect);
 if(effect?.type!=='effect'||f.activationEffect!==true||!permission(actor,userId))return false;
 const item=find(actor,f.activationSourceItemId),kind=correction1619Identity(source(item))?.special;
 if(!item||!installed(item))return false;
 if(kind==='carapace')return sync1619Carapace(actor);
 let ids=[];
 if(kind==='flywheel')ids=values(actor.items).filter(d=>d.type==='condition'&&d.system?.slug==='glitching').map(d=>d.id??d._id);
 if(kind==='cryo')ids=values(actor.items).filter(d=>d.type==='condition'&&d.system?.slug==='persistent-damage'&&d.system?.persistent?.damageType==='fire').map(d=>d.id??d._id);
 if(ids.length)await actor.deleteEmbeddedDocuments('Item',ids,internally);
 return ids.length>0;
}
export async function use1619CarapaceAction(action){
 const f=meta(action),actor=actorOf(action),item=find(actor,f.sourceItemId),effect=item&&liveEffect(actor,item);
 if(!['renew','cover'].includes(f.release1619Action)||!permission(actor)||!item||!installed(item)||correction1619Identity(source(item))?.special!=='carapace'||!effect||(f.activationEffectId&&f.activationEffectId!==(effect.id??effect._id)))return false;
 if(f.release1619Action==='renew'){
  const current=Number(actor.system?.attributes?.hp?.temp??0);if(current<10)await actor.update({'system.attributes.hp.temp':10,'system.attributes.hp.tempSource':effect.id??effect._id},internally);return true;
 }
 const old=values(actor.items).filter(d=>meta(d).release1619Cover&&meta(d).sourceItemId===f.sourceItemId);
 const start={value:globalThis.game?.time?.worldTime??0,initiative:actor.combatant?.initiative??null};
 if(old.length){await old[0].update({'system.start':start},internally);if(old.length>1)await actor.deleteEmbeddedDocuments('Item',old.slice(1).map(d=>d.id??d._id),internally);return true;}
 await actor.createEmbeddedDocuments('Item',[{name:'Панцирь — Прикрыться бронёй',type:'effect',img:item.img,system:{level:{value:1},description:{value:'Бонус обстоятельства +2 к КБ до начала вашего следующего хода.'},duration:{value:1,unit:'rounds',expiry:'turn-start',sustained:false},start,tokenIcon:{show:true},rules:[{key:'FlatModifier',selector:'ac',type:'circumstance',value:2}]},flags:{[MOD]:{release1619Cover:true,sourceItemId:f.sourceItemId,activationEffectId:effect.id??effect._id}}}],internally);return true;
}
function merge(target,changes){
 for(const [path,value]of Object.entries(changes)){const keys=path.split('.');let cursor=target;for(const key of keys.slice(0,-1))cursor=cursor[key]??={};const key=keys.at(-1);if(value&&typeof value==='object'&&!Array.isArray(value)&&cursor[key]&&typeof cursor[key]==='object'&&!Array.isArray(cursor[key]))merge(cursor[key],value);else cursor[key]=structuredClone(value);}
 return target;
}
function writeChange(changes,path,value){
 const parts=path.split('.');for(let n=parts.length;n>0;n--){const prefix=parts.slice(0,n).join('.');if(Object.hasOwn(changes,prefix)){if(n===parts.length)changes[prefix]=structuredClone(value);else merge(changes[prefix],{[parts.slice(n).join('.')]:value});return;}}
 changes[path]=structuredClone(value);
}
export function normalize1619LegacyUpdate(document,changes,options={}){
 const own=options[MOD]??{};if(own.migration1619||!Object.keys(own).some(k=>/migration/iu.test(k)))return false;
 const merged=merge(structuredClone(source(document)),changes),update=correction1619Update(merged);if(!update)return false;
 for(const [path,value]of Object.entries(update))writeChange(changes,path,value);return true;
}
function primaryGM(){const gms=values(globalThis.game?.users).filter(u=>u.active&&u.isGM).sort((a,b)=>String(a.id).localeCompare(String(b.id)));return gms[0]?.id===globalThis.game?.user?.id;}
function allActors(){const result=new Map();for(const actor of values(globalThis.game?.actors))result.set(actor.uuid??actor,actor);for(const scene of values(globalThis.game?.scenes))for(const token of values(scene.tokens))if(!token.actorLink&&token.actor)result.set(token.actor.uuid??token.actor,token.actor);return [...result.values()];}
async function migrateItem(item){const update=correction1619Update(item);if(!update||!item.update)return false;await item.update(update,internally);return true;}
async function migrateActiveEffects(actor){
 let n=0;for(const effect of values(actor.items)){
  const f=creator(effect);if(effect.type!=='effect'||!f.activationEffect)continue;
  const item=find(actor,f.activationSourceItemId),row=correction1619Identity(source(item));if(!row?.before?.activation)continue;
  const activation=source(item).flags?.[CREATOR]?.activation;if(!activation||same(activation.effectRules,row.before.activation.effectRules))continue;
  const current=source(effect).system?.rules??[],old=row.before.activation.effectRules??[],newRules=activation.effectRules??[];
  // Replace only stock rule elements from this activation; keep additional house rules.
  const extras=current.filter(r=>!old.some(x=>same(x,r))&&!newRules.some(x=>same(x,r))),rules=[...newRules,...extras];
  if(!same(current,rules)){await effect.update({'system.rules':rules},internally);n++;}
 }return n;
}
export async function migrate1619Copies(){
 if(!primaryGM())return 0;let count=0;const actors=allActors(),seen=new Set();
 for(const item of [...values(globalThis.game?.items),...actors.flatMap(a=>values(a.items))]){
  const key=item.uuid??item;if(seen.has(key))continue;seen.add(key);
  try{if(await migrateItem(item))count++;}catch(error){console.error('['+MOD+'] 1.6.19 item migration failed: '+(item.name??item.id),error);}
 }
 for(const actor of actors){count+=await migrateActiveEffects(actor);await sync1619Carapace(actor);}
 if(count)console.info('['+MOD+'] 1.6.19: обновлено предметов и эффектов: '+count);return count;
}
export async function handle1619ActionMessage(message,_options={},userId=null){
 if(userId&&globalThis.game?.user?.id&&userId!==game.user.id)return false;
 const uuid=message?.flags?.sf2e?.origin?.uuid??message?.flags?.pf2e?.origin?.uuid;if(typeof uuid!=='string'||typeof globalThis.fromUuid!=='function')return false;
 const action=await fromUuid(uuid);if(!meta(action).release1619Action)return false;return use1619CarapaceAction(action);
}
function report(error){console.error('['+MOD+'] 1.6.19 runtime',error);}
export async function reconcile1619Actors(){if(!primaryGM())return;for(const actor of allActors())await sync1619Carapace(actor);}
if(globalThis.Hooks?.on){
 Hooks.on('preCreateItem',(document)=>{
  // EffectPF2e._preCreate has already initialized start/badge/rule choices on
  // _source. Never replay the original creation payload over that state.
  if(!['equipment','weapon','armor','ammo'].includes(document.type))return;
  const update=correction1619Update(source(document));
  if(update)document.updateSource(update);
 });
 Hooks.on('preUpdateItem',(document,changes,options)=>{normalize1619LegacyUpdate(document,changes,options);});
 Hooks.on('createItem',(item,options={},userId=null)=>{
  if(!permission(actorOf(item),userId))return;
  (async()=>{await migrateItem(item);if(!options?.[MOD]?.migration1619)await process1619Activation(item,options,userId);})().catch(report);
 });
 Hooks.on('updateItem',(item,_changes,_options,userId)=>{const actor=actorOf(item);if(actor&&permission(actor,userId)&&(correction1619Identity(source(item))?.special==='carapace'||creator(item).activationEffect))sync1619Carapace(actor).catch(report);});
 Hooks.on('deleteItem',(item,_options,userId)=>{const actor=actorOf(item);if(actor&&permission(actor,userId)&&(creator(item).activationEffect||correction1619Identity(source(item))?.special==='carapace'))sync1619Carapace(actor).catch(report);});
 Hooks.on('createChatMessage',(message,options,userId)=>handle1619ActionMessage(message,options,userId).catch(report));
 Hooks.on('updateWorldTime',()=>reconcile1619Actors().catch(report));
 Hooks.on('updateCombat',()=>reconcile1619Actors().catch(report));
}
if(globalThis.Hooks?.once)Hooks.once('ready',()=>migrate1619Copies().catch(report));
