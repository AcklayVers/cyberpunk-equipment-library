import {operatingSystem1634Kind} from './operating-systems-1634.mjs';
const MOD='cyberpunk-equipment-library',REM='cyberpunk-remaster';
const PATCH=Symbol.for(MOD+'.chromeCapacity1636');
const sourceOf=item=>item?._source??item?.toObject?.(true)??item??{};
const values=collection=>Array.isArray(collection)?collection:Array.isArray(collection?.contents)?collection.contents:[...(collection?.values?.()??[])];
const idOf=item=>item?.id??sourceOf(item)._id;
function installed(item){const source=sourceOf(item),flag=source.flags?.[REM]?.installed;return typeof flag==='boolean'?flag:source.system?.equipped?.carryType==='implanted';}
const ownChrome=item=>operatingSystem1634Kind(item)==='chrome-compressor';
export function chromeCapacityBonus1636(actor,type,options={}){
 if(!['internal','external'].includes(type))return 0;
 return values(actor?.items).some(item=>idOf(item)!==options.excludeItemId&&ownChrome(item)&&installed(item))?2:0;
}
function removalMessage(C,actor,source){
 if(!ownChrome(source)||!installed(source))return null;
 if(C.getRuleSetting?.('ignoreSlotLimits')===true)return null;
 const view={items:values(actor.items).filter(item=>idOf(item)!==idOf(source))};
 for(const type of ['internal','external']){
  const capacity=C.implantCapacity(view,type);
  if(capacity.used>capacity.limit){const label=type==='internal'?'внутренних':'внешних';return 'Сначала освободите дополнительные места Chrome Compressor: занято '+capacity.used+' '+label+' мест при лимите '+capacity.limit+' без компрессора.';}
 }
 return null;
}
export function installChromeCapacity1636(C){
 if(typeof C?.implantCapacity!=='function'||typeof C?.removalValidation!=='function')return false;
 if(C.implantCapacity[PATCH]||Object.hasOwn(C,PATCH))return true;
 const capacity=C.implantCapacity,removal=C.removalValidation;
 function withChrome(actor,type,options={}){
  const result=capacity.call(this,actor,type,options),bonus=chromeCapacityBonus1636(actor,type,options);
  if(!bonus||!Number.isFinite(result?.limit))return result;
  const limit=result.limit+bonus;return {...result,limit,over:result.used>limit};
 }
 Object.defineProperty(withChrome,PATCH,{value:true});C.implantCapacity=withChrome;
 C.removalValidation=function(actor,item){return removal.call(this,actor,item)||removalMessage(this,actor,item);};
 Object.defineProperty(C,PATCH,{value:true});
 return true;
}
const nativeClass=()=>globalThis.game?.modules?.get?.(REM)?.api?.CyberwareTab;
function notify(message){globalThis.ui?.notifications?.warn?.(message);return false;}
if(globalThis.Hooks?.once){
 Hooks.once('setup',()=>installChromeCapacity1636(nativeClass()));
 Hooks.once('ready',()=>{if(!installChromeCapacity1636(nativeClass()))console.error('['+MOD+'] Chrome Compressor: CyberwareTab API unavailable');});
}
if(globalThis.Hooks?.on){
 Hooks.on('preUpdateItem',(item,changes)=>{
  const C=nativeClass(),actor=item.actor;
  if(!C||!actor||!ownChrome(item)||!installed(item))return;
  const expanded=foundry.utils.expandObject(changes);
  const flag=expanded.flags?.[REM]?.installed,carry=expanded.system?.equipped?.carryType;
  const next=typeof flag==='boolean'?flag:typeof carry==='string'?carry==='implanted':true;
  if(next)return;
  const message=removalMessage(C,actor,item);if(message)return notify(message);
 });
 Hooks.on('preDeleteItem',item=>{
  const C=nativeClass();if(!C||!item.actor||!ownChrome(item)||!installed(item))return;
  const message=removalMessage(C,item.actor,item);if(message)return notify(message);
 });
}
