import {SANDY_IDS_1640} from './data/implant-expansion-1640.mjs';
const MOD='cyberpunk-equipment-library',CIC='cyberpunk-implant-creator';
const ids=new Set(SANDY_IDS_1640.map(x=>x.id)),values=x=>Array.isArray(x)?x:[...(x?.values?.()??[])];
const raw=x=>x?._source??x?.toObject?.(true)??x??{};
const owner=x=>x?.actor??x?.parent;
const report=e=>console.error('['+MOD+'] восстановление Сандевистана',e);

export function ownSandevistan1640(item){
 const s=raw(item);if(s.type!=='equipment')return false;
 const refs=[s._stats?.compendiumSource,s._stats?.duplicateSource,s.flags?.core?.sourceId,s.sourceId].filter(x=>typeof x==='string'&&x.startsWith('Compendium.'));
 if(refs.some(x=>!x.startsWith(`Compendium.${MOD}.`)))return false;
 return refs.some(x=>x.startsWith(`Compendium.${MOD}.implants.`)&&ids.has(x.split('.').at(-1)))||(!refs.length&&ids.has(s._id));
}
export function sandevistanPeriod1640(config,{combat=globalThis.game?.combat,worldTime=globalThis.game?.time?.worldTime??0}={}){
 if(config?.frequency==='day')return `day:${Math.floor(Number(worldTime)/86400)}`;
 if(config?.frequency!=='encounter')return null;
 return combat?`encounter:${combat.id}`:`encounter:world:${Math.floor(Number(worldTime)/600)}`;
}
export function sandevistanUses1640(item,context={}){
 const config=item?.flags?.[CIC]?.activation??raw(item).flags?.[CIC]?.activation,max=Math.max(1,Number(config?.frequencyMax??1)||1),key=sandevistanPeriod1640(config,context),state=item?.flags?.[CIC]?.activationState??{};
 if(!key)return null;
 const action=values(owner(item)?.items).find(a=>a.type==='action'&&a.flags?.[CIC]?.activationAction===true&&a.flags[CIC].activationSourceItemId===(item.id??item._id)),frequency=action?.system?.frequency;
 return {max:frequency?.max??max,value:frequency?Math.max(0,Number(frequency.value??frequency.max??max)):Math.max(0,max-(state.key===key?Number(state.count??0):0)),period:config.frequency==='day'?'за день':'за столкновение'};
}
export function expiredSandevistanEffects1640(item){
 if(!ownSandevistan1640(item))return [];
 const actor=owner(item);return values(actor?.items).filter(e=>{
  const f=e.flags?.[CIC];return e.type==='effect'&&f?.activationEffect===true&&f.activationSourceItemId===(item.id??item._id)&&(!f.activationSourceUuid||f.activationSourceUuid===item.uuid)&&(e.isExpired===true||e.system?.expired===true);
 });
}
export async function restoreSandevistan1640(item){
 const actor=owner(item);if(!actor?.isOwner||!ownSandevistan1640(item))return false;
 const config=item.flags?.[CIC]?.activation;if(!config?.enabled||!['encounter','day'].includes(config.frequency))return false;
 await item.update({[`flags.${CIC}.-=activationState`]:null},{render:true,cpelSandy1640:true});
 const action=values(actor.items).find(a=>a.type==='action'&&a.flags?.[CIC]?.activationAction===true&&a.flags[CIC].activationSourceItemId===item.id);
 if(action?.system?.frequency)await action.update({'system.frequency.value':action.system.frequency.max??config.frequencyMax??1},{render:true,cpelSandy1640:true});
 const expired=expiredSandevistanEffects1640(item);
 if(expired.length)await actor.deleteEmbeddedDocuments('Item',expired.map(e=>e.id),{render:true,cpelSandy1640:true});
 // Live effects, granted defense actions and all other resources are retained.
 return true;
}
function primaryGM(){return values(game.users).filter(u=>u.active&&u.isGM).sort((a,b)=>String(a.id).localeCompare(String(b.id)))[0]?.id===game.user.id;}
function actors(){const a=new Map(values(game.actors).map(x=>[x.uuid??x,x]));for(const scene of values(game.scenes))for(const token of values(scene.tokens))if(!token.actorLink&&token.actor)a.set(token.actor.uuid??token.actor,token.actor);return [...a.values()];}
let cleaning=false;
export async function cleanExpiredSandevistans1640(){
 if(!primaryGM()||cleaning)return;cleaning=true;
 try{for(const actor of actors())for(const item of values(actor.items))if(ownSandevistan1640(item)){const expired=expiredSandevistanEffects1640(item);if(expired.length)await actor.deleteEmbeddedDocuments('Item',expired.map(e=>e.id),{render:true,cpelSandy1640:true});}}finally{cleaning=false;}
}
function librarySource(item){
 const s=raw(item),refs=[s._stats?.compendiumSource,s._stats?.duplicateSource,s.flags?.core?.sourceId].filter(x=>typeof x==='string'&&x.startsWith('Compendium.'));
 return !refs.some(x=>!x.startsWith(`Compendium.${MOD}.`))&&(ownSandevistan1640(item)||s.flags?.[CIC]?.sourceModule===MOD);
}
export function arrangeActivationRow1642(row){
 if(!row?.style)return;
 // The system's controls track is only 2rem: reserve the actual width of the
 // editor, trash and native power control rather than overflowing into charges.
 row.style.gridTemplateColumns='2rem minmax(0, 1fr) max-content max-content';row.style.columnGap='10px';
 const controls=row.querySelector('.item-controls');
 if(controls){Object.assign(controls.style,{display:'inline-flex',alignItems:'center',justifyContent:'flex-end',flexWrap:'nowrap',gap:'6px',width:'max-content',minWidth:'max-content'});}
 const name=row.querySelector('.name');
 if(name){name.style.minWidth='0';const title=name.querySelector('a');if(title)Object.assign(title.style,{minWidth:'0',overflow:'hidden',textOverflow:'ellipsis'});}
}
function render(app,html){
 const root=html?.[0]??html,document=app.document??app.item??app.actor;if(!root?.querySelector||!document)return;
 const actor=document.documentName==='Actor'?document:owner(document);if(!actor?.isOwner)return;
 if(document.documentName==='Actor')for(const action of values(actor.items)){
  if(action.type!=='action'||action.flags?.[CIC]?.activationAction!==true)continue;
  if(librarySource(actor.items.get(action.flags[CIC].activationSourceItemId)))arrangeActivationRow1642(root.querySelector(`[data-item-id="${action.id}"]`));
 }
 const linked=document.type==='action'?actor.items.get(document.flags?.[CIC]?.activationSourceItemId):null;
 const items=document.documentName==='Actor'?values(actor.items).filter(ownSandevistan1640):ownSandevistan1640(document)?[document]:ownSandevistan1640(linked)?[linked]:[];
 for(const item of items){
  const uses=sandevistanUses1640(item);if(!uses||!item.flags?.[CIC]?.activation?.enabled)continue;
  const action=values(actor.items).find(a=>a.type==='action'&&a.flags?.[CIC]?.activationAction===true&&a.flags[CIC].activationSourceItemId===item.id);
  const target=document.documentName==='Actor'?root.querySelector(`[data-item-id="${action?.id}"]`):root.querySelector('[data-cic-activation-controls]')??root.querySelector('form')??root;
  if(!target||target.querySelector(`[data-cpel-sandy-restore="${item.id}"]`))continue;
  const nativeFrequency=document.documentName==='Actor'?target.querySelector('.frequency'):null;
  const panel=root.ownerDocument.createElement('span');panel.dataset.cpelSandyRestore=item.id;panel.style.cssText='display:inline-flex;grid-area:tracking;gap:6px;align-items:center;white-space:nowrap;flex:0 0 auto;margin:0 6px 0 0';
  const counter=root.ownerDocument.createElement('span');counter.textContent=`${uses.value}/${uses.max}`;counter.title=`Использования ${uses.period}`;
  const button=root.ownerDocument.createElement('button');button.type='button';button.textContent='↻';button.title='Восстановить использование';button.setAttribute('aria-label','Восстановить использование');button.style.cssText='display:inline-flex;align-items:center;justify-content:center;flex:0 0 22px;width:22px;min-width:22px;max-width:22px;height:22px;min-height:22px;padding:0;margin:0;line-height:20px;font-size:16px;white-space:nowrap';
  button.addEventListener('click',async event=>{event.preventDefault();event.stopPropagation();button.disabled=true;try{await restoreSandevistan1640(item);counter.textContent=`${uses.max}/${uses.max}`;}catch(e){report(e);globalThis.ui?.notifications?.error?.(e.message);}finally{button.disabled=false;}});
  if(!nativeFrequency)panel.append(counter);panel.append(button);(nativeFrequency??target).append(panel);
 }
}
async function encounterEnded(combat){
 if(!primaryGM())return;
 for(const actor of new Set(values(combat?.combatants).map(c=>c.actor).filter(Boolean)))for(const item of values(actor.items))if(ownSandevistan1640(item)&&item.flags?.[CIC]?.activation?.frequency==='encounter')await restoreSandevistan1640(item);
 await cleanExpiredSandevistans1640();
}
if(globalThis.Hooks?.on){
 for(const hook of ['renderActorSheet','renderActorSheetV2','renderItemSheet','renderItemSheetV2','renderItemSheetPF2e'])Hooks.on(hook,render);
 Hooks.on('updateWorldTime',()=>cleanExpiredSandevistans1640().catch(report));
 Hooks.on('updateCombat',(combat,changes)=>{(changes.round===0?encounterEnded(combat):cleanExpiredSandevistans1640()).catch(report);});
 Hooks.on('deleteCombat',combat=>encounterEnded(combat).catch(report));
 Hooks.once('ready',()=>{const m=game.modules.get(MOD);if(m)m.api={...(m.api??{}),restoreSandevistan1640,cleanExpiredSandevistans1640};cleanExpiredSandevistans1640().catch(report);});
}
