import {uniquePktEconomy1621Identity} from './unique-pkt-economy-1621.mjs';

const MOD = 'cyberpunk-equipment-library';
const physicalTypes = ['bludgeoning', 'piercing', 'slashing'];
const armorTypes = ['fire', 'cold', 'electricity', 'acid', 'force', 'void'];
const resistance = type => ({key: 'Resistance', type, value: 10});

function modifier(selector, type, before, after, text, {afterType = type, predicate = []} = {}) {
  return {
    rules: [{key: 'FlatModifier', selector, type, before, after, afterType, predicate}],
    text,
  };
}

function armorClass(before, after) {
  return modifier('ac', 'circumstance', before, after, [
    `бонус обстоятельства +${before} к КБ.`,
    `бонус без типа +${after} к КБ.`,
  ], {afterType: 'untyped'});
}

function physicalCoating(before, after) {
  return {
    rules: physicalTypes.map(type => ({key: 'Resistance', type, before, after, afterType: type})),
    text: [
      `сопротивление ${before} дробящему, колющему и режущему урону.`,
      `сопротивление ${after} дробящему, колющему и режущему урону.`,
    ],
  };
}

const items = new Map([
  ['MBMwa9XqoJnV7dJo', {name: 'Защитное покрытие «Драгун»', ...armorClass(1, 1)}],
  ['ly8I90faZCI344gb', {name: 'Адаптивное защитное покрытие «Драгун 2.0»', ...armorClass(2, 2)}],
  ['b3629fbf09cb121d', {
    name: 'IEC DRG: Несущая силовая рама «Titan Spine»',
    ...modifier('athletics', 'circumstance', 2, 4, [
      'бонус обстоятельства +2 к проверкам @Check[athletics]{Атлетики}.',
      'бонус обстоятельства +4 к проверкам @Check[athletics]{Атлетики}.',
    ]),
  }],
  ['60672fdf4b36fe56', {name: 'IEC DRG: Секционные панели «Ceramic Bastion»', ...armorClass(1, 2)}],
  ['0de70a5a83ecb6e7', {
    name: 'IEC DRG: Следящий лидар «TrackTrace»',
    ...modifier('survival', 'circumstance', 2, 3, [
      'бонус обстоятельства +2 к проверкам @Check[survival]{Выживания}',
      'бонус обстоятельства +3 к проверкам @Check[survival]{Выживания}',
    ], {predicate: ['action:track']}),
  }],
  ['f12ac04d5d536a6a', {
    name: 'IEC: Броня DRG-SP40 «Monoceramic»',
    rules: [],
    resistances: armorTypes,
    text: [
      'сопротивление 10 урону огнём.',
      'сопротивление 10 каждому из следующих типов урона: огонь, холод, электричество, кислота, силовой урон и пустота.',
    ],
  }],
  ['b2185fb1b1518cf5', {
    name: 'IEC: Приводы REF-15 / MA-25',
    ...modifier('reflex', 'item', 2, 3, [
      'бонус предмета +2 к спасброскам @Check[reflex]{Рефлекса}.',
      'бонус предмета +3 к спасброскам @Check[reflex]{Рефлекса}.',
    ]),
  }],
  ['76a805592385f3b0', {
    name: 'IEC: Combat Crystal — боевой командный контур',
    ...modifier('attack-roll', 'circumstance', 2, 3, [
      'бонус обстоятельства +2 к броскам атак.',
      'бонус обстоятельства +3 к броскам атак.',
    ], {predicate: ['iec-dragoon-target-lock']}),
  }],
  ['eggcw0l4JPm5Vu7N', {name: 'Защитное покрытие — лёгкое', ...physicalCoating(3, 5)}],
  ['1O2Mxhg1cidgZfN7', {name: 'Защитное покрытие — средние', ...physicalCoating(5, 10)}],
  ['lZBy3wXsUFtM6n0w', {name: 'Защитное покрытие — тяжёлое', ...physicalCoating(10, 15)}],
]);

const names = new Map([...items.values()].map(item => [item.name, item]));

function identify(source) {
  if (source?.type !== 'equipment') return null;
  const references = [
    source._stats?.compendiumSource, source._stats?.duplicateSource,
    source.flags?.core?.sourceId, source.sourceId,
  ].filter(ref => typeof ref === 'string' && ref.startsWith('Compendium.'));
  if (references.some(ref => ref.split('.')[1] !== MOD)) return null;
  const identity = uniquePktEconomy1621Identity(source);
  if (identity) return items.get(identity.id);
  if (references.length) {
    const implant = references.find(ref => ref.startsWith(`Compendium.${MOD}.implants.`));
    return items.get(implant?.split('.').at(-1));
  }
  return items.get(source._id) ?? (
    source.img?.startsWith?.(`modules/${MOD}/assets/`) ? names.get(source.name) : null
  );
}

const oneOf = (value, expected) =>
  value === expected || (Array.isArray(value) && value.length === 1 && value[0] === expected);

function matches(rule, spec, updated = false) {
  const type = updated ? spec.afterType : spec.type;
  const predicate = rule?.predicate ?? [];
  const expected = spec.predicate ?? [];
  return rule?.key === spec.key && oneOf(rule.type, type) &&
    (spec.selector === undefined || oneOf(rule.selector, spec.selector)) &&
    rule.value === (updated ? spec.after : spec.before) &&
    Array.isArray(predicate) && predicate.length === expected.length &&
    predicate.every((entry, index) => entry === expected[index]);
}

function hasResistance(rule, type) {
  return rule?.key === 'Resistance' &&
    (Array.isArray(rule.type) ? rule.type.includes(type) : rule.type === type);
}

/** Update only the identified stock modifiers and matching description text. */
export function dragoonProtection1630Update(source) {
  const item = identify(source);
  const original = source?.system?.rules;
  if (!item || !Array.isArray(original)) return null;

  const rules = original.map(rule => {
    const spec = item.rules.find(spec => matches(rule, spec));
    return spec ? {...rule, type: spec.afterType, value: spec.after} : rule;
  });
  let complete = item.rules.every(spec => rules.some(rule => matches(rule, spec, true)));
  if (item.resistances) {
    const stockResistance = (type, value) => rules.some(rule =>
      hasResistance(rule, type) && rule.value === value && !rule.predicate?.length);
    if (stockResistance('physical', 15) && stockResistance('fire', 10)) {
      for (const type of item.resistances) {
        if (!rules.some(rule => hasResistance(rule, type))) rules.push(resistance(type));
      }
    }
    complete = stockResistance('physical', 15) && item.resistances.every(type => stockResistance(type, 10));
  }

  const update = {};
  if (rules.length !== original.length || rules.some((rule, index) => rule !== original[index])) {
    update['system.rules'] = rules;
  }
  const html = source.system.description?.value;
  if (complete && typeof html === 'string' && html.includes(item.text[0])) {
    update['system.description.value'] = html.replace(item.text[0], item.text[1]);
  }
  return Object.keys(update).length ? update : null;
}

export function patchDragoonProtection1630Profile(profile, id) {
  const update = dragoonProtection1630Update({
    _id: id, type: 'equipment',
    system: {rules: JSON.parse(profile.rulesJson || '[]'), description: {value: profile.bodyHtml}},
  });
  if (!update) return profile;
  return {
    ...profile,
    rulesJson: update['system.rules'] ? JSON.stringify(update['system.rules']) : profile.rulesJson,
    bodyHtml: update['system.description.value'] ?? profile.bodyHtml,
  };
}
