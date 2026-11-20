import { PRESET_ABILITIES } from './preset-abilities.mjs';
import { ROLE_PROFILES } from './presets.mjs';
import { ROLE_SPECIALTY_SPECS } from './canonical-role-abilities.mjs';

const FORBIDDEN_MAGIC = new Set(['arcane','divine','occult','primal','magical','spell','focus','cantrip']);

function ability(id, name, actionType='passive', actions=null, category='interaction', description='', options={}) {
  const traits = Object.freeze([...(options.traits ?? [])]);
  if (traits.some((trait) => FORBIDDEN_MAGIC.has(trait))) throw new Error(`Magical trait not allowed in Neon Forge ability: ${id}`);
  const numericTarget = options.numericTarget ?? '';
  return Object.freeze({
    id, name, actionType,
    actions: actionType === 'action' ? Math.max(1, Math.min(3, Number(actions) || 1)) : null,
    category, traits, description,
    rules: Object.freeze(structuredClone(options.rules ?? [])),
    requirements: Object.freeze({
      allTags:Object.freeze([...(options.allTags ?? [])]),
      anyTags:Object.freeze([...(options.anyTags ?? [])]),
      forbiddenTags:Object.freeze([...(options.forbiddenTags ?? [])]),
    }),
    minLevel: Number.isFinite(options.minLevel) ? Number(options.minLevel) : 0,
    maxLevel: Number.isFinite(options.maxLevel) ? Number(options.maxLevel) : 20,
    weight: Number(options.weight ?? 10),
    sourceRef: options.sourceRef ?? '',
    exclusiveGroup: options.exclusiveGroup ?? '',
    tier: Number.isInteger(options.tier) ? Math.max(0, Math.min(3, options.tier)) : 0,
    upgradeOf: options.upgradeOf ?? '',
    variantOf: options.variantOf ?? '',
    numericTarget,
  });
}

function roleAbility(roleId, spec) {
  const id = `${roleId}-signature-${spec.key}`;
  const upgradeOf = spec.upgradeOfKey ? `${roleId}-signature-${spec.upgradeOfKey}` : '';
  return ability(id, spec.name, spec.actionType, spec.actions, spec.category, spec.description, {
    traits: spec.traits,
    rules: spec.rules,
    allTags: spec.allTags,
    anyTags: spec.anyTags,
    forbiddenTags: spec.forbiddenTags,
    minLevel: spec.minLevel,
    maxLevel: spec.maxLevel,
    weight: spec.weight ?? (spec.tier ? 20 + spec.tier * 4 : 17),
    sourceRef: spec.sourceRef,
    exclusiveGroup: `role-${roleId}-${spec.group ?? spec.key}`,
    tier: spec.tier,
    upgradeOf,
    variantOf: spec.variantOf,
    numericTarget: spec.numericTarget,
  });
}

