import {ICON_MIGRATION_CATALOG as catalog} from './item-image-migration-data.mjs';
import {LEGACY_ICON_FALLBACKS as fallbacks} from './item-image-migration-fallbacks.mjs';
const MOD='cyberpunk-equipment-library';
const PREFIX='modules/'+MOD+'/assets/icons/';
const byKey=new Map(catalog.map(row=>[row.key,row]));
const currentImages=new Set([...catalog.map(row=>row.img),...Object.values(fallbacks)]);
const byId=new Map(),byName=new Map(),bySourceKey=new Map(),bySourceUuid=new Map(),byLegacy=new Map();
const own=(object,key)=>Object.prototype.hasOwnProperty.call(object??{},key);
const clone=value=>globalThis.foundry?.utils?.deepClone?foundry.utils.deepClone(value):structuredClone(value);
const asList=value=>Array.isArray(value?.contents)?value.contents:Array.isArray(value)?value:typeof value?.values==='function'?[...value.values()]:[];
const sourceOf=doc=>doc?._source??doc?.toObject?.(true)??doc??{};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
// The activation module keeps a separate portrait of the granting item. It is
// not the effect's own artwork and must be resolved using its own provenance.
const ORIGIN_PATHS=['flags.pf2e-item-activations.grantedBy','flags.sf2e.origin','flags.pf2e.origin','system.context.origin'];
const at=(object,path)=>path.split('.').reduce((value,key)=>value?.[key],object);
function uri(value){
 if(typeof value!=='string')return '';
 let text=value.trim().replaceAll('\\','/').split(/[?#]/,1)[0];
 try{text=decodeURI(text);}catch{}
 const start=text.indexOf('/'+PREFIX);
 return start>=0?text.slice(start+1):text.replace(/^(?:\.\/|\/)+/,'');
}
const libraryImage=value=>uri(value).startsWith(PREFIX);
const nameKey=source=>String(source?.type??'')+':'+String(source?.name??'').normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase('ru');
function add(index,key,row){if(!key)return;if(!index.has(key))index.set(key,[]);index.get(key).push(row);}
for(const row of catalog){
 add(byId,row.key.split(':')[1],row);add(byName,nameKey(row),row);add(bySourceKey,row.sourceKey,row);
 for(const ref of Array.isArray(row.sourceUuids)?row.sourceUuids:[])if(typeof ref==='string'&&ref)add(bySourceUuid,ref,row);
 for(const old of row.legacy)if(libraryImage(old))add(byLegacy,uri(old),row);
}
function uniqueImage(rows,trusted=false){
 if(!rows?.length||new Set(rows.map(row=>row.img)).size!==1)return null;
 return {...rows[0],key:rows.length===1?rows[0].key:null,trusted};
}
function sourceRefs(source){
 return [...new Set([source?._stats?.compendiumSource,source?._stats?.duplicateSource,source?.flags?.core?.sourceId,source?.sourceId,source?.flags?.[MOD]?.neonForge?.sourceUuid].filter(ref=>typeof ref==='string'&&ref))];
}
function identity(source,parent=null){
 if(parent?.key){
  const [pack,id]=parent.key.split(':');
  const entry=byKey.get(pack+':'+(source._id??source.id)+':'+id);
  if(entry)return {...entry,trusted:true};
 }
 const refs=sourceRefs(source);
 for(const ref of refs){
  const alias=uniqueImage(bySourceUuid.get(ref),true);
  if(alias)return alias;
  const p=ref.split('.');
  if(p[0]!=='Compendium'||p[1]!==MOD)continue;
  const pack=p[2],id=p[3]==='Item'?p[4]:p[3],child=p[3]==='Item'&&p[5]==='Item'?p[6]:null;
  const entry=byKey.get(child?pack+':'+child+':'+id:pack+':'+id+':');
  if(entry)return {...entry,trusted:true};
 }
 const marker=uniqueImage(bySourceKey.get(source?.flags?.world?.neonForgeArsenal?.sourceKey),true);
 if(marker)return marker;
 // Other compendia and world copies can reuse both a Foundry ID and a name.
 // An existing source must resolve explicitly; image-only aliases remain safe below.
 if(refs.length)return null;
 const direct=uniqueImage(byId.get(source._id??source.id),true);
 if(direct)return direct;
 if(libraryImage(source.img)){
  const names=byName.get(nameKey(source));
  const level=Number(source.system?.level?.value);
  const precise=Number.isFinite(level)?uniqueImage(names?.filter(row=>Number(row.level)===level)):null;
  return precise??uniqueImage(names)??uniqueImage(byLegacy.get(uri(source.img)));
 }
 return null;
}
function image(value,owner,allowExternal=false){
 if(typeof value!=='string'||currentImages.has(uri(value)))return value;
 if(libraryImage(value))return owner?.img??uniqueImage(byLegacy.get(uri(value)))?.img??fallbacks[uri(value)]??value;
 if(allowExternal&&owner?.trusted&&owner.legacy.some(old=>uri(old)===uri(value)))return owner.img;
 return value;
}
function rulesImages(rules,owner){
 if(!Array.isArray(rules))return;
 for(const rule of rules)if(['TokenIcon','TokenEffectIcon'].includes(rule?.key))rule.value=image(rule.value,owner,true);
}
function originImages(origin){
 if(!origin||typeof origin!=='object'||Array.isArray(origin))return origin;
 if(own(origin,'img'))origin.img=image(origin.img,identity(origin),true);
 if(origin.item&&typeof origin.item==='object'&&!Array.isArray(origin.item))originImages(origin.item);
 return origin;
}
function patch(source,parent=null){
 if(!source||typeof source!=='object')return source;
 const entry=identity(source,parent);
 if(own(source,'img'))source.img=image(source.img,entry,true);
 const owner=entry&&currentImages.has(uri(source.img))?{...entry,img:uri(source.img)}:entry;
 rulesImages(source.system?.rules,owner);
 const activation=source.flags?.['cyberpunk-implant-creator']?.activation;
 if(activation&&own(activation,'effectImg'))activation.effectImg=image(activation.effectImg,owner,true);
 for(const path of ORIGIN_PATHS)originImages(at(source,path));
 for(const child of source.system?.subitems??[])patch(child,entry);
 return source;
}
/** Pure visual migration: every statistic, identifier, custom flag, and description is preserved. */
export function migrateIconSource(source){return patch(clone(source));}
function updateFor(original,changed){
 const update={};
 if(changed.img!==original.img)update.img=changed.img;
 for(const key of ['rules','subitems'])if(!same(original.system?.[key],changed.system?.[key]))update['system.'+key]=changed.system[key];
 const before=original.flags?.['cyberpunk-implant-creator']?.activation?.effectImg;
 const after=changed.flags?.['cyberpunk-implant-creator']?.activation?.effectImg;
 if(before!==after)update['flags.cyberpunk-implant-creator.activation.effectImg']=after;
 for(const path of ORIGIN_PATHS)for(const field of ['img','item.img']){
  const full=path+'.'+field,previous=at(original,full),next=at(changed,full);
  if(previous!==next)update[full]=next;
 }
 return Object.keys(update).length?update:null;
}
export function imageMigrationUpdate(document){
 const original=sourceOf(document);
 return updateFor(original,migrateIconSource(original));
}
function unresolved(source,documentUuid,path='',details=[]){
 const refs=sourceRefs(source),field=key=>path?path+'.'+key:key;
 const check=(value,key)=>{
  if(!libraryImage(value)||currentImages.has(uri(value)))return;
  const candidates=byLegacy.get(uri(value))??[];
  const reason=refs.some(ref=>ref.startsWith('Compendium.'+MOD+'.'))?'missing-library-source':refs.some(ref=>ref.startsWith('Compendium.'))?'foreign-source':new Set(candidates.map(row=>row.img)).size>1?'ambiguous-legacy-image':'unmapped-library-image';
  details.push({documentUuid,itemId:source._id??source.id??null,name:String(source.name??''),type:String(source.type??''),field:field(key),img:value,sourceUuids:refs,reason,candidateKeys:candidates.map(row=>row.key)});
 };
 check(source.img,'img');check(source.flags?.['cyberpunk-implant-creator']?.activation?.effectImg,'flags.cyberpunk-implant-creator.activation.effectImg');
 for(const [index,rule]of(source.system?.rules??[]).entries())if(['TokenIcon','TokenEffectIcon'].includes(rule?.key))check(rule.value,'system.rules.'+index+'.value');
 for(const originPath of ORIGIN_PATHS)for(const imagePath of ['img','item.img'])check(at(source,originPath+'.'+imagePath),originPath+'.'+imagePath);
 for(const [index,child]of(source.system?.subitems??[]).entries())unresolved(child,documentUuid,field('system.subitems.'+index),details);
 return details;
}
function primaryGM(){
 const game=globalThis.game;if(!game?.user?.isGM)return false;
 const active=asList(game.users).filter(user=>user.active&&user.isGM).sort((a,b)=>String(a.id).localeCompare(String(b.id)));
 return active.length?active[0].id===game.user.id:!game.users;
}
/** Update existing world, actor and synthetic scene-token Item documents; compendia are already current. */
export async function migrateItemIcons(){
 const result={scanned:0,updated:0,failed:0,unresolved:0,unresolvedDocuments:0,unresolvedDetails:[]};
 if(!primaryGM())return result;
 const seen=new Set();
 async function visit(doc){
  if(!doc||seen.has(doc))return;seen.add(doc);result.scanned++;
  try{
   const original=sourceOf(doc),changed=migrateIconSource(original),update=updateFor(original,changed);
   const details=unresolved(changed,doc.uuid??'Item.'+(original._id??original.id??result.scanned));
   result.unresolved+=details.length;if(details.length)result.unresolvedDocuments++;
   result.unresolvedDetails.push(...details);
   if(!update)return;
   if(typeof doc.update!=='function')throw Error('Item document is not editable');
   await doc.update(update,{render:false,[MOD]:{imageMigration512:true}});result.updated++;
  }catch(error){result.failed++;console.warn('['+MOD+'] image migration failed for '+(doc.name??doc.id??'item'),error);}
 }
 for(const item of asList(globalThis.game.items))await visit(item);
 for(const actor of asList(globalThis.game.actors))for(const item of asList(actor?.items))await visit(item);
 for(const scene of asList(globalThis.game.scenes))for(const token of asList(scene?.tokens)){
  if(token.actorLink===true||token._source?.actorLink===true)continue;
  try{for(const item of asList((token.actor??token.delta?.syntheticActor)?.items))await visit(item);}
  catch(error){result.failed++;console.warn('['+MOD+'] image migration: synthetic actor is unavailable',error);}
 }
 const module=globalThis.game.modules?.get?.(MOD);
 if(module?.api)module.api.lastIconMigration={...result};
 const {unresolvedDetails,...summary}=result;
 console.info('['+MOD+'] WebP 512 migration',summary);
 if(unresolvedDetails.length)console.table(unresolvedDetails.map(({sourceUuids,candidateKeys,...row})=>({...row,sourceUuids:sourceUuids.join(', '),candidateKeys:candidateKeys.join(', ')})));
 if(result.failed||result.unresolved)globalThis.ui?.notifications?.warn?.('Иконки библиотеки: обновлено '+result.updated+', ошибок '+result.failed+', не определено '+result.unresolved+'. Подробности в консоли.');
 else if(result.updated)globalThis.ui?.notifications?.info?.('Иконки библиотеки: обновлено '+result.updated+' предметов и эффектов (WebP 512×512).');
 return result;
}
function ownClient(userId){return !userId||!globalThis.game?.user?.id||userId===game.user.id;}
function pending(changes,path,fn){
 if(own(changes,path)){changes[path]=fn(changes[path]);return;}
 const parts=path.split('.');
 // Foundry updates may replace an ancestor using a dotted key, for example
 // flags.pf2e-item-activations.grantedBy = {img: ...}.
 for(let length=parts.length-1;length>0;length--){
  const prefix=parts.slice(0,length).join('.');
  if(own(changes,prefix)){pending(changes[prefix],parts.slice(length).join('.'),fn);return;}
 }
 let object=changes;
 for(const part of parts.slice(0,-1)){object=object?.[part];if(!object)return;}
 const key=parts.at(-1);if(own(object,key))object[key]=fn(object[key]);
}
if(globalThis.Hooks?.on){
 Hooks.on('preCreateItem',(item,_data,_options,userId)=>{
  if(!ownClient(userId))return;
  const update=imageMigrationUpdate(item);if(update&&typeof item.updateSource==='function')item.updateSource(update);
 });
 // Older content migrations may write rule/subitem arrays on ready. Normalize their incoming
 // image paths in place, retaining all numeric and user changes in the pending update.
 Hooks.on('preUpdateItem',(item,changes,_options,userId)=>{
  if(!ownClient(userId))return;
  const source=sourceOf(item),entry=identity(source);
  const owner=entry&&currentImages.has(uri(source.img))?{...entry,img:uri(source.img)}:entry;
  pending(changes,'img',value=>image(value,entry,true));
  pending(changes,'system.rules',value=>{rulesImages(value,owner);return value;});
  pending(changes,'system.subitems',value=>Array.isArray(value)?value.map(child=>patch(child,entry)):value);
  pending(changes,'flags.cyberpunk-implant-creator.activation.effectImg',value=>image(value,owner,true));
  for(const path of ORIGIN_PATHS){
   pending(changes,path,value=>originImages(value));
   for(const field of ['img','item.img'])pending(changes,path+'.'+field,value=>image(value,identity(at(source,path)),true));
  }
 });
}
if(globalThis.Hooks?.once)Hooks.once('ready',async()=>{
 const module=globalThis.game?.modules?.get?.(MOD);
 if(module)module.api={...(module.api??{}),migrateItemIcons};
 await migrateItemIcons();
});
