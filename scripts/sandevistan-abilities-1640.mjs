import {SANDY_CONTENT_1640,SANDY_PRESENTATION_1641} from './data/implant-expansion-1640.mjs';
import {ownSandevistan1640} from './sandevistan-recovery-1640.mjs';

const MOD='cyberpunk-equipment-library',CIC='cyberpunk-implant-creator',REM='cyberpunk-remaster';
const values=x=>Array.isArray(x)?x:[...(x?.values?.()??[])];
const raw=x=>x?._source??x?.toObject?.(true)??x??{};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const get=(x,p)=>p.split('.').reduce((a,k)=>a?.[k],x);
const report=e=>console.error('['+MOD+'] способности Сандевистанов',e);
const warn=s=>globalThis.ui?.notifications?.warn?.(s);
const opts={render:false,cpelSandy1640:true};
const locks=new Map();
const gm=()=>values(globalThis.game?.users).filter(u=>u.active&&u.isGM).sort((a,b)=>String(a.id).localeCompare(String(b.id)))[0];
const authority=actor=>(gm()??actor?.primaryUpdater)?.id===game.user.id;
const roundKey=()=>game.combat?`${game.combat.id}:${game.combat.round??0}`:`world:${Math.floor(Number(game.time?.worldTime??0)/6)}`;
const expired=e=>e?.isExpired===true||e?.system?.expired===true;
function serial(actor,task){const previous=locks.get(actor.uuid)??Promise.resolve(),next=previous.then(task);locks.set(actor.uuid,next.catch(report));return next;}
function rowFor(item){
 if(!ownSandevistan1640(item))return null;
 const s=raw(item),refs=[s._stats?.compendiumSource,s.flags?.core?.sourceId,s._stats?.duplicateSource];
 return SANDY_CONTENT_1640.items.find(r=>r.before._id===s._id||refs.includes(`Compendium.${MOD}.implants.Item.${r.before._id}`));
}
export function installedSandevistan1640(item){
 if(!rowFor(item)||item.isBroken||item.isDestroyed)return false;
 const f=item.flags?.[REM]??{},s=item.system??{};
 if(f.installed!==true||f.disabled||f.suppressed)return false;
 if(Number(s.hp?.max)>0&&Number(s.hp.value)<=Math.floor(Number(s.hp.max)/2))return false;
 const api=game.modules.get(REM)?.api?.CyberwareTab;
 return typeof api?.isInstalled==='function'?api.isInstalled(item):s.equipped?.carryType==='implanted';
}
export function activeSandevistan1640(item){
 const actor=item?.actor??item?.parent;
 return installedSandevistan1640(item)&&values(actor?.items).some(e=>e.type==='effect'&&e.flags?.[CIC]?.activationEffect===true&&e.flags[CIC].activationSourceItemId===item.id&&(!e.flags[CIC].activationSourceUuid||e.flags[CIC].activationSourceUuid===item.uuid)&&!expired(e));
}
export function sandyAbilityMeta1640(item){
 const m=item?.flags?.[MOD]?.sandyAbility1640;
 if(m?.provider!==MOD||!['action','effect'].includes(m.kind)||item?.type!==m.kind)return null;
 const d=SANDY_CONTENT_1640.abilities.find(a=>a.key===m.key&&a.sourceId===m.sourceId);
 return d?{...d,kind:m.kind,sourceItemId:m.sourceItemId,generated:m.generated}:null;
}
export function sandevistan1640Update(item){
 const row=rowFor(item),s=raw(item);if(!row||s.flags?.[MOD]?.sandy1640Migrated==='1.6.40')return sandyPresentation1641Update(item);
 const out={};
 for(const path of ['system.description.value',`flags.${CIC}.activation`]){
  const current=get(s,path),before=get(row.before,path),after=get(row.after,path);
  if(same(current,before)||current===undefined)out[path]=structuredClone(after);
  else if(path.endsWith('.activation')&&current&&before){
   for(const [key,value]of Object.entries(after))if(same(current[key],before[key])||current[key]===undefined)out[path+'.'+key]=structuredClone(value);
  }
 }
 for(const scope of [CIC,REM])for(const [key,value]of Object.entries(row.after.flags?.[scope]??{})){
  if(key==='activation'||key==='installed')continue;
  if(s.flags?.[scope]?.[key]===undefined)out[`flags.${scope}.${key}`]=structuredClone(value);
 }
 out[`flags.${MOD}.sandy1640Migrated`]='1.6.40';return {...out,...sandyPresentation1641Update(item)};
}
export function sandyPresentation1641Update(item){
 const s=raw(item);if(s.flags?.[MOD]?.sandyPresentation1641==='1.6.41')return {};
 const source=rowFor(item),meta=sandyAbilityMeta1640(item),id=source?.after._id??(meta?.kind==='action'?meta.actionId:meta?.effectId);
 const row=SANDY_PRESENTATION_1641.find(r=>r.id===id&&r.type===s.type);if(!row)return {};
 const patch={};for(const [path,value]of Object.entries(row.after))if(same(get(s,path),row.before[path])||(path==='system.selfEffect'&&value===null&&get(s,path)?.uuid===row.before[path]?.uuid))patch[path]=structuredClone(value);
 patch[`flags.${MOD}.sandyPresentation1641`]='1.6.41';return patch;
}
function sourceFor(actor,meta,origin=null){
 if(meta.sourceItemId){const source=actor.items.get(meta.sourceItemId);return rowFor(source)?.after._id===meta.sourceId?source:null;}
 if(origin){const action=values(actor.items).find(i=>i.uuid===origin);const m=sandyAbilityMeta1640(action);if(m?.key===meta.key&&m.sourceItemId)return sourceFor(actor,m);}
 return values(actor.items).find(i=>rowFor(i)?.after._id===meta.sourceId&&installedSandevistan1640(i));
}
function used(actor,source,key){return actor.flags?.[MOD]?.sandy1640Uses?.[source.id]?.[key]===roundKey();}
function effects(actor,source,key){return values(actor.items).filter(e=>{const m=sandyAbilityMeta1640(e);return m?.kind==='effect'&&m.sourceItemId===source.id&&(!key||m.key===key);});}

