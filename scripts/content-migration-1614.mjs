/** CPEL 1.6.14: conservative, repeatable fixes for known CPEL 1.6.13 item data. */
const MOD = 'cyberpunk-equipment-library';
const VERSION = '1.6.14';
const IDS = Object.freeze({med:'CtbRLaOxC03UvIMx',bio:'FVAmUVuZ0olKe1r7',skull:'87524823f0f9ff98',launcher:'m9gqXL5NS8Xs0OkC',pistol:'eH7e04uOAUExwAC7',rifle:'sElAPO3dTELHSvdT'});
const SPELL = 'Compendium.sf2e.spells.Item.sxQZ6yqTn0czJxVd';
const OLD_GRENADE_DC = '10 + @item.level + @actor.system.abilities.str.mod';
const ARMOR_MODULE = 'cyberpunk-remaster';
const asList=(collection)=>Array.isArray(collection?.contents)?collection.contents:Array.isArray(collection)?collection:typeof collection?.values==='function'?[...collection.values()]:[];
const sourceOf=(doc)=>doc?._source??doc?.toObject?.(false)??doc??{};
const getOriginalId=(src)=>{
 for (const key of [src?._stats?.compendiumSource,src?.flags?.core?.sourceId,src?.sourceId]) {
  const match=String(key??'').match(/^Compendium\.cyberpunk-equipment-library\.(?:implants|weapons)\.Item\.([a-zA-Z0-9]{16})$/u);
  if(match)return match[1];
 }
 return null;
};
const desc=(src)=>String(src?.system?.description?.value??'');
const own=(value,key)=>Object.prototype.hasOwnProperty.call(value??{},key);
function matching(src,id,name,signature){
 const origin=getOriginalId(src);
 if(origin && origin!==id)return false;
 // Exact ID also catches world copies retaining the original document ID.
 if(origin===id || src?._id===id)return true;
 // Imported copies can lose compendiumSource. Match name AND a specific old fingerprint.
 return src?.name===name && signature(src);
}
const updateString=(text,search,repl)=>text.includes(search)?text.replace(search,repl):text;
const replaceCost=(html,label,legacyValue)=>html.replace(new RegExp(`(<strong>${label}:<\\/strong>\\s*)(?:${legacyValue})(?=<\\/p>)`,'gu'),'$10');

