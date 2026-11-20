import {applyIllustratedIcons} from './illustrated-icons.mjs';
import { calculateHumanity } from "../neon-forge/runtime/humanity.mjs";
import {
  HOST_MODULE_ID,
  LEGACY_MODULE_ID,
  MODULE_ID as REMASTER_MODULE_ID,
  parseCyberwareDescription,
  safeInt,
} from "../neon-forge/runtime/cyberware-schema.mjs";

const MODULE_ID = "cyberpunk-equipment-library";
const VERSION = "1.5.73";
const PACK_ID = `${MODULE_ID}.gear`;
const SOURCE_TITLE = "Data Pool 1.6.4 / Cyberpunk Equipment Library";
const DRUG_ICON = "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/consumables/consumables-e47938c4f2cd4eb2.webp";
const MED_ICON = "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/consumables/consumables-9631971473bd2b1d.webp";
const STIM_ICON = "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/consumables/consumables-db40fc00b1a07e09.webp";
const PSYCHO_ICON = "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/consumables/consumables-28381bfa199f67a9.webp";
const FIRE_ICON = "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/consumables/consumables-912c9cda2f85f110.webp";

function checkLink(dc) {
  return `@Check[fortitude|dc:${dc}|traits:consumable,drug,poison]{Стойкость КС ${dc}}`;
}

function dataPoolDescription(title, body, rulesText) {
  return [
    `<p><strong>${title}</strong></p>`,
    `<p>${body}</p>`,
    `<hr><p><strong>Эффект:</strong> ${rulesText}</p>`,
  ].join("");
}

const EFFECTS_FOLDER_ID = "f76c28dc361577d8";
export const CONDITION_DOCUMENT_IDS = Object.freeze({
  Clumsy: "i3OJZU2nk64Df3xm",
  Confused: "yblD8fOR1J8rDwEQ",
  Dazzled: "TkIyaNPgTZFBCCuh",
  Deafened: "9PR9y0bi4JPKnHPR",
  Drained: "4D2KBtexWXa6oUMR",
  Fatigued: "HL2l2VRSaQHu9lUw",
  Fleeing: "sDPxOjQ9kx2RZE8D",
  Frightened: "TBSHQspnbcqxsmjL",
  Slowed: "xYTAsEpcJE1Ccni3",
  Stupefied: "e1XGnhKNSQIm5IXg",
  Unconscious: "fBnFDH2MTzgFijKf",
});

export function sf2eConditionUuid(name) {
  const id = CONDITION_DOCUMENT_IDS[name];
  if (!id) throw new Error(`Unknown SF2e condition: ${name}`);
  return `Compendium.sf2e.conditions.Item.${id}`;
}

const CONDITION_UUIDS = {
  "Ослеплён": sf2eConditionUuid("Dazzled"),
  "Без сознания": sf2eConditionUuid("Unconscious"),
  "Замешательство": sf2eConditionUuid("Confused"),
  "Неуклюжесть": sf2eConditionUuid("Clumsy"),
  "Одурманен": sf2eConditionUuid("Stupefied"),
  "Утомлён": sf2eConditionUuid("Fatigued"),
  "Замедлен": sf2eConditionUuid("Slowed"),
  "Истощён": sf2eConditionUuid("Drained"),
  "Напуган": sf2eConditionUuid("Frightened"),
  "Бегство": sf2eConditionUuid("Fleeing"),
};

function linkSystemTerms(value) {
  const source = String(value ?? "");
  const pattern = /Ослеплён|Без сознания|Замешательство|Неуклюжесть(?: \d+)?|Одурманен(?: \d+)?|Утомлён|Замедлен(?: \d+)?|Истощён(?: \d+)?|Напуган(?: \d+)?|Бегство/gu;
  return source.replace(pattern, (term) => {
    const entry = Object.entries(CONDITION_UUIDS).find(([label]) => term === label || term.startsWith(`${label} `));
    if (!entry) return term;
    const [label, uuid] = entry;
    return `@UUID[${uuid}]{${term}}`;
  });
}

function structuredDescription(title, paragraphs = [], sections = []) {
  const flavor = paragraphs.map((paragraph, index) =>
    `<p data-cpel-flavor="substance-${index + 1}">${paragraph}</p>`,
  );
  return [
    `<p><strong>${title}</strong></p>`,
    ...flavor,
    ...sections.map(([label, value]) => `<p><strong>${label}:</strong> ${linkSystemTerms(value)}</p>`),
  ].join("");
}

function conditionGrant(uuid, badge = null) {
  return {
    key: "GrantItem",
    uuid,
    inMemoryOnly: true,
    ...(badge === null ? {} : {
      alterations: [{ mode: "override", property: "badge-value", value: badge }],
    }),
  };
}

