import {IMPLANTS_1640, MIGRATIONS_1640, SHOCK_REVISION_1642} from './data/implant-expansion-1640.mjs';
import {installMicrogenerator1640} from './implant-microgenerator-1640.mjs';

const MOD='cyberpunk-equipment-library', REM='cyberpunk-remaster', CIC='cyberpunk-implant-creator', NET='sf2e-netrunning';
const raw=x=>x?._source??x?.toObject?.(true)??x??{};
const list=x=>Array.isArray(x)?x:Array.isArray(x?.contents)?x.contents:[...(x?.values?.()??[])];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const get=(x,p)=>p.split('.').reduce((a,k)=>a?.[k],x);
const ownOptions={render:false,cpel1640:true};
const esc=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const now=()=>Number(globalThis.game?.time?.worldTime??0);
const warn=x=>globalThis.ui?.notifications?.warn?.(x);
const report=e=>console.error('['+MOD+'] импланты 1.6.40',e);

export function implant1640Meta(item){
 const s=raw(item);if(s.type!=='equipment')return null;
 const refs=[s._stats?.compendiumSource,s._stats?.duplicateSource,s.flags?.core?.sourceId,s.sourceId].filter(x=>typeof x==='string'&&x.startsWith('Compendium.'));
 if(refs.some(x=>!x.startsWith(`Compendium.${MOD}.`)))return null;
 const row=IMPLANTS_1640.find(d=>refs.includes(`Compendium.${MOD}.implants.Item.${d._id}`)||s._id===d._id);
 const m=s.flags?.[MOD]?.implantExpansion1640;
 if(row)return row.flags[MOD].implantExpansion1640;
 return m?.provider===MOD&&IMPLANTS_1640.some(d=>d.flags[MOD].implantExpansion1640.family===m.family&&d.flags[MOD].implantExpansion1640.tier===m.tier)?m:null;
}

export function installed1640(item){
 if(!implant1640Meta(item)||item?.isBroken===true||item?.isDestroyed===true)return false;
 const s=raw(item),system=item?.system??s.system??{},f=s.flags?.[REM]??{};
 if(f.installed!==true||f.disabled===true||f.suppressed===true)return false;
 if(Number(system.hp?.max)>0&&Number(system.hp.value)<=Math.floor(Number(system.hp.max)/2))return false;
 const native=globalThis.game?.modules?.get?.(REM)?.api?.CyberwareTab;
 return typeof native?.isInstalled==='function'?native.isInstalled(item):system.equipped?.carryType==='implanted';
}