const COMMON = {
  'common-combat-movement': [
    ability('combat-reposition','Тактическая смена позиции','action',1,'defensive','<p>NPC Перемещается вплоть до половины Скорости и должен закончить движение в укрытии, за препятствием или рядом с союзником. Это действие не создаёт дополнительную атаку.</p>',{traits:['move'],exclusiveGroup:'common-movement'}),
    ability('combat-angle-step','Сместить угол','action',1,'defensive','<p>NPC Шагает на 5 футов так, чтобы изменить линию огня на выбранную видимую цель. Если новая клетка не меняет линию или укрытие, действие нельзя использовать.</p>',{traits:['move'],exclusiveGroup:'common-angle'}),
    ability('combat-cross-lane','Пересечь линию','reaction',null,'defensive','<p><strong>Триггер:</strong> союзник заканчивает перемещение и освобождает соседнюю клетку в укрытии. NPC может Шагнуть на 5 футов в эту клетку, если она действительно улучшает его укрытие.</p>',{exclusiveGroup:'common-cross-lane'}),
    ability('combat-route-mode','Маршрут движения','free',null,'interaction','<p><strong>Частота:</strong> один раз за раунд. NPC переключает режим маршрута между «укрытие», «сближение» и «отход»; следующее действие move в этом раунде должно соответствовать выбранному режиму.</p>',{exclusiveGroup:'common-route-mode'}),
  ],
  'common-cover': [
    ability('combat-cover-settle','Осесть в укрытии','action',1,'defensive','<p>Если NPC находится рядом с подходящим укрытием, он Укрывается и выбирает одну сторону укрытия как основной сектор до начала следующего хода.</p>',{exclusiveGroup:'common-cover-action'}),
    ability('combat-cover-transfer','Передать укрытие','reaction',null,'defensive','<p><strong>Триггер:</strong> союзник рядом с NPC покидает укрытие и освобождает защищённую клетку. NPC может Шагнуть на 5 футов в эту клетку.</p>',{exclusiveGroup:'common-cover-transfer'}),
    ability('combat-cover-sector','Сектор из укрытия','free',null,'interaction','<p><strong>Частота:</strong> один раз за раунд. Находясь в укрытии, NPC переключает основной сектор между левым, центральным и правым направлением.</p>',{exclusiveGroup:'common-cover-sector'}),
    ability('combat-cover-discipline','Закреплённое укрытие','passive',null,'defensive','<p>Пока NPC находится в укрытии и с начала хода не Перемещался, первая дальнобойная атака против него из выбранного сектора получает дополнительный обстоятельственный штраф -1, если укрытие уже даёт защиту от этой атаки.</p>',{exclusiveGroup:'common-cover-passive',numericTarget:'incoming-ranged-attack-roll:cover-sector'}),
  ],
  'common-focus-fire': [
    ability('combat-coordinated-pressure','Согласованное давление','action',1,'offensive','<p>NPC выбирает видимую цель, которую союзник атаковал с начала прошлого хода. Первая атака NPC по этой цели до конца хода получает обстоятельственный бонус +1.</p>',{traits:['concentrate'],exclusiveGroup:'common-focus-action',numericTarget:'attack-roll:designated-target'}),
    ability('combat-follow-hit','Подхватить попадание','reaction',null,'offensive','<p><strong>Триггер:</strong> союзник наносит урон видимой цели в пределах 30 футов. NPC может сделать эту цель своим приоритетом до начала следующего хода; реакция сама по себе не совершает атаку.</p>',{exclusiveGroup:'common-focus-reaction'}),
    ability('combat-call-target','Назначить цель','free',null,'interaction','<p><strong>Частота:</strong> один раз за раунд. NPC обозначает одну видимую угрозу как приоритетную цель группы до начала своего следующего хода.</p>',{traits:['auditory'],exclusiveGroup:'common-focus-free'}),
    ability('combat-shared-mark','Общая метка','passive',null,'offensive','<p>Если текущая приоритетная цель NPC также отмечена союзником его группы, NPC не меняет приоритет из-за другой цели, пока отмеченная цель остаётся видимой или не становится недоступной.</p>',{exclusiveGroup:'common-focus-passive'}),
  ],
  'common-disengage': [
    ability('combat-break-contact','Разрыв контакта','reaction',null,'defensive','<p><strong>Триггер:</strong> враг заканчивает движение рядом с NPC. Если путь свободен, NPC может Шагнуть на 5 футов только от этого врага.</p>',{exclusiveGroup:'common-disengage-reaction'}),
    ability('combat-withdraw','Организованный отход','action',1,'defensive','<p>NPC Шагает на 5 футов, затем может Переместиться ещё на 5 футов к укрытию или выходу. Вторая часть движения не может приближать его к ближайшему видимому врагу.</p>',{traits:['move'],exclusiveGroup:'common-disengage-action'}),
    ability('combat-withdraw-mode','Приоритет отхода','free',null,'interaction','<p><strong>Частота:</strong> один раз за раунд. NPC переключает приоритет отхода между «укрытие», «выход» и «союзник» и выбирает соответствующую точку.</p>',{exclusiveGroup:'common-disengage-free'}),
  ],
  'common-command': [
    ability('combat-command-step','Команда: Шаг','action',1,'interaction','<p>Один союзник в пределах 30 футов, который слышит NPC, может Шагнуть на 5 футов к обозначенному укрытию или от отмеченной угрозы.</p>',{traits:['auditory','linguistic'],exclusiveGroup:'common-command-action'}),
    ability('combat-command-correct','Поправить приказ','reaction',null,'interaction','<p><strong>Триггер:</strong> союзник в пределах 30 футов заканчивает движение не в обозначенной ранее точке. NPC может сменить точку приказа на клетку, где союзник фактически завершил движение.</p>',{traits:['auditory','linguistic'],exclusiveGroup:'common-command-reaction'}),
    ability('combat-command-priority','Командный приоритет','free',null,'interaction','<p><strong>Частота:</strong> один раз за раунд. NPC переключает приоритет команды между «атака», «укрытие» и «эвакуация» и называет одну связанную цель или точку.</p>',{traits:['auditory','linguistic'],exclusiveGroup:'common-command-free'}),
    ability('combat-command-link','Сохранять приказ','passive',null,'interaction','<p>Пока хотя бы один союзник в пределах 30 футов слышит NPC, последний объявленный командный приоритет сохраняется до следующего переключения или потери связи.</p>',{exclusiveGroup:'common-command-passive'}),
  ],
  'common-defense': [
    ability('combat-brace','Упереться','action',1,'defensive','<p>До начала следующего хода NPC получает обстоятельственный бонус +1 к Athletics DC против Shove, Reposition и Trip.</p>',{exclusiveGroup:'common-brace',numericTarget:'dc:athletics:shove-reposition-trip'}),
    ability('combat-deflect-route','Сместиться от угрозы','reaction',null,'defensive','<p><strong>Триггер:</strong> NPC успешно проходит Reflex save против area effect. NPC может Шагнуть на 5 футов за пределы опасной зоны, если свободная клетка доступна.</p>',{exclusiveGroup:'common-reflex-step'}),
    ability('combat-defense-mode','Режим защиты','free',null,'interaction','<p><strong>Частота:</strong> один раз за раунд. NPC переключает защитный режим между «дистанция», «ближний бой» и «эффекты области»; режим определяет, от какой угрозы он в первую очередь ищет укрытие или дистанцию.</p>',{exclusiveGroup:'common-defense-mode'}),
    ability('combat-stable-footing','Устойчивая опора','passive',null,'defensive','<p>Если NPC с начала прошлого хода не Перемещался более чем на 5 футов, первое forced movement против него за раунд не может сдвинуть его более чем на 10 футов.</p>',{exclusiveGroup:'common-stable-footing'}),
  ],
};

