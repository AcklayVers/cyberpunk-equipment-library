import{STOCK_MIGRATIONS,EXTERNAL_ACTIONS}from'./data/external-cyberarmor-1626.mjs';
import{rollSpykeContact,handleSpykeGrapple}from'./spyke-contact.mjs';
const MOD='cyberpunk-equipment-library',REM='cyberpunk-remaster',NET='sf2e-netrunning';
const clone=structuredClone,same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),values=c=>Array.isArray(c)?c:Array.isArray(c?.contents)?c.contents:typeof c?.values==='function'?[...c.values()]:[];
const raw=d=>d?._source??d?.toObject?.(false)??d??{},meta=d=>d?.flags?.[MOD]?.external1626??raw(d).flags?.[MOD]?.external1626??{};
const get=(o,p)=>p.split('.').reduce((a,k)=>a?.[k],o);function set(o,p,v){const keys=p.split('.');let a=o;for(const k of keys.slice(0,-1))a=a[k]??={};a[keys.at(-1)]=clone(v);}
const refs=s=>[s?._stats?.compendiumSource,s?.flags?.core?.sourceId,s?.sourceId].filter(x=>typeof x==='string');
function stockRow(s){const references=refs(s);if(references.some(x=>x.startsWith('Compendium.')&&!x.startsWith('Compendium.'+MOD+'.')))return null;return STOCK_MIGRATIONS.find(r=>references.includes(`Compendium.${MOD}.${r.pack??'implants'}.Item.${r.id}`)||(s._id===r.id&&String(s.img??'').startsWith('modules/'+MOD+'/')))||null;}
/** Change only stock fields; current installation state and house rules survive. */
export function migrateStock1626(input){const s=clone(input),row=stockRow(s);if(!row)return s;
 const previous=[row.before,...(row.previous??[])];for(const p of['name','img','system.description.value','system.slug','system.level.value','system.price.value','system.traits.rarity'])if(previous.some(d=>same(get(s,p),get(d,p)))&&get(row.after,p)!==undefined)set(s,p,get(row.after,p));
 for(const[k,v]of Object.entries(row.after.flags?.[REM]??{})){const p=`flags.${REM}.${k}`;if(get(s,p)===undefined||same(get(s,p),row.before.flags?.[REM]?.[k]))set(s,p,v);}
 s.flags??={};s.flags[MOD]??={};s.flags[MOD].external1626={...row.after.flags[MOD].external1626,...s.flags[MOD].external1626};
 return s;
}
export function isActive1626(item){const d=raw(item),m=meta(item),f=d.flags?.[REM]??{},system=item?.system??d.system??{},carry=system.equipped?.carryType;
 if(m.disabled||item?.isBroken===true||item?.isDestroyed===true)return false;
 const hp=system.hp;if(Number(hp?.max)>0&&Number(hp.value)<=Math.floor(Number(hp.max)/2))return false;
 if(m.kind==='netrunner-suit')return carry==='worn';
 if(f.installed!==true)return false;
 return d.type==='armor'?['worn','implanted'].includes(carry):carry==='implanted';
}
function fullPlating(actor){return values(actor?.items).some(d=>meta(d).kind==='total-plating'&&isActive1626(d)&&(d.isEquipped??d.system?.equipped?.inSlot===true));}
export function protectionAllowed1626(actor,item){return isActive1626(item)&&(!['faceplate','facial','cowl'].includes(meta(item).kind)||!fullPlating(actor));}
export function salvageValue1626(price,degree,remaining=price){const p=Number(price),r=Number(remaining);if(!Number.isFinite(p)||!Number.isFinite(r)||p<=0||r<=0)return 0;return Math.floor(Math.max(0,Math.min(r,p*(degree==='criticalSuccess'?.2:degree==='success'?.1:0))));}
export function buildCoverEffect1626(parent,{worldTime=0,initiative=null}={}){return{name:'Эффект: Прикрыть лицо',type:'effect',img:parent.img,system:{description:{value:'<p>Лицевая панель даёт +1 обстоятельства к КБ до начала следующего хода. С другими бонусами обстоятельства применяется большее значение. «Блок щитом» не предоставляется.</p>',gm:''},rules:[{key:'FlatModifier',selector:'ac',type:'circumstance',value:1,predicate:[{not:'cpel-total-body-plating'}]}],duration:{unit:'rounds',value:1,expiry:'turn-start',sustained:false},start:{value:worldTime,initiative},level:{value:6},traits:{value:[],otherTags:[]},tokenIcon:{show:true},badge:null,unidentified:false,fromSpell:false},flags:{[MOD]:{external1626Effect:{kind:'cover',parentId:parent.id??parent._id}}}};}
export function buildIrEffect1626(parent){return{name:'Эффект: Net Runner Cellular — ИК маскировка',type:'effect',img:parent.img,system:{description:{value:'<p>Включите переключатель только для Скрытности против подходящего инфракрасного сенсора. Костюм даёт +2 обстоятельства для этой проверки. Обычное зрение и камеры не обманываются.</p>',gm:''},rules:[{key:'RollOption',domain:'all',option:'cpel-netrunner-ir',label:'ИК маскировка против инфракрасных сенсоров',toggleable:true,value:false},{key:'FlatModifier',selector:'stealth',type:'circumstance',value:2,predicate:['cpel-netrunner-ir'],label:'Net Runner Cellular — ИК маскировка'}],duration:{unit:'unlimited',value:-1,expiry:null,sustained:false},start:{value:0,initiative:null},level:{value:8},traits:{value:[],otherTags:[]},tokenIcon:{show:false},badge:null,unidentified:false,fromSpell:false},flags:{[MOD]:{external1626Effect:{kind:'ir',parentId:parent.id??parent._id}}}};}
const ownOptions={render:false,cpel1626:true};
function diff(before,after,prefix='',out={}){if(same(before,after))return out;if(!before||!after||typeof before!=='object'||typeof after!=='object'||Array.isArray(before)||Array.isArray(after)){out[prefix]=after;return out;}for(const k of Object.keys(after))diff(before[k],after[k],prefix?prefix+'.'+k:k,out);return out;}
function merged(input,changes){const result=clone(input);for(const[k,v]of Object.entries(changes??{})){if(k.includes('.'))set(result,k,v);else if(v&&typeof v==='object'&&!Array.isArray(v))result[k]=merged(result[k]??{},v);else result[k]=clone(v);}return result;}
export function stockUpdate1626(item){return diff(raw(item),migrateStock1626(raw(item)));}
function authoritative(userId){return !userId||userId===globalThis.game?.user?.id;}
function canWrite(actor,userId){return Boolean(actor?.isOwner&&authoritative(userId));}
function primaryGM(){const users=values(globalThis.game?.users).filter(u=>u.active&&u.isGM).sort((a,b)=>String(a.id).localeCompare(String(b.id)));return users[0]?.id===globalThis.game?.user?.id;}
function allActors(){const actors=new Map();for(const a of values(globalThis.game?.actors))actors.set(a.uuid??a,a);for(const scene of values(globalThis.game?.scenes))for(const t of values(scene.tokens))if(!t.actorLink&&t.actor)actors.set(t.actor.uuid??t.actor,t.actor);return[...actors.values()];}
function activeParents(actor,key){return values(actor?.items).filter(d=>meta(d).actionKeys?.includes(key)&&protectionAllowed1626(actor,d));}
const queue=new Map();
/** Refresh only this release's generated actions and transient cover effect. */
export async function syncExternal1626(actor){if(!actor?.isOwner||queue.has(actor))return;queue.set(actor,true);try{
 const wanted=new Set();for(const item of values(actor.items))if(protectionAllowed1626(actor,item))for(const key of meta(item).actionKeys??[])wanted.add(key);
 const remove=[];for(const item of values(actor.items)){const m=meta(item),effect=item.flags?.[MOD]?.external1626Effect;if(m.generatedAction&&!wanted.has(m.actionKey))remove.push(item.id);if(effect?.kind==='cover'||effect?.kind==='ir'){const parent=values(actor.items).find(d=>d.id===effect.parentId);if(!parent||!(effect.kind==='cover'?protectionAllowed1626(actor,parent):isActive1626(parent)&&meta(parent).cellular))remove.push(item.id);}}
 if(remove.length)await actor.deleteEmbeddedDocuments('Item',[...new Set(remove)],ownOptions);
 for(const key of wanted){if(values(actor.items).some(d=>d.type==='action'&&meta(d).actionKey===key))continue;const template=EXTERNAL_ACTIONS.find(d=>meta(d).actionKey===key);if(!template)continue;const d=clone(template);delete d._id;delete d.folder;delete d.sort;d.flags[MOD].external1626.generatedAction=true;await actor.createEmbeddedDocuments('Item',[d],ownOptions);}
 const cellular=values(actor.items).find(d=>meta(d).kind==='netrunner-suit'&&meta(d).cellular&&isActive1626(d));if(cellular&&!values(actor.items).some(d=>d.flags?.[MOD]?.external1626Effect?.kind==='ir'))await actor.createEmbeddedDocuments('Item',[buildIrEffect1626(cellular)],ownOptions);
 }finally{queue.delete(actor);}}