export function patchImplant1640(input){
 const s=structuredClone(raw(input));
 const meta=implant1640Meta(s);
 const known=meta?IMPLANTS_1640.find(d=>d.flags[MOD].implantExpansion1640.family===meta.family&&d.flags[MOD].implantExpansion1640.tier===meta.tier):null;
 const row=known?MIGRATIONS_1640.find(r=>r.id===known._id):null;
 if(row&&s.flags?.[MOD]?.implant1640Migrated!=='1.6.40'){
  const a=row.after,b=row.before;
  // Stock content is replaced once; house rules and current installation survive.
  for(const path of ['name','img','system.description.value','system.rules','system.slug']){
   if(same(get(s,path),get(b,path))){const keys=path.split('.');let out=s;for(const k of keys.slice(0,-1))out=out[k]??={};out[keys.at(-1)]=structuredClone(get(a,path));}
  }
  s.flags??={};s.flags[REM]??={};s.flags[MOD]??={};s.flags[CIC]??={};
  for(const [key,value]of Object.entries(a.flags[REM]))if(key!=='installed'&&(s.flags[REM][key]===undefined||same(s.flags[REM][key],b.flags?.[REM]?.[key])))s.flags[REM][key]=structuredClone(value);
  Object.assign(s.flags[REM],{hardCost:a.flags[REM].hardCost,stressFormula:a.flags[REM].stressFormula});
  // Also normalize the cost footer when the owner customized the rest of the text.
  s.system.description.value=String(s.system.description.value).replace(/((?:<strong>|<b>)\s*Hard Cost\s*:\s*(?:<\/strong>|<\/b>)\s*)\d+/giu,(_m,p)=>p+a.flags[REM].hardCost).replace(/((?:<strong>|<b>)\s*Stress Cost\s*:\s*(?:<\/strong>|<\/b>)\s*(?:\[\[\/r\s*)?)(?:\d+d\d+(?:\s*\+\s*\d+d\d+)*|0)/giu,(_m,p)=>p+a.flags[REM].stressFormula);
  if(!s.flags[CIC].activation||same(s.flags[CIC].activation,b.flags?.[CIC]?.activation))Object.assign(s.flags[CIC],structuredClone(a.flags[CIC]??{}));
  s.flags[MOD].implantExpansion1640=structuredClone(a.flags[MOD].implantExpansion1640);s.flags[MOD].implant1640Migrated='1.6.40';
 }
 const shock=meta?.family==='shock-n-awe'?SHOCK_REVISION_1642.find(r=>r.id===known?._id):null;
 if(shock&&s.flags?.[MOD]?.shock1642Migrated!=='1.6.42'){
  for(const path of ['system.description.value',`flags.${CIC}.activation.effectDescription`]){
   const value=get(s,path);if(typeof value!=='string')continue;
   const next=same(value,get(shock.before,path))?get(shock.after,path):value.replaceAll(`@Damage[${shock.previousDice}d6[electricity]]`,`@Damage[${shock.damageDice}d6[electricity]]`).replaceAll('Раз в 10 минут','Раз в минуту');
   const keys=path.split('.');let target=s;for(const k of keys.slice(0,-1))target=target[k]??={};target[keys.at(-1)]=next;
  }
  s.flags??={};s.flags[MOD]??={};s.flags[MOD].implantExpansion1640??=structuredClone(shock.after.flags[MOD].implantExpansion1640);
  const metadata=s.flags[MOD].implantExpansion1640,readyAt=s.flags[MOD].implant1640State?.readyAt;
  if(Number.isFinite(Number(readyAt))&&readyAt!==undefined&&metadata.cooldownSeconds===600)s.flags[MOD].implant1640State.readyAt=Math.max(0,Number(readyAt)-540);
  metadata.cooldownSeconds=60;metadata.damageDice=shock.damageDice;s.flags[MOD].shock1642Migrated='1.6.42';
 }
 if(Array.isArray(s.system?.subitems))s.system.subitems=s.system.subitems.map(patchImplant1640);
 return s;
}

function diff(a,b,p='',out={}){
 if(same(a,b))return out;
 if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)||Array.isArray(b)){out[p]=b;return out;}
 for(const k of Object.keys(b))diff(a[k],b[k],p?p+'.'+k:k,out);return out;
}
export function implant1640Update(item){const before=raw(item);return diff(before,patchImplant1640(before));}
function actors(){const a=new Map(list(globalThis.game?.actors).map(x=>[x.uuid??x,x]));for(const scene of list(globalThis.game?.scenes))for(const token of list(scene.tokens))if(!token.actorLink&&token.actor)a.set(token.actor.uuid??token.actor,token.actor);return [...a.values()];}
function primaryGM(){const gm=list(globalThis.game?.users).filter(x=>x.active&&x.isGM).sort((a,b)=>String(a.id).localeCompare(String(b.id)));return gm[0]?.id===globalThis.game?.user?.id;}
export async function migrateImplants1640(){
 if(!primaryGM())return {updated:0,failed:0};const result={updated:0,failed:0};
 for(const item of [...list(game.items),...actors().flatMap(a=>list(a.items))]){const update=implant1640Update(item);if(!Object.keys(update).length)continue;try{await item.update(update,ownOptions);result.updated++;}catch(e){result.failed++;report(e);}}
 for(const actor of actors())for(const action of list(actor.items)){
  if(implant1640Meta(sourceForAction(action))?.family!=='shock-n-awe')continue;
  const patch=frequency1640(action);if(!patch||!Object.entries(patch).some(([path,value])=>!same(get(raw(action),path),value)))continue;
  try{await action.update(patch,ownOptions);}catch(e){result.failed++;report(e);}
 }
 return result;
}

function ownerOf(item){return item?.actor??item?.parent;}
function sourceForAction(action){const id=action?.flags?.[CIC]?.activationSourceItemId;return id?ownerOf(action)?.items?.get?.(id):null;}
function creator(){return globalThis.game?.modules?.get?.(REM)?.api?.implantCreator;}
function linkedAction(item){return list(ownerOf(item)?.items).find(a=>a.type==='action'&&a.flags?.[CIC]?.activationSourceItemId===(item.id??item._id));}
function effectsFor(item){return list(ownerOf(item)?.items).filter(e=>e.type==='effect'&&e.flags?.[CIC]?.activationEffect===true&&e.flags[CIC].activationSourceItemId===(item.id??item._id));}
function currentEffect(item){return effectsFor(item).find(e=>e.isExpired!==true&&e.system?.expired!==true);}
function mostAdvanced(actor,family){return list(actor?.items).filter(i=>installed1640(i)&&implant1640Meta(i)?.family===family).sort((a,b)=>implant1640Meta(b).tier-implant1640Meta(a).tier)[0];}
export function remaining1640(item,time=now()){return Math.max(0,Number(item?.flags?.[MOD]?.implant1640State?.readyAt??0)-time);}
export function classDC1640(actor){const value=actor?.getStatistic?.('class')?.dc?.value??actor?.getStatistic?.('class-dc')?.dc?.value??actor?.system?.attributes?.classDC?.value??actor?.system?.attributes?.classOrSpellDC?.value??actor?.system?.attributes?.classDC;return Number.isFinite(Number(value))&&Number(value)>0?Number(value):null;}

