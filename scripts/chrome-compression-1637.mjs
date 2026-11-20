import './chrome-capacity-1636.mjs';
import {operatingSystem1634Kind} from './operating-systems-1634.mjs';
const MOD='cyberpunk-equipment-library',REM='cyberpunk-remaster';
const PATCH=Symbol.for(MOD+'.chromeCompression1637');
const values=collection=>Array.isArray(collection)?collection:Array.isArray(collection?.contents)?collection.contents:[...(collection?.values?.()??[])];
const ownChrome=item=>operatingSystem1634Kind(item)==='chrome-compressor';

export function reducedHardCost1637(value){
 return Number.isFinite(value)&&value>1?Math.max(1,value-1):value;
}

/** Base prices/costs remain available unchanged to editors and exports. */
export function installChromeCompression1637(C){
 if(typeof C?.getHumanity!=='function'||typeof C?.getHardCost!=='function'||typeof C?.isInstalled!=='function'||typeof C?.isCyberware!=='function')return false;
 if(C.getHumanity[PATCH]||Object.hasOwn(C,PATCH))return true;
 const original=C.getHumanity;
 function withCompression(actor,installed=null){
  const selected=installed??values(actor?.items).filter(item=>this.isCyberware(item)&&this.isInstalled(item));
  if(!values(selected).some(item=>ownChrome(item)&&this.isInstalled(item)))return original.call(this,actor,installed);
  const native=this,scoped=Object.create(native);
  scoped.getHardCost=function(item){
   const cost=native.getHardCost(item);
   return ownChrome(item)||!native.isCyberware(item)||!native.isInstalled(item)?cost:reducedHardCost1637(cost);
  };
  return original.call(scoped,actor,installed);
 }
 Object.defineProperty(withCompression,PATCH,{value:true});C.getHumanity=withCompression;
 Object.defineProperty(C,PATCH,{value:true});return true;
}
const nativeClass=()=>globalThis.game?.modules?.get?.(REM)?.api?.CyberwareTab;
if(globalThis.Hooks?.once){
 Hooks.once('setup',()=>installChromeCompression1637(nativeClass()));
 Hooks.once('ready',()=>{if(!installChromeCompression1637(nativeClass()))console.error('['+MOD+'] Chrome Compressor: CyberwareTab Humanity API unavailable');});
}