const DOCTRINE = {
  'trained-patrol': [
    ability('patrol-challenge','Процедура остановки','action',1,'interaction','<p>NPC громко обозначает требование остановиться и назначает одного видимого нарушителя приоритетной целью группы до начала следующего хода.</p>',{traits:['auditory','linguistic'],sourceRef:'Night City 2045 — Security Organizations',exclusiveGroup:'doctrine-patrol-challenge'}),
    ability('patrol-paired-cover','Парное прикрытие','passive',null,'defensive','<p>Пока NPC находится в укрытии рядом с союзником той же патрульной группы, первый Шаг одного из них в раунде не снимает приоритет укрытия у второго.</p>',{sourceRef:'Night City 2045 — Security Organizations',exclusiveGroup:'doctrine-patrol-cover'}),
  ],
  'veteran-fireteam': [
    ability('veteran-bounding','Перебежка отделения','action',1,'defensive','<p>NPC Перемещается вплоть до половины Скорости к укрытию, пока союзник видит маршрут. После движения NPC не может использовать ещё одно действие move в этот ход.</p>',{traits:['move'],sourceRef:'Night City 2045 — Factions — 6th Street',exclusiveGroup:'doctrine-veteran-bounding'}),
    ability('veteran-focus-fire','Командный огонь','free',null,'offensive','<p><strong>Частота:</strong> один раз за раунд. NPC переключает приоритет огня на цель, которую уже атаковал союзник; приоритет действует до начала следующего хода.</p>',{traits:['auditory'],sourceRef:'Night City 2045 — Factions — 6th Street',exclusiveGroup:'doctrine-veteran-focus'}),
  ],
  'professional-extraction': [
    ability('extraction-corridor','Коридор эвакуации','passive',null,'defensive','<p>Пока NPC находится между пациентом и отмеченной точкой эвакуации, первое forced movement пациента в сторону от этой точки уменьшается на 5 футов, если NPC физически может удерживать коридор.</p>',{sourceRef:'Night City 2045 — Security Organizations — Trauma Team',exclusiveGroup:'doctrine-extraction-corridor'}),
    ability('extraction-cover-withdrawal','Прикрыть отход','reaction',null,'defensive','<p><strong>Триггер:</strong> медик или пациент начинает отход из соседней клетки. NPC может Шагнуть на 5 футов в освободившуюся клетку или на линию между отходящим и видимой угрозой.</p>',{sourceRef:'Night City 2045 — Security Organizations — Trauma Team',exclusiveGroup:'doctrine-extraction-reaction'}),
  ],
  'riot-control': [
    ability('riot-push-line','Давление линии','action',1,'offensive','<p>NPC выполняет Shove или Reposition вместо Удара, если цель находится в обозначенной линии контроля.</p>',{sourceRef:'Night City 2045 — Factions — NCPD',exclusiveGroup:'doctrine-riot-push'}),
    ability('riot-nonlethal','Нелетальный приоритет','passive',null,'interaction','<p>Когда NPC применяет оружие или средство с nonlethal против цели, которую требуется задержать, его Intimidation check для Demoralize этой цели получает обстоятельственный бонус +1.</p>',{anyTags:['has:nonlethal','has:shield'],sourceRef:'Night City 2045 — Factions — NCPD',exclusiveGroup:'doctrine-riot-nonlethal',numericTarget:'skill:intimidation:demoralize-detainment'}),
  ],
  'corporate-breach': [
    ability('breach-stack','Стек у входа','passive',null,'defensive','<p>Если NPC начинает ход рядом с союзником у подготовленной точки входа, первый Шаг после пересечения этой точки может быть выполнен в боковую клетку, даже если общий маршрут группы идёт прямо.</p>',{sourceRef:'Night City 2045 — Security Organizations',exclusiveGroup:'doctrine-breach-stack'}),
    ability('breach-entry','Вход по команде','action',2,'offensive','<p>NPC Перемещается вплоть до половины Скорости через подготовленный проход и затем может совершить один Удар по цели, которую видит после пересечения входа.</p>',{traits:['move'],sourceRef:'Night City 2045 — Security Organizations',exclusiveGroup:'doctrine-breach-entry'}),
  ],
  'gang-swarm': [
    ability('gang-swarm-pressure','Толпа давит','passive',null,'offensive','<p>Если цель соседствует как минимум с двумя союзниками NPC, первый успешный ближний Удар NPC по этой цели в раунде наносит 1 дополнительный урон.</p>',{sourceRef:'Night City 2045 — Factions',exclusiveGroup:'doctrine-gang-swarm'}),
  ],
  'anti-cyberware-hunter': [
    ability('anti-cyberware-priority','Приоритет: хром','free',null,'interaction','<p><strong>Частота:</strong> один раз за раунд. NPC переключает приоритет охоты на одну видимо кибернетически усиленную цель; приоритет снимается, если цель больше не видна.</p>',{sourceRef:'Night City 2045 — Factions — Inquisitors',exclusiveGroup:'doctrine-anti-cyberware'}),
  ],
  'mobile-honor-guard': [
    ability('mobile-guard-relocate','Мобильная охрана','action',1,'defensive','<p>NPC Перемещается вплоть до половины Скорости к охраняемому союзнику, выходу или точке контроля и должен закончить рядом с выбранным объектом.</p>',{traits:['move'],sourceRef:'Night City 2045 — Factions',exclusiveGroup:'doctrine-mobile-guard'}),
  ],
  'professional-pmc': [
    ability('pmc-threat-scan','Оценка угрозы PMC','free',null,'interaction','<p><strong>Частота:</strong> один раз за столкновение. NPC переключает приоритет группы на одну видимую угрозу и объявляет связанную точку укрытия или огневой сектор.</p>',{traits:['concentrate'],sourceRef:'Night City 2045 — Security Organizations — Lazarus',exclusiveGroup:'doctrine-pmc-scan'}),
    ability('pmc-fire-discipline','Дисциплина боекомплекта','passive',null,'offensive','<p>Если NPC в прошлом раунде не совершал атаки, первая атака текущего раунда не может быть заменена на подавляющий режим, расходующий больше боеприпасов, пока обычная атака доступна.</p>',{sourceRef:'Night City 2045 — Security Organizations',exclusiveGroup:'doctrine-pmc-discipline'}),
  ],
  'max-tac-response': [
    ability('maxtac-isolate-threat','Изоляция киберпсиха','passive',null,'offensive','<p>Пока отмеченная главная угроза активна, NPC не переключает приоритет на второстепенную цель, если та не наносит ему урон или не блокирует путь.</p>',{sourceRef:'Night City 2045 — Security Organizations — MAX-TAC',exclusiveGroup:'doctrine-maxtac-isolate'}),
    ability('maxtac-hard-entry','Жёсткий вход MAX-TAC','action',2,'offensive','<p>NPC Перемещается вплоть до половины Скорости и совершает один Удар, если движение заканчивается ближе к отмеченной главной угрозе.</p>',{traits:['move'],sourceRef:'Night City 2045 — Security Organizations — MAX-TAC',exclusiveGroup:'doctrine-maxtac-entry'}),
  ],
  'nomad-patrol': [
    ability('nomad-mobile-cover','Транспорт как укрытие','passive',null,'defensive','<p>Пока NPC находится рядом со своим транспортом и транспорт реально предоставляет укрытие, первый Шаг NPC за раунд может проходить вдоль корпуса транспорта, не меняя выбранный маршрут отхода.</p>',{sourceRef:'Night City 2045 — Factions — Nomad Nations',exclusiveGroup:'doctrine-nomad-cover'}),
  ],
};