export function patch1614Source(input){
 const src=structuredClone(input??{});
 const system=src.system??{};let changed=false;
 const setDescription=(value)=>{if(value!==desc(src)){(src.system??={}).description??={};src.system.description.value=value;changed=true;}};
 const setRuleChanges=(callback)=>{
  if(!Array.isArray(system.rules))return;
  const rules=structuredClone(system.rules);let touched=false;
  for(const r of rules)touched=callback(r)||touched;
  if(touched){(src.system??={}).rules=rules;changed=true;}
 };
 const setRemasterFlag=(field,oldValue,newValue)=>{
  const obj=src.flags?.[ARMOR_MODULE];if(!obj||obj[field]!==oldValue)return;
  obj[field]=newValue;changed=true;
 };
 if(matching(src,IDS.med,'Медсканер киберруки',s=>s.system?.rules?.some(r=>JSON.stringify(r.predicate??[]).includes('action:battle-medicine')))){
  setRuleChanges(r=>{
   if(r.key!=='FlatModifier'||!r.predicate)return false;
   let modified=false;
   function fixPredicate(value){
    if(Array.isArray(value)){for(const x of value)fixPredicate(x);return;}
    if(value&&typeof value==='object'){
     if(Array.isArray(value.not)&&value.not.length===1&&value.not[0]==='action:battle-medicine'){value.not='action:battle-medicine';modified=true;}
     for(const v of Object.values(value))fixPredicate(v);
    }
   }
   fixPredicate(r.predicate);return modified;
  });
 }
 if(matching(src,IDS.bio,'Био-монитор',s=>desc(s).includes('Stress Cost:')&&desc(s).includes('Hard Cost:'))){
  let html=desc(src);
  html=replaceCost(html,'Stress Cost','\\[\\[/r 1d4 #Потеря Человечности\\]\\]');
  html=replaceCost(html,'Hard Cost','1');
  setDescription(html);
  src.flags??={};src.flags[ARMOR_MODULE]??={};
  for(const [field,oldValue,newValue] of [['hardCost',1,0],['stressFormula','1d4','0']]){
   if(!own(src.flags[ARMOR_MODULE],field)){src.flags[ARMOR_MODULE][field]=newValue;changed=true;}
   else setRemasterFlag(field,oldValue,newValue);
  }
 }
 if(matching(src,IDS.skull,'Киберчереп',s=>desc(s).includes('Усиленная краниальная защита')&&desc(s).includes('Тип импланта:'))){
  let html=desc(src);
  html=updateString(html,'<strong>Тип импланта:</strong> База','<strong>Тип импланта:</strong> Внутренний');
  // Only this exact item is being migrated. Preserve custom description sections.
  html=html.replaceAll('@Check[flat|dc:8|showDC:all]','@Check[flat|dc:17|showDC:all]');
  html=updateString(html,'{чистую проверку КС 8}','{чистую проверку КС 17}');
  setDescription(html);
  setRemasterFlag('implantType','base','internal');
 }
 if(matching(src,IDS.launcher,'Выкидной гранатомёт «Страж порядка»',s=>s.system?.rules?.some(r=>r.key==='ItemCast'&&r.uuid===SPELL))){
  setRuleChanges(r=>false); // preserve all unrelated rules
  const rules=src.system?.rules;
  if(Array.isArray(rules)){
   const without=rules.filter(r=>!(r.key==='ItemCast' && r.uuid===SPELL));
   if(without.length!==rules.length){src.system.rules=without;changed=true;}
  }
  const paragraph='<p><strong>Встроенная способность — гранатомётный залп:</strong> @UUID[Compendium.sf2e.spells.Item.sxQZ6yqTn0czJxVd]{Fireball (огненный взрыв)}. Область: взрыв радиусом 20 футов, базовый спасбросок Рефлекса, урон 6d6 огнём (ранг 3). <strong>КС</strong> = 10 + уровень оружия + модификатор Силы владельца. Чтобы разыграть встроенную способность без стороннего ItemCast, откройте предмет и нажмите «Гранатомётный залп» (CPEL); используется встроенный магазин на 2 заряда.</p>';
  if(!desc(src).includes('Встроенная способность — гранатомётный залп'))setDescription(desc(src)+paragraph);
 }
 const velocity=[[IDS.pistol,'Пистолетные патроны: Высокоскоростные'],[IDS.rifle,'Винтовочные патроны: Высокоскоростные']];
 for(const [id,name] of velocity){
  if(!matching(src,id,name,s=>desc(s).includes('высокоскоростн')&&s.system?.rules?.some(r=>r.key==='FlatModifier'&&r.value===2)))continue;
  setDescription(desc(src).replaceAll('бонус обстоятельства к КС класса','бонус состояния к КС класса'));
  setRuleChanges(r=>{
   if(r.key==='FlatModifier'&&r.type==='circumstance'&&r.value===2&&(r.selector==='class'||Array.isArray(r.selector)&&r.selector.includes('class'))){r.type='status';return true;}
   if(r.key==='Note'&&typeof r.text==='string'&&r.text.includes('Высокоскоростные боеприпасы дают +2 бонус обстоятельства')){r.text=r.text.replaceAll('бонус обстоятельства','бонус состояния');return true;}
   return false;
  });
 }
 return {source:src,changed};
}
function buildUpdate(original,patched){
 const updates={};
 const prev=original.system??{},now=patched.system??{};
 if(desc(original)!==desc(patched))updates['system.description.value']=now.description.value;
 if(JSON.stringify(prev.rules??[])!==JSON.stringify(now.rules??[]))updates['system.rules']=now.rules;
 const oldFlags=original.flags?.[ARMOR_MODULE]??{},newFlags=patched.flags?.[ARMOR_MODULE]??{};
 for(const k of ['implantType','hardCost','stressFormula'])if(own(newFlags,k)&&newFlags[k]!==oldFlags[k])updates[`flags.${ARMOR_MODULE}.${k}`]=newFlags[k];
 return updates;
}
export function migration1614UpdateForDocument(document){
 const original=sourceOf(document);const result=patch1614Source(original);
 return result.changed?buildUpdate(original,result.source):null;
}
async function migrateOne(item,summary){
 summary.scanned++;
 const update=migration1614UpdateForDocument(item);
 if(!update||!Object.keys(update).length||typeof item?.update!=='function')return;
 await item.update(update,{render:false,[MOD]:{migration1614:true}});summary.updated++;
}
function isPrimaryGM(){
 const game=globalThis.game;const gms=asList(game?.users).filter(u=>u?.active&&u?.isGM).sort((a,b)=>String(a.id).localeCompare(String(b.id)));
 return Boolean(gms.length&&game?.user?.id===gms[0].id);
}
/** Migrates world items, actor embedded items and unlinked scene-token actor deltas; not compendia. */
export async function migrate1614Copies(){
 const summary={scanned:0,updated:0,failed:0};
 if(!isPrimaryGM())return summary;
 const seen=new Set();
 const visit=async(item)=>{if(!item||seen.has(item))return;seen.add(item);try{await migrateOne(item,summary);}catch(error){summary.failed++;console.warn(`[${MOD}] ${VERSION}: миграция предмета ${item.name??item.id}`,error);}};
 for(const doc of asList(globalThis.game?.items))await visit(doc);
 for(const actor of asList(globalThis.game?.actors))for(const item of asList(actor?.items))await visit(item);
 for(const scene of asList(globalThis.game?.scenes))for(const token of asList(scene?.tokens)){
  if(token.actorLink===true||token._source?.actorLink===true)continue;
  const synthetic=token.actor??token.delta?.syntheticActor;
  for(const item of asList(synthetic?.items))await visit(item);
 }
 console.info(`[${MOD}] ${VERSION}: проверено ${summary.scanned}, исправлено ${summary.updated}, ошибок ${summary.failed}. Повторный запуск безопасен.`);
 return summary;
}
if(globalThis.Hooks?.once)Hooks.once('ready',async()=>{
 const api=globalThis.game?.modules?.get?.(MOD);
 if(api)api.api={...(api.api??{}),migrate1614Copies};
 await migrate1614Copies();
});