export const SUBSTANCES_1555 = [
  {
    key: "emerald-city",
    itemId: "feb80c0a747611bd",
    effectId: "7947b743f516b9fc",
    name: "Изумрудный город / Emerald City",
    effectName: "Эффект: Изумрудный город — Стадия 1",
    icon: PSYCHO_ICON,
    level: 5,
    rarity: "uncommon",
    price: 100,
    duration: { value: 8, unit: "hours" },
    description: structuredDescription(
      "Изумрудный город",
      [
        "Густая изумрудно-зелёная жидкость в прозрачных одноразовых ампулах. Под неоном раствор кажется почти светящимся, а после вскрытия пахнет сладкой мятой, озоном и дешёвым синтетическим лаймом. На языке остаётся холодное металлическое послевкусие, будто лизнули контакты батарейки.",
        "Через несколько минут цвета становятся ярче, шум города складывается в приятный ритм, а знакомые лица кажутся безопаснее, чем они есть на самом деле. Чем глубже препарат захватывает нервную систему, тем сильнее зрительные следы, ложные движения на краю зрения и уверенность, что происходящее под полным контролем.",
      ],
      [
        ["Спасбросок", `${checkLink(15)}`],
        ["Возникновение", "1 час"],
        ["Максимальная продолжительность", "8 часов"],
        ["Стадия 1", `Персонаж получает состояние <strong>Ослеплён</strong> из-за цветовых шлейфов и ложных бликов (1 час). @UUID[Compendium.${PACK_ID}.Item.7947b743f516b9fc]{Применить стадию 1}`],
        ["Стадия 2", `Сенсорная перегрузка усиливается: <strong>Одурманен 1</strong> (1 час). @UUID[Compendium.${PACK_ID}.Item.4959ef85c358f51f]{Применить стадию 2}`],
        ["Стадия 3", `Реальность и галлюцинации смешиваются: <strong>Одурманен 2</strong> и <strong>Замешательство</strong> (1 час). @UUID[Compendium.${PACK_ID}.Item.42fcbfdfc0b6811c]{Применить стадию 3}`],
        ["Переход между стадиями", `В конце каждого часа выполните ${checkLink(15)}. Критический успех снижает стадию на 2, успех — на 1, провал не меняет её, критический провал повышает на 1. Если стадия падает ниже 1, действие заканчивается.`],
      ],
    ),
    rulesText: "Ослеплён. В конце часа выполните Стойкость КС 15 и измените стадию согласно описанию препарата.",
    effectRules: [],
    stageEffects: [
      {
        stage: 1,
        effectId: "7947b743f516b9fc",
        effectName: "Эффект: Изумрудный город — Стадия 1",
        duration: { value: 1, unit: "hours" },
        rulesText: "Изумрудный город — Стадия 1: Ослеплён. В конце часа выполните Стойкость КС 15.",
        effectRules: [conditionGrant(sf2eConditionUuid("Dazzled"))],
      },
      {
        stage: 2,
        effectId: "4959ef85c358f51f",
        effectName: "Эффект: Изумрудный город — Стадия 2",
        duration: { value: 1, unit: "hours" },
        rulesText: "Изумрудный город — Стадия 2: Одурманен 1. В конце часа выполните Стойкость КС 15.",
        effectRules: [conditionGrant(sf2eConditionUuid("Stupefied"), 1)],
      },
      {
        stage: 3,
        effectId: "42fcbfdfc0b6811c",
        effectName: "Эффект: Изумрудный город — Стадия 3",
        duration: { value: 1, unit: "hours" },
        rulesText: "Изумрудный город — Стадия 3: Одурманен 2 и Замешательство. В конце часа выполните Стойкость КС 15.",
        effectRules: [
          conditionGrant(sf2eConditionUuid("Stupefied"), 2),
          conditionGrant(sf2eConditionUuid("Confused")),
        ],
      },
    ],
  },
  {
    key: "immunoblockers",
    itemId: "0a681890e9b9841f",
    effectId: "02e035e01114af2c",
    name: "Иммуноблокаторы / Immunoblockers",
    effectName: "Эффект: Иммуноблокаторы",
    icon: MED_ICON,
    level: 8,
    rarity: "rare",
    price: 100,
    duration: { value: 1, unit: "hours" },
    description: structuredDescription(
      "Иммуноблокаторы",
      [
        "Стерильный молочно-белый раствор, который обычно продают в защищённых автоинъекторах с медицинской маркировкой. У препарата почти нет запаха, но во рту после введения появляется сухой привкус пластика и антисептика.",
        "Через несколько минут эмоциональные пики будто срезает: страх становится далёким, паника приглушается, а навязчивые мысли перестают цепляться друг за друга. Обратная сторона — ощущение эмоциональной пустоты и тяжёлая усталость после окончания действия.",
      ],
      [
        ["Эффект", `При применении пользователь восстанавливает [[/r 2d6 #Иммуноблокаторы — восстановление Человечности]] Человечности, но не выше текущего максимума. На 1 час он также получает +1 предметный бонус к спасброскам Воли против эффектов с признаками <strong>ментальный</strong>, <strong>эмоция</strong> или <strong>страх</strong>; состояние Напуган уменьшается на 1.`],
        ["Откат", `После окончания эффекта выполните ${checkLink(21)}. При провале восстановленная этой дозой Человечность теряется и персонаж получает состояние Утомлён на 10 минут. Если в течение 60 секунд не ввести 2 дополнительные дозы, он дополнительно теряет [[/r 4d6 #Иммуноблокаторы — срыв Человечности]] Человечности.`],
      ],
    ),
    rulesText: "Иммуноблокаторы: при применении восстановите 2d6 Человечности до максимума; +1 предметный бонус к Воле против ментальных, эмоциональных эффектов и страха; Напуган уменьшается на 1. Откат: Стойкость КС 21, при провале потеря восстановленной Человечности и Утомлён.",
    effectRules: [
      { key: "FlatModifier", selector: "will", value: 1, type: "item", slug: "immunoblockers-will", label: "Иммуноблокаторы", predicate: [{ or: ["item:trait:mental", "item:trait:emotion", "item:trait:fear"] }] },
      { key: "RollOption", domain: "all", option: "cpel:immunoblockers", toggleable: false },
    ],
  },
  {
    key: "red-lace",
    itemId: "90af2abae594482e",
    effectId: "b92e260c0f3c7246",
    name: "Красное Кружево / Red Lace",
    effectName: "Эффект: Красное Кружево — Стадия 1",
    icon: DRUG_ICON,
    level: 7,
    rarity: "uncommon",
    price: 110,
    duration: { value: 10, unit: "minutes" },
    description: structuredDescription(
      "Красное Кружево",
      [
        "Красное Кружево выглядит как вязкий алый гель с тонкими тёмными прожилками, будто внутри ампулы действительно свернули крошечную нить кружева. При распылении пахнет горячим металлом, перцем и сладким растворителем.",
        "Препарат разгоняет пульс и превращает раздражение в почти приятную ярость. Мышцы кажутся сильнее, удары — тяжелее, а опасность — чем-то далёким и несущественным. На высокой дозе пальцы начинают дрожать, координация рассыпается, а злость мешает думать на несколько секунд вперёд.",
      ],
      [
        ["Спасбросок", `${checkLink(17)}`],
        ["Возникновение", "1 раунд"],
        ["Максимальная продолжительность", "10 минут"],
        ["Человечность", `Если пользователь ещё не зависим от Красного Кружева, при применении он теряет [[/r 1d6 #Красное Кружево — потеря Человечности]] Человечности.`],
        ["Стадия 1", `+2 статусного бонуса к урону Ударов в ближнем бою, но –1 статусный штраф к КБ (1 минута).`],
        ["Стадия 2", `Эффекты Стадии 1 сохраняются; дополнительно <strong>Неуклюжесть 1</strong> (1 минута).`],
        ["Стадия 3", `+2 к урону Ударов в ближнем бою, –1 к КБ, <strong>Неуклюжесть 1</strong> и <strong>Одурманен 1</strong> (1 минута).`],
      ],
    ),
    rulesText: "+2 статусного бонуса к урону Ударов в ближнем бою и –1 статусный штраф к КБ.",
    effectRules: [],
    stageEffects: [
      { stage: 1, effectId: "b92e260c0f3c7246", effectName: "Эффект: Красное Кружево — Стадия 1", duration: { value: 1, unit: "minutes" }, rulesText: "Красное Кружево — Стадия 1: +2 к урону Ударов в ближнем бою, –1 к КБ.", effectRules: [
        { key: "FlatModifier", selector: "melee-strike-damage", value: 2, type: "status", slug: "red-lace-melee-damage", label: "Красное Кружево" },
        { key: "FlatModifier", selector: "ac", value: -1, type: "status", slug: "red-lace-ac", label: "Красное Кружево" },
      ] },
      { stage: 2, effectId: "be06d59a589a1fa5", effectName: "Эффект: Красное Кружево — Стадия 2", duration: { value: 1, unit: "minutes" }, rulesText: "Красное Кружево — Стадия 2: +2 к урону Ударов в ближнем бою, –1 к КБ, Неуклюжесть 1.", effectRules: [
        { key: "FlatModifier", selector: "melee-strike-damage", value: 2, type: "status", slug: "red-lace-melee-damage", label: "Красное Кружево" },
        { key: "FlatModifier", selector: "ac", value: -1, type: "status", slug: "red-lace-ac", label: "Красное Кружево" },
        conditionGrant(sf2eConditionUuid("Clumsy"), 1),
      ] },
      { stage: 3, effectId: "14bb3cd79ebc4344", effectName: "Эффект: Красное Кружево — Стадия 3", duration: { value: 1, unit: "minutes" }, rulesText: "Красное Кружево — Стадия 3: +2 к урону Ударов в ближнем бою, –1 к КБ, Неуклюжесть 1, Одурманен 1.", effectRules: [
        { key: "FlatModifier", selector: "melee-strike-damage", value: 2, type: "status", slug: "red-lace-melee-damage", label: "Красное Кружево" },
        { key: "FlatModifier", selector: "ac", value: -1, type: "status", slug: "red-lace-ac", label: "Красное Кружево" },
        conditionGrant(sf2eConditionUuid("Clumsy"), 1),
        conditionGrant(sf2eConditionUuid("Stupefied"), 1),
      ] },
    ],
  },
  {
    key: "white-lace",
    itemId: "1178ac954caca8bb",
    effectId: "208385d86b1c17a5",
    name: "Белое Кружево / White Lace",
    effectName: "Эффект: Белое Кружево — Стадия 1",
    icon: DRUG_ICON,
    level: 4,
    rarity: "common",
    price: 20,
    duration: { value: 1, unit: "hours" },
    description: structuredDescription(
      "Белое Кружево",
      [
        "Белое Кружево продаётся в дешёвых прозрачных капсулах, наполненных почти бесцветным порошком с перламутровым блеском. При растворении в воде образует молочную взвесь с запахом цитруса и медицинского спирта.",
        "Первая волна приносит тепло, спокойствие и странное ощущение, будто тело стало легче переносить удары и усталость. Через некоторое время приходит ватная слабость, мысли начинают запаздывать, а попытка удержать высокий темп заканчивается мелкой дрожью и пустотой в голове.",
      ],
      [
        ["Спасбросок", `${checkLink(15)}`],
        ["Возникновение", "1 минута"],
        ["Максимальная продолжительность", "1 час"],
        ["Человечность", `При применении пользователь временно теряет [[/r 1d6 #Белое Кружево — потеря Человечности]] Человечности. Эта потеря возвращается после окончания основной дозы; если вторичный спасбросок ${checkLink(15)} провален, потеря становится постоянной.`],
        ["Стадия 1", `+1 предметный бонус к спасброскам Стойкости (10 минут).`],
        ["Стадия 2", `+1 предметный бонус к Стойкости и состояние <strong>Утомлён</strong> (10 минут).`],
        ["Стадия 3", `<strong>Утомлён</strong> и <strong>Одурманен 1</strong> (10 минут).`],
      ],
    ),
    rulesText: "+1 предметный бонус к Стойкости.",
    effectRules: [],
    stageEffects: [
      { stage: 1, effectId: "208385d86b1c17a5", effectName: "Эффект: Белое Кружево — Стадия 1", duration: { value: 10, unit: "minutes" }, rulesText: "Белое Кружево — Стадия 1: +1 предметный бонус к Стойкости.", effectRules: [
        { key: "FlatModifier", selector: "fortitude", value: 1, type: "item", slug: "white-lace-fortitude", label: "Белое Кружево" },
      ] },
      { stage: 2, effectId: "5af8d664367c969b", effectName: "Эффект: Белое Кружево — Стадия 2", duration: { value: 10, unit: "minutes" }, rulesText: "Белое Кружево — Стадия 2: +1 к Стойкости и Утомлён.", effectRules: [
        { key: "FlatModifier", selector: "fortitude", value: 1, type: "item", slug: "white-lace-fortitude", label: "Белое Кружево" },
        conditionGrant(sf2eConditionUuid("Fatigued")),
      ] },
      { stage: 3, effectId: "c3e6107de373d79a", effectName: "Эффект: Белое Кружево — Стадия 3", duration: { value: 10, unit: "minutes" }, rulesText: "Белое Кружево — Стадия 3: Утомлён и Одурманен 1.", effectRules: [
        conditionGrant(sf2eConditionUuid("Fatigued")),
        conditionGrant(sf2eConditionUuid("Stupefied"), 1),
      ] },
    ],
  },
  {
    key: "antibiotics",
    itemId: "1eb7810d173b0944",
    effectId: "fa96fa7bc1439083",
    name: "Антибиотики / Antibiotics",
    effectName: "Эффект: Антибиотики",
    icon: MED_ICON,
    level: 2,
    rarity: "common",
    price: 0,
    duration: { value: 1, unit: "days" },
    description: structuredDescription(
      "Антибиотики",
      [
        "Набор капсул и одноразовых инъекторов широкого спектра, рассчитанный на полевое лечение бактериальных инфекций. У качественных препаратов почти нет запаха; дешёвые аналоги оставляют во рту меловой вкус и вызывают лёгкую тошноту.",
        "Антибиотик не затягивает раны и не возвращает силы мгновенно. Его работа тише: жар становится слабее, воспаление отступает, дыхание выравнивается, а организм получает шанс переломить течение болезни при следующей проверке.",
      ],
      [
        ["Эффект", `До следующего спасброска против одной болезни вы получаете +1 предметный бонус к этому спасброску. После успешного спасброска дополнительно уменьшите <strong>стадию болезни</strong> на 1.`],
        ["Критический успех", `После обычного результата дополнительно уменьшите стадию болезни ещё на 1.`],
        ["Ограничение", `Одновременно действует только один курс антибиотиков; он не восстанавливает ОЗ.`],
      ],
    ),
    rulesText: "+1 предметный бонус к следующему спасброску против болезни. После успеха уменьшите стадию болезни дополнительно на 1; при критическом успехе — ещё на 1.",
    effectRules: [
      { key: "FlatModifier", selector: "fortitude", value: 1, type: "item", slug: "antibiotics-disease-save", label: "Антибиотики", predicate: ["item:trait:disease"] },
      { key: "Note", selector: ["fortitude"], title: "Антибиотики", text: "Если это спасбросок против болезни: после успеха дополнительно уменьшите стадию болезни на 1; после критического успеха уменьшите её ещё на 1." },
    ],
  },
  {
    key: "rapid-detox",
    itemId: "adb06debea1e0c73",
    effectId: "90dd9480181d843b",
    name: "Быстрый детокс / Rapid Detox",
    effectName: "Эффект: Быстрый детокс",
    icon: MED_ICON,
    level: 4,
    rarity: "uncommon",
    price: 0,
    duration: { value: 1, unit: "rounds" },
    description: structuredDescription(
      "Быстрый детокс",
      [
        "Прозрачная едкая смесь в толстостенном автоинъекторе. После введения по венам проходит ощущение ледяного жжения, во рту появляется вкус меди, а кожа на несколько секунд покрывается холодным потом.",
        "Препарат не «стирает» токсин из организма мгновенно — он резко ускоряет фильтрацию и стабилизирует обмен веществ, давая телу ещё один шанс справиться с действующим ядом или наркотиком.",
      ],
      [
        ["Эффект", `Немедленно повторите один спасбросок Стойкости против действующего яда или наркотика с +2 предметным бонусом.`],
        ["Результат", `Критический успех уменьшает текущую стадию аффликции на 2; успех уменьшает её на 1. Провал и критический провал не ухудшают стадию из-за самого Быстрого детокса.`],
        ["Ограничение", `Не устраняет уже полученный урон и не лечит зависимость.`],
      ],
    ),
    rulesText: "Немедленно повторите один спасбросок Стойкости против действующего яда или наркотика с +2 предметным бонусом. Критический успех снижает стадию на 2, успех — на 1.",
    effectRules: [
      { key: "FlatModifier", selector: "fortitude", value: 2, type: "item", slug: "rapid-detox-poison", label: "Быстрый детокс", predicate: ["item:trait:poison"] },
      { key: "FlatModifier", selector: "fortitude", value: 2, type: "item", slug: "rapid-detox-drug", label: "Быстрый детокс", predicate: ["item:trait:drug"] },
      { key: "Note", selector: ["fortitude"], title: "Быстрый детокс", text: "Повторный спасбросок: критический успех снижает текущую стадию аффликции на 2, успех — на 1. Быстрый детокс сам по себе не ухудшает стадию при провале." },
    ],
  },
  {
    key: "truth-serum",
    itemId: "4b61c7bac20660fd",
    effectId: "e1f2255130bfb435",
    name: "Истина / Truth",
    effectName: "Эффект: Истина",
    icon: MED_ICON,
    level: 6,
    rarity: "uncommon",
    price: 0,
    duration: { value: 10, unit: "minutes" },
    description: structuredDescription(
      "Истина",
      [
        "Бесцветный седативный раствор с едва заметным запахом горького миндаля. Медицинские партии идут в ампулах с фиолетовой маркировкой, а уличные версии часто подкрашивают, чтобы скрыть примеси.",
        "После введения напряжение в мышцах уходит, язык становится тяжелее, а сложные истории требуют слишком много усилий. Препарат не вынуждает говорить правду, но делает последовательную ложь заметно труднее поддерживать.",
      ],
      [
        ["Спасбросок", `${checkLink(17)}`],
        ["Провал", `На 10 минут персонаж получает <strong>Одурманен 1</strong> и –2 статусный штраф к Обману.`],
        ["Допрос", `Проверки Восприятия для распознавания лжи этого персонажа получают +2 обстоятельственный бонус.`],
      ],
    ),
    rulesText: "При провале Стойкости КС 17: Одурманен 1 и –2 к Обману на 10 минут. Проверки Восприятия против лжи пользователя получают +2 обстоятельственный бонус.",
    effectRules: [
      conditionGrant(sf2eConditionUuid("Stupefied"), 1),
      { key: "FlatModifier", selector: "deception", value: -2, type: "status", slug: "truth-serum-deception", label: "Истина" },
      { key: "Note", selector: ["deception"], title: "Истина", text: "Собеседники получают +2 обстоятельственный бонус к проверкам Восприятия, чтобы распознать вашу ложь." },
    ],
  },
  {
    key: "anti-cerebral",
    itemId: "4d5f0fe1f7c70db8",
    effectId: "4ba547138e0d0095",
    name: "Антимозг / Anti-Cerebral",
    effectName: "Эффект: Антимозг — Стадия 1",
    icon: PSYCHO_ICON,
    level: 5,
    rarity: "uncommon",
    price: 60,
    duration: { value: 10, unit: "minutes" },
    description: structuredDescription(
      "Антимозг",
      [
        "Мутная серо-жёлтая жидкость с резким запахом аммиака и старой электроники. Даже микроскопическая капля на коже вызывает покалывание; полноценная доза предназначена не для удовольствия, а для химического подавления воли.",
        "Сначала в груди возникает необъяснимая тревога, затем любой звук кажется предупреждением, а случайное движение — угрозой. На тяжёлых стадиях страх забивает рабочую память: человек видит опасность повсюду и с трудом удерживает мысль дольше нескольких секунд.",
      ],
      [
        ["Спасбросок", `${checkLink(17)}`],
        ["Возникновение", "1 раунд"],
        ["Максимальная продолжительность", "10 минут"],
        ["Человечность", `При первом применении эффекта пользователь теряет 1d6 Человечности. Затем выполните вторичный спасбросок ${checkLink(17)}; при провале он дополнительно теряет [[/r 1d6 #Антимозг — вторичная потеря Человечности]] Человечности.`],
        ["Стадия 1", `<strong>Напуган 1</strong> (1 минута).`],
        ["Стадия 2", `<strong>Напуган 2</strong> и <strong>Одурманен 1</strong> (1 минута).`],
        ["Стадия 3", `<strong>Напуган 3</strong> и <strong>Одурманен 2</strong> (1 минута).`],
      ],
    ),
    rulesText: "Напуган 1.",
    effectRules: [],
    stageEffects: [
      { stage: 1, effectId: "4ba547138e0d0095", effectName: "Эффект: Антимозг — Стадия 1", duration: { value: 1, unit: "minutes" }, rulesText: "Антимозг — Стадия 1: Напуган 1.", effectRules: [conditionGrant(sf2eConditionUuid("Frightened"), 1)] },
      { stage: 2, effectId: "e241426b0d667f89", effectName: "Эффект: Антимозг — Стадия 2", duration: { value: 1, unit: "minutes" }, rulesText: "Антимозг — Стадия 2: Напуган 2, Одурманен 1.", effectRules: [conditionGrant(sf2eConditionUuid("Frightened"), 2), conditionGrant(sf2eConditionUuid("Stupefied"), 1)] },
      { stage: 3, effectId: "9b4c7cfe9d440b60", effectName: "Эффект: Антимозг — Стадия 3", duration: { value: 1, unit: "minutes" }, rulesText: "Антимозг — Стадия 3: Напуган 3, Одурманен 2.", effectRules: [conditionGrant(sf2eConditionUuid("Frightened"), 3), conditionGrant(sf2eConditionUuid("Stupefied"), 2)] },
    ],
  },
  {
    key: "delirium",
    itemId: "de0b649eacfb8d8b",
    effectId: "890279c147c403c2",
    name: "Делириум / Delirium",
    effectName: "Эффект: Делириум — Стадия 1",
    icon: PSYCHO_ICON,
    level: 6,
    rarity: "rare",
    price: 50,
    duration: { value: 10, unit: "minutes" },
    description: structuredDescription(
      "Делириум",
      [
        "Препарат хранится в янтарных ампулах, потому что свет быстро разрушает активные компоненты. Жидкость маслянистая, бесцветная и пахнет аптечной настойкой; после введения зрачки почти сразу расширяются.",
        "Пространство начинает плыть: лампы оставляют шлейфы, шаги звучат слишком громко, а собственные руки ощущаются чужими. На высокой дозе речь собеседников распадается на отдельные слова, равновесие пропадает, а попытка выполнить точное движение превращается в борьбу с собственным телом.",
      ],
      [
        ["Спасбросок", `${checkLink(17)}`],
        ["Возникновение", "1 раунд"],
        ["Максимальная продолжительность", "10 минут"],
        ["Человечность", `После основного эффекта выполните вторичный спасбросок ${checkLink(17)}. Если персонаж зависим от Синего Стекла и проваливает эту проверку, он теряет [[/r 1d6 #Делириум — потеря Человечности]] Человечности.`],
        ["Стадия 1", `<strong>Ослеплён</strong> (1 минута).`],
        ["Стадия 2", `<strong>Ослеплён</strong> и <strong>Неуклюжесть 1</strong> (1 минута).`],
        ["Стадия 3", `<strong>Неуклюжесть 1</strong> и <strong>Одурманен 2</strong> (1 минута).`],
      ],
    ),
    rulesText: "Ослеплён.",
    effectRules: [],
    stageEffects: [
      { stage: 1, effectId: "890279c147c403c2", effectName: "Эффект: Делириум — Стадия 1", duration: { value: 1, unit: "minutes" }, rulesText: "Делириум — Стадия 1: Ослеплён.", effectRules: [conditionGrant(sf2eConditionUuid("Dazzled"))] },
      { stage: 2, effectId: "12da1c73a9ea0a66", effectName: "Эффект: Делириум — Стадия 2", duration: { value: 1, unit: "minutes" }, rulesText: "Делириум — Стадия 2: Ослеплён, Неуклюжесть 1.", effectRules: [conditionGrant(sf2eConditionUuid("Dazzled")), conditionGrant(sf2eConditionUuid("Clumsy"), 1)] },
      { stage: 3, effectId: "28675d1f517078bb", effectName: "Эффект: Делириум — Стадия 3", duration: { value: 1, unit: "minutes" }, rulesText: "Делириум — Стадия 3: Неуклюжесть 1, Одурманен 2.", effectRules: [conditionGrant(sf2eConditionUuid("Clumsy"), 1), conditionGrant(sf2eConditionUuid("Stupefied"), 2)] },
    ],
  },
  {
    key: "mind-flame",
    itemId: "2e568654292b825b",
    effectId: "2471bcde30a01e42",
    name: "Пламя Разума / Mind Flame",
    effectName: "Эффект: Пламя Разума — Стадия 1",
    icon: FIRE_ICON,
    level: 5,
    rarity: "rare",
    price: 50,
    duration: { value: 1, unit: "minutes" },
    description: structuredDescription(
      "Пламя Разума",
      [
        "Бледно-оранжевый раствор с резким горьким запахом. После инъекции язык немеет, во рту появляется вкус раскалённой меди, а сосуды на висках начинают заметно пульсировать.",
        "Боль начинается как точка давления за глазами, быстро разрастается в ослепляющую мигрень и мешает связывать мысли. На тяжёлой стадии даже простое решение требует усилия, а резкая волна боли может на мгновение полностью сорвать действие.",
      ],
      [
        ["Спасбросок", `${checkLink(15)}`],
        ["Возникновение", "1 раунд"],
        ["Максимальная продолжительность", "1 минута"],
        ["Человечность", `После основного эффекта выполните вторичный спасбросок ${checkLink(15)}. Если у персонажа нет Редактора боли, он провалил основной спасбросок и затем проваливает вторичный, то теряет [[/r 1d6 #Пламя Разума — потеря Человечности]] Человечности.`],
        ["Стадия 1", `<strong>Одурманен 1</strong> (1 раунд).`],
        ["Стадия 2", `<strong>Одурманен 2</strong> (1 раунд).`],
        ["Стадия 3", `<strong>Одурманен 2</strong> и <strong>Замедлен 1</strong> (1 раунд).`],
      ],
    ),
    rulesText: "Одурманен 1.",
    effectRules: [],
    stageEffects: [
      { stage: 1, effectId: "2471bcde30a01e42", effectName: "Эффект: Пламя Разума — Стадия 1", duration: { value: 1, unit: "rounds" }, rulesText: "Пламя Разума — Стадия 1: Одурманен 1.", effectRules: [conditionGrant(sf2eConditionUuid("Stupefied"), 1)] },
      { stage: 2, effectId: "d008b558ec17b364", effectName: "Эффект: Пламя Разума — Стадия 2", duration: { value: 1, unit: "rounds" }, rulesText: "Пламя Разума — Стадия 2: Одурманен 2.", effectRules: [conditionGrant(sf2eConditionUuid("Stupefied"), 2)] },
      { stage: 3, effectId: "9b537fe8ab963c0f", effectName: "Эффект: Пламя Разума — Стадия 3", duration: { value: 1, unit: "rounds" }, rulesText: "Пламя Разума — Стадия 3: Одурманен 2, Замедлен 1.", effectRules: [conditionGrant(sf2eConditionUuid("Stupefied"), 2), conditionGrant(sf2eConditionUuid("Slowed"), 1)] },
    ],
  },
  {
    key: "mortal",
    itemId: "f310710f9e5a8733",
    effectId: "17b1010848dd7a14",
    name: "Смертный / Mortal",
    effectName: "Эффект: Смертный — Стадия 1",
    icon: DRUG_ICON,
    level: 10,
    rarity: "rare",
    price: 250,
    duration: { value: 3, unit: "rounds" },
    description: structuredDescription(
      "Смертный",
      [
        "На вид это обычный прозрачный медицинский раствор, и именно поэтому его так любят профессиональные убийцы. Только при встряхивании на поверхности на секунду появляется тонкая радужная плёнка, быстро исчезающая без следа.",
        "После попадания сердце сбивается с ритма, грудь стягивает холодным обручем, а конечности становятся тяжёлыми. Тяжёлая доза лишает тело нормального кровоснабжения настолько быстро, что сознание может просто выключиться раньше, чем жертва поймёт, что произошло.",
      ],
      [
        ["Спасбросок", `${checkLink(21)}`],
        ["Возникновение", "1 раунд"],
        ["Максимальная продолжительность", "3 раунда"],
        ["Стадия 1", `<strong>Утомлён</strong> (1 раунд).`],
        ["Стадия 2", `<strong>Истощён 1</strong> и <strong>Замедлен 1</strong> (1 раунд).`],
        ["Стадия 3", `<strong>Истощён 2</strong> и <strong>Без сознания</strong> (1 раунд).`],
      ],
    ),
    rulesText: "Утомлён.",
    effectRules: [],
    stageEffects: [
      { stage: 1, effectId: "17b1010848dd7a14", effectName: "Эффект: Смертный — Стадия 1", duration: { value: 1, unit: "rounds" }, rulesText: "Смертный — Стадия 1: Утомлён.", effectRules: [conditionGrant(sf2eConditionUuid("Fatigued"))] },
      { stage: 2, effectId: "99626f930c291f89", effectName: "Эффект: Смертный — Стадия 2", duration: { value: 1, unit: "rounds" }, rulesText: "Смертный — Стадия 2: Истощён 1, Замедлен 1.", effectRules: [conditionGrant(sf2eConditionUuid("Drained"), 1), conditionGrant(sf2eConditionUuid("Slowed"), 1)] },
      { stage: 3, effectId: "4a03e26d433b1a7c", effectName: "Эффект: Смертный — Стадия 3", duration: { value: 1, unit: "rounds" }, rulesText: "Смертный — Стадия 3: Истощён 2, Без сознания.", effectRules: [conditionGrant(sf2eConditionUuid("Drained"), 2), conditionGrant(sf2eConditionUuid("Unconscious"))] },
    ],
  },
  {
    key: "frost",
    itemId: "4efe478d36f9dae5",
    effectId: "0ba6e6b1c1e26e5e",
    name: "Иней / Frost",
    effectName: "Эффект: Иней — Стадия 1",
    icon: STIM_ICON,
    level: 6,
    rarity: "uncommon",
    price: 60,
    duration: { value: 24, unit: "hours" },
    description: structuredDescription(
      "Иней",
      [
        "Бледно-голубая суспензия с микроскопическими кристаллами, которые не тают даже в тёплой ампуле. При введении по позвоночнику проходит ощущение ледяной иглы, а на коже выступает мелкая гусиная сыпь.",
        "Сначала это просто неприятная дрожь, но затем мышцы начинают сокращаться сами по себе. Пальцы хуже слушаются, шаг становится рваным, а на тяжёлой стадии длительные спазмы быстро выматывают даже тренированного человека.",
      ],
      [
        ["Спасбросок", `${checkLink(15)}`],
        ["Возникновение", "1 минута"],
        ["Максимальная продолжительность", "24 часа"],
        ["Человечность", `После основного эффекта выполните вторичный спасбросок ${checkLink(15)}. При провале персонаж без Киберпозвоночника теряет [[/r 1d6 #Иней — потеря Человечности]] Человечности.`],
        ["Стадия 1", `<strong>Неуклюжесть 1</strong> (10 минут).`],
        ["Стадия 2", `<strong>Неуклюжесть 2</strong> (10 минут).`],
        ["Стадия 3", `<strong>Неуклюжесть 2</strong> и <strong>Утомлён</strong> (10 минут).`],
        ["Киберпозвоночник", `По решению ведущего усиленный киберпозвоночник может снизить получаемую стадию Инея на 1, поскольку часть спазмов приходится на искусственную опорную систему.`],
      ],
    ),
    rulesText: "Неуклюжесть 1.",
    effectRules: [],
    stageEffects: [
      { stage: 1, effectId: "0ba6e6b1c1e26e5e", effectName: "Эффект: Иней — Стадия 1", duration: { value: 10, unit: "minutes" }, rulesText: "Иней — Стадия 1: Неуклюжесть 1.", effectRules: [conditionGrant(sf2eConditionUuid("Clumsy"), 1)] },
      { stage: 2, effectId: "4ddd350ffb65890a", effectName: "Эффект: Иней — Стадия 2", duration: { value: 10, unit: "minutes" }, rulesText: "Иней — Стадия 2: Неуклюжесть 2.", effectRules: [conditionGrant(sf2eConditionUuid("Clumsy"), 2)] },
      { stage: 3, effectId: "9f745addc4d626f8", effectName: "Эффект: Иней — Стадия 3", duration: { value: 10, unit: "minutes" }, rulesText: "Иней — Стадия 3: Неуклюжесть 2, Утомлён.", effectRules: [conditionGrant(sf2eConditionUuid("Clumsy"), 2), conditionGrant(sf2eConditionUuid("Fatigued"))] },
    ],
  },
  {
    key: "terrifying",
    itemId: "2d72c5607f1ad036",
    effectId: "cce9cbbe5e034905",
    name: "Ужасающий / Terrifying",
    effectName: "Эффект: Ужасающий — Стадия 1",
    icon: PSYCHO_ICON,
    level: 9,
    rarity: "rare",
    price: 40,
    duration: { value: 10, unit: "minutes" },
    description: structuredDescription(
      "Ужасающий",
      [
        "Тёмная маслянистая жидкость с запахом мокрого железа и горелого сахара. Военные партии обычно поставляются в чёрных инъекторах без маркировки; уличные дозы часто разбавляют стимуляторами, отчего препарат становится ещё менее предсказуемым.",
        "Ужасающий не создаёт конкретную галлюцинацию — он выкручивает сам механизм страха. Шорох превращается в шаг преследователя, открытая дверь кажется ловушкой, а знакомое лицо на секунду выглядит враждебным. На предельных стадиях разум перестаёт обсуждать варианты и оставляет только одну команду: бежать.",
      ],
      [
        ["Спасбросок", `${checkLink(18)}`],
        ["Возникновение", "1 раунд"],
        ["Максимальная продолжительность", "10 минут"],
        ["Стадия 1", `<strong>Напуган 1</strong> (1 раунд).`],
        ["Стадия 2", `<strong>Напуган 2</strong> (1 раунд).`],
        ["Стадия 3", `<strong>Напуган 3</strong> (1 раунд).`],
        ["Стадия 4", `<strong>Напуган 4</strong> (1 раунд).`],
        ["Стадия 5", `<strong>Напуган 5</strong> и –5 футов статусного штрафа к наземной Скорости (1 раунд).`],
        ["Стадия 6", `<strong>Напуган 6</strong> и <strong>Бегство</strong> (1 раунд).`],
        ["Стадия 7", `<strong>Напуган 7</strong> и <strong>Бегство</strong> (1 раунд). На этой стадии персонаж не может добровольно приближаться к тому, что воспринимает как источник угрозы.`],
        ["Переход между стадиями", `В конце каждого раунда выполните ${checkLink(18)}. Критический успех снижает стадию на 2, успех — на 1, провал повышает её на 1, критический провал — на 2, максимум до стадии 7.`],
      ],
    ),
    rulesText: "Ужасающий — Стадия 1: Напуган 1.",
    effectRules: [],
    stageEffects: [
      { stage: 1, effectId: "cce9cbbe5e034905", effectName: "Эффект: Ужасающий — Стадия 1", duration: { value: 1, unit: "rounds" }, rulesText: "Ужасающий — Стадия 1: Напуган 1.", effectRules: [conditionGrant(sf2eConditionUuid("Frightened"), 1)] },
      { stage: 2, effectId: "0682c897ac873881", effectName: "Эффект: Ужасающий — Стадия 2", duration: { value: 1, unit: "rounds" }, rulesText: "Ужасающий — Стадия 2: Напуган 2.", effectRules: [conditionGrant(sf2eConditionUuid("Frightened"), 2)] },
      { stage: 3, effectId: "43da2521d7c00528", effectName: "Эффект: Ужасающий — Стадия 3", duration: { value: 1, unit: "rounds" }, rulesText: "Ужасающий — Стадия 3: Напуган 3.", effectRules: [conditionGrant(sf2eConditionUuid("Frightened"), 3)] },
      { stage: 4, effectId: "0f986f447c315419", effectName: "Эффект: Ужасающий — Стадия 4", duration: { value: 1, unit: "rounds" }, rulesText: "Ужасающий — Стадия 4: Напуган 4.", effectRules: [conditionGrant(sf2eConditionUuid("Frightened"), 4)] },
      { stage: 5, effectId: "833e225dc3f50c8f", effectName: "Эффект: Ужасающий — Стадия 5", duration: { value: 1, unit: "rounds" }, rulesText: "Ужасающий — Стадия 5: Напуган 5; наземная Скорость –5 футов.", effectRules: [conditionGrant(sf2eConditionUuid("Frightened"), 5), { key: "FlatModifier", selector: "land-speed", value: -5, type: "status", slug: "terrifying-speed", label: "Ужасающий" }] },
      { stage: 6, effectId: "40ff32b59ce2678d", effectName: "Эффект: Ужасающий — Стадия 6", duration: { value: 1, unit: "rounds" }, rulesText: "Ужасающий — Стадия 6: Напуган 6 и Бегство.", effectRules: [conditionGrant(sf2eConditionUuid("Frightened"), 6), conditionGrant(sf2eConditionUuid("Fleeing"))] },
      { stage: 7, effectId: "8865d66eb56f19ce", effectName: "Эффект: Ужасающий — Стадия 7", duration: { value: 1, unit: "rounds" }, rulesText: "Ужасающий — Стадия 7: Напуган 7 и Бегство; нельзя добровольно приближаться к воспринимаемому источнику угрозы.", effectRules: [conditionGrant(sf2eConditionUuid("Frightened"), 7), conditionGrant(sf2eConditionUuid("Fleeing"))] },
    ],
  },
];