export function frequency1640(action,changes=null){
 if(raw(action).type!=='action'||action?.flags?.[CIC]?.activationAction!==true)return null;
 const source=sourceForAction(action),seconds=implant1640Meta(source)?.cooldownSeconds;if(!seconds)return null;
 const patch={'system.frequency.per':seconds===60?'PT1M':'PT10M','system.frequency.max':1};
 const value=changes?.['system.frequency.value']??changes?.['system.frequency']?.value??changes?.system?.frequency?.value;
 if(value!==undefined&&Number(value)>0&&remaining1640(source)>0)patch['system.frequency.value']=0;
 return patch;
}

async function refund(item){
 const action=linkedAction(item);
 if(action?.system?.frequency){await action.update({'system.frequency.value':remaining1640(item)>0?0:Math.min(action.system.frequency.max??1,(action.system.frequency.value??0)+1)},{...ownOptions,cpel1640Refund:true});return;}
 const state=item?.flags?.[CIC]?.activationState;if(state?.count>0)await item.update({[`flags.${CIC}.activationState`]:{...state,count:state.count-1}},ownOptions);
}
async function discard(effect){if(effect?.id&&ownerOf(effect)?.items?.has?.(effect.id))await effect.delete({...ownOptions,render:true});}
async function cancelUse(item,effect){await refund(item);await discard(effect);}
async function startCooldown(item){const seconds=implant1640Meta(item)?.cooldownSeconds;if(seconds)await item.update({[`flags.${MOD}.implant1640State.readyAt`]:now()+seconds},ownOptions);}

async function pick(title,prompt,options,{confirmLabel='Подтверждаю условия активации',extra=''}={}){
 if(!options.length)return null;
 const content=`<p>${esc(prompt)}</p><select name="selection" style="width:100%">${options.map(x=>`<option value="${esc(x.value)}">${esc(x.label)}</option>`).join('')}</select>${extra}<p><label><input type="checkbox" name="confirmed"> ${esc(confirmLabel)}</label></p>`;
 const read=button=>{const form=button.form??button.closest?.('form')??button;const field=name=>form?.elements?.[name]??form?.querySelector?.(`[name="${name}"]`);if(!field('confirmed')?.checked)return null;return {id:field('selection').value,map:Number(field('map')?.value??0),rangePenalty:Math.max(0,Number(field('rangePenalty')?.value??0)||0)};};
 const DialogV2=globalThis.foundry?.applications?.api?.DialogV2;
 if(DialogV2)return DialogV2.wait({window:{title},content,buttons:[{action:'ok',label:'Применить',default:true,callback:(_event,button)=>read(button)},{action:'cancel',label:'Отмена',callback:()=>null}],close:()=>null,rejectClose:false});
 return new Promise(resolve=>new globalThis.Dialog({title,content,buttons:{ok:{label:'Применить',callback:html=>{const root=html?.[0]??html;resolve(read(root.querySelector('button')??{form:root.querySelector('form')??root}));}},cancel:{label:'Отмена',callback:()=>resolve(null)}},close:()=>resolve(null)}).render(true));
}

