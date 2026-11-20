const MOD='cyberpunk-equipment-library',CIC='cyberpunk-implant-creator';
const values=x=>Array.isArray(x)?x:[...(x?.values?.()??[])];
const state=message=>message?.flags?.[MOD]?.microgen1640;
let dependencies,queue=Promise.resolve();
const pending=new Map(),localLocks=new Set(),damageClaims=new Map();
const activeGM=()=>values(globalThis.game?.users).filter(u=>u.active&&u.isGM).sort((a,b)=>String(a.id).localeCompare(String(b.id)))[0];
const authority=actor=>(activeGM()??actor?.primaryUpdater)?.id===game.user.id;
const worldTime=()=>Number(globalThis.game?.time?.worldTime??0);
const options={render:false,cpel1640:true};
function serialized(task){const result=queue.then(task);queue=result.catch(dependencies.report);return result;}

export function microgenAttack1640(message,actor,effect){
 const context=message?.flags?.sf2e?.context??message?.flags?.pf2e?.context;
 const prepared=effect?.flags?.[MOD]?.implant1640Effect;
 return context?.type==='attack-roll'&&message?.actor?.uuid===actor?.uuid&&message?.item?.id===prepared?.weaponId&&prepared?.family==='microgenerator'&&!prepared.spentBy&&effect?.isExpired!==true&&effect?.system?.expired!==true;
}

export function microgenEphemeral1640(message){
 const s=state(message);if(!s||s.tier<1||s.tier>3)return null;
 return {_id:globalThis.foundry?.utils?.randomID?.()??'CPELmicrogenDie0',name:s.name,type:'effect',img:s.img,system:{description:{value:'Электрический импульс конкретной уже выполненной атаки.'},rules:[{key:'DamageDice',selector:`${s.weaponId}-damage`,diceNumber:s.tier,dieSize:'d6',damageType:'electricity',predicate:[`cpel1640:microgen-damage:${message.id}`],label:s.name}],duration:{value:-1,unit:'unlimited',expiry:null,sustained:false},start:{value:0,initiative:null},level:{value:0},traits:{value:[],otherTags:[]},tokenIcon:{show:false},badge:null,unidentified:false},flags:{[MOD]:{ephemeralMicrogen1640:message.uuid}}};
}

async function consumeFirstAttack(message){
 if(state(message))return;
 const actor=message.actor;if(!actor)return;
 const effect=values(actor.items).find(e=>microgenAttack1640(message,actor,e));
 if(!effect){if(message.flags?.[MOD]?.microgen1640Pending)await message.update({[`flags.${MOD}.-=microgen1640Pending`]:null},options);return;}
 const item=actor.items.get(effect.flags?.[CIC]?.activationSourceItemId);
 if(!dependencies.installed(item)){await dependencies.discard(effect);if(message.flags?.[MOD]?.microgen1640Pending)await message.update({[`flags.${MOD}.-=microgen1640Pending`]:null});return;}
 const meta=dependencies.meta(item),degree=message.rolls?.[0]?.degreeOfSuccess;
 await effect.update({[`flags.${MOD}.implant1640Effect.spentBy`]:message.uuid},options);
 const binding={actorUuid:actor.uuid,weaponId:message.item.id,sourceItemUuid:item.uuid,tier:meta.tier,name:item.name,img:item.img,classDC:dependencies.classDC(actor),status:[0,1].includes(degree)?'miss':'pending',firedAt:worldTime()};
 await message.update({[`flags.${MOD}.microgen1640`]:binding,[`flags.${MOD}.-=microgen1640Pending`]:null});
 await dependencies.discard(effect); // the attempt spends the charge, including misses
}