const EQUIPMENT = {
  'shield-core': [
    ability('shield-wall','Щитовая стена','passive',null,'defensive','<p>Пока NPC держит щит и соседствует с союзником, первый противник, пытающийся пройти между их клетками, не может считать промежуток свободным проходом без отдельной механики обхода.</p>',{allTags:['has:shield'],exclusiveGroup:'equipment-shield-wall'}),
    ability('shield-cover-ally','Прикрыть союзника щитом','reaction',null,'defensive','<p><strong>Триггер:</strong> соседний союзник становится целью атаки, а щит можно физически поставить между ним и атакующим. Союзник получает обстоятельственный бонус +1 к КБ против этой атаки.</p>',{allTags:['has:shield'],exclusiveGroup:'equipment-shield-cover',numericTarget:'ac-vs-triggering-attack'}),
    ability('shield-advance','Продвижение под щитом','action',2,'defensive','<p>NPC Перемещается вплоть до половины Скорости. До начала следующего хода он получает обстоятельственный бонус +1 к КБ против дистанционных атак, если щит находится между ним и атакующим.</p>',{allTags:['has:shield'],traits:['move'],exclusiveGroup:'equipment-shield-advance',numericTarget:'ac-vs-ranged-through-shield'}),
    ability('shield-shove','Оттеснение щитом','action',1,'offensive','<p>NPC выполняет Shove соседней цели, используя Athletics и удерживаемый щит; это не является Ударом оружием.</p>',{allTags:['has:shield'],traits:['attack'],exclusiveGroup:'equipment-shield-shove'}),
    ability('shield-chokepoint','Щит в проходе','passive',null,'defensive','<p>Пока NPC держит щит в проходе шириной в одну клетку и не Перемещался в этот ход, первый forced movement против него уменьшается на 5 футов.</p>',{allTags:['has:shield'],exclusiveGroup:'equipment-shield-chokepoint'}),
  ],
  'shotgun-breach': [
    ability('shotgun-door-control','Дробовик у проёма','passive',null,'offensive','<p>Если NPC с дробовиком находится не дальше 10 футов от двери/прохода, первая атака по цели, только что пересёкшей этот проём, получает обстоятельственный бонус +1.</p>',{allTags:['has:shotgun'],exclusiveGroup:'equipment-shotgun-breach',numericTarget:'ranged-attack-roll:doorway'}),
  ],
  'rifle-fireteam': [
    ability('rifle-support','Винтовочная поддержка','passive',null,'offensive','<p>Если союзник в пределах 30 футов Переместился к укрытию с начала прошлого хода, первая дальнобойная атака NPC с винтовкой по цели, видимой этому союзнику, получает обстоятельственный бонус +1.</p>',{allTags:['has:rifle'],exclusiveGroup:'equipment-rifle-support',numericTarget:'ranged-attack-roll:fireteam-support'}),
  ],
  'heavy-weapon-control': [
    ability('heavy-area-denial','Зональное подавление оружием','action',2,'offensive','<p>NPC использует реальный доступный режим тяжёлого оружия для контроля указанной зоны. Если оружие не имеет подходящего area/auto/suppression режима, способность недоступна.</p>',{allTags:['has:heavy-weapon'],exclusiveGroup:'equipment-heavy-control'}),
  ],
  'medical-kit-support': [
    ability('gear-first-aid','Медицинская поддержка набором','action',2,'interaction','<p>NPC использует фактически имеющийся медицинский набор по его обычным правилам; способность не создаёт расходники и не заменяет Medicine check.</p>',{allTags:['has:medical-gear'],traits:['healing','manipulate'],exclusiveGroup:'equipment-medical-kit'}),
  ],
  'jump-boosters-mobile': [
    ability('jump-mobile-angle','Вертикальный угол','action',1,'defensive','<p>NPC использует реальные прыжковые/вертикальные средства, чтобы сменить высоту или пересечь препятствие в пределах их обычных правил; после этого он обозначает новую высоту как текущий сектор.</p>',{allTags:['has:jump-boosters'],traits:['move'],exclusiveGroup:'equipment-jump-boosters'}),
  ],
  'cyberdeck-support': [
    ability('cyberdeck-cover','Резерв сетевого канала','passive',null,'interaction','<p>Пока NPC имеет рабочую кибердеку, потеря одного открытого сетевого узла не снимает выбранный сетевой приоритет, если остаётся другой открытый узел того же контура.</p>',{allTags:['has:cyberdeck'],exclusiveGroup:'equipment-cyberdeck'}),
  ],
  'smart-weapon-link': [
    ability('smart-link-track','Смарт-метка оружия','passive',null,'offensive','<p>Пока NPC использует совместимое smart-оружие, смена приоритетной цели свободным действием сохраняет метку оружия только на новой цели; старая метка снимается.</p>',{allTags:['has:smart-weapon'],exclusiveGroup:'equipment-smart-link'}),
  ],
};