export function prepareSandyEffect1640(item){
 const meta=sandyAbilityMeta1640(item),actor=item.parent;if(!meta||meta.kind!=='effect'||!actor?.items)return;
 if(!meta.hasAcEffect)return false;
 const origin=item.system?.context?.origin;
 if(origin?.actor&&origin.actor!==actor.uuid){warn('Эта способность Сандевистана применяется только к владельцу.');return false;}
 const source=sourceFor(actor,meta,origin?.item);
 if(!source||!activeSandevistan1640(source)){warn('Сначала включите основной режим установленного Сандевистана.');return false;}
 if(used(actor,source,meta.key)||effects(actor,source,meta.key).some(e=>!expired(e))){warn('Эта способность уже использована в текущем раунде.');return false;}
 item.updateSource({[`flags.${MOD}.sandyAbility1640.sourceItemId`]:source.id,[`flags.${MOD}.sandyAbility1640.generated`]:true,[`flags.${MOD}.sandyAbility1640.roundKey`]:roundKey(),'system.start.value':Number(game.time?.worldTime??0),'system.start.initiative':actor.combatant?.initiative??null});
}
async function recordEffect(item){
 const meta=sandyAbilityMeta1640(item),actor=item.parent;if(meta?.kind!=='effect'||!actor?.isOwner||!authority(actor))return;
 await serial(actor,async()=>{
  const source=sourceFor(actor,meta);if(!source||!activeSandevistan1640(source)){await item.delete(opts);return;}
  const matches=effects(actor,source,meta.key).filter(e=>!expired(e)).sort((a,b)=>(a._stats?.createdTime??0)-(b._stats?.createdTime??0)||String(a.id).localeCompare(String(b.id)));
  if(matches[0]?.id!==item.id){await item.delete(opts);return;}
  await actor.update({[`flags.${MOD}.sandy1640Uses.${source.id}.${meta.key}`]:roundKey()},opts);
  const action=values(actor.items).find(i=>{const m=sandyAbilityMeta1640(i);return m?.kind==='action'&&m.generated&&m.sourceItemId===source.id&&m.key===meta.key;});
  if(action?.system?.frequency?.value!==0)await action?.update({'system.frequency.value':0},opts);
 });
}
async function syncActor(actor){
 if(!actor?.items||!authority(actor))return;
 return serial(actor,async()=>{
  for(const item of values(actor.items))if(sandyAbilityMeta1640(item)?.kind==='action'){
   const patch=sandyPresentation1641Update(item);if(Object.keys(patch).length)await item.update(patch,opts);
  }
  for(const item of values(actor.items).filter(ownSandevistan1640)){
   const patch=sandevistan1640Update(item);if(Object.keys(patch).length)await item.update(patch,opts);
   const row=rowFor(item),beforeRules=row.before.flags?.[CIC]?.activation?.effectRules,afterRules=row.after.flags[CIC].activation.effectRules;
   if(beforeRules&&!same(beforeRules,afterRules))for(const e of values(actor.items)){
    if(e.type==='effect'&&e.flags?.[CIC]?.activationEffect===true&&e.flags[CIC].activationSourceItemId===item.id&&same(raw(e).system?.rules,beforeRules))await e.update({'system.rules':structuredClone(afterRules)},opts);
   }
   const presentation=SANDY_PRESENTATION_1641.find(r=>r.id===row.after._id),descriptionPath=`flags.${CIC}.activation.effectDescription`;
   if(presentation?.after[descriptionPath])for(const effect of values(actor.items)){
    if(effect.type==='effect'&&effect.flags?.[CIC]?.activationEffect===true&&effect.flags[CIC].activationSourceItemId===item.id&&effect.system?.description?.value===presentation.before[descriptionPath])await effect.update({'system.description.value':presentation.after[descriptionPath]},opts);
   }
   if(!installedSandevistan1640(item))continue;
   for(const ability of SANDY_CONTENT_1640.abilities.filter(a=>a.sourceId===row.after._id)){
    const existing=values(actor.items).find(i=>{const m=sandyAbilityMeta1640(i);return m?.kind==='action'&&m.generated&&m.sourceItemId===item.id&&m.key===ability.key;});
    const remaining=used(actor,item,ability.key)?0:1;
    if(existing){if(existing.system.frequency?.value!==remaining)await existing.update({'system.frequency.value':remaining},opts);continue;}
    const source=structuredClone(ability.action);delete source._id;delete source.folder;
    source.flags[MOD].sandyAbility1640={...source.flags[MOD].sandyAbility1640,sourceItemId:item.id,generated:true};source.system.frequency.value=remaining;
    await actor.createEmbeddedDocuments('Item',[source],opts);
   }
  }
  const remove=[];
  for(const item of values(actor.items)){
   const m=sandyAbilityMeta1640(item);if(!m?.generated)continue;
   const source=sourceFor(actor,m);
   if(!source||!installedSandevistan1640(source)||(m.kind==='effect'&&((!m.hasAcEffect&&!raw(item).system?.rules?.length)||!activeSandevistan1640(source)||expired(item))))remove.push(item.id);
   else if(m.kind==='effect'){const patch=sandyPresentation1641Update(item);if(Object.keys(patch).length)await item.update(patch,opts);}
  }
  if(remove.length)await actor.deleteEmbeddedDocuments('Item',remove,opts);
 });
}
function actors(){const map=new Map(values(game.actors).map(a=>[a.uuid,a]));for(const scene of values(game.scenes))for(const t of values(scene.tokens))if(!t.actorLink&&t.actor)map.set(t.actor.uuid,t.actor);return [...map.values()];}
async function syncAll(){for(const actor of actors())await syncActor(actor);}
async function migrateWorldSources(){
 if(gm()?.id!==game.user.id)return;
 for(const item of values(game.items)){const patch=sandevistan1640Update(item);if(Object.keys(patch).length)await item.update(patch,opts);}
}
export async function activateSandyAbility1640(action){
 const m=sandyAbilityMeta1640(action),actor=action?.actor??action?.parent;if(m?.kind!=='action'||!actor?.isOwner)return false;
 const source=sourceFor(actor,m);if(!source||!activeSandevistan1640(source)||used(actor,source,m.key)){
  // Native useAction spends its frequency before posting its self-effect card.
  // An unavailable mode must not consume an otherwise unused auxiliary ability.
  if(source&&!used(actor,source,m.key)&&action.system.frequency?.value===0)await action.update({'system.frequency.value':1},opts);
  warn('Способность недоступна: проверьте основной режим и расход за раунд.');return false;
 }
 if(!m.hasAcEffect){
  await actor.update({[`flags.${MOD}.sandy1640Uses.${source.id}.${m.key}`]:roundKey()},opts);
  if(action.system.frequency?.value!==0)await action.update({'system.frequency.value':0},opts);
  return true;
 }
 const effect=structuredClone(m.effect);delete effect._id;delete effect.folder;
 effect.flags[MOD].sandyAbility1640={...effect.flags[MOD].sandyAbility1640,sourceItemId:source.id,generated:true};
 const created=await actor.createEmbeddedDocuments('Item',[effect],{...opts,render:true});return Boolean(created?.length);
}
export async function finishSandyAbility1640(effect){
 const m=sandyAbilityMeta1640(effect),actor=effect?.actor??effect?.parent;
 if(m?.kind!=='effect'||!m.generated||!actor?.isOwner)return false;
 await effect.delete({...opts,render:true});return true;
}
async function recordNativeAbilityUse(item,changes,options){
 const m=sandyAbilityMeta1640(item),actor=item.parent;
 const value=changes['system.frequency.value']??changes.system?.frequency?.value??changes['system.frequency']?.value;
 if(m?.kind!=='action'||!m.generated||m.hasAcEffect||value!==0||options?.cpelSandy1640||!authority(actor))return;
 await serial(actor,async()=>{
  const source=sourceFor(actor,m);if(!source)return;
  if(!activeSandevistan1640(source)){
   if(!used(actor,source,m.key))await item.update({'system.frequency.value':1},opts);
   return;
  }
  await actor.update({[`flags.${MOD}.sandy1640Uses.${source.id}.${m.key}`]:roundKey()},opts);
  if(item.system.frequency?.value!==0)await item.update({'system.frequency.value':0},opts);
 });
}
if(globalThis.Hooks?.on){
 Hooks.on('preCreateItem',item=>{
  if(sandyAbilityMeta1640(item)){const patch=sandyPresentation1641Update(item);if(Object.keys(patch).length)item.updateSource(patch);}
  if(item.type==='effect')return prepareSandyEffect1640(item);
  if(ownSandevistan1640(item)){const patch=sandevistan1640Update(item);if(Object.keys(patch).length)item.updateSource(patch);}
 });
 Hooks.on('createItem',(item,_options,userId)=>{
  if(item.type==='effect'&&sandyAbilityMeta1640(item))recordEffect(item).catch(report);
  if(ownSandevistan1640(item)&&item.parent?.items)syncActor(item.parent).catch(report);
 });
 for(const hook of ['updateItem','deleteItem'])Hooks.on(hook,(item,_changes,options)=>{
  if(_changes?.cpelSandy1640||options?.cpelSandy1640)return;
  const linked=item.flags?.[CIC]?.activationEffect===true?item.parent?.items?.get?.(item.flags[CIC].activationSourceItemId):null;
  if((ownSandevistan1640(item)||ownSandevistan1640(linked))&&item.parent?.items)syncActor(item.parent).catch(report);
 });
 Hooks.on('createChatMessage',(message,_options,userId)=>{
  if(userId!==game.user.id||!message.actor?.isOwner)return;
  const context=message.flags?.sf2e?.context,action=message.item;
  const meta=sandyAbilityMeta1640(action);
  if(context?.type==='self-effect'&&context.item===action?.id&&meta?.kind==='action'&&meta.hasAcEffect)activateSandyAbility1640(action).catch(report);
 });
 Hooks.on('updateItem',(item,changes,options)=>recordNativeAbilityUse(item,changes,options).catch(report));
 Hooks.on('updateWorldTime',()=>syncAll().catch(report));Hooks.on('updateCombat',()=>syncAll().catch(report));Hooks.on('deleteCombat',()=>syncAll().catch(report));
 Hooks.once('ready',()=>{const module=game.modules.get(MOD);if(module)module.api={...(module.api??{}),activateSandyAbility1640,finishSandyAbility1640};migrateWorldSources().then(syncAll).catch(report);});
}