async function send(item,html,flags={}){
 const actor=ownerOf(item),editor=globalThis.TextEditor??globalThis.foundry?.applications?.ux?.TextEditor?.implementation;
 const content=editor?.enrichHTML?await editor.enrichHTML(html,{async:true,rollData:actor.getRollData?.()??{},relativeTo:item}):html;
 return ChatMessage.create({content,speaker:ChatMessage.getSpeaker({actor}),flags:{[MOD]:{implant1640:true,...flags}}});
}
function gunStrikes(actor){return list(actor?.system?.actions).filter(a=>a.item?.type==='weapon'&&a.item.isEquipped!==false&&['projectile','sniper','firearm'].includes(a.item.system?.group)&&a.item.isMelee!==true&&['piercing','bludgeoning'].includes(a.item.system?.damage?.damageType));}
function strikeOptions(actor){return gunStrikes(actor).map(a=>({value:a.item.id,label:a.label??a.item.name}));}
const attackFields='<p><label>Номер атаки <select name="map"><option value="0">Первая</option><option value="1">Вторая</option><option value="2">Третья и последующие</option></select></label></p>';
async function nativeStrike(item,weaponId,map,options,modifiers=[]){
 const strike=gunStrikes(ownerOf(item)).find(a=>a.item.id===weaponId);if(!strike)throw Error('Подходящее оружие больше не находится в руках владельца.');
 const roll=await strike.variants[Math.min(2,Math.max(0,map))].roll({options,modifiers});
 if(!roll)return null;
 // Native attack cards keep their exact target/MAP and resolve damage separately.
 // This also lets the prepared Microgenerator bind to every normal first Strike.
 return roll;
}

export function quickhack1640(message){
 const flags=message?.flags?.[NET],slug=flags?.descriptionSlug;
 return typeof slug==='string'&&slug.startsWith('quickhack-')&&!/blackwall/i.test(slug)?slug:null;
}
export function blockedQuickhack1640(message,actor){const stored=actor?.flags?.[MOD]?.selfIce1640Blocks,blocks=Array.isArray(stored)?stored:Object.values(stored??{});return Boolean(quickhack1640(message)&&blocks.some(x=>x.message===(message.uuid??message.id)));}
export function poisonRoll1640(message,actor){
 const context=message?.flags?.sf2e?.context??message?.flags?.pf2e?.context??{},options=list(context.options);
 const fail=['failure','criticalFailure'].includes(context.outcome)||[0,1].includes(message?.rolls?.[0]?.degreeOfSuccess);
 return Boolean(message?.actor?.uuid===actor?.uuid&&(message?.isAuthor||globalThis.game?.user?.isGM)&&message?.isRerollable===true&&context.type==='saving-throw'&&(list(context.domains).includes('fortitude')||context.identifier==='fortitude'||context.statistic==='fortitude')&&options.includes('item:trait:poison')&&fail&&!context.isReroll);
}