function permission(message,user){return Boolean(message?.actor&&user&&(user.isGM||message.actor.testUserPermission?.(user,'OWNER')));}
async function transition(request){
 const message=game.messages.get(request.messageId),binding=state(message),user=game.users.get(request.userId);
 if(!binding||!permission(message,user)||binding.actorUuid!==message.actor?.uuid)throw Error('Нет доступа к этой атаке с импульсом.');
 if(request.operation==='claim'){
  if(binding.status!=='pending')throw Error('Импульс этой атаки уже разрешён или его урон сейчас бросается.');
  await message.update({[`flags.${MOD}.microgen1640`]:{...binding,status:'claimed',claimId:request.requestId,claimUserId:user.id}});
  return {claimId:request.requestId};
 }
 if(request.operation==='recover'){
  if(!user.isGM||binding.status!=='claimed'||game.users.get(binding.claimUserId)?.active)throw Error('Мастер может разблокировать только прерванный бросок отключённого пользователя.');
  await message.update({[`flags.${MOD}.microgen1640`]:{...binding,status:'pending',claimId:null,claimUserId:null}});return {recovered:true};
 }
 if(binding.status!=='claimed'||binding.claimId!==request.claimId||binding.claimUserId!==user.id)throw Error('У этой попытки нет действующего права на урон импульсом.');
 await message.update({[`flags.${MOD}.microgen1640`]:{...binding,status:request.operation==='release'?'pending':'resolved'}});
 return {resolved:request.operation!=='release'};
}

async function request(operation,message,claimId=null){
 const actor=message.actor,updater=activeGM()??actor?.primaryUpdater;
 if(!updater?.active)throw Error('Нет активного ведущего или основного владельца для импульса.');
 const requestId=foundry.utils.randomID(),data={operation,messageId:message.id,requestId,claimId};
 return new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>{pending.delete(requestId);reject(Error('Мастер не ответил на запрос импульса. Повторно урон не создаётся.'));},15000);
  pending.set(requestId,{resolve,reject,timeout});
  actor.update({[`flags.${MOD}.microgen1640Request`]:data},options).catch(error=>{clearTimeout(timeout);pending.delete(requestId);reject(error);});
 });
}
function requestUpdated(actor,changes,_options,userId){
 const response=changes[`flags.${MOD}.microgen1640Response`]??changes.flags?.[MOD]?.microgen1640Response;
 if(response){const p=pending.get(response.requestId);if(p){clearTimeout(p.timeout);pending.delete(response.requestId);response.error?p.reject(Error(response.error)):p.resolve(response.result);}}
 const data=changes[`flags.${MOD}.microgen1640Request`]??changes.flags?.[MOD]?.microgen1640Request;
 if(!data||!authority(actor)||!['claim','release','resolve','recover'].includes(data.operation))return;
 // userId is supplied by Foundry after an authorized Actor update, not by a
 // client-controlled socket payload. Exactly one updater serializes all claims.
 serialized(async()=>{
  let response;
  try{
   if(game.messages.get(data.messageId)?.actor?.uuid!==actor.uuid)throw Error('Атака относится к другому персонажу.');
   response={requestId:data.requestId,error:null,result:await transition({...data,userId})};
  }catch(error){response={requestId:data.requestId,result:null,error:error.message};}
  await actor.update({[`flags.${MOD}.microgen1640Response`]:response},options);
 });
}