export function classifySpecialEffect(key) {
  switch (key) {
    case "immunoblockers": return "humanity-heal";
    case "anti-cerebral": return "humanity-loss";
    default: return null;
  }
}

export function computeHumanityChange({ current, max }, amount) {
  const safeCurrent = Math.max(0, Math.trunc(Number(current) || 0));
  const safeMax = Math.max(0, Math.trunc(Number(max) || 0));
  const next = Math.min(safeMax, Math.max(0, safeCurrent + Math.trunc(Number(amount) || 0)));
  return { current: next, delta: next - safeCurrent };
}

export function shouldApplyFlameMindTick({ hp, hasPainEditor }) {
  return Number(hp) > 1 && hasPainEditor !== true;
}

export function shouldHandleDocumentEvent(currentUserId, eventUserId) {
  return !eventUserId || currentUserId === eventUserId;
}

function isPrimaryGM() {
  const game = globalThis.game;
  if (!game?.user?.isGM) return false;
  const activeGM = Array.from(game.users ?? []).find((user) => user?.active && user?.isGM) ?? null;
  return !activeGM || activeGM.id === game.user.id;
}

function effectSource(substance, stage = null) {
  const spec = stage ?? substance;
  const rules = [
    { key: "TokenEffectIcon", value: substance.icon },
    ...(spec.effectRules ?? substance.effectRules),
  ];
  return {
    _id: spec.effectId ?? substance.effectId,
    name: spec.effectName ?? substance.effectName,
    type: "effect",
    img: substance.icon,
    folder: EFFECTS_FOLDER_ID,
    system: {
      description: {
        value: `<p><strong>${spec.effectName ?? substance.effectName}</strong></p><p>${linkSystemTerms(spec.rulesText ?? substance.rulesText)}</p><p>Полные правила и проверка указаны в связанном расходнике.</p>`,
      },
      duration: {
        expiry: "turn-start",
        sustained: false,
        unit: (spec.duration ?? substance.duration).unit,
        value: (spec.duration ?? substance.duration).value,
      },
      level: { value: substance.level },
      publication: { title: SOURCE_TITLE, authors: "Alec-Leon / CPEL adaptation", license: "ORC", remaster: true },
      rules,
      start: { initiative: null, value: 0 },
      tokenIcon: { show: true },
      traits: { rarity: substance.rarity, value: [] },
    },
    effects: [],
    flags: {
      [MODULE_ID]: {
        version: VERSION,
        dataPool1555Key: substance.key,
        dataPool1555Kind: "effect",
        specialEffect: stage ? null : classifySpecialEffect(substance.key),
        ...(stage ? { stage: stage.stage } : {}),
      },
    },
    ownership: { default: 0 },
    sort: 0,
  };
}