const RANK = {
  'elite-operator': [ability('elite-tempo','Темп элитного оператора','free',null,'interaction','<p><strong>Частота:</strong> один раз за столкновение. NPC переключает текущий сектор/стойку и немедленно Шагает на 5 футов; это не создаёт дополнительную атаку.</p>',{minLevel:11,exclusiveGroup:'rank-elite-tempo'})],
  'commander': [ability('commander-order','Командирский приказ','reaction',null,'interaction','<p><strong>Триггер:</strong> союзник в пределах 30 футов завершает действие. Командир меняет приоритет этого союзника на одну безопасную клетку; союзник может Шагнуть на 5 футов, если слышит приказ.</p>',{minLevel:8,traits:['auditory','linguistic'],exclusiveGroup:'rank-commander-order'})],
  'cyberpsycho-pressure': [ability('cyberpsycho-pressure','Неослабевающее давление','passive',null,'offensive','<p>Пока приоритетная цель киберпсиха остаётся видимой, первая его добровольная попытка отойти дальше от неё в раунде недоступна, если только путь к цели полностью не перекрыт.</p>',{exclusiveGroup:'rank-cyberpsycho-pressure'})],
  'pkt-operator': [ability('pkt-system-discipline','Контурная дисциплина ПКТ','passive',null,'defensive','<p>Пока у ПКТ активен один боевой контур, попытка активировать другой контур того же exclusiveGroup сначала автоматически завершает текущий; два таких контура никогда не действуют одновременно.</p>',{exclusiveGroup:'rank-pkt-discipline'})],
};