export async function damageMicrogen1640(message,critical,event=null){
 const key=message?.uuid;if(localLocks.has(key))return;localLocks.add(key);
 let claim=null,rolled=false;
 try{
  if(!message.actor?.isOwner||state(message)?.status!=='pending')throw Error('У этой атаки нет неразрешённого импульса.');
  claim=(await request('claim',message)).claimId;
  damageClaims.set(message.id,claim);
  const binding=state(message),ephemeral=microgenEphemeral1640(message),actor=message.actor;
  if(!ephemeral||typeof actor.getContextualClone!=='function')throw Error('Системный контекст урона SF2e недоступен.');
  const option=`cpel1640:microgen-damage:${message.id}`;
  const clone=actor.getContextualClone([...(actor.getRollOptions?.()??[]),option],[ephemeral]);
  const strike=values(clone.system?.actions).find(a=>a.item?.id===binding.weaponId);
  if(!strike)throw Error('Оружие этой атаки больше не доступно у владельца.');
  const context=message.flags?.sf2e?.context??message.flags?.pf2e?.context??{};
  const roll=await strike[critical?'critical':'damage']({event,altUsage:context.altUsage??null,mapIncreases:context.mapIncreases??null,checkContext:context,target:message.target?.token?.object??null,options:[option]});
  if(!roll){await request('release',message,claim);claim=null;return;}
  rolled=true;await request('resolve',message,claim);claim=null;
  if(binding.tier===3)await dependencies.electricCard({actor,parent:actor,name:binding.name,img:binding.img,uuid:binding.sourceItemUuid},2,'Дуга — 5 футов вокруг основной цели; основная цель исключена',binding.classDC);
  return roll;
 }catch(e){
  if(claim&&!rolled)await request('release',message,claim).catch(dependencies.report);
  dependencies.report(e);globalThis.ui?.notifications?.warn?.(e.message??String(e));
 }finally{damageClaims.delete(message?.id);localLocks.delete(key);}
}

function render(message,html){
 const root=html?.[0]??html;if(!root?.querySelectorAll||root.dataset?.cpelMicrogen1640)return;
 const binding=state(message),waiting=message.flags?.[MOD]?.microgen1640Pending;
 if(!binding&&!waiting)return;
 if(root.dataset)root.dataset.cpelMicrogen1640='1';
 for(const button of root.querySelectorAll('[data-action="strike-damage"]')){
  if(waiting||binding?.status==='claimed'){button.disabled=true;button.title='Ожидается разрешение этого импульса';continue;}
  if(binding?.status!=='pending')continue;
  const label=root.ownerDocument.createElement('span');label.textContent=' + импульс';button.append(label);
  const handler=event=>{if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();damageMicrogen1640(message,button.dataset.outcome!=='success',event).catch(dependencies.report);};
  button.addEventListener('click',handler,{capture:true});button.addEventListener('keydown',handler,{capture:true});
 }
 if(binding?.status==='claimed'&&game.user.isGM&&!game.users.get(binding.claimUserId)?.active){
  const reset=root.ownerDocument.createElement('button');reset.type='button';reset.textContent='Разблокировать прерванный бросок импульса';reset.addEventListener('click',()=>request('recover',message).catch(dependencies.report));root.append(reset);
 }
}

export function installMicrogenerator1640(api){
 dependencies=api;if(!globalThis.Hooks?.on)return;
 Hooks.on('preCreateChatMessage',message=>{
  const context=message.flags?.sf2e?.context??message.flags?.pf2e?.context;
  const option=values(context?.options).find(x=>typeof x==='string'&&x.startsWith('cpel1640:microgen-damage:'));
  if(option){const id=option.split(':').at(-1),original=game.messages.get(id),binding=state(original);if(!binding||binding.actorUuid!==message.actor?.uuid||binding.status!=='claimed'||binding.claimId!==damageClaims.get(id)){globalThis.ui?.notifications?.warn?.('Право на этот бросок импульса уже отменено.');return false;}return;}
  if(message.flags?.[MOD]?.implant1640||message.flags?.[MOD]?.microgen1640)return;
  if(values(message.actor?.items).some(e=>microgenAttack1640(message,message.actor,e)))message.updateSource({[`flags.${MOD}.microgen1640Pending`]:true});
 });
 Hooks.on('createChatMessage',(message,_options,userId)=>{
  if(!authority(message.actor))return;
  const context=message.flags?.sf2e?.context??message.flags?.pf2e?.context;
  if(context?.type==='attack-roll')serialized(()=>consumeFirstAttack(message));
 });
 Hooks.on('renderChatMessage',render);Hooks.on('renderChatMessageHTML',render);
 Hooks.on('updateActor',requestUpdated);
}