function consumableSource(substance, { linkScope = "compendium" } = {}) {
  const effectUuid = linkScope === "world"
    ? `Item.${substance.effectId}`
    : `Compendium.${PACK_ID}.Item.${substance.effectId}`;
  return {
    _id: substance.itemId,
    name: substance.name,
    type: "consumable",
    img: substance.icon,
    system: {
      description: {
        gm: "",
        value: `${substance.description}<hr><p>@UUID[${effectUuid}]{Применить эффект: ${substance.effectName.replace(/^Эффект:\s*/, "")}}</p>`,
      },
      rules: [],
      slug: substance.key,
      _migration: { version: 0.959, lastMigration: null, previous: null },
      traits: { otherTags: [], value: ["consumable", "drug"], rarity: substance.rarity },
      publication: { title: SOURCE_TITLE, authors: "Alec-Leon / CPEL adaptation", license: "ORC", remaster: true },
      level: { value: substance.level },
      quantity: 1,
      baseItem: null,
      bulk: { value: 0.1 },
      hp: { value: 0, max: 0 },
      hardness: 0,
      price: { value: { sp: substance.price }, per: 1 },
      equipped: { carryType: "worn" },
      containerId: null,
      size: "tiny",
      material: { type: null, grade: null },
      identification: {
        status: "identified",
        unidentified: {
          name: "Неизвестное вещество",
          img: "systems/sf2e/icons/unidentified_item_icons/drugs.webp",
          data: { description: { value: "" } },
        },
      },
      category: "drug",
      uses: { value: 1, max: 1, autoDestroy: true },
      damage: null,
      usage: { value: "held-in-one-hand" },
      spell: null,
    },
    effects: [],
    flags: {
      [MODULE_ID]: {
        version: VERSION,
        dataPool1555Key: substance.key,
        dataPool1555Kind: "consumable",
        source: "Data Pool 1.6.4",
      },
    },
    ownership: { default: 0 },
    sort: 0,
  };
}