const LEGACY_NUMERIC_TARGET = Object.freeze({
  'corporate-patrol':'attack-roll:ally-vs-detention-target',
  'corporate-sniper':'ranged-attack-roll',
  'corporate-netwatch':'network-defense',
  solo:'attack-and-save-vs-designated-target',
  netrunner:'program-attack-or-dc',
  medic:'speed',
  nomad:'ranged-attack-roll',
  'pkt-operative':'attack-ac-or-speed-by-mode',
});

function legacyAbility(presetId, feature) {
  let description = feature.description;
  if (presetId === 'street-ganger') description = '<p>Если рядом с целью находится хотя бы один союзник бандита, первый успешный Удар бандита по этой цели в раунде наносит 1 дополнительный урон.</p>';
  if (presetId === 'netrunner') description = '<p><strong>Частота:</strong> один раз за раунд. Нетраннер переключает режим на «приоритетный эксплойт» для одного совместимого устройства. Перед следующей программой/квикхаком по этой цели он получает обстоятельственный бонус +1 к броску атаки программы либо увеличивает её КС на 1.</p>';
  if (presetId === 'pkt-operative') description = '<p><strong>Частота:</strong> один раз за раунд. Оперативник переключает боевой контур до начала следующего хода: <strong>Штурм</strong> даёт +1 обстоятельственный бонус к атакам; <strong>Бастион</strong> даёт +1 обстоятельственный бонус к КБ; <strong>Преследование</strong> даёт +5 футов к Скорости. Один контур нельзя выбирать два раунда подряд.</p>';
  return ability(`legacy-${presetId}`, `Наследие — ${feature.name}`, feature.actionType, feature.actions, feature.category, description, {
    traits:feature.traits,
    rules:feature.rules,
    exclusiveGroup:`legacy-${presetId}`,
    numericTarget: LEGACY_NUMERIC_TARGET[presetId] ?? '',
  });
}

