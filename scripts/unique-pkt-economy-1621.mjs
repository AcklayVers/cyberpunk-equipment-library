import {UNIQUE_PKT_ECONOMY_1621} from './data/unique-pkt-economy-1621.mjs';
const MOD='cyberpunk-equipment-library',REMASTER='cyberpunk-remaster';
const byId=new Map(UNIQUE_PKT_ECONOMY_1621.map(row=>[row.id,row]));
const byKey=new Map(UNIQUE_PKT_ECONOMY_1621.map(row=>[row.key,row]));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const values=collection=>Array.isArray(collection)?collection:Array.isArray(collection?.contents)?collection.contents:typeof collection?.values==='function'?[...collection.values()]:[];
const sourceOf=doc=>doc?._source??doc?.toObject?.(true)??doc??{};

export function uniquePktEconomy1621Identity(source){
 const refs=[source?._stats?.compendiumSource,source?._stats?.duplicateSource,source?.flags?.core?.sourceId,source?.sourceId].filter(ref=>typeof ref==='string'&&ref.startsWith('Compendium.'));
 if(refs.some(ref=>ref.split('.')[1]!==MOD))return null;
 for(const ref of refs){const parts=ref.split('.');if(parts[2]!=='implants')continue;const row=byId.get(parts[3]==='Item'?parts[4]:parts[3]);if(row)return row;}
 const marker=source?.flags?.[MOD]?.uniquePkt1620;
 return marker?.provider===MOD?byKey.get(marker.key)??null:null;
}
function replaceStockCost(html,label,before,after){
 const escaped=String(before).replace(/[.*+?^${}()|[\]\\]/gu,'\\$&');
 const re=new RegExp('('+label.replace(' ','\\s*')+'\\s*:\\s*(?:<[^>]+>\\s*)*)(?:\\[\\[\\/r\\s*)?'+escaped+'(?:\\s*#[^\\]]*)?(?:\\]\\])?(?=\\s|<|$)','giu');
 return html.replace(re,(_match,lead)=>lead+(label==='Stress Cost'&&after!=='0'?'[[/r '+after+' #Потеря Человечности]]':String(after)));
}
function stockDescriptionCost(html,label,before,after){
 const text=String(html??'').replace(/<[^>]+>/gu,' ').replace(/&nbsp;|&#160;/gu,' ').replace(/\s+/gu,' ');
 const expression=label==='Hard Cost'?/Hard\s*Cost\s*:?\s*(\d+)/iu:/Stress\s*Cost\s*:?\s*(?:\[\[\/r\s*)?((?:\d*d(?:4|6))(?:\s*\+\s*\d*d(?:4|6))*|0)/iu;
 const match=text.match(expression);if(!match)return !new RegExp(label.replace(' ','\\s*'),'iu').test(text);
 const value=match[1].replace(/\s+/gu,'');return value===String(before).replace(/\s+/gu,'')||value===String(after).replace(/\s+/gu,'');
}
/** Preserve house prices/costs, artwork and mechanics; migrate only original stock values once. */
export function patchUniquePktEconomy1621(input){
 const source=structuredClone(input??{}),row=uniquePktEconomy1621Identity(source);
 if(row&&source.flags?.[MOD]?.uniquePktEconomy1621?.version!=='1.6.21'){
  source.flags??={};const flags=source.flags[REMASTER]??={};source.system??={};
  const price=source.system.price?.value,amount=Number(price?.sp??0),otherCurrency=price&&Object.entries(price).some(([key,value])=>key!=='sp'&&Number(value)!==0);
  if(!otherCurrency&&amount===row.before.priceEddies&&(flags.priceEddies==null||Number(flags.priceEddies)===row.before.priceEddies)){
   source.system.price??={};source.system.price.value={...(price??{}),sp:row.priceEddies};flags.priceEddies=row.priceEddies;
  }
  for(const [field,label]of [['hardCost','Hard Cost'],['stressFormula','Stress Cost']]){
   if(row[field]===undefined)continue;
   const current=flags[field];
   if((current==null||String(current)===String(row.before[field]))&&stockDescriptionCost(source.system.description?.value,label,row.before[field],row[field])){
    flags[field]=row[field];
    if(typeof source.system.description?.value==='string')source.system.description.value=replaceStockCost(source.system.description.value,label,row.before[field],row[field]);
   }
  }
  source.flags[MOD]??={};source.flags[MOD].uniquePktEconomy1621={version:'1.6.21',key:row.key};
 }
 if(Array.isArray(source.system?.subitems))source.system.subitems=source.system.subitems.map(patchUniquePktEconomy1621);
 return source;
}
export function uniquePktEconomy1621Update(document){
 const before=sourceOf(document);
 function needsMigration(source){return (uniquePktEconomy1621Identity(source)&&source.flags?.[MOD]?.uniquePktEconomy1621?.version!=='1.6.21')||source.system?.subitems?.some?.(needsMigration);}
 if(!needsMigration(before))return null;
 const after=patchUniquePktEconomy1621(before),update={};
 function compare(a,b,path=''){
  if(same(a,b))return;
  if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)||Array.isArray(b)){update[path]=b;return;}
  for(const key of new Set([...Object.keys(a),...Object.keys(b)]))compare(a[key],b[key],path?path+'.'+key:key);
 }
 compare(before,after);return Object.keys(update).length?update:null;
}
export async function migrateUniquePktEconomy1621(){
 const game=globalThis.game,gms=values(game?.users).filter(user=>user.active&&user.isGM).sort((a,b)=>String(a.id).localeCompare(String(b.id)));
 const result={scanned:0,updated:0,failed:0};if(!game?.user?.isGM||gms[0]?.id!==game.user.id)return result;
 const actors=new Map(values(game.actors).map(actor=>[actor.uuid??actor,actor]));
 for(const scene of values(game.scenes))for(const token of values(scene.tokens))if(!token.actorLink&&token.actor)actors.set(token.actor.uuid??token.actor,token.actor);
 const seen=new Set();for(const item of [...values(game.items),...[...actors.values()].flatMap(actor=>values(actor.items))]){
  const key=item.uuid??item;if(seen.has(key))continue;seen.add(key);result.scanned++;
  const update=uniquePktEconomy1621Update(item);if(!update||typeof item.update!=='function')continue;
  try{await item.update(update,{[MOD]:{migration1621:true}});result.updated++;}catch(error){result.failed++;console.error('['+MOD+']1.6.21 economy migration',item.name??item.id,error);}
 }
 if(result.updated||result.failed)console.info('['+MOD+']1.6.21 economy',result);return result;
}
if(globalThis.Hooks?.on)Hooks.on('preCreateItem',(document)=>{
 const update=uniquePktEconomy1621Update(sourceOf(document));if(update)document.updateSource(update);
});
if(globalThis.Hooks?.once)Hooks.once('ready',async()=>{
 const module=globalThis.game?.modules?.get?.(MOD);if(module)module.api={...(module.api??{}),migrateUniquePktEconomy1621};
 const ready=migrateUniquePktEconomy1621();if(module)module.api.uniquePktEconomy1621Ready=ready;await ready;
});