export function buildSubstanceSources(options = {}) {
  return SUBSTANCES_1555.flatMap((substance) => {
    const effects = Array.isArray(substance.stageEffects) && substance.stageEffects.length
      ? substance.stageEffects.map((stage) => effectSource(substance, stage))
      : [effectSource(substance)];
    return [consumableSource(substance, options), ...effects].map(source => applyIllustratedIcons(source, 'gear'));
  });
}

function cyberwareFlag(item, key) {
  return item?.flags?.[MODULE_ID]?.[key]
    ?? item?.flags?.[REMASTER_MODULE_ID]?.[key]
    ?? item?.flags?.[LEGACY_MODULE_ID]?.[key];
}

function isInstalledCyberware(item) {
  const described = parseCyberwareDescription(item);
  const cyberware = Boolean(
    described.implantType
      || described.hardCost !== null
      || cyberwareFlag(item, "cyberware") === true
      || cyberwareFlag(item, "implantType"),
  );
  if (!cyberware) return false;
  const installed = cyberwareFlag(item, "installed");
  return typeof installed === "boolean" ? installed : item?.system?.equipped?.carryType === "implanted";
}

function hardCost(item) {
  const override = item?.flags?.[MODULE_ID]?.hardCostOverride;
  if (override !== undefined && override !== null) return safeInt(override);
  const described = parseCyberwareDescription(item).hardCost;
  if (described !== null) return described;
  const flagged = cyberwareFlag(item, "hardCost");
  return flagged !== undefined && flagged !== null ? safeInt(flagged) : 0;
}

