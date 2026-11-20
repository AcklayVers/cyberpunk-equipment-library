/** Built-in CPEL launch action replacing PF2e Toolbelt's non-core ItemCast RE. */
const MOD='cyberpunk-equipment-library';
const ORIGINAL_ID='m9gqXL5NS8Xs0OkC';
const ORIGIN=`Compendium.${MOD}.implants.Item.${ORIGINAL_ID}`;
const SPELL='Compendium.sf2e.spells.Item.sxQZ6yqTn0czJxVd';
export function grenadeItem(item){
 if(item?.type!=='weapon')return false;
 const refs=[item?._stats?.compendiumSource,item?._source?._stats?.compendiumSource,item?.flags?.core?.sourceId,item?.sourceId];
 if(refs.includes(ORIGIN)||item._id===ORIGINAL_ID)return true;
 return item.name==='Выкидной гранатомёт «Страж порядка»' && ['implants/','pictograms-detailed/implants/','pictograms-detailed/quality-revision/implants/'].some(folder=>String(item.img??'').startsWith(`modules/${MOD}/assets/icons/${folder}`)) && item.system?.ammo?.builtIn===true && item.system?.ammo?.capacity===2;
}
export function grenadeDC(item){
 const level=Number(item?.system?.level?.value??item?.level??0);
 const strength=Number(item?.actor?.system?.abilities?.str?.mod??item?.actor?.system?.attributes?.str?.mod??0);
 return 10+(Number.isFinite(level)?level:0)+(Number.isFinite(strength)?strength:0);
}
export function grenadeRemaining(item){
 const max=Number(item?.system?.ammo?.capacity??2);
 const val=item?.flags?.[MOD]?.grenadeRemaining;
 return Number.isFinite(Number(val))&&val!==null&&val!==undefined?Math.max(0,Math.min(max,Number(val))):max;
}
export function grenadeCardHTML(item){
 const dc=grenadeDC(item);const speaker=String(item?.name??'Гранатомёт').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
 return `<section class="cpel-grenade-card"><h3>${speaker}: гранатомётный залп</h3><p><strong>Активация:</strong> 2 действия. <strong>Боеприпасы:</strong> встроенный магазин (2 заряда).</p><p><strong>Встроенная способность:</strong> @UUID[${SPELL}]{Fireball — огненный взрыв} (ранг 3). Выберите точку в пределах дальности способности. Все существа в 20-футовом взрыве совершают @Check[reflex|dc:${dc}|basic|showDC:all]{базовый спасбросок Рефлекса КС ${dc}}.</p><p><strong>Урон:</strong> @Damage[6d6[fire]] огнём. Полный урон при провале, половина при успехе, двойной при критическом провале, без урона при критическом успехе.</p></section>`;
}
async function defaultSend(html,item){
 const editor=globalThis.TextEditor??globalThis.foundry?.applications?.ux?.TextEditor?.implementation;
 const content=typeof editor?.enrichHTML==='function'?await editor.enrichHTML(html,{async:true,rollData:item.actor?.getRollData?.()??{}}):html;
 return await globalThis.ChatMessage.create({content,speaker:globalThis.ChatMessage.getSpeaker({actor:item.actor}),flags:{[MOD]:{launcherItemId:item.id,spellUuid:SPELL}}});
}
export async function fireGrenade1614(item,{send=defaultSend}={}){
 if(!grenadeItem(item)||!item.actor)throw Error('Гранатомёт доступен только на листе владельца.');
 if(grenadeRemaining(item)<=0)throw Error('Встроенный магазин гранатомёта пуст. Перезарядите его (2 действия).');
 const html=grenadeCardHTML(item);
 await send(html,item); // dispatch a single chat card; never decrease ammo if message fails
 const before=grenadeRemaining(item);
 await item.update({[`flags.${MOD}.grenadeRemaining`]:before-1},{render:false});
 return {dc:grenadeDC(item),remaining:before-1};
}
export async function reloadGrenade1614(item){
 if(!grenadeItem(item)||!item.actor)throw Error('Нужен предмет гранатомёта в инвентаре персонажа.');
 await item.update({[`flags.${MOD}.grenadeRemaining`]:Number(item.system?.ammo?.capacity??2)});
 return grenadeRemaining(item);
}
function renderButton(app,html){
 const item=app?.document??app?.item;
 if(!grenadeItem(item)||!item?.actor)return;
 const root=html?.[0]??html;
 if(!root?.querySelector||root.querySelector('[data-cpel-grenade-control="1"]'))return;
 const panel=globalThis.document?.createElement?.('div');if(!panel)return;
 panel.dataset.cpelGrenadeControl='1';panel.style.cssText='display:flex;gap:8px;align-items:center;margin:7px;padding:6px;flex-wrap:wrap';
 const attack=globalThis.document.createElement('button');attack.type='button';attack.textContent=`Гранатомётный залп (КС ${grenadeDC(item)})`;
 const reload=globalThis.document.createElement('button');reload.type='button';reload.textContent='Перезарядить (2 действия)';
 const count=globalThis.document.createElement('span');count.textContent=`Заряды: ${grenadeRemaining(item)}/${item.system?.ammo?.capacity??2}`;
 const refresh=()=>{count.textContent=`Заряды: ${grenadeRemaining(item)}/${item.system?.ammo?.capacity??2}`;attack.disabled=grenadeRemaining(item)<1;};
 attack.addEventListener('click',async()=>{try{await fireGrenade1614(item);refresh();}catch(e){globalThis.ui?.notifications?.error?.(e.message);}});
 reload.addEventListener('click',async()=>{try{await reloadGrenade1614(item);refresh();}catch(e){globalThis.ui?.notifications?.error?.(e.message);}});
 panel.append(attack,reload,count);(root.querySelector('.sheet-body')??root.querySelector('form')??root).append(panel);refresh();
}
if(globalThis.Hooks?.on){
 Hooks.on('renderItemSheet',renderButton);
 Hooks.on('renderItemSheetV2',renderButton);
 Hooks.on('renderItemSheetPF2e',renderButton);
}