const rawPacks = [];
function addPack(id, sourceKind, abilities) { rawPacks.push(Object.freeze({id, sourceKind, abilities:Object.freeze([...abilities])})); }
for (const [id, abilities] of Object.entries(COMMON)) addPack(id, 'common', abilities);
for (const [roleId, specs] of Object.entries(ROLE_SPECIALTY_SPECS)) addPack(`role-${roleId}-specialty`, 'role', specs.map((spec)=>roleAbility(roleId,spec)));
for (const [id, abilities] of Object.entries(DOCTRINE)) addPack(id, 'doctrine', abilities);
for (const [id, abilities] of Object.entries(EQUIPMENT)) addPack(id, 'equipment', abilities);
for (const [id, abilities] of Object.entries(RANK)) addPack(id, 'rank', abilities);
for (const [presetId, feature] of Object.entries(PRESET_ABILITIES)) addPack(`legacy-${presetId}`, 'legacy', [legacyAbility(presetId,feature)]);

const registry = new Map();
const packRefs = new Map();
for (const sourcePack of rawPacks) {
  const refs = [];
  for (const entry of sourcePack.abilities) {
    const existing = registry.get(entry.id);
    if (existing && JSON.stringify(existing) !== JSON.stringify(entry)) throw new Error(`Conflicting canonical Neon Forge ability: ${entry.id}`);
    if (!existing) registry.set(entry.id, entry);
    refs.push(entry.id);
  }
  if (new Set(refs).size !== refs.length) throw new Error(`Duplicate canonical reference inside package: ${sourcePack.id}`);
  packRefs.set(sourcePack.id, Object.freeze({id:sourcePack.id, sourceKind:sourcePack.sourceKind, abilityIds:Object.freeze(refs)}));
}