function actorHumanity(actor) {
  const installed = [...(actor?.items ?? [])].filter(isInstalledCyberware);
  return calculateHumanity({
    actor,
    installed,
    adjustments: actor?.synthetics?.[REMASTER_MODULE_ID]?.humanityAdjustments,
    getHardCost: hardCost,
    hardCostMultiplier: 1,
  });
}

async function adjustActorHumanity(actor, amount, { effect = null, restoreOnDelete = false } = {}) {
  if (!actor?.setFlag) return 0;
  const state = actorHumanity(actor);
  const result = computeHumanityChange(state, amount);
  await actor.setFlag(MODULE_ID, "humanity", { current: result.current });
  if (effect?.setFlag && result.delta !== 0) {
    await effect.setFlag(MODULE_ID, "substance1555Runtime", {
      humanityDelta: result.delta,
      restoreOnDelete,
    });
  }
  return result.delta;
}

async function rollFormula(formula, label) {
  const RollClass = globalThis.Roll;
  if (!RollClass) return null;
  const roll = await new RollClass(formula).evaluate();
  await roll.toMessage?.({ flavor: label });
  return Number(roll.total ?? 0);
}

function normalizedItemText(item) {
  return `${item?.slug ?? ""} ${item?.name ?? ""}`.toLocaleLowerCase("ru");
}