export async function useExternal1626Action(action,actor=action?.actor??action?.parent){const key=meta(action).actionKey;if(!key||!actor?.isOwner)return false;const parents=activeParents(actor,key);if(!parents.length){globalThis.ui?.notifications?.warn?.('Для этого действия нужен установленный исправный совместимый модуль.');return false;}
 if(key==='spyke-contact'){await rollSpykeContact(actor,{isActive:isActive1626});return true;}
 if(key==='cover'){const parent=parents[0],effect=buildCoverEffect1626(parent,{worldTime:globalThis.game?.time?.worldTime??0,initiative:actor.combatant?.initiative??values(globalThis.game?.combat?.combatants).find(c=>c.actorId===actor.id)?.initiative??null}),existing=values(actor.items).find(d=>d.flags?.[MOD]?.external1626Effect?.kind==='cover');if(existing)await existing.update({'system.start':effect.system.start,'system.duration':effect.system.duration},ownOptions);else await actor.createEmbeddedDocuments('Item',[effect],ownOptions);return true;}
 if(key==='facial-reaction'&&globalThis.game?.combat?.started){const round=game.combat.id+':'+game.combat.round;if(actor.flags?.[MOD]?.external1626ReactionRound===round){globalThis.ui?.notifications?.warn?.('Лицевая пластина уже применялась в этом раунде.');return false;}await actor.update({[`flags.${MOD}.external1626ReactionRound`]:round},ownOptions);}
 if(key==='extend-sensor'||key==='retract-sensor')await parents[0].update({[`flags.${MOD}.external1626.sensorExtended`]:key==='extend-sensor'},ownOptions);
 return true;
}
function retiredSuitDeck(item){const s=raw(item);if(s.type!=='equipment')return false;const references=refs(s);if(references.some(x=>x.startsWith('Compendium.')&&!x.startsWith('Compendium.'+MOD+'.')))return false;return references.includes(`Compendium.${MOD}.gear.Item.95f2a4704df84d8d`)||(meta(s).kind==='suit-deck'&&s.flags?.[NET]?.slug==='cpel-netrunner-suit-deck');}
export async function migrateExternal1626(){if(!primaryGM())return 0;let count=0;const actors=allActors();for(const item of[...values(game.items),...actors.flatMap(a=>values(a.items))]){if(retiredSuitDeck(item)){await item.delete(ownOptions);count++;continue;}const update=stockUpdate1626(item);if(Object.keys(update).length){await item.update(update,ownOptions);count++;}}for(const actor of actors)await syncExternal1626(actor);if(count)console.info('['+MOD+'] 1.6.27: обновлено предметов: '+count);return count;}
const report=e=>console.error('['+MOD+'] наружная киберброня 1.6.26',e);
if(globalThis.Hooks?.on){
 Hooks.on('preCreateItem',(item)=>{const update=stockUpdate1626(item);if(Object.keys(update).length)item.updateSource(update);});
 Hooks.on('preUpdateItem',(item,changes,options={})=>{if(options.cpel1626)return;const future=merged(raw(item),changes),update=diff(future,migrateStock1626(future));Object.assign(changes,update);const m=meta(future);if(['torso-plating','total-plating'].includes(m.kind)&&get(future,'system.equipped.inSlot')===true&&future.flags?.[REM]?.installed!==true){if(get(changes,'system.equipped.inSlot')===true||changes['system.equipped.inSlot']===true){globalThis.ui?.notifications?.warn?.('Сначала установите киберброню во вкладке имплантов.');return false;}changes['system.equipped.inSlot']=false;}});
 for(const hook of['createItem','updateItem','deleteItem'])Hooks.on(hook,(item,...args)=>{const options=hook==='updateItem'?args[1]:args[0],userId=hook==='updateItem'?args[2]:args[1];if(options?.cpel1626)return;const actor=item.actor??item.parent;if(canWrite(actor,userId))syncExternal1626(actor).catch(report);});
 Hooks.on('createChatMessage',(message,_options,userId)=>{if(primaryGM())handleSpykeGrapple(message,{isActive:isActive1626}).catch(report);if(!authoritative(userId))return;const ref=message?.flags?.sf2e?.origin?.uuid??message?.flags?.pf2e?.origin?.uuid;if(!ref||typeof globalThis.fromUuid!=='function')return;(async()=>{const action=await fromUuid(ref);if(meta(action).actionKey)await useExternal1626Action(action);})().catch(report);});
}
if(globalThis.Hooks?.once){Hooks.once('ready',()=>{const module=globalThis.game?.modules?.get?.(MOD);if(module)module.api={...(module.api??{}),useExternal1626Action,salvageValue1626,migrateExternal1626};migrateExternal1626().catch(report);});}