// Backward-compatible package reference: it points at canonical common abilities instead of owning copies.
const COMPAT_COMBAT_BASIC_IDS = Object.freeze([
  'combat-reposition','combat-angle-step','combat-cross-lane','combat-route-mode',
  'combat-coordinated-pressure','combat-follow-hit','combat-call-target','combat-shared-mark',
  'combat-break-contact','combat-withdraw','combat-withdraw-mode','combat-brace','combat-deflect-route','combat-defense-mode','combat-stable-footing',
]);
packRefs.set('role-combat-basics', Object.freeze({id:'role-combat-basics', sourceKind:'common', abilityIds:COMPAT_COMBAT_BASIC_IDS}));

export const ABILITY_LIBRARY = Object.freeze(Object.fromEntries(registry));
export function abilityById(id) { return ABILITY_LIBRARY[id] ?? null; }
export function packagesForAbility(id) {
  return Object.values(ABILITY_PACKAGES)
    .filter((pack) => pack.id !== 'role-combat-basics' && pack.abilityIds.includes(id))
    .map((pack) => pack.id);
}

export const ABILITY_PACKAGES = Object.freeze(Object.fromEntries([...packRefs].map(([id, packRef]) => [id, Object.freeze({
  ...packRef,
  abilities:Object.freeze(packRef.abilityIds.map((abilityId)=>ABILITY_LIBRARY[abilityId])),
})])));

export function abilityPackage(id){ return ABILITY_PACKAGES[id] ?? null; }
export function allAbilityPackageIds(){ return Object.keys(ABILITY_PACKAGES); }
export function legacyPresetPackageId(presetId){ const id=`legacy-${presetId}`; return ABILITY_PACKAGES[id] ? id : null; }

const COMBAT_COMMON = ['common-combat-movement','common-cover','common-focus-fire','common-disengage','common-defense'];
const COMMAND_COMMON = ['common-command'];
const CIVILIAN_ROLES = new Set(['civilian','merchant','driver','laborer','service','clerk']);
const TECH_ROLES = new Set(['netrunner','technician','forensic','demolitions','droneOperator','saboteur','support']);
const COMMAND_ROLES = new Set(['leader','bodyguard','pointman','commando','support']);

export const ROLE_PACKAGE_MAP = Object.freeze(Object.fromEntries(Object.keys(ROLE_PROFILES).map((roleId) => {
  const refs = [`role-${roleId}-specialty`];
  if (!CIVILIAN_ROLES.has(roleId)) {
    if (TECH_ROLES.has(roleId)) refs.push('common-cover','common-disengage','common-defense');
    else refs.push(...COMBAT_COMMON);
  }
  if (COMMAND_ROLES.has(roleId)) refs.push(...COMMAND_COMMON);
  return [roleId,Object.freeze([...new Set(refs)])];
})));