function actorHasNamedImplant(actor, patterns) {
  return [...(actor?.items ?? [])].some((item) => {
    if (!isInstalledCyberware(item)) return false;
    const text = normalizedItemText(item);
    return patterns.some((pattern) => text.includes(pattern));
  });
}

function hasPainEditor(actor) {
  return actorHasNamedImplant(actor, ["редактор боли", "pain editor", "pain-editor"]);
}

function hasCyberSpine(actor) {
  return actorHasNamedImplant(actor, ["киберпозвоноч", "cyberspine", "cyber spine"]);
}

function effectKey(item) {
  return item?.flags?.[MODULE_ID]?.dataPool1555Key ?? null;
}

export function isDetoxTargetName(name) {
  const text = String(name ?? "").toLocaleLowerCase("ru");
  if (/антибиот|speedheal|спидхил|быстр.*детокс|rapid detox|иммуноблок|immunoblocker|седатив|sedative|stim(?:\b|уля)|surge|всплеск/.test(text)) return false;
  return /(?:яд|poison|токсин|toxin|наркотик|drug|кружево|lace|смэш|smash|синтококс|synthcoke|\bбуст\b|\bboost\b|прайм[ -]?тайм|prime[ -]?time|sixgun|шестиствол|timewarp|искривлен|синее стекло|blue glass|берсеркер|berserker|изумрудный город|emerald city|делириум|delirium|пламя разума|mind flame|смертный|mortal|\bиней\b|\bfrost\b|ужасающ|terrifying|антимозг|anti-cerebral)/.test(text);
}