const handling=new Set(),pendingSelfIce=new Map(),shooting=new Set();
async function activated(item,effect){
 const actor=ownerOf(item),m=implant1640Meta(item);if(!m||!actor?.isOwner)return;
 if(!installed1640(item)||remaining1640(item)>0){warn('Имплант не установлен, повреждён или ещё восстанавливается.');await cancelUse(item,effect);return;}
 let committed=false;
 try{
  if(m.family==='bankshot'){
   const selected=await pick(item.name,'Подтвердите допустимую поверхность, свободные отрезки и известное положение цели.',strikeOptions(actor),{extra:attackFields+'<p><label>Дополнительный штраф дальности <input type="number" name="rangePenalty" min="0" step="2" value="0"></label></p>'});
   if(!selected){await cancelUse(item,effect);return;}
   const Modifier=game.pf2e?.Modifier??game.sf2e?.Modifier;
   if((3-m.tier||selected.rangePenalty)&&!Modifier)throw Error('Системный API модификатора SF2e недоступен.');
   const mods=[];
   if(m.tier<3)mods.push(new Modifier({label:'Банкшот — рикошет',modifier:-(3-m.tier),type:'circumstance'}));
   if(selected.rangePenalty)mods.push(new Modifier({label:'Банкшот — дополнительная дальность',modifier:-selected.rangePenalty,type:'untyped'}));
   committed=Boolean(await nativeStrike(item,selected.id,selected.map,['cpel1640:bankshot'],mods));
   if(!committed)await refund(item);await discard(effect);return;
  }
  if(m.family==='microgenerator'){
   if(list(actor.items).some(e=>e!==effect&&e.flags?.[MOD]?.implant1640Effect?.family==='microgenerator'&&e.isExpired!==true)){warn('Уже подготовлен один импульс.');await cancelUse(item,effect);return;}
   const selected=await pick(item.name,'Подтвердите обычную перезарядку пустого магазина после минимум двух настоящих выстрелов в этом бою.',strikeOptions(actor),{confirmLabel:'Магазин опустел от выстрелов, перезаряжен и вмещает минимум два боеприпаса'});
   if(!selected){await cancelUse(item,effect);return;}
   if(!actor.items.has(effect.id)||effect.isExpired===true)throw Error('Время подготовки импульса истекло.');
   await effect.update({[`flags.${MOD}.implant1640Effect`]:{family:m.family,weaponId:selected.id},'system.rules':[]},{...ownOptions,render:true});
   await startCooldown(item);return;
  }
  if(m.family==='self-ice'){
   const requested=pendingSelfIce.get(item.uuid);pendingSelfIce.delete(item.uuid);
   const choices=list(game.messages).filter(x=>quickhack1640(x)&&x.speaker?.actor!==actor.id&&!blockedQuickhack1640(x,actor)&&(!requested||x.id===requested)).slice(-30).reverse();
   const selected=await pick(item.name,'Выберите обычный враждебный скрипт, прошедший штатную защиту, до применения последствий к вашему нейропорту.',choices.map(x=>({value:x.id,label:`${game.actors?.get?.(x.speaker?.actor)?.name??'NET'} — ${quickhack1640(x)}`})),{confirmLabel:'Реакция доступна; скрипт враждебный, обычный и ещё не применён'});
   if(!selected){warn('Перехват отменён; нужна карточка быстрого скрипта в NET-чате.');await cancelUse(item,effect);return;}
   const message=game.messages.get(selected.id);if(!quickhack1640(message))throw Error('Карточка скрипта больше недоступна.');
   if(blockedQuickhack1640(message,actor)){await cancelUse(item,effect);return;}
   await actor.update({[`flags.${MOD}.selfIce1640Blocks.${message.id}`]:{message:message.uuid??message.id,worldTime:now()}},ownOptions);committed=true;await startCooldown(item);
   await send(item,`<p><strong>Self-ICE:</strong> ${esc(actor.name)} перехватывает ${esc(quickhack1640(message))}. Последствия этой карточки на владельца не применяются; остальные цели не защищены.</p>`,{selfIceMessage:message.uuid??message.id});
   await discard(effect);return;
  }
  if(m.family==='toxin'){
   const messages=list(game.messages).filter(x=>poisonRoll1640(x,actor)).slice(-10).reverse();
   const chosen=await pick(item.name,'Выберите проваленный очередной спасбросок против действующего яда.',messages.map(x=>({value:x.id,label:String(x.flavor??x.rolls?.[0]?.total??x.id).replace(/<[^>]+>/g,'').slice(0,160)})),{confirmLabel:'Это очередной спасбросок, не первоначальное отравление; другой эффект удачи не применяется'});
   if(!chosen){await cancelUse(item,effect);return;}
   const api=game.pf2e?.Check??game.sf2e?.Check;if(typeof api?.rerollFromMessage!=='function')throw Error('Системный API повторного броска недоступен.');
   const message=game.messages.get(chosen.id);if(!poisonRoll1640(message,actor))throw Error('Выбранный бросок больше недоступен для этого переброса.');
   await api.rerollFromMessage(message,{keep:'new'});
   if(game.messages.has(message.id))throw Error('Система не выполнила переброс; использование возвращено.');
   committed=true;await discard(effect);return;
  }
  if(m.family==='shock-n-awe'){
   const accepted=await pick(item.name,'Подтвердите полученный урон от попадания в ближнем бою. Разряд затронет всех остальных существ в 5 футах, включая союзников.',[{value:'confirm',label:'Ответный разряд'}],{confirmLabel:'Попадание разрешено; реакция доступна; это не ответный разряд другого импланта'});
   if(!accepted){await cancelUse(item,effect);return;}
   await electricCard(item,m.damageDice??(m.tier===1?8:16),'Ответный разряд — 5 футов вокруг владельца');committed=true;await startCooldown(item);await discard(effect);return;
  }
  // A stash extraction declares the normal Interact; inventory use stays native.
  if(m.family==='stash')await discard(effect);
 }catch(e){if(!committed)await cancelUse(item,effect);report(e);warn(e.message??String(e));}
}

async function electricCard(item,dice,label,snapshotDC=null){
 const actor=ownerOf(item),dc=snapshotDC??classDC1640(actor);if(!dc)throw Error('У владельца не определена КС класса.');
 const RollClass=game.pf2e?.DamageRoll??game.sf2e?.DamageRoll??globalThis.CONFIG?.Dice?.rolls?.find(C=>C.name==='DamageRoll');
 if(!RollClass)throw Error('Системный DamageRoll недоступен.');
 const roll=await new RollClass(`${dice}d6[electricity]`,actor.getRollData?.()??{}).evaluate();
 const message=await send(item,`<p><strong>${esc(label)}</strong></p><p>@Check[reflex|dc:${dc}|basic|showDC:all]{Базовый спасбросок Рефлекса КС ${dc}}. Союзники в области также затронуты.</p>`);
 await roll.toMessage({speaker:ChatMessage.getSpeaker({actor}),flavor:label,flags:{[MOD]:{implant1640:true,sourceItem:item.uuid,saveDC:dc,areaCard:message.uuid}}});
}

