/** User-requested CPEL 1.6.19 item corrections; browser-safe and side-effect free. */
import {CORRECTIONS_1619 as catalog} from './data/item-corrections-1619.mjs';
export const MODULE_1619='cyberpunk-equipment-library';
export const CREATOR_1619='cyberpunk-implant-creator';
const REMASTER='cyberpunk-remaster';
const byId=new Map(catalog.map(x=>[x.id,x])),byName=new Map(catalog.map(x=>[x.name,x]));
const copy=x=>structuredClone(x),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function correction1619Identity(src){
 const refs=[src?._stats?.compendiumSource,src?._stats?.duplicateSource,src?.flags?.core?.sourceId,src?.sourceId];
 if(refs.some(ref=>typeof ref==='string'&&ref.startsWith('Compendium.')&&ref.split('.')[1]!==MODULE_1619))return null;
 for(const ref of refs){
  if(typeof ref!=='string'||!ref.startsWith('Compendium.'))continue;
  const bits=ref.split('.');
  const id=bits[3]==='Item'?bits[4]:bits[3],row=byId.get(id);if(row&&row.pack===bits[2])return row;
 }
 const direct=byId.get(src?._id??src?.id);if(direct)return direct;
 if(String(src?.img??'').startsWith('modules/'+MODULE_1619+'/'))return byName.get(src.name)??null;
 return null;
}
function costDescription(html,costs){
 for(const [field,label]of [['hardCost','Hard Cost'],['stressFormula','Stress Cost'],['slotsUsed','Слоты']]){
  if(costs[field]===undefined)continue;
  const value=field==='stressFormula'&&costs[field]!=='0'?'[[/r '+costs[field]+' #Потеря Человечности]]':String(costs[field]);
  const re=new RegExp('(<strong>'+label+':<\\/strong>\\s*)(?:\\[\\[\\/r[^\\]]*\\]\\]|[^<]*)(?=<)','gu');
  if(re.test(html))html=html.replace(re,(_m,lead)=>lead+value);
  else html+='<p><strong>'+label+':</strong> '+value+'</p>';
 }
 return html;
}
const texts={
 deck:'<p>Компактная кибердека подключается непосредственно к нейролинку. Нейронный интерфейс обеспечивает доступ к её программам и аппаратным опциям без размещения вычислительного блока в киберруке.</p><p><strong>Механика SF2e:</strong> модуль нейролинка даёт один дополнительный слот связанной совместимой кибердеке. Извлечение требует отключения и демонтажа у специалиста.</p>',
 bastion:'<p>Внутри корпуса спрятаны складные композитные пластины. При критическом попадании они сходятся вокруг центральных узлов ПКТ, принимая на себя часть последующего урона.</p><p><strong>Захлопнуть броню:</strong> реакция при получении критического попадания, один раз в день. Вы получаете 60 временных ОЗ и сопротивление 10 дробящему, колющему и режущему урону до начала вашего следующего хода. Временные ОЗ не складываются с другими временными ОЗ.</p>',
 anchor:'<p><strong>Зацепиться:</strong> в режиме «Якорь» КС проверки @Check[reflex]{Рефлекса} или @Check[acrobatics]{Акробатики} для действия «Зацепиться» уменьшается на 5. В броске это представлено отдельной поправкой +5 к результату проверки, эквивалентной снижению КС на 5.</p>',
 flywheel:'<p>Маховики и суперконденсаторы собирают часть энергии движения корпуса и разово возвращают её в приводную систему. При разряде накопленный импульс проходит по резервной шине, выравнивает питание и помогает приводам выйти из аварийного рассогласования.</p><p><strong>Разрядить Маховик:</strong> свободное действие, один раз в час. Снимает с владельца состояние «Сбоящий». Кинетический резерв на 1 раунд сохраняет прежние преимущества: +10 футов бонуса состояния к наземной Скорости и +1 предмета к Атлетике.</p>',
 carapace:'<p>Моторизованные пластины меняют перекрытие и угол брони. В осадной конфигурации повреждённые секции можно последовательно заменять свежими защитными поверхностями.</p><p><strong>Осадная геометрия:</strong> 1 действие, длительность 10 минут. При активации вы получаете 10 временных ОЗ; сохраняется штраф состояния −5 футов к наземной Скорости.</p><p><strong>Обновить пластины:</strong> 1 действие, пока активна Осадная геометрия. Вы вновь получаете 10 временных ОЗ; они не складываются с оставшимися временными ОЗ и не заменяют больший запас.</p><p><strong>Прикрыться бронёй:</strong> 1 действие, пока активна Осадная геометрия. Даёт +2 обстоятельства к КБ до начала вашего следующего хода.</p>',
 mirage:'<p>Распределённые излучатели искажённо возвращают свет и электронные сигнатуры в системы машинного наблюдения. Вместо силуэта ПКТ камеры получают согласованное изображение окружающего фона.</p><p><strong>Развернуть ложные сигнатуры:</strong> на время активации вы невидимы для камер: обычные, инфракрасные и подключённые к охранной сети камеры не фиксируют изображение корпуса. Живые наблюдатели продолжают видеть вас; звук, физические контакты и отдельные некамерные датчики действуют обычно. Сохраняется прежний бонус обстоятельства +2 к Скрытности.</p>',
 scarab:'<p>В полостях корпуса хранится рой микроремонтников. Они запаивают кабели, возвращают на место микроприводы и восстанавливают повреждённые магистрали прямо во время боя.</p><p><strong>Саморемонт:</strong> 2 действия, один раз в день. На 5 раундов вы получаете быстрое исцеление 10, восстанавливающее 10 ОЗ в начале каждого вашего хода. Это ремонт ПКТ; органическому телу система бесполезна.</p><p>Рой не восстанавливает уничтоженные конечности, оружие или сорванные внешние модули.</p>',
 cryo:'<p>Фазовый теплоаккумулятор принимает тепло с перегретых участков корпуса и сбрасывает его через радиаторы. Быстрое охлаждение гасит горящий состав на обшивке.</p><p><strong>Криосброс:</strong> реакция, когда вы должны получить постоянный урон огнём, один раз в час. Немедленно прекращает все действующие на вас эффекты постоянного урона огнём. Сопротивление огню не предоставляется.</p><p>После сброса корпус покрывается инеем и заметным паром.</p>',
};
function specialDescription(html,row,body){
 const tag='<section data-cpel-1619="'+row.special+'">';
 if(html.includes(tag))return html.replace(new RegExp('<section data-cpel-1619="'+row.special+'">[\\s\\S]*?<\\/section>','u'),tag+body+'</section>');
 const before=row.before.description??'',oldBody=before.split('<hr')[0];
 if(row.special==='anchor')return html.includes('<hr')?html.replace(/<hr/u,tag+body+'</section><hr'):html+tag+body+'</section>';
 if(oldBody&&html.includes(oldBody))return html.replace(oldBody,tag+body+'</section>');
 return tag+body+'</section>'+html;
}
function activationDescription(html,a){
 html=html.replace(/<section\b[^>]*data-cic-activation[\s\S]*?<\/section>/gu,'').trim();
 const glyph={reaction:'Reaction',free:'Free',action1:'Action 1',action2:'Action 2',action3:'Action 3'}[a.actionType]??'Action 1';
 const frequency={day:'Один раз в день',hour:'Один раз в час',encounter:'Один раз за столкновение'}[a.frequency];
 return html+'<section data-cic-activation="true"><hr><p><strong>Активация — '+a.name+':</strong> @Glyph['+glyph+']</p>'+(frequency?'<p><strong>Частота:</strong> '+frequency+'</p>':'')+(a.trigger?'<p><strong>Триггер:</strong> '+a.trigger+'</p>':'')+'<p><strong>Длительность:</strong> '+a.duration.value+' '+({rounds:'раундов',minutes:'минут'}[a.duration.unit]??a.duration.unit)+'</p><p><strong>Эффект:</strong> '+a.effectDescription+'</p></section>';
}
function managedRules(existing,oldRules,newRules,tag){
 const kept=(existing??[]).filter(r=>!oldRules.some(old=>same(old,r))&&!String(r.slug??'').startsWith(tag)&&r.option!==tag);
 return [...kept,...newRules];
}
function patchSpecial(s,row){
 const kind=row.special;if(!kind)return;
 const f=s.flags??={},r=f[REMASTER]??={},creator=f[CREATOR_1619]??={};
 if(kind==='deck'){
  r.pktParentFamily='neural-link';r.pktFamily='neural-integrated-cyberdeck';r.slotsUsed=2;
  if(s.img===row.before.img)s.img=row.before.img.replace(/\.webp$/u,'-v2.webp');
 }
 if(kind.startsWith('tendons')){
  const tier=Number(kind.at(-1)),bonus=[10,15,20,25][tier-1],base=row.before.rules.find(x=>x.key==='FlatModifier'&&(x.selector==='land-speed'||x.selector?.includes?.('land-speed')))?.value??5,option='cpel-pair-'+row.id.toLowerCase(),oldOption='cpel-carbon-tendons-'+tier;
  const selected=s.system.rules?.find(x=>x.option===option)?.selection??s.system.rules?.find(x=>x.option===oldOption)?.selection;
  const selection=selected==='paired'?'paired':'single';
  const rules=[{key:'RollOption',domain:'all',option,label:'Сопряжение — Углеволоконные сухожилия',toggleable:true,mergeable:true,alwaysActive:true,value:true,selection,suboptions:[{label:'1 модуль',value:'single'},{label:'2 модуля',value:'paired'}]},
   {key:'FlatModifier',selector:'land-speed',type:'item',value:base,slug:option+'-single',predicate:[option+':single'],label:'Углеволоконные сухожилия — один модуль'},
   {key:'FlatModifier',selector:'land-speed',type:'item',value:bonus,slug:option+'-paired',predicate:[option+':paired'],label:'Углеволоконные сухожилия — сопряжённая пара'}];
  const retained=(s.system.rules??[]).filter(x=>x.option!==oldOption&&!String(x.slug??'').startsWith(oldOption));
  s.system.rules=managedRules(retained,row.before.rules,rules,option);
  Object.assign(r,{cyberware:true,implantType:'module',slotsUsed:r.slotsUsed??1,hardCost:r.hardCost??2,stressFormula:r.stressFormula??'1d6',pktParentFamily:'cyber-leg',pktFamily:'carbon-tendons-'+tier});
  const desc='<p>Углеволоконные тяги распределяют усилие приводов. Один модуль сохраняет бонус предмета +'+base+' футов к наземной Скорости; два модуля этой версии дают общий бонус предмета +'+bonus+' футов. Выберите «1 модуль» или «2 модуля» в единственном общем переключателе сопряжения на листе. Бонус пары учитывается один раз и не складывается между двумя копиями модуля.</p>';
  s.system.description.value=specialDescription(s.system.description.value,row,desc);
 }
 if(texts[kind])s.system.description.value=specialDescription(s.system.description.value,row,texts[kind]);
 if(kind==='anchor'){
  const slug='cpel-anchor-edge-1619';
  if(!s.system.rules.some(x=>x.slug===slug))s.system.rules.push({key:'FlatModifier',selector:['reflex','acrobatics'],value:5,slug,predicate:['pkt-anchor-mode','action:grab-an-edge'],label:'«Якорь» — КС Зацепиться ниже на 5'});
 }
 const a=creator.activation;
 if(a){
  if(kind==='bastion'){
   a.effectRules=(a.effectRules??[]).filter(x=>x.key!=='TempHP');a.effectRules.push({key:'TempHP',value:60});
   for(const type of ['bludgeoning','piercing','slashing']){const existing=a.effectRules.find(x=>x.key==='Resistance'&&x.type===type);if(existing)existing.value=10;else a.effectRules.push({key:'Resistance',type,value:10});}
   a.effectDescription='60 временных ОЗ и сопротивление 10 дробящему, колющему и режущему урону до начала следующего хода.';
  }
  if(kind==='flywheel')a.effectDescription='Снимает состояние «Сбоящий». На 1 раунд +10 футов бонуса состояния к наземной Скорости и +1 предмета к Атлетике.';
  if(kind==='carapace'){
   a.effectRules=(a.effectRules??[]).filter(x=>x.key!=='TempHP'&&!(x.key==='FlatModifier'&&x.selector==='ac'));a.effectRules.push({key:'TempHP',value:10});
   a.effectDescription='10 временных ОЗ при активации; −5 футов к наземной Скорости. Пока эффект активен, действия «Обновить пластины» и «Прикрыться бронёй» позволяют вновь получить 10 временных ОЗ или +2 обстоятельства к КБ до начала следующего хода.';
  }
  if(kind==='mirage'){
   if(!a.effectRules.some(x=>x.key==='RollOption'&&x.option==='cpel:camera-invisible'))a.effectRules.push({key:'RollOption',domain:'all',option:'cpel:camera-invisible',value:true});
   a.effectDescription='Невидимость для камер на время активации. Живые наблюдатели и некамерные датчики действуют обычно. +2 обстоятельства к Скрытности.';
  }
  if(kind==='scarab'){
   for(const rule of a.effectRules??[])if(rule.key==='FastHealing')rule.value=10;
   a.effectDescription='Быстрое исцеление 10: восстанавливайте 10 ОЗ в начале каждого своего хода в течение 5 раундов. Ремонт действует только на ПКТ.';
  }
  if(kind==='cryo'){
   a.effectRules=(a.effectRules??[]).filter(x=>!(x.key==='Resistance'&&x.type==='fire'));
   a.trigger='Вы должны получить постоянный урон огнём.';
   a.effectDescription='Немедленно снимает все эффекты постоянного урона огнём. Сопротивление огню не предоставляется.';
  }
  if(['bastion','flywheel','carapace','mirage','scarab','cryo'].includes(kind))s.system.description.value=activationDescription(s.system.description.value,a);
 }
 f[REMASTER]=r;if(Object.keys(creator).length)f[CREATOR_1619]=creator;else delete f[CREATOR_1619];s.flags=f;
}
function classText(value){
 return value.replace(/@Check\[fortitude\|(?:dc:\d+|against:class)(?:\|showDC:all)?\](?:\{[^}]*\})?/gu,'@Check[fortitude|against:class|showDC:all]{Стойкость против КС класса владельца}')
  .replace(/Стойкость КС (?:13|15)/gu,'@Check[fortitude|against:class|showDC:all]{Стойкость против КС класса владельца}')
  .replace(/против КС (?:13|15)/gu,'против КС класса владельца');
}
function patchAmmo(s,row){
 if(row.arrow)s.system.baseItem='arrows';
 if(row.classDC){
  s.system.description.value=classText(s.system.description.value);
  for(const rule of s.system.rules??[])if(typeof rule.text==='string')rule.text=classText(rule.text);
 }
}
export function patch1619Source(input){
 const s=copy(input??{}),row=correction1619Identity(s);
 if(row){
  s.system??={};s.system.description??={value:''};s.system.rules??=[];
  if(row.type==='ammo')patchAmmo(s,row);
  else{
   s.flags??={};s.flags[REMASTER]??={};Object.assign(s.flags[REMASTER],row.costs);
   s.system.description.value=costDescription(s.system.description.value??'',row.costs);patchSpecial(s,row);
  }
 }
 for(const child of s.system?.subitems??[])Object.assign(child,patch1619Source(child));
 return s;
}
export function correction1619Update(document){
 const original=document?._source??document?.toObject?.(true)??document??{},patched=patch1619Source(original),update={};
 function compare(a,b,path=''){
  if(same(a,b))return;
  if(Array.isArray(a)||Array.isArray(b)||!a||!b||typeof a!=='object'||typeof b!=='object'){update[path]=b;return;}
  for(const key of new Set([...Object.keys(a),...Object.keys(b)]))compare(a[key],b[key],path?path+'.'+key:key);
 }
 compare(original,patched);return Object.keys(update).length?update:null;
}