function isHarmfulSubstanceEffect(item) {
  if (!item || item.type !== "effect") return false;
  const key = effectKey(item);
  if (["emerald-city", "red-lace", "white-lace", "anti-cerebral", "delirium", "mind-flame", "mortal", "frost", "terrifying"].includes(key)) return true;
  const traits = item.system?.traits?.value ?? [];
  if (traits.includes("poison")) return true;
  return isDetoxTargetName(item.name);
}

async function performDetox(effect) {
  const actor = effect?.parent;
  if (!actor?.deleteEmbeddedDocuments) return;
  const ids = [...(actor.items ?? [])]
    .filter((item) => item.id !== effect.id && isHarmfulSubstanceEffect(item))
    .map((item) => item.id);
  if (ids.length) await actor.deleteEmbeddedDocuments("Item", ids, { render: false, cpelSubstance1555: true });
  if (actor.items?.has?.(effect.id)) {
    await actor.deleteEmbeddedDocuments("Item", [effect.id], { render: false, cpelSubstance1555: true });
  }
}

async function handleCreatedEffect(item, options = {}, userId = null) {
  if (!shouldHandleDocumentEvent(globalThis.game?.user?.id ?? null, userId)) return;
  if (options.cpelSubstance1555 || item?.type !== "effect" || !item?.parent) return;
  const key = effectKey(item);
  if (!key || item.flags?.[MODULE_ID]?.substance1555Runtime?.handled) return;
  const actor = item.parent;
  try {
    switch (key) {
      case "immunoblockers": {
        const total = await rollFormula("2d6", `${item.name}: восстановление Человечности`);
        if (Number.isFinite(total)) await adjustActorHumanity(actor, total, { effect: item, restoreOnDelete: true });
        break;
      }
      case "anti-cerebral": {
        const stage = Number(item?.flags?.[MODULE_ID]?.stage ?? 1);
        if (stage === 1) {
          const total = await rollFormula("1d6", `${item.name}: потеря Человечности`);
          if (Number.isFinite(total)) await adjustActorHumanity(actor, -total, { effect: item, restoreOnDelete: false });
        }
        break;
      }
    }
    if (actor.items?.has?.(item.id)) {
      await item.setFlag(MODULE_ID, "substance1555Runtime.handled", true);
    }
  } catch (error) {
    console.warn(`[${MODULE_ID}] v${VERSION}: ошибка применения вещества ${item.name}`, error);
  }
}

async function handleDeletedEffect(item, options = {}, userId = null) {
  if (!shouldHandleDocumentEvent(globalThis.game?.user?.id ?? null, userId)) return;
  if (options.cpelSubstance1555 || item?.type !== "effect" || !item?.parent) return;
  const runtime = item.flags?.[MODULE_ID]?.substance1555Runtime;
  if (!runtime?.restoreOnDelete || !Number.isFinite(Number(runtime.humanityDelta))) return;
  try {
    await adjustActorHumanity(item.parent, -Number(runtime.humanityDelta));
  } catch (error) {
    console.warn(`[${MODULE_ID}] v${VERSION}: не удалось вернуть временную Человечность`, error);
  }
}

function sanitizeForUpdate(source) {
  const { _id, _stats, ownership, ...rest } = source;
  return rest;
}

async function upsertIntoWorld(sources) {
  let created = 0;
  let updated = 0;
  for (const source of sources) {
    const existing = globalThis.game?.items?.get?.(source._id) ?? null;
    if (existing) {
      await existing.update(sanitizeForUpdate(source), { diff: false, render: false, cpelSubstance1555: true });
      updated++;
    } else {
      // v1.5.57+: источник уже физически находится в pack gear.
      // Не создаём его как мировой Item автоматически; старые мировые копии только обновляются.
    }
  }
  return { created, updated, target: "world" };
}

export async function seedSubstances1555() {
  if (!isPrimaryGM()) return { created: 0, updated: 0, target: "none" };
  const result = await upsertIntoWorld(buildSubstanceSources({ linkScope: "world" }));
  console.info(`[${MODULE_ID}] v${VERSION}: Data Pool вещества: ${result.created} создано, ${result.updated} обновлено в мире.`);
  return result;
}

function registerApi() {
  const module = globalThis.game?.modules?.get?.(MODULE_ID);
  if (!module) return;
  module.api = {
    ...(module.api ?? {}),
    substances1555: {
      definitions: SUBSTANCES_1555,
      seed: seedSubstances1555,
      adjustHumanity: adjustActorHumanity,
      detox: performDetox,
    },
  };
}

if (globalThis.Hooks?.once && globalThis.Hooks?.on) {
  Hooks.once("init", registerApi);
  Hooks.once("ready", seedSubstances1555);
  Hooks.on("createItem", (item, options, userId) => handleCreatedEffect(item, options, userId));
  Hooks.on("deleteItem", (item, options, userId) => handleDeletedEffect(item, options, userId));
}