export async function shootImpulse1640(item){
 const key=item?.uuid??item;if(shooting.has(key))return warn('Выстрел с этим импульсом уже разрешается.');shooting.add(key);
 try{
 const actor=ownerOf(item),effect=currentEffect(item),state=effect?.flags?.[MOD]?.implant1640Effect;
 if(!actor?.isOwner||!installed1640(item)||state?.family!=='microgenerator')return warn('Нет подготовленного импульса этого импланта.');
 const chosen=await pick('Выстрел с импульсом','Один Удар выбранным при подготовке оружием. Расходуются обычные действия и боеприпас.',[{value:state.weaponId,label:actor.items.get(state.weaponId)?.name??'Оружие'}],{extra:attackFields,confirmLabel:'Оружие готово; выполняю одну обычную атаку'});
 if(!chosen)return;
 const current=actor.items.get(effect.id);
 if(!current||current.isExpired===true||current.flags?.[MOD]?.implant1640Effect?.spentBy)return warn('Этот импульс уже израсходован или истёк.');
 return await nativeStrike(item,state.weaponId,chosen.map,[]);
 }finally{shooting.delete(key);}
}

export async function activate1640(item){
 if(!ownerOf(item)?.isOwner||!installed1640(item))return warn('Установите исправный имплант владельцу.');
 if(remaining1640(item)>0)return warn(`Имплант восстанавливается: ${Math.ceil(remaining1640(item))} с.`);
 const api=creator();if(typeof api?.activate!=='function')throw Error('Нужен встроенный Конструктор имплантов Cyberpunk Remaster.');
 return api.activate(item);
}

async function restoreCooldowns(){
 if(!primaryGM())return;
 for(const actor of actors())for(const item of list(actor.items))if(implant1640Meta(item)?.cooldownSeconds&&item.flags?.[MOD]?.implant1640State?.readyAt!==undefined&&remaining1640(item)<=0){
  const action=linkedAction(item);if(action?.system?.frequency&&action.system.frequency.value<1)await action.update({'system.frequency.value':1},ownOptions);
  await item.update({[`flags.${MOD}.implant1640State.-=readyAt`]:null},ownOptions);
 }
}

function renderControls(app,html){
 const root=html?.[0]??html;if(!root?.querySelector||root.querySelector('[data-cpel1640-controls]'))return;
 const document=app.document??app.actor??app.item,actor=document?.documentName==='Actor'?document:ownerOf(document);
 if(!actor?.isOwner)return;
 const own=document?.type==='equipment'?[document]:list(actor.items);
 const items=own.filter(i=>installed1640(i)&&implant1640Meta(i)?.family==='microgenerator'&&currentEffect(i)?.flags?.[MOD]?.implant1640Effect);
 if(!items.length)return;
 const panel=globalThis.document.createElement('section');panel.dataset.cpel1640Controls='1';
 const title=globalThis.document.createElement('strong');title.textContent='Действия имплантов';panel.append(title);
 for(const item of items){
  const row=globalThis.document.createElement('div');row.style.cssText='display:flex;gap:6px;margin:4px 0;flex-wrap:wrap';
  const add=(label,callback)=>{const b=globalThis.document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',()=>Promise.resolve(callback()).catch(e=>{report(e);warn(e.message);}));row.append(b);};
  add(`${item.name}: выстрел с импульсом`,()=>shootImpulse1640(item));
  panel.append(row);
 }
 (root.querySelector('.sheet-body')??root.querySelector('form')??root).append(panel);
}

function renderNetCard(message,html){
 const root=html?.[0]??html;if(!quickhack1640(message)||!root?.querySelector||root.querySelector('[data-cpel1640-selfice]'))return;
 const available=actors().filter(a=>a.isOwner&&a.id!==message.speaker?.actor&&mostAdvanced(a,'self-ice'));
 if(!available.length)return;
 const b=globalThis.document.createElement('button');b.type='button';b.dataset.cpel1640Selfice='1';b.textContent='Перехват Self-ICE';
 b.addEventListener('click',async event=>{event.stopPropagation();let item;try{const picked=await pick('Self-ICE','Выберите владельца установленного Self-ICE.',available.map(a=>({value:a.uuid,label:a.name})),{confirmLabel:'Враждебный скрипт направлен на выбранного владельца'});if(!picked)return;const actor=available.find(a=>a.uuid===picked.id);item=mostAdvanced(actor,'self-ice');pendingSelfIce.set(item.uuid,message.id);await activate1640(item);}catch(e){report(e);warn(e.message);}finally{if(item)pendingSelfIce.delete(item.uuid);}});
 (root.querySelector('.message-content')??root).append(b);
}

function netActor(element=null){
 const id=element?.closest?.('[data-actor-id]')?.dataset?.actorId;
 if(id&&game.actors.get(id))return game.actors.get(id);
 const itemId=element?.closest?.('[data-item-id]')?.dataset?.itemId;
 if(itemId){const actor=list(game.actors).find(a=>a.items?.has?.(itemId));if(actor)return actor;}
 return globalThis.canvas?.tokens?.controlled?.[0]?.actor??game.user.character??game.actors.get(ChatMessage.getSpeaker()?.actor);
}
export function netRecipients1640(kind,element){
 const origin=netActor(kind==='condition'?null:element);
 if(element?.dataset?.target==='self'&&kind!=='condition')return origin?[origin]:[];
 const targets=list(game.user?.targets).map(t=>t.actor).filter(Boolean);
 if(targets.length||kind==='damage')return targets;
 const controlled=(globalThis.canvas?.tokens?.controlled??[]).map(t=>t.actor).filter(Boolean);
 return controlled.length?controlled:origin?[origin]:[];
}
export function guardNet1640(event,message=null,kind=null,element=null){
 const target=element??event.target?.closest?.('[data-cpel1640-net-control],.sf2e-net-condition,.sf2e-net-effect,.sf2e-net-damage');if(!target)return false;
 if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return false;
 message??=game.messages.get(target.closest('[data-message-id]')?.dataset?.messageId);
 if(!quickhack1640(message))return false;
 kind??=target.dataset?.cpel1640NetControl??(target.classList?.contains('sf2e-net-condition')?'condition':target.classList?.contains('sf2e-net-effect')?'effect':'damage');
 if(kind==='effect'&&target.dataset?.mode==='remove')return false;
 if(!netRecipients1640(kind,target).some(actor=>blockedQuickhack1640(message,actor)))return false;
 event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();warn('Self-ICE перехватил этот скрипт. Снимите защищённую цель перед применением к остальным.');return true;
}
async function netDamage1640(element,message){
 const api=game.modules.get(NET)?.api;if(typeof api?.rollDamage!=='function')throw Error('Системный NET API урона недоступен.');
 const actor=netActor(element),attackCompatible=element.dataset.attackCompatible!=='false';
 let sourceItem=attackCompatible?actor?.items?.get?.(element.closest('[data-item-id]')?.dataset?.itemId):null;
 if(attackCompatible&&!sourceItem){const uuid=element.closest('[data-item-uuid]')?.dataset?.itemUuid;const resolved=uuid?await fromUuid(uuid):null;if(resolved?.actor===actor)sourceItem=resolved;}
 const targets=list(game.user.targets).map(t=>t.actor).filter(Boolean),targetActor=element.dataset.target==='self'?actor:targets.length===1?targets[0]:null;
 const child=await api.rollDamage({actor,sourceItem:sourceItem??null,targetActor,targetOptions:element.dataset.target==='self'?[]:targetActor?.getSelfRollOptions?.('target')??[],targetAmbiguous:element.dataset.target!=='self'&&targets.length>1,tier:element.dataset.tier,type:element.dataset.damageType,formula:element.dataset.formula||null,persistent:element.dataset.persistent==='true'||/продолж/i.test(element.textContent),attackCompatible,multiplier:Number(element.dataset.multiplier||1),flavor:element.textContent.trim()});
 if(child?.update)await child.update({[`flags.${MOD}.netOrigin1640`]:message.uuid??message.id});
}
function wrapNetControls(message,html){
 const root=html?.[0]??html;if(!quickhack1640(message)||!root?.querySelectorAll)return;
 for(const kind of ['condition','effect','damage'])for(const control of root.querySelectorAll('.sf2e-net-'+kind)){
  // A per-control relay is independent of the NET capture-listener order, even in popouts.
  control.classList.remove('sf2e-net-'+kind);control.dataset.cpel1640NetControl=kind;
  const handler=event=>{
   if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;
   event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();
   if(guardNet1640(event,message,kind,control))return;
   if(kind==='damage'){netDamage1640(control,message).catch(e=>{report(e);warn(e.message);});return;}
   control.classList.add('sf2e-net-'+kind);
   try{control.dispatchEvent(new (control.ownerDocument.defaultView.MouseEvent)('click',{bubbles:true,composed:true,cancelable:true}));}finally{control.classList.remove('sf2e-net-'+kind);}
  };
  control.addEventListener('click',event=>{if(control.classList.contains('sf2e-net-'+kind))return;handler(event);},{capture:true});
  control.addEventListener('keydown',handler,{capture:true});
 }
}
function protectedDamage(message){
 const origin=message?.flags?.[MOD]?.netOrigin1640;if(!origin)return false;
 const parent=game.messages.get(origin.split('.').at(-1));if(!quickhack1640(parent))return false;
 const main=globalThis.ui?.chat?.element,root=main?.[0]??main,asTarget=root?.querySelector?.(`li.chat-message[data-message-id="${message.id}"]`)?.dataset?.actorIsTarget;
 const tokens=asTarget&&message.token?[message.token]:game.user?.getActiveTokens?.()??globalThis.canvas?.tokens?.controlled??[];
 return list(tokens).some(t=>blockedQuickhack1640(parent,t.actor));
}
function guardDamageCard(message,html){
 const root=html?.[0]??html;if(!message?.flags?.[MOD]?.netOrigin1640||!root?.querySelectorAll)return;
 for(const button of root.querySelectorAll('[data-action="applyDamage"]')){
  const handler=event=>{if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;if(Number(button.dataset.multiplier)<0||!protectedDamage(message))return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();warn('Self-ICE: снимите защищённого персонажа перед применением урона этого скрипта.');};
  button.addEventListener('click',handler,{capture:true});button.addEventListener('keydown',handler,{capture:true});
 }
}
function guardDamageMenu(...args){
 const entries=args.find(Array.isArray);if(!entries)return;
 for(const entry of entries){
  if(!/^PF2E\.DamageButton\.(Full|Half|Double|Triple)Context$/.test(entry.label??entry.name??''))continue;
  for(const key of ['onClick','callback'])if(typeof entry[key]==='function'){
   const original=entry[key];entry[key]=function(...callArgs){const element=callArgs.map(x=>x?.[0]??x).find(x=>x?.dataset?.messageId);const message=game.messages.get(element?.dataset?.messageId);if(protectedDamage(message)){warn('Self-ICE: этот персонаж перехватил скрипт.');return;}return original.apply(this,callArgs);};
  }
 }
}

installMicrogenerator1640({meta:implant1640Meta,installed:installed1640,discard,electricCard,classDC:classDC1640,report});
if(globalThis.Hooks?.on){
 Hooks.on('preCreateItem',item=>{if(item.type==='equipment'){const patch=implant1640Update(item);if(Object.keys(patch).length)item.updateSource(patch);}else if(item.type==='action'){const patch=frequency1640(item);if(patch)item.updateSource(patch);}});
 Hooks.on('preUpdateItem',(item,changes,options={})=>{if(options.cpel1640Refund)return;const patch=frequency1640(item,changes);if(patch){const expanded=foundry.utils.expandObject(changes);for(const key of Object.keys(changes))delete changes[key];Object.assign(changes,expanded);for(const[path,value]of Object.entries(patch))foundry.utils.setProperty(changes,path,value);}});
 Hooks.on('createItem',(item,_options,userId)=>{
  if(userId!==globalThis.game?.user?.id||item.type!=='effect'||item.flags?.[CIC]?.activationEffect!==true)return;
  const source=ownerOf(item)?.items?.get?.(item.flags[CIC].activationSourceItemId);if(!implant1640Meta(source)||handling.has(item.uuid))return;
  handling.add(item.uuid);activated(source,item).catch(report).finally(()=>handling.delete(item.uuid));
 });
 Hooks.on('updateWorldTime',()=>restoreCooldowns().catch(report));
 for(const hook of ['renderItemSheet','renderItemSheetV2','renderItemSheetPF2e','renderActorSheet','renderActorSheetV2'])Hooks.on(hook,renderControls);
 for(const hook of ['renderChatMessage','renderChatMessageHTML'])Hooks.on(hook,(message,html)=>{wrapNetControls(message,html);renderNetCard(message,html);guardDamageCard(message,html);});
 Hooks.on('getChatMessageContextOptions',guardDamageMenu);Hooks.on('getChatLogEntryContext',guardDamageMenu);
 Hooks.once('ready',()=>{const module=game.modules.get(MOD);if(module)module.api={...(module.api??{}),activateImplant1640:activate1640,shootImpulse1640,migrateImplants1640};migrateImplants1640().then(restoreCooldowns).catch(report);});
}
