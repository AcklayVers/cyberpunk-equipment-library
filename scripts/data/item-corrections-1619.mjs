// Exact user-requested corrections. Generated from the preserved 1.6.18 baseline.
export const CORRECTIONS_1619 = [
  {
    "id": "42bd7fb631b8a52b",
    "name": "Адаптивное покрытие I",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6",
      "slotsUsed": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-f9c1788fc9f60521.webp",
      "description": "<p><strong>Адаптивное покрытие I</strong> — Адаптивное внешнее покрытие меняет отражение, фактуру и тепловую сигнатуру под окружающую среду.</p><p><strong>Эффект:</strong> +1 предметный бонус ко всем проверкам @Check[stealth]{Скрытность}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внешний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 1</p><p><strong>Проверка:</strong> @Check[flat|dc:3|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "stealth",
          "type": "item",
          "value": 1,
          "label": "Адаптивное покрытие I — Скрытность"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "external",
        "hardCost": 1,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "pktFamily": "skill-stealth-coating-t1",
        "exclusiveFamily": "skill-stealth-coating",
        "priceEddies": 750,
        "skillLine": "stealth-coating",
        "skillTier": 1,
        "cpel1579Generated": true
      }
    }
  },
  {
    "id": "5fa967e8d1732c80",
    "name": "Адаптивное покрытие II",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6",
      "slotsUsed": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-f9c1788fc9f60521.webp",
      "description": "<p><strong>Адаптивное покрытие II</strong> — Адаптивное внешнее покрытие меняет отражение, фактуру и тепловую сигнатуру под окружающую среду.</p><p><strong>Эффект:</strong> +2 предметный бонус ко всем проверкам @Check[stealth]{Скрытность}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внешний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "stealth",
          "type": "item",
          "value": 2,
          "label": "Адаптивное покрытие II — Скрытность"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "external",
        "hardCost": 2,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "skill-stealth-coating-t2",
        "exclusiveFamily": "skill-stealth-coating",
        "priceEddies": 3250,
        "skillLine": "stealth-coating",
        "skillTier": 2,
        "cpel1579Generated": true
      }
    }
  },
  {
    "id": "69b79a9a50deea8d",
    "name": "Адаптивное покрытие III",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6",
      "slotsUsed": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-f9c1788fc9f60521.webp",
      "description": "<p><strong>Адаптивное покрытие III</strong> — Адаптивное внешнее покрытие меняет отражение, фактуру и тепловую сигнатуру под окружающую среду.</p><p><strong>Эффект:</strong> +3 предметный бонус ко всем проверкам @Check[stealth]{Скрытность}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внешний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "stealth",
          "type": "item",
          "value": 3,
          "label": "Адаптивное покрытие III — Скрытность"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "external",
        "hardCost": 3,
        "stressFormula": "3d6",
        "slotsUsed": 2,
        "pktFamily": "skill-stealth-coating-t3",
        "exclusiveFamily": "skill-stealth-coating",
        "priceEddies": 10000,
        "skillLine": "stealth-coating",
        "skillTier": 3,
        "cpel1579Generated": true
      }
    }
  },
  {
    "id": "1b00ee707129e637",
    "name": "Адаптивное покрытие IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6",
      "slotsUsed": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-f9c1788fc9f60521.webp",
      "description": "<p><strong>Адаптивное покрытие IV</strong> — Адаптивное внешнее покрытие меняет отражение, фактуру и тепловую сигнатуру под окружающую среду.</p><p><strong>Эффект:</strong> +4 предметный бонус ко всем проверкам @Check[stealth]{Скрытность}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внешний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 4</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "stealth",
          "type": "item",
          "value": 4,
          "label": "Адаптивное покрытие IV — Скрытность"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "external",
        "hardCost": 4,
        "stressFormula": "4d6",
        "slotsUsed": 2,
        "pktFamily": "skill-stealth-coating-t4",
        "exclusiveFamily": "skill-stealth-coating",
        "priceEddies": 50000,
        "skillLine": "stealth-coating",
        "skillTier": 4,
        "cpel1579Generated": true,
        "cpel1581Generated": true
      }
    }
  },
  {
    "id": "379efa474cf4ee4e",
    "name": "АудиоВокс «Conciliator» I",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-521e8b9322ad18b9.webp",
      "description": "<p><strong>АудиоВокс «Conciliator» I</strong> — Внутренний голосовой тракт сглаживает тембр, темп и артикуляцию для убедительной переговорной подачи.</p><p><strong>Эффект:</strong> +1 предметный бонус ко всем проверкам @Check[diplomacy]{Дипломатия}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 1</p><p><strong>Проверка:</strong> @Check[flat|dc:3|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "diplomacy",
          "type": "item",
          "value": 1,
          "label": "АудиоВокс «Conciliator» I — Дипломатия"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 1,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "pktFamily": "skill-diplomacy-audiovox-t1",
        "exclusiveFamily": "skill-diplomacy-audiovox",
        "priceEddies": 750,
        "skillLine": "diplomacy-audiovox",
        "skillTier": 1,
        "cpel1579Generated": true
      }
    }
  },
  {
    "id": "e1ecb1c4f246cf5f",
    "name": "АудиоВокс «Conciliator» II",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-521e8b9322ad18b9.webp",
      "description": "<p><strong>АудиоВокс «Conciliator» II</strong> — Внутренний голосовой тракт сглаживает тембр, темп и артикуляцию для убедительной переговорной подачи.</p><p><strong>Эффект:</strong> +2 предметный бонус ко всем проверкам @Check[diplomacy]{Дипломатия}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "diplomacy",
          "type": "item",
          "value": 2,
          "label": "АудиоВокс «Conciliator» II — Дипломатия"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 2,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "skill-diplomacy-audiovox-t2",
        "exclusiveFamily": "skill-diplomacy-audiovox",
        "priceEddies": 3250,
        "skillLine": "diplomacy-audiovox",
        "skillTier": 2,
        "cpel1579Generated": true
      }
    }
  },
  {
    "id": "0e4d1e601230839b",
    "name": "АудиоВокс «Conciliator» III",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-521e8b9322ad18b9.webp",
      "description": "<p><strong>АудиоВокс «Conciliator» III</strong> — Внутренний голосовой тракт сглаживает тембр, темп и артикуляцию для убедительной переговорной подачи.</p><p><strong>Эффект:</strong> +3 предметный бонус ко всем проверкам @Check[diplomacy]{Дипломатия}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "diplomacy",
          "type": "item",
          "value": 3,
          "label": "АудиоВокс «Conciliator» III — Дипломатия"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 3,
        "stressFormula": "3d6",
        "slotsUsed": 2,
        "pktFamily": "skill-diplomacy-audiovox-t3",
        "exclusiveFamily": "skill-diplomacy-audiovox",
        "priceEddies": 10000,
        "skillLine": "diplomacy-audiovox",
        "skillTier": 3,
        "cpel1579Generated": true
      }
    }
  },
  {
    "id": "b2bd58b49124931c",
    "name": "АудиоВокс «Conciliator» IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-521e8b9322ad18b9.webp",
      "description": "<p><strong>АудиоВокс «Conciliator» IV</strong> — Внутренний голосовой тракт сглаживает тембр, темп и артикуляцию для убедительной переговорной подачи.</p><p><strong>Эффект:</strong> +4 предметный бонус ко всем проверкам @Check[diplomacy]{Дипломатия}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 4</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "diplomacy",
          "type": "item",
          "value": 4,
          "label": "АудиоВокс «Conciliator» IV — Дипломатия"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 4,
        "stressFormula": "4d6",
        "slotsUsed": 2,
        "pktFamily": "skill-diplomacy-audiovox-t4",
        "exclusiveFamily": "skill-diplomacy-audiovox",
        "priceEddies": 50000,
        "skillLine": "diplomacy-audiovox",
        "skillTier": 4,
        "cpel1579Generated": true,
        "cpel1581Generated": true
      }
    }
  },
  {
    "id": "b86132f86b73e489",
    "name": "АудиоВокс «Gravel» I",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-1c33b5fd1dafb9e5.webp",
      "description": "<p><strong>АудиоВокс «Gravel» I</strong> — Внутренний голосовой тракт формирует давящий низкочастотный тембр и контролируемую агрессивную подачу.</p><p><strong>Эффект:</strong> +1 предметный бонус ко всем проверкам @Check[intimidation]{Запугивание}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 1</p><p><strong>Проверка:</strong> @Check[flat|dc:3|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "intimidation",
          "type": "item",
          "value": 1,
          "label": "АудиоВокс «Gravel» I — Запугивание"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 1,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "pktFamily": "skill-intimidation-audiovox-t1",
        "exclusiveFamily": "skill-intimidation-audiovox",
        "priceEddies": 750,
        "skillLine": "intimidation-audiovox",
        "skillTier": 1,
        "cpel1579Generated": true
      }
    }
  },
  {
    "id": "19bd9c4261917d96",
    "name": "АудиоВокс «Gravel» II",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-1c33b5fd1dafb9e5.webp",
      "description": "<p><strong>АудиоВокс «Gravel» II</strong> — Внутренний голосовой тракт формирует давящий низкочастотный тембр и контролируемую агрессивную подачу.</p><p><strong>Эффект:</strong> +2 предметный бонус ко всем проверкам @Check[intimidation]{Запугивание}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "intimidation",
          "type": "item",
          "value": 2,
          "label": "АудиоВокс «Gravel» II — Запугивание"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 2,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "skill-intimidation-audiovox-t2",
        "exclusiveFamily": "skill-intimidation-audiovox",
        "priceEddies": 3250,
        "skillLine": "intimidation-audiovox",
        "skillTier": 2,
        "cpel1579Generated": true
      }
    }
  },
  {
    "id": "28928138bbad3669",
    "name": "АудиоВокс «Gravel» III",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-1c33b5fd1dafb9e5.webp",
      "description": "<p><strong>АудиоВокс «Gravel» III</strong> — Внутренний голосовой тракт формирует давящий низкочастотный тембр и контролируемую агрессивную подачу.</p><p><strong>Эффект:</strong> +3 предметный бонус ко всем проверкам @Check[intimidation]{Запугивание}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "intimidation",
          "type": "item",
          "value": 3,
          "label": "АудиоВокс «Gravel» III — Запугивание"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 3,
        "stressFormula": "3d6",
        "slotsUsed": 2,
        "pktFamily": "skill-intimidation-audiovox-t3",
        "exclusiveFamily": "skill-intimidation-audiovox",
        "priceEddies": 10000,
        "skillLine": "intimidation-audiovox",
        "skillTier": 3,
        "cpel1579Generated": true
      }
    }
  },
  {
    "id": "a0906c8eb62ac376",
    "name": "АудиоВокс «Gravel» IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-1c33b5fd1dafb9e5.webp",
      "description": "<p><strong>АудиоВокс «Gravel» IV</strong> — Внутренний голосовой тракт формирует давящий низкочастотный тембр и контролируемую агрессивную подачу.</p><p><strong>Эффект:</strong> +4 предметный бонус ко всем проверкам @Check[intimidation]{Запугивание}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 4</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "intimidation",
          "type": "item",
          "value": 4,
          "label": "АудиоВокс «Gravel» IV — Запугивание"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 4,
        "stressFormula": "4d6",
        "slotsUsed": 2,
        "pktFamily": "skill-intimidation-audiovox-t4",
        "exclusiveFamily": "skill-intimidation-audiovox",
        "priceEddies": 50000,
        "skillLine": "intimidation-audiovox",
        "skillTier": 4,
        "cpel1579Generated": true,
        "cpel1581Generated": true
      }
    }
  },
  {
    "id": "f03343195cf504eb",
    "name": "АудиоВокс «Mimic» I",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-fbf65a37616a126d.webp",
      "description": "<p><strong>АудиоВокс «Mimic» I</strong> — Внутренний голосовой тракт моделирует дыхание, резонанс и эмоциональную окраску речи для убедительной имитации.</p><p><strong>Эффект:</strong> +1 предметный бонус ко всем проверкам @Check[deception]{Обман}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 1</p><p><strong>Проверка:</strong> @Check[flat|dc:3|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "deception",
          "type": "item",
          "value": 1,
          "label": "АудиоВокс «Mimic» I — Обман"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 1,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "pktFamily": "skill-deception-audiovox-t1",
        "exclusiveFamily": "skill-deception-audiovox",
        "priceEddies": 750,
        "skillLine": "deception-audiovox",
        "skillTier": 1,
        "cpel1579Generated": true
      }
    }
  },
  {
    "id": "628599a32e856567",
    "name": "АудиоВокс «Mimic» II",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-fbf65a37616a126d.webp",
      "description": "<p><strong>АудиоВокс «Mimic» II</strong> — Внутренний голосовой тракт моделирует дыхание, резонанс и эмоциональную окраску речи для убедительной имитации.</p><p><strong>Эффект:</strong> +2 предметный бонус ко всем проверкам @Check[deception]{Обман}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "deception",
          "type": "item",
          "value": 2,
          "label": "АудиоВокс «Mimic» II — Обман"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 2,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "skill-deception-audiovox-t2",
        "exclusiveFamily": "skill-deception-audiovox",
        "priceEddies": 3250,
        "skillLine": "deception-audiovox",
        "skillTier": 2,
        "cpel1579Generated": true
      }
    }
  },
  {
    "id": "2e31ce0c5d60d28d",
    "name": "АудиоВокс «Mimic» III",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-fbf65a37616a126d.webp",
      "description": "<p><strong>АудиоВокс «Mimic» III</strong> — Внутренний голосовой тракт моделирует дыхание, резонанс и эмоциональную окраску речи для убедительной имитации.</p><p><strong>Эффект:</strong> +3 предметный бонус ко всем проверкам @Check[deception]{Обман}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "deception",
          "type": "item",
          "value": 3,
          "label": "АудиоВокс «Mimic» III — Обман"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 3,
        "stressFormula": "3d6",
        "slotsUsed": 2,
        "pktFamily": "skill-deception-audiovox-t3",
        "exclusiveFamily": "skill-deception-audiovox",
        "priceEddies": 10000,
        "skillLine": "deception-audiovox",
        "skillTier": 3,
        "cpel1579Generated": true
      }
    }
  },
  {
    "id": "605c21dcf83d816a",
    "name": "АудиоВокс «Mimic» IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-fbf65a37616a126d.webp",
      "description": "<p><strong>АудиоВокс «Mimic» IV</strong> — Внутренний голосовой тракт моделирует дыхание, резонанс и эмоциональную окраску речи для убедительной имитации.</p><p><strong>Эффект:</strong> +4 предметный бонус ко всем проверкам @Check[deception]{Обман}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 4</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "deception",
          "type": "item",
          "value": 4,
          "label": "АудиоВокс «Mimic» IV — Обман"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 4,
        "stressFormula": "4d6",
        "slotsUsed": 2,
        "pktFamily": "skill-deception-audiovox-t4",
        "exclusiveFamily": "skill-deception-audiovox",
        "priceEddies": 50000,
        "skillLine": "deception-audiovox",
        "skillTier": 4,
        "cpel1579Generated": true,
        "cpel1581Generated": true
      }
    }
  },
  {
    "id": "2478bf9adb31cbe1",
    "name": "Резонансный Вокс I",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-19b6f5916e90e3e6.webp",
      "description": "<p><strong>Резонансный Вокс I</strong> — Внутренний резонансный тракт управляет дыханием, обертонами, микродинамикой и сценической подачей.</p><p><strong>Эффект:</strong> +1 предметный бонус ко всем проверкам @Check[performance]{Выступление}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 1</p><p><strong>Проверка:</strong> @Check[flat|dc:3|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "performance",
          "type": "item",
          "value": 1,
          "label": "Резонансный Вокс I — Выступление"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 1,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "pktFamily": "skill-performance-audiovox-t1",
        "exclusiveFamily": "skill-performance-audiovox",
        "priceEddies": 750,
        "skillLine": "performance-audiovox",
        "skillTier": 1,
        "cpel1579Generated": true,
        "cpel1580Generated": true
      }
    }
  },
  {
    "id": "83d619be8ddf2d02",
    "name": "Резонансный Вокс II",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-19b6f5916e90e3e6.webp",
      "description": "<p><strong>Резонансный Вокс II</strong> — Внутренний резонансный тракт управляет дыханием, обертонами, микродинамикой и сценической подачей.</p><p><strong>Эффект:</strong> +2 предметный бонус ко всем проверкам @Check[performance]{Выступление}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "performance",
          "type": "item",
          "value": 2,
          "label": "Резонансный Вокс II — Выступление"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 2,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "skill-performance-audiovox-t2",
        "exclusiveFamily": "skill-performance-audiovox",
        "priceEddies": 3250,
        "skillLine": "performance-audiovox",
        "skillTier": 2,
        "cpel1579Generated": true,
        "cpel1580Generated": true
      }
    }
  },
  {
    "id": "1a246d59b37b3b64",
    "name": "Резонансный Вокс III",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-19b6f5916e90e3e6.webp",
      "description": "<p><strong>Резонансный Вокс III</strong> — Внутренний резонансный тракт управляет дыханием, обертонами, микродинамикой и сценической подачей.</p><p><strong>Эффект:</strong> +3 предметный бонус ко всем проверкам @Check[performance]{Выступление}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "performance",
          "type": "item",
          "value": 3,
          "label": "Резонансный Вокс III — Выступление"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 3,
        "stressFormula": "3d6",
        "slotsUsed": 2,
        "pktFamily": "skill-performance-audiovox-t3",
        "exclusiveFamily": "skill-performance-audiovox",
        "priceEddies": 10000,
        "skillLine": "performance-audiovox",
        "skillTier": 3,
        "cpel1579Generated": true,
        "cpel1580Generated": true
      }
    }
  },
  {
    "id": "61ba9dac9bbe0973",
    "name": "Резонансный Вокс IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-19b6f5916e90e3e6.webp",
      "description": "<p><strong>Резонансный Вокс IV</strong> — Внутренний резонансный тракт управляет дыханием, обертонами, микродинамикой и сценической подачей.</p><p><strong>Эффект:</strong> +4 предметный бонус ко всем проверкам @Check[performance]{Выступление}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 4</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "performance",
          "type": "item",
          "value": 4,
          "label": "Резонансный Вокс IV — Выступление"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 4,
        "stressFormula": "4d6",
        "slotsUsed": 2,
        "pktFamily": "skill-performance-audiovox-t4",
        "exclusiveFamily": "skill-performance-audiovox",
        "priceEddies": 50000,
        "skillLine": "performance-audiovox",
        "skillTier": 4,
        "cpel1579Generated": true,
        "cpel1580Generated": true,
        "cpel1581Generated": true
      }
    }
  },
  {
    "id": "4ed0b6922e6b2a14",
    "name": "Биометрический анализатор I",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-c12c72e7f8fd80d2.webp",
      "description": "<p><strong>Биометрический анализатор I</strong> — Биометрический анализатор выделяет физиологические показатели и патологические отклонения в реальном времени.</p><p><strong>Эффект:</strong> +1 предметный бонус ко всем проверкам @Check[medicine]{Медицина}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 1</p><p><strong>Проверка:</strong> @Check[flat|dc:3|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "medicine",
          "type": "item",
          "value": 1,
          "label": "Биометрический анализатор I — Медицина"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 1,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "pktFamily": "skill-medicine-eyes-t1",
        "exclusiveFamily": "skill-medicine-eyes",
        "priceEddies": 750,
        "skillLine": "medicine-eyes",
        "skillTier": 1,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-eye"
      }
    }
  },
  {
    "id": "e276654d47461acd",
    "name": "Биометрический анализатор II",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-c12c72e7f8fd80d2.webp",
      "description": "<p><strong>Биометрический анализатор II</strong> — Биометрический анализатор выделяет физиологические показатели и патологические отклонения в реальном времени.</p><p><strong>Эффект:</strong> +2 предметный бонус ко всем проверкам @Check[medicine]{Медицина}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "medicine",
          "type": "item",
          "value": 2,
          "label": "Биометрический анализатор II — Медицина"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 2,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "skill-medicine-eyes-t2",
        "exclusiveFamily": "skill-medicine-eyes",
        "priceEddies": 3250,
        "skillLine": "medicine-eyes",
        "skillTier": 2,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-eye"
      }
    }
  },
  {
    "id": "4c1faab9cf62705a",
    "name": "Биометрический анализатор III",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-c12c72e7f8fd80d2.webp",
      "description": "<p><strong>Биометрический анализатор III</strong> — Биометрический анализатор выделяет физиологические показатели и патологические отклонения в реальном времени.</p><p><strong>Эффект:</strong> +3 предметный бонус ко всем проверкам @Check[medicine]{Медицина}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "medicine",
          "type": "item",
          "value": 3,
          "label": "Биометрический анализатор III — Медицина"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "3d6",
        "slotsUsed": 2,
        "pktFamily": "skill-medicine-eyes-t3",
        "exclusiveFamily": "skill-medicine-eyes",
        "priceEddies": 10000,
        "skillLine": "medicine-eyes",
        "skillTier": 3,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-eye"
      }
    }
  },
  {
    "id": "aabc608e47a6d3b7",
    "name": "Биометрический анализатор IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-c12c72e7f8fd80d2.webp",
      "description": "<p><strong>Биометрический анализатор IV</strong> — Биометрический анализатор выделяет физиологические показатели и патологические отклонения в реальном времени.</p><p><strong>Эффект:</strong> +4 предметный бонус ко всем проверкам @Check[medicine]{Медицина}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 4</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "medicine",
          "type": "item",
          "value": 4,
          "label": "Биометрический анализатор IV — Медицина"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 4,
        "stressFormula": "4d6",
        "slotsUsed": 2,
        "pktFamily": "skill-medicine-eyes-t4",
        "exclusiveFamily": "skill-medicine-eyes",
        "priceEddies": 50000,
        "skillLine": "medicine-eyes",
        "skillTier": 4,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-eye",
        "cpel1581Generated": true
      }
    }
  },
  {
    "id": "2bf957dfcdfd9380",
    "name": "Предиктивная оптика I",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-b386b41b0e9bc9bf.webp",
      "description": "<p><strong>Предиктивная оптика I</strong> — Предиктивная оптика сопоставляет движение, микросигналы и сенсорные данные, ускоряя обнаружение угроз и деталей.</p><p><strong>Эффект:</strong> +1 предметный бонус ко всем проверкам @Check[perception]{Восприятие}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 1</p><p><strong>Проверка:</strong> @Check[flat|dc:3|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "perception",
          "type": "item",
          "value": 1,
          "label": "Предиктивная оптика I — Восприятие"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 1,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "pktFamily": "skill-perception-eyes-t1",
        "exclusiveFamily": "skill-perception-eyes",
        "priceEddies": 750,
        "skillLine": "perception-eyes",
        "skillTier": 1,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-eye"
      }
    }
  },
  {
    "id": "9643df33f6f5a3c3",
    "name": "Предиктивная оптика II",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-b386b41b0e9bc9bf.webp",
      "description": "<p><strong>Предиктивная оптика II</strong> — Предиктивная оптика сопоставляет движение, микросигналы и сенсорные данные, ускоряя обнаружение угроз и деталей.</p><p><strong>Эффект:</strong> +2 предметный бонус ко всем проверкам @Check[perception]{Восприятие}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "perception",
          "type": "item",
          "value": 2,
          "label": "Предиктивная оптика II — Восприятие"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 2,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "skill-perception-eyes-t2",
        "exclusiveFamily": "skill-perception-eyes",
        "priceEddies": 3250,
        "skillLine": "perception-eyes",
        "skillTier": 2,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-eye"
      }
    }
  },
  {
    "id": "f991defd3655a553",
    "name": "Предиктивная оптика III",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-b386b41b0e9bc9bf.webp",
      "description": "<p><strong>Предиктивная оптика III</strong> — Предиктивная оптика сопоставляет движение, микросигналы и сенсорные данные, ускоряя обнаружение угроз и деталей.</p><p><strong>Эффект:</strong> +3 предметный бонус ко всем проверкам @Check[perception]{Восприятие}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "perception",
          "type": "item",
          "value": 3,
          "label": "Предиктивная оптика III — Восприятие"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "3d6",
        "slotsUsed": 2,
        "pktFamily": "skill-perception-eyes-t3",
        "exclusiveFamily": "skill-perception-eyes",
        "priceEddies": 10000,
        "skillLine": "perception-eyes",
        "skillTier": 3,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-eye"
      }
    }
  },
  {
    "id": "a1dbde2eb70095e9",
    "name": "Предиктивная оптика IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-b386b41b0e9bc9bf.webp",
      "description": "<p><strong>Предиктивная оптика IV</strong> — Предиктивная оптика сопоставляет движение, микросигналы и сенсорные данные, ускоряя обнаружение угроз и деталей.</p><p><strong>Эффект:</strong> +4 предметный бонус ко всем проверкам @Check[perception]{Восприятие}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 4</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "perception",
          "type": "item",
          "value": 4,
          "label": "Предиктивная оптика IV — Восприятие"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 4,
        "stressFormula": "4d6",
        "slotsUsed": 2,
        "pktFamily": "skill-perception-eyes-t4",
        "exclusiveFamily": "skill-perception-eyes",
        "priceEddies": 50000,
        "skillLine": "perception-eyes",
        "skillTier": 4,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-eye",
        "cpel1581Generated": true
      }
    }
  },
  {
    "id": "398687f824831076",
    "name": "Гибкие мышцы I",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-4543a38ed507db8d.webp",
      "description": "<p><strong>Гибкие мышцы I</strong> — Адаптивные миомерные волокна киберног повышают гибкость, координацию и контроль центра тяжести.</p><p><strong>Эффект:</strong> +1 предметный бонус ко всем проверкам @Check[acrobatics]{Акробатика}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 1</p><p><strong>Проверка:</strong> @Check[flat|dc:3|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "acrobatics",
          "type": "item",
          "value": 1,
          "label": "Гибкие мышцы I — Акробатика"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 1,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "pktFamily": "skill-acrobatics-legs-t1",
        "exclusiveFamily": "skill-acrobatics-legs",
        "priceEddies": 750,
        "skillLine": "acrobatics-legs",
        "skillTier": 1,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-leg"
      }
    }
  },
  {
    "id": "14055eea215b7a0f",
    "name": "Гибкие мышцы II",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-4543a38ed507db8d.webp",
      "description": "<p><strong>Гибкие мышцы II</strong> — Адаптивные миомерные волокна киберног повышают гибкость, координацию и контроль центра тяжести.</p><p><strong>Эффект:</strong> +2 предметный бонус ко всем проверкам @Check[acrobatics]{Акробатика}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "acrobatics",
          "type": "item",
          "value": 2,
          "label": "Гибкие мышцы II — Акробатика"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 2,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "skill-acrobatics-legs-t2",
        "exclusiveFamily": "skill-acrobatics-legs",
        "priceEddies": 3250,
        "skillLine": "acrobatics-legs",
        "skillTier": 2,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-leg"
      }
    }
  },
  {
    "id": "9f1dc446da715bcb",
    "name": "Гибкие мышцы III",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-4543a38ed507db8d.webp",
      "description": "<p><strong>Гибкие мышцы III</strong> — Адаптивные миомерные волокна киберног повышают гибкость, координацию и контроль центра тяжести.</p><p><strong>Эффект:</strong> +3 предметный бонус ко всем проверкам @Check[acrobatics]{Акробатика}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "acrobatics",
          "type": "item",
          "value": 3,
          "label": "Гибкие мышцы III — Акробатика"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "3d6",
        "slotsUsed": 2,
        "pktFamily": "skill-acrobatics-legs-t3",
        "exclusiveFamily": "skill-acrobatics-legs",
        "priceEddies": 10000,
        "skillLine": "acrobatics-legs",
        "skillTier": 3,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-leg"
      }
    }
  },
  {
    "id": "92332750a40a3372",
    "name": "Гибкие мышцы IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-4543a38ed507db8d.webp",
      "description": "<p><strong>Гибкие мышцы IV</strong> — Адаптивные миомерные волокна киберног повышают гибкость, координацию и контроль центра тяжести.</p><p><strong>Эффект:</strong> +4 предметный бонус ко всем проверкам @Check[acrobatics]{Акробатика}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 4</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "acrobatics",
          "type": "item",
          "value": 4,
          "label": "Гибкие мышцы IV — Акробатика"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 4,
        "stressFormula": "4d6",
        "slotsUsed": 2,
        "pktFamily": "skill-acrobatics-legs-t4",
        "exclusiveFamily": "skill-acrobatics-legs",
        "priceEddies": 50000,
        "skillLine": "acrobatics-legs",
        "skillTier": 4,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-leg",
        "cpel1581Generated": true
      }
    }
  },
  {
    "id": "081fdcbd108b101d",
    "name": "Микроманипулятор I",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-ec40165fcccfdc2e.webp",
      "description": "<p><strong>Микроманипулятор I</strong> — Микроманипуляторы стабилизируют инструмент и автоматизируют микродвижения при сборке и ремонте.</p><p><strong>Эффект:</strong> +1 предметный бонус ко всем проверкам @Check[crafting]{Ремесло}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 1</p><p><strong>Проверка:</strong> @Check[flat|dc:3|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "crafting",
          "type": "item",
          "value": 1,
          "label": "Микроманипулятор I — Ремесло"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 1,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "pktFamily": "skill-crafting-arms-t1",
        "exclusiveFamily": "skill-crafting-arms",
        "priceEddies": 750,
        "skillLine": "crafting-arms",
        "skillTier": 1,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-arm"
      }
    }
  },
  {
    "id": "9f76546d3dc42d88",
    "name": "Микроманипулятор II",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-ec40165fcccfdc2e.webp",
      "description": "<p><strong>Микроманипулятор II</strong> — Микроманипуляторы стабилизируют инструмент и автоматизируют микродвижения при сборке и ремонте.</p><p><strong>Эффект:</strong> +2 предметный бонус ко всем проверкам @Check[crafting]{Ремесло}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "crafting",
          "type": "item",
          "value": 2,
          "label": "Микроманипулятор II — Ремесло"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 2,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "skill-crafting-arms-t2",
        "exclusiveFamily": "skill-crafting-arms",
        "priceEddies": 3250,
        "skillLine": "crafting-arms",
        "skillTier": 2,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-arm"
      }
    }
  },
  {
    "id": "b9d941d91796ff41",
    "name": "Микроманипулятор III",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-ec40165fcccfdc2e.webp",
      "description": "<p><strong>Микроманипулятор III</strong> — Микроманипуляторы стабилизируют инструмент и автоматизируют микродвижения при сборке и ремонте.</p><p><strong>Эффект:</strong> +3 предметный бонус ко всем проверкам @Check[crafting]{Ремесло}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "crafting",
          "type": "item",
          "value": 3,
          "label": "Микроманипулятор III — Ремесло"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "3d6",
        "slotsUsed": 2,
        "pktFamily": "skill-crafting-arms-t3",
        "exclusiveFamily": "skill-crafting-arms",
        "priceEddies": 10000,
        "skillLine": "crafting-arms",
        "skillTier": 3,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-arm"
      }
    }
  },
  {
    "id": "6739dd450e12689c",
    "name": "Микроманипулятор IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-ec40165fcccfdc2e.webp",
      "description": "<p><strong>Микроманипулятор IV</strong> — Микроманипуляторы стабилизируют инструмент и автоматизируют микродвижения при сборке и ремонте.</p><p><strong>Эффект:</strong> +4 предметный бонус ко всем проверкам @Check[crafting]{Ремесло}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 4</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "crafting",
          "type": "item",
          "value": 4,
          "label": "Микроманипулятор IV — Ремесло"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 4,
        "stressFormula": "4d6",
        "slotsUsed": 2,
        "pktFamily": "skill-crafting-arms-t4",
        "exclusiveFamily": "skill-crafting-arms",
        "priceEddies": 50000,
        "skillLine": "crafting-arms",
        "skillTier": 4,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-arm",
        "cpel1581Generated": true
      }
    }
  },
  {
    "id": "f6e33928e9cc13ab",
    "name": "Микросервопривод I",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-beaa11b97487cd22.webp",
      "description": "<p><strong>Микросервопривод I</strong> — Микросервоприводы кисти повышают точность и плавность тонких манипуляций.</p><p><strong>Эффект:</strong> +1 предметный бонус ко всем проверкам @Check[thievery]{Воровство}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 1</p><p><strong>Проверка:</strong> @Check[flat|dc:3|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "thievery",
          "type": "item",
          "value": 1,
          "label": "Микросервопривод I — Воровство"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 1,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "pktFamily": "skill-thievery-hands-t1",
        "exclusiveFamily": "skill-thievery-hands",
        "priceEddies": 750,
        "skillLine": "thievery-hands",
        "skillTier": 1,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-arm"
      }
    }
  },
  {
    "id": "0a180b0b564fbd16",
    "name": "Микросервопривод II",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-beaa11b97487cd22.webp",
      "description": "<p><strong>Микросервопривод II</strong> — Микросервоприводы кисти повышают точность и плавность тонких манипуляций.</p><p><strong>Эффект:</strong> +2 предметный бонус ко всем проверкам @Check[thievery]{Воровство}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "thievery",
          "type": "item",
          "value": 2,
          "label": "Микросервопривод II — Воровство"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 2,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "skill-thievery-hands-t2",
        "exclusiveFamily": "skill-thievery-hands",
        "priceEddies": 3250,
        "skillLine": "thievery-hands",
        "skillTier": 2,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-arm"
      }
    }
  },
  {
    "id": "dbefeed01d71b252",
    "name": "Микросервопривод III",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-beaa11b97487cd22.webp",
      "description": "<p><strong>Микросервопривод III</strong> — Микросервоприводы кисти повышают точность и плавность тонких манипуляций.</p><p><strong>Эффект:</strong> +3 предметный бонус ко всем проверкам @Check[thievery]{Воровство}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "thievery",
          "type": "item",
          "value": 3,
          "label": "Микросервопривод III — Воровство"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "3d6",
        "slotsUsed": 2,
        "pktFamily": "skill-thievery-hands-t3",
        "exclusiveFamily": "skill-thievery-hands",
        "priceEddies": 10000,
        "skillLine": "thievery-hands",
        "skillTier": 3,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-arm"
      }
    }
  },
  {
    "id": "902295678dcf4008",
    "name": "Микросервопривод IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-beaa11b97487cd22.webp",
      "description": "<p><strong>Микросервопривод IV</strong> — Микросервоприводы кисти повышают точность и плавность тонких манипуляций.</p><p><strong>Эффект:</strong> +4 предметный бонус ко всем проверкам @Check[thievery]{Воровство}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 4</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "thievery",
          "type": "item",
          "value": 4,
          "label": "Микросервопривод IV — Воровство"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 4,
        "stressFormula": "4d6",
        "slotsUsed": 2,
        "pktFamily": "skill-thievery-hands-t4",
        "exclusiveFamily": "skill-thievery-hands",
        "priceEddies": 50000,
        "skillLine": "thievery-hands",
        "skillTier": 4,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-arm",
        "cpel1581Generated": true
      }
    }
  },
  {
    "id": "8cad83df403a6a42",
    "name": "Усиленные мышцы I",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-6b1baa8d41b1c8c8.webp",
      "description": "<p><strong>Усиленные мышцы I</strong> — Усиленные миомерные пучки киберрук повышают тягу, хват и устойчивость при силовой работе.</p><p><strong>Эффект:</strong> +1 предметный бонус ко всем проверкам @Check[athletics]{Атлетика}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 1</p><p><strong>Проверка:</strong> @Check[flat|dc:3|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "athletics",
          "type": "item",
          "value": 1,
          "label": "Усиленные мышцы I — Атлетика"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 1,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "pktFamily": "skill-athletics-arms-t1",
        "exclusiveFamily": "skill-athletics-arms",
        "priceEddies": 750,
        "skillLine": "athletics-arms",
        "skillTier": 1,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-arm"
      }
    }
  },
  {
    "id": "1dc37b5925187b16",
    "name": "Усиленные мышцы II",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-6b1baa8d41b1c8c8.webp",
      "description": "<p><strong>Усиленные мышцы II</strong> — Усиленные миомерные пучки киберрук повышают тягу, хват и устойчивость при силовой работе.</p><p><strong>Эффект:</strong> +2 предметный бонус ко всем проверкам @Check[athletics]{Атлетика}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "athletics",
          "type": "item",
          "value": 2,
          "label": "Усиленные мышцы II — Атлетика"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 2,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "skill-athletics-arms-t2",
        "exclusiveFamily": "skill-athletics-arms",
        "priceEddies": 3250,
        "skillLine": "athletics-arms",
        "skillTier": 2,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-arm"
      }
    }
  },
  {
    "id": "8c5eb38c7e9f1975",
    "name": "Усиленные мышцы III",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-6b1baa8d41b1c8c8.webp",
      "description": "<p><strong>Усиленные мышцы III</strong> — Усиленные миомерные пучки киберрук повышают тягу, хват и устойчивость при силовой работе.</p><p><strong>Эффект:</strong> +3 предметный бонус ко всем проверкам @Check[athletics]{Атлетика}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "athletics",
          "type": "item",
          "value": 3,
          "label": "Усиленные мышцы III — Атлетика"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "3d6",
        "slotsUsed": 2,
        "pktFamily": "skill-athletics-arms-t3",
        "exclusiveFamily": "skill-athletics-arms",
        "priceEddies": 10000,
        "skillLine": "athletics-arms",
        "skillTier": 3,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-arm"
      }
    }
  },
  {
    "id": "b733c100b8445fcb",
    "name": "Усиленные мышцы IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-6b1baa8d41b1c8c8.webp",
      "description": "<p><strong>Усиленные мышцы IV</strong> — Усиленные миомерные пучки киберрук повышают тягу, хват и устойчивость при силовой работе.</p><p><strong>Эффект:</strong> +4 предметный бонус ко всем проверкам @Check[athletics]{Атлетика}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 4</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "athletics",
          "type": "item",
          "value": 4,
          "label": "Усиленные мышцы IV — Атлетика"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 4,
        "stressFormula": "4d6",
        "slotsUsed": 2,
        "pktFamily": "skill-athletics-arms-t4",
        "exclusiveFamily": "skill-athletics-arms",
        "priceEddies": 50000,
        "skillLine": "athletics-arms",
        "skillTier": 4,
        "cpel1579Generated": true,
        "pktParentFamily": "cyber-arm",
        "cpel1581Generated": true
      }
    }
  },
  {
    "id": "2e93b5071b09bd22",
    "name": "Нейросопроцессор I",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-c19d946b4b7c01a8.webp",
      "description": "<p><strong>Нейросопроцессор I</strong> — Нейросопроцессор ускоряет разбор цифровых структур, команд и сетевых шаблонов.</p><p><strong>Эффект:</strong> +1 предметный бонус ко всем проверкам @Check[computers]{Компьютеры}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 1</p><p><strong>Проверка:</strong> @Check[flat|dc:3|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "computers",
          "type": "item",
          "value": 1,
          "label": "Нейросопроцессор I — Компьютеры"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 1,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "pktFamily": "skill-computers-neural-t1",
        "exclusiveFamily": "skill-computers-neural",
        "priceEddies": 750,
        "skillLine": "computers-neural",
        "skillTier": 1,
        "cpel1579Generated": true,
        "pktParentFamily": "neural-link"
      }
    }
  },
  {
    "id": "e55d48a0c0e495bb",
    "name": "Нейросопроцессор II",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-c19d946b4b7c01a8.webp",
      "description": "<p><strong>Нейросопроцессор II</strong> — Нейросопроцессор ускоряет разбор цифровых структур, команд и сетевых шаблонов.</p><p><strong>Эффект:</strong> +2 предметный бонус ко всем проверкам @Check[computers]{Компьютеры}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "computers",
          "type": "item",
          "value": 2,
          "label": "Нейросопроцессор II — Компьютеры"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 2,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "skill-computers-neural-t2",
        "exclusiveFamily": "skill-computers-neural",
        "priceEddies": 3250,
        "skillLine": "computers-neural",
        "skillTier": 2,
        "cpel1579Generated": true,
        "pktParentFamily": "neural-link"
      }
    }
  },
  {
    "id": "45c40b3ee48847df",
    "name": "Нейросопроцессор III",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-c19d946b4b7c01a8.webp",
      "description": "<p><strong>Нейросопроцессор III</strong> — Нейросопроцессор ускоряет разбор цифровых структур, команд и сетевых шаблонов.</p><p><strong>Эффект:</strong> +3 предметный бонус ко всем проверкам @Check[computers]{Компьютеры}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "computers",
          "type": "item",
          "value": 3,
          "label": "Нейросопроцессор III — Компьютеры"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "3d6",
        "slotsUsed": 2,
        "pktFamily": "skill-computers-neural-t3",
        "exclusiveFamily": "skill-computers-neural",
        "priceEddies": 10000,
        "skillLine": "computers-neural",
        "skillTier": 3,
        "cpel1579Generated": true,
        "pktParentFamily": "neural-link"
      }
    }
  },
  {
    "id": "dc061265e24b4e8e",
    "name": "Нейросопроцессор IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-c19d946b4b7c01a8.webp",
      "description": "<p><strong>Нейросопроцессор IV</strong> — Нейросопроцессор ускоряет разбор цифровых структур, команд и сетевых шаблонов.</p><p><strong>Эффект:</strong> +4 предметный бонус ко всем проверкам @Check[computers]{Компьютеры}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 4</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "computers",
          "type": "item",
          "value": 4,
          "label": "Нейросопроцессор IV — Компьютеры"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 4,
        "stressFormula": "4d6",
        "slotsUsed": 2,
        "pktFamily": "skill-computers-neural-t4",
        "exclusiveFamily": "skill-computers-neural",
        "priceEddies": 50000,
        "skillLine": "computers-neural",
        "skillTier": 4,
        "cpel1579Generated": true,
        "pktParentFamily": "neural-link",
        "cpel1581Generated": true
      }
    }
  },
  {
    "id": "2eef4ac20081882a",
    "name": "Пилотный сопроцессор I",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-a1b60eb9f02b5f41.webp",
      "description": "<p><strong>Пилотный сопроцессор I</strong> — Пилотный сопроцессор связывает телеметрию машины с моторными контурами владельца.</p><p><strong>Эффект:</strong> +1 предметный бонус ко всем проверкам @Check[piloting]{Пилотирование}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 1</p><p><strong>Проверка:</strong> @Check[flat|dc:3|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "piloting",
          "type": "item",
          "value": 1,
          "label": "Пилотный сопроцессор I — Пилотирование"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 1,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "pktFamily": "skill-piloting-neural-t1",
        "exclusiveFamily": "skill-piloting-neural",
        "priceEddies": 750,
        "skillLine": "piloting-neural",
        "skillTier": 1,
        "cpel1579Generated": true,
        "pktParentFamily": "neural-link"
      }
    }
  },
  {
    "id": "5f1814d75e8764bb",
    "name": "Пилотный сопроцессор II",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-a1b60eb9f02b5f41.webp",
      "description": "<p><strong>Пилотный сопроцессор II</strong> — Пилотный сопроцессор связывает телеметрию машины с моторными контурами владельца.</p><p><strong>Эффект:</strong> +2 предметный бонус ко всем проверкам @Check[piloting]{Пилотирование}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "piloting",
          "type": "item",
          "value": 2,
          "label": "Пилотный сопроцессор II — Пилотирование"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 2,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "skill-piloting-neural-t2",
        "exclusiveFamily": "skill-piloting-neural",
        "priceEddies": 3250,
        "skillLine": "piloting-neural",
        "skillTier": 2,
        "cpel1579Generated": true,
        "pktParentFamily": "neural-link"
      }
    }
  },
  {
    "id": "5351103ffa5d0162",
    "name": "Пилотный сопроцессор III",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-a1b60eb9f02b5f41.webp",
      "description": "<p><strong>Пилотный сопроцессор III</strong> — Пилотный сопроцессор связывает телеметрию машины с моторными контурами владельца.</p><p><strong>Эффект:</strong> +3 предметный бонус ко всем проверкам @Check[piloting]{Пилотирование}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "piloting",
          "type": "item",
          "value": 3,
          "label": "Пилотный сопроцессор III — Пилотирование"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "3d6",
        "slotsUsed": 2,
        "pktFamily": "skill-piloting-neural-t3",
        "exclusiveFamily": "skill-piloting-neural",
        "priceEddies": 10000,
        "skillLine": "piloting-neural",
        "skillTier": 3,
        "cpel1579Generated": true,
        "pktParentFamily": "neural-link"
      }
    }
  },
  {
    "id": "baffae1ee0aaa5c1",
    "name": "Пилотный сопроцессор IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-a1b60eb9f02b5f41.webp",
      "description": "<p><strong>Пилотный сопроцессор IV</strong> — Пилотный сопроцессор связывает телеметрию машины с моторными контурами владельца.</p><p><strong>Эффект:</strong> +4 предметный бонус ко всем проверкам @Check[piloting]{Пилотирование}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 4</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "piloting",
          "type": "item",
          "value": 4,
          "label": "Пилотный сопроцессор IV — Пилотирование"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 4,
        "stressFormula": "4d6",
        "slotsUsed": 2,
        "pktFamily": "skill-piloting-neural-t4",
        "exclusiveFamily": "skill-piloting-neural",
        "priceEddies": 50000,
        "skillLine": "piloting-neural",
        "skillTier": 4,
        "cpel1579Generated": true,
        "pktParentFamily": "neural-link",
        "cpel1581Generated": true
      }
    }
  },
  {
    "id": "68710145f4e7ed53",
    "name": "Социальный сопроцессор I",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-8fe330f24fd138d2.webp",
      "description": "<p><strong>Социальный сопроцессор I</strong> — Социальный сопроцессор индексирует контекст, субкультуры, связи и поведенческие маркеры.</p><p><strong>Эффект:</strong> +1 предметный бонус ко всем проверкам @Check[society]{Общество}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 1</p><p><strong>Проверка:</strong> @Check[flat|dc:3|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "society",
          "type": "item",
          "value": 1,
          "label": "Социальный сопроцессор I — Общество"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 1,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "pktFamily": "skill-society-neural-t1",
        "exclusiveFamily": "skill-society-neural",
        "priceEddies": 750,
        "skillLine": "society-neural",
        "skillTier": 1,
        "cpel1579Generated": true,
        "pktParentFamily": "neural-link"
      }
    }
  },
  {
    "id": "25c852521b8473da",
    "name": "Социальный сопроцессор II",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-8fe330f24fd138d2.webp",
      "description": "<p><strong>Социальный сопроцессор II</strong> — Социальный сопроцессор индексирует контекст, субкультуры, связи и поведенческие маркеры.</p><p><strong>Эффект:</strong> +2 предметный бонус ко всем проверкам @Check[society]{Общество}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "society",
          "type": "item",
          "value": 2,
          "label": "Социальный сопроцессор II — Общество"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 2,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "skill-society-neural-t2",
        "exclusiveFamily": "skill-society-neural",
        "priceEddies": 3250,
        "skillLine": "society-neural",
        "skillTier": 2,
        "cpel1579Generated": true,
        "pktParentFamily": "neural-link"
      }
    }
  },
  {
    "id": "2536d4f743df7928",
    "name": "Социальный сопроцессор III",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-8fe330f24fd138d2.webp",
      "description": "<p><strong>Социальный сопроцессор III</strong> — Социальный сопроцессор индексирует контекст, субкультуры, связи и поведенческие маркеры.</p><p><strong>Эффект:</strong> +3 предметный бонус ко всем проверкам @Check[society]{Общество}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "society",
          "type": "item",
          "value": 3,
          "label": "Социальный сопроцессор III — Общество"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "3d6",
        "slotsUsed": 2,
        "pktFamily": "skill-society-neural-t3",
        "exclusiveFamily": "skill-society-neural",
        "priceEddies": 10000,
        "skillLine": "society-neural",
        "skillTier": 3,
        "cpel1579Generated": true,
        "pktParentFamily": "neural-link"
      }
    }
  },
  {
    "id": "2fa3f19aabb76945",
    "name": "Социальный сопроцессор IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2,
      "stressFormula": "2d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-8fe330f24fd138d2.webp",
      "description": "<p><strong>Социальный сопроцессор IV</strong> — Социальный сопроцессор индексирует контекст, субкультуры, связи и поведенческие маркеры.</p><p><strong>Эффект:</strong> +4 предметный бонус ко всем проверкам @Check[society]{Общество}. Бонус не ограничен отдельным действием.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 4</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "society",
          "type": "item",
          "value": 4,
          "label": "Социальный сопроцессор IV — Общество"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 4,
        "stressFormula": "4d6",
        "slotsUsed": 2,
        "pktFamily": "skill-society-neural-t4",
        "exclusiveFamily": "skill-society-neural",
        "priceEddies": 50000,
        "skillLine": "society-neural",
        "skillTier": 4,
        "cpel1579Generated": true,
        "pktParentFamily": "neural-link",
        "cpel1581Generated": true
      }
    }
  },
  {
    "id": "4UUKSdTetXVeWljw",
    "name": "Кироши ОптиЩит",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-c9b0c9c00e486c5d.webp",
      "description": "<p>Из надбровной области выдвигается зеркальный противоослепляющий экран. В сложенном состоянии почти незаметен.</p><p><strong>Механика:</strong> при активном щите +2 предмета к спасброскам против визуальных и световых эффектов.</p><hr><p><strong>Тип импланта:</strong> Внешний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> <a data-flavor=\"Потеря Человечности\" data-formula=\"2d6\" data-tooltip aria-label=\"2d6\" data-mode=\"public\" data-damage-roll class=\"inline-roll roll\"><i inert class=\"fa-solid fa-dice-d6\"></i>2d6</a></p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> <a data-pf2-traits=\"tech\" data-pf2-repost-flavor=\"Кироши ОптиЩит\" data-pf2-label=\"КС Кироши ОптиЩит\" data-pf2-check=\"flat\" data-roller-role=\"origin\" data-item-uuid=\"Item.6YbB2aNZ1N7QiF2R\" data-pf2-dc=\"8\" class=\"inline-check with-repost\"><i inert class=\"fa-solid fa-dice-d20\"></i></a><span style=\"white-space:nowrap;padding-right:4px\"><a data-pf2-traits=\"tech\" data-pf2-repost-flavor=\"Кироши ОптиЩит\" data-pf2-label=\"КС Кироши ОптиЩит\" data-pf2-check=\"flat\" data-roller-role=\"origin\" data-item-uuid=\"Item.6YbB2aNZ1N7QiF2R\" data-pf2-dc=\"8\" class=\"inline-check with-repost\">Чистая</a></span><span style=\"white-space:nowrap\"><a data-pf2-traits=\"tech\" data-pf2-repost-flavor=\"Кироши ОптиЩит\" data-pf2-label=\"КС Кироши ОптиЩит\" data-pf2-check=\"flat\" data-roller-role=\"origin\" data-item-uuid=\"Item.6YbB2aNZ1N7QiF2R\" data-pf2-dc=\"8\" class=\"inline-check with-repost\">проверка </a></span><span data-visibility=\"all\"><a data-pf2-traits=\"tech\" data-pf2-repost-flavor=\"Кироши ОптиЩит\" data-pf2-label=\"КС Кироши ОптиЩит\" data-pf2-check=\"flat\" data-roller-role=\"origin\" data-item-uuid=\"Item.6YbB2aNZ1N7QiF2R\" data-pf2-dc=\"8\" class=\"inline-check with-repost\">с КС 8</a></span><a data-pf2-traits=\"tech\" data-pf2-repost-flavor=\"Кироши ОптиЩит\" data-pf2-label=\"КС Кироши ОптиЩит\" data-pf2-check=\"flat\" data-roller-role=\"origin\" data-item-uuid=\"Item.6YbB2aNZ1N7QiF2R\" data-pf2-dc=\"8\" class=\"inline-check with-repost\"><i data-pf2-repost title=\"Отправить в чат\" class=\"fa-solid fa-comment repost\"></i></a></p><section data-cic-activation=\"true\"><hr><p><strong>Активация — Развернуть ОптиЩит — Кироши ОптиЩит:</strong> <span class=\"action-glyph\">1</span></p><p><strong>Длительность:</strong> 10 minutes</p><p><strong>Эффект:</strong> Зеркальный щит закрывает глаза.</p></section>",
      "rules": [],
      "activation": {
        "enabled": true,
        "name": "Развернуть ОптиЩит",
        "actionType": "action1",
        "traits": [],
        "requirements": "",
        "trigger": "",
        "frequency": "unlimited",
        "frequencyMax": 1,
        "duration": {
          "value": 10,
          "unit": "minutes",
          "expiry": null,
          "sustained": false
        },
        "effectName": "Кироши ОптиЩит",
        "effectImg": "modules/cyberpunk-remaster/assets/icons/implants/anti_dazzle.svg",
        "effectDescription": "Зеркальный щит закрывает глаза.",
        "effectRules": [
          {
            "key": "FlatModifier",
            "selector": "saving-throw",
            "type": "item",
            "value": 2,
            "predicate": [
              {
                "or": [
                  "item:trait:visual",
                  "item:trait:light"
                ]
              }
            ]
          }
        ],
        "grantItemUuids": [],
        "tokenIcon": true,
        "chatMessage": true,
        "showOnActionsSheet": true
      },
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "external",
        "hardCost": 3,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "visual-shield",
        "priceEddies": 500
      }
    }
  },
  {
    "id": "77rGd7YXKlbTcK46",
    "name": "Микроманипуляторы «Паук»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "3d6"
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-afae9f3d6e124f6d.webp",
      "description": "<p>Из запястья выходят два тонких многосуставных манипулятора размером с маленькие руки.</p><p><strong>Особенность:</strong> они могут удерживать, поворачивать и подключать предметы пренебрежимо малого размера: щепки, провода, винты, ампулы, разъёмы. Они позволяют выполнять простые @UUID[Compendium.sf2e.actions.Item.pvQ5rY2zrtPI614F]{Взаимодействовать}-действия с Маленькими-объектами, даже когда основная кисть держит другой предмет.</p><p><strong>Нельзя:</strong> атаковать, удерживать оружие, использовать щит или считать их полноценной дополнительной рукой.</p><hr><p><strong>Тип импланта:</strong> Внешний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "2d6",
        "slotsUsed": 2,
        "pktFamily": "arm-module-spider",
        "pktParentFamily": "cyber-arm",
        "priceEddies": 1500
      }
    }
  },
  {
    "id": "Gz9strTY2DFeWUhC",
    "name": "Наномедицинский контур «Лазарь»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-c46eff1bbd49711b.webp",
      "description": "<p>Распределённый по телу контур микрокапсул высвобождает наномедицинских агентов, которые временно ускоряют закрытие ран и восстановление мягких тканей.</p><p><strong>Запустить регенерацию:</strong> 1 раз в день одним действием вы получаете <strong>быстрое исцеление 5</strong> на 5 раундов.</p><p><strong>Самодостаточность:</strong> для активации не нужен внешний медик, аптечка или свободная рука. Эффект всегда применяется только к владельцу импланта.</p><p><strong>Обслуживание:</strong> после использования контур требует пополнения наномассы при следующем ежедневном обслуживании.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p><section data-cic-activation=\"true\"><hr><p><strong>Активация — Запустить регенерацию — Наномедицинский контур «Лазарь»:</strong> @Glyph[Action 1]</p><p><strong>Частота:</strong> Раз в день</p><p><strong>Требования:</strong> Имплант установлен и содержит подготовленную дозу. Целью всегда является владелец импланта.</p><p><strong>Длительность:</strong> 5 rounds</p><p><strong>Эффект:</strong> Владелец получает быстрое исцеление 5 на 5 раунд(а/ов). Эффект создаётся на Actor владельца и не может лечить другую цель.</p></section>",
      "rules": [],
      "activation": {
        "enabled": true,
        "name": "Запустить регенерацию",
        "actionType": "action1",
        "traits": [
          "manipulate"
        ],
        "requirements": "Имплант установлен и содержит подготовленную дозу. Целью всегда является владелец импланта.",
        "trigger": "",
        "frequency": "day",
        "frequencyMax": 1,
        "duration": {
          "value": 5,
          "unit": "rounds",
          "expiry": "turn-start",
          "sustained": false
        },
        "effectName": "Наномедицинский контур «Лазарь» — самолечение",
        "effectImg": "modules/cyberpunk-remaster/assets/icons/implants/biomonitor.svg",
        "effectDescription": "Владелец получает быстрое исцеление 5 на 5 раунд(а/ов). Эффект создаётся на Actor владельца и не может лечить другую цель.",
        "effectRules": [
          {
            "key": "FastHealing",
            "value": 5
          }
        ],
        "grantItemUuids": [],
        "tokenIcon": true,
        "chatMessage": true,
        "showOnActionsSheet": true
      },
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 3,
        "stressFormula": "2d6",
        "slotsUsed": 2,
        "exclusiveFamily": "heal-lazarus-nanomed",
        "pktFamily": "nanomedical-circuit-lazarus",
        "priceEddies": 5000
      }
    }
  },
  {
    "id": "6GXvyMiS9Bm0Wz4l",
    "name": "Sycust Киберпозвоночник",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "slotsUsed": 2,
      "stressFormula": "2d6",
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-addbbb6c5fd5597a.webp",
      "description": "<p>Военный двойностенный позвоночник заменяет уязвимые позвонки, улучшает гибкость и защищён от типичных ЭМИ-сбоев. Может служить точкой выхода для Киберзмеи.</p><p><strong>Механика SF2e:</strong> +1 состояния к @Check[acrobatics]. Иммунен к обычному отключению от ЭМИ; эффекты тяжёлой травмы позвоночника по решению мастера снижаются или игнорируются.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 3</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "acrobatics",
          "type": "status",
          "value": 1
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 3,
        "stressFormula": "2d6",
        "slotsUsed": 3,
        "exclusiveFamily": "cyber-spine",
        "pktFamily": "sycust-spine",
        "priceEddies": 1000
      }
    }
  },
  {
    "id": "CVaZdDwExUlrfHmg",
    "name": "Киберпозвоночник «Атлас»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "slotsUsed": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-325bff407ce70ef2.webp",
      "description": "<p>«Атлас» фактически превращает позвоночник в активную несущую раму. Каждый позвонковый сегмент соединён с соседними независимыми приводами, а инерциальные датчики корректируют положение корпуса до того, как владелец осознаёт потерю равновесия.</p><p><strong>Эффект:</strong> +2 состояния к Атлетике; +1 обстоятельства к @Check[acrobatics] только для @UUID[Compendium.sf2e.actions.Item.M76ycLAqHoAgbcej]{Балансировать}; +2 предмета к @Check[fortitude] и @Check[reflex] против @UUID[Compendium.sf2e.actions.Item.PMbdMWc2QroouFGD]{Захватить},@UUID[Compendium.sf2e.actions.Item.7blmbDrQFNfdT731]{Толкнуть}, @UUID[Compendium.sf2e.actions.Item.ge56Lu1xXVFYUnLP]{Опрокидывание} и @UUID[Compendium.sf2e.actions.Item.lOE4yjUnETTdaf2T]{Перестановка}.</p><p><strong>Нарратив:</strong> владелец может удерживать необычно тяжёлую верхнюю часть корпуса, безопаснее использовать массивные киберруки и сохранять рабочую позу при отдаче или резком торможении.</p><p><strong>Совместимость:</strong> не заменяет киберконечности и не повышает скорость движения.</p><p><strong>Требования:</strong> Усиленные кости и сухожилие или боргированого тела. Бонусы складываются с эндо скилетом</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "athletics",
          "type": "status",
          "value": 2,
          "label": "Киберпозвоночник «Атлас»"
        },
        {
          "key": "FlatModifier",
          "selector": "acrobatics",
          "type": "circumstance",
          "value": 1,
          "predicate": [
            "action:balance"
          ],
          "label": "Киберпозвоночник «Атлас» — стабилизация"
        },
        {
          "key": "FlatModifier",
          "selector": [
            "fortitude-dc",
            "reflex-dc"
          ],
          "type": "item",
          "value": 2,
          "predicate": [
            {
              "or": [
                "action:grapple",
                "action:shove",
                "action:trip",
                "action:reposition"
              ]
            }
          ],
          "label": "Киберпозвоночник «Атлас» — несущая рама"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 4,
        "stressFormula": "3d6",
        "slotsUsed": 2,
        "exclusiveFamily": "cyber-spine",
        "pktFamily": "cyber-spine-atlas-advanced",
        "priceEddies": 6000
      }
    }
  },
  {
    "id": "4VaecoCuc1H3RzuU",
    "name": "Киберпозвоночник «Вектор»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "slotsUsed": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-23a6f2e152583ecc.webp",
      "description": "<p>Тактическая версия дополняет механические дуги активными приводами таза и грудного отдела. Система считывает направление нагрузки и мгновенно перераспределяет усилие между позвоночником, тазом и плечевым поясом.</p><p><strong>Эффект:</strong> бонус состояния +1 к @Check[athletics] и +1 к КС @Check[fortitude]/@Check[reflex] против @UUID[Compendium.sf2e.actions.Item.PMbdMWc2QroouFGD]{Захватить},@UUID[Compendium.sf2e.actions.Item.7blmbDrQFNfdT731]{Толкнуть}, @UUID[Compendium.sf2e.actions.Item.ge56Lu1xXVFYUnLP]{Опрокидывание} и @UUID[Compendium.sf2e.actions.Item.lOE4yjUnETTdaf2T]{Перестановка}.</p><p><strong>Нарратив:</strong> полезен при лазании, переноске, удержании тяжёлых объектов и физической работе, когда решающим является контроль корпуса.</p><p><strong>Баланс:</strong> бонус к @Check[athletics] имеет тип Состояние и поэтому не предназначен для складывания с другими бонусами состояния того же типа.</p><p><strong>Требования:</strong> Усиленные кости и сухожилие или боргированого тела. Бонусы складываются с эндо скилетом</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "athletics",
          "type": "status",
          "value": 1,
          "label": "Киберпозвоночник «Вектор»"
        },
        {
          "key": "FlatModifier",
          "selector": [
            "fortitude-dc",
            "reflex-dc"
          ],
          "type": "item",
          "value": 1,
          "predicate": [
            {
              "or": [
                "action:grapple",
                "action:shove",
                "action:trip",
                "action:reposition"
              ]
            }
          ],
          "label": "Киберпозвоночник «Вектор» — стабилизация корпуса"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 3,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "exclusiveFamily": "cyber-spine",
        "pktFamily": "cyber-spine-vector-tactical",
        "priceEddies": 1250
      }
    }
  },
  {
    "id": "rIUa6i0nNugMRrtm",
    "name": "Киберпозвоночник «Голиаф»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "slotsUsed": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-f69cc2faae5bac3e.webp",
      "description": "<p>Военный киберпозвоночник с высокомоментными сервоприводами, гиростабилизацией и распределённой системой блокировки позвонков. При попытке сорвать владельца с места рама на доли секунды превращает корпус в единую жёсткую конструкцию.</p><p><strong>Эффект:</strong> +3 состояния к Атлетике; +2 обстоятельства к @Check[acrobatics] только для @UUID[Compendium.sf2e.actions.Item.M76ycLAqHoAgbcej]{Балансировать}; +3 предмета к @Check[fortitude] и @Check[reflex] против @UUID[Compendium.sf2e.actions.Item.PMbdMWc2QroouFGD]{Захватить},@UUID[Compendium.sf2e.actions.Item.7blmbDrQFNfdT731]{Толкнуть}, @UUID[Compendium.sf2e.actions.Item.ge56Lu1xXVFYUnLP]{Опрокидывание} и @UUID[Compendium.sf2e.actions.Item.lOE4yjUnETTdaf2T]{Перестановка}.</p><p><strong>Нарратив:</strong> «Голиаф» рассчитан на тяжёлые киберконечности, бронекорпуса, мощную отдачу и экстремальные перегрузки. Ведущий может учитывать это при ситуациях, где обычный позвоночник был бы очевидной точкой отказа.</p><p><strong>Важно:</strong> имплант не делает персонажа неподвижным объектом и не создаёт иммунитет к принудительному перемещению — он только повышает соответствующие КС.</p><p><strong>Требования:</strong> Усиленные кости и сухожилие или боргированого тела. Бонусы складываются с эндо скилетом</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 4</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "athletics",
          "type": "status",
          "value": 3,
          "label": "Киберпозвоночник «Голиаф»"
        },
        {
          "key": "FlatModifier",
          "selector": "acrobatics",
          "type": "circumstance",
          "value": 2,
          "predicate": [
            "action:balance"
          ],
          "label": "Киберпозвоночник «Голиаф» — гиростабилизация"
        },
        {
          "key": "FlatModifier",
          "selector": [
            "fortitude-dc",
            "reflex-dc"
          ],
          "type": "item",
          "value": 3,
          "predicate": [
            {
              "or": [
                "action:grapple",
                "action:shove",
                "action:trip",
                "action:reposition"
              ]
            }
          ],
          "label": "Киберпозвоночник «Голиаф» — активная фиксация"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 4,
        "stressFormula": "4d6",
        "slotsUsed": 2,
        "exclusiveFamily": "cyber-spine",
        "pktFamily": "cyber-spine-goliath-superior",
        "priceEddies": 14000
      }
    }
  },
  {
    "id": "p9VtO6uNUw9VuOPZ",
    "name": "Киберпозвоночник «Опора»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "slotsUsed": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-5352ac4069e180e6.webp",
      "description": "<p>Сегментированный титано-полимерный усилитель позвоночного столба. Искусственные дуги и микроприводы принимают на себя резкие боковые нагрузки, удерживая корпус в правильной геометрии.</p><p><strong>Эффект:</strong> бонус состояния +1 к вашим @Check[fortitude] и @Check[reflex] против @UUID[Compendium.sf2e.actions.Item.PMbdMWc2QroouFGD]{Захватить},@UUID[Compendium.sf2e.actions.Item.7blmbDrQFNfdT731]{Толкнуть}, @UUID[Compendium.sf2e.actions.Item.ge56Lu1xXVFYUnLP]{Опрокидывание} и @UUID[Compendium.sf2e.actions.Item.lOE4yjUnETTdaf2T]{Перестановка}.</p><p><strong>Нарратив:</strong> легче переносить тяжёлое снаряжение, долго работать в неудобной позе и переживать резкие перегрузки корпуса. Конкретные бытовые преимущества не заменяют проверки навыков.</p><p><strong>Ограничение:</strong> это усиление позвоночника, а не полный эндоскелет; оно не увеличивает Силу и не даёт дополнительные ОЗ.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": [
            "fortitude-dc",
            "reflex-dc"
          ],
          "type": "status",
          "value": 1,
          "predicate": [
            {
              "or": [
                "action:grapple",
                "action:shove",
                "action:trip",
                "action:reposition"
              ]
            }
          ],
          "label": "Киберпозвоночник «Опора»"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 2,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "exclusiveFamily": "cyber-spine",
        "pktFamily": "cyber-spine-support-serial",
        "priceEddies": 650
      }
    }
  },
  {
    "id": "pzFbOvTHgkMqrv6O",
    "name": "Ультразвуковой канал «Шёпот»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-96d8f63ed372eafd.webp",
      "description": "<p>Узконаправленный ультразвуковой передатчик и приёмник для ближней скрытой связи.</p><p><strong>Особенность:</strong> в прямой видимости два совместимых модуля могут обмениваться голосом на дистанции до 60 футов без обычной радиопередачи. Большинство людей не слышит несущую. Стены, плотные преграды и сильный ультразвуковой шум разрывают канал.</p><p>Это не шифрование само по себе; для криптографической защиты нужен отдельный модуль.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "2d6",
        "slotsUsed": 2,
        "pktFamily": "audio-module-ultrasonic",
        "pktParentFamily": "cyber-audio",
        "priceEddies": 1650
      }
    }
  },
  {
    "id": "9ErNfbagB5PXHXOF",
    "name": "Реактивный стабилизатор «Отскок»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-bdfe38238a5854eb.webp",
      "description": "<p>После резкого уклонения приводы автоматически докручивают движение в безопасную сторону.</p><p><strong>Отскок:</strong> после успешного спасброска Рефлекса против эффекта, который мог нанести вам урон, сделайте Шаг на 5 футов. Используется один раз за столкновение.</p><p>Это движение не происходит, если вы не можете двигаться или подходящей клетки нет.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p><section data-cic-activation=\"true\"><hr><p><strong>Активация — Отскок — Реактивный стабилизатор «Отскок»:</strong> @Glyph[Reaction] (@Trait[Concentrate]{концентрация}</p><p><strong>Частота:</strong> Раз за столкновение</p><p><strong>Триггер:</strong> Вы успешно прошли спасбросок Рефлекса против эффекта, способного нанести урон</p><p><strong>Длительность:</strong> 1 rounds</p><p><strong>Эффект:</strong></p><p>Сделайте Step на 5 футов в доступную клетку.</p><p></p></section>",
      "rules": [],
      "activation": {
        "enabled": true,
        "name": "Отскок",
        "actionType": "reaction",
        "traits": [
          "concentrate"
        ],
        "requirements": "",
        "trigger": "Вы успешно прошли спасбросок Рефлекса против эффекта, способного нанести урон",
        "frequency": "encounter",
        "frequencyMax": 1,
        "duration": {
          "value": 1,
          "unit": "rounds",
          "expiry": null,
          "sustained": false
        },
        "effectName": "Реактивный стабилизатор «Отскок»",
        "effectImg": "modules/cyberpunk-remaster/assets/icons/implants/jump_booster.svg",
        "effectDescription": "<p>Сделайте Step на 5 футов в доступную клетку.</p>",
        "effectRules": [],
        "grantItemUuids": [],
        "tokenIcon": true,
        "chatMessage": true,
        "showOnActionsSheet": true
      },
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "2d6",
        "slotsUsed": 2,
        "pktFamily": "leg-module-bounce",
        "pktParentFamily": "cyber-leg",
        "priceEddies": 1500
      }
    }
  },
  {
    "id": "k0uePVEzDBKWKcNU",
    "name": "Встроенный лечебный резервуар «Укус Асклепия»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-fe8bb39a024a9173.webp",
      "description": "<p>Усиленный медицинский резервуар киберруки хранит высококонцентрированный регенеративный коктейль и подаёт его через встроенный инъектор в ладони или предплечье.</p><p><strong>Пассивно:</strong> когда на владельце успешно применяют Лечение ран или Боевую медицину, он восстанавливает дополнительно 10 ОЗ. Механика использует тот же selector, что и @UUID[Compendium.cyberpunk-equipment-library.implants.Item.FVAmUVuZ0olKe1r7]{Биомонитор} Remaster.</p><p><strong>Лечебная доза:</strong> 1 раз в день одним действием выберите <strong>одну цель инструментом Target</strong>: владельца или другое существо в пределах досягаемости киберруки. Цель немедленно восстанавливает @Damage[(6d8+10)[vitality,healing]] ОЗ и получает <strong>быстрое исцеление 5</strong> на 5 раундов.</p><p><strong>Роль:</strong> продвинутый медицинский модуль киберруки, предназначенный как для самолечения, так и для экстренной помощи другому персонажу.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 1</p><p><strong>Проверка:</strong> @Check[flat|dc:11|showDC:all]</p><section data-cic-activation=\"true\"><hr><p><strong>Активация — Ввести лечебную дозу — Встроенный лечебный резервуар «Укус Асклепия»:</strong> @Glyph[Action 1] (@Trait[Manipulate]{воздействие})</p><p><strong>Частота:</strong> Раз в день</p><p><strong>Требования:</strong> Имплант установлен в киберруку и содержит подготовленную дозу. Перед активацией выберите ровно одну цель инструментом Target. Цель — владелец или другое согласное существо в пределах досягаемости киберруки.</p><p><strong>Длительность:</strong> 5 rounds</p><p><strong>Эффект:</strong> Выбранная цель немедленно восстанавливает @Damage[(6d8+10)[vitality,healing]] ОЗ и получает быстрое исцеление 5 на 5 раундов. Дозу можно ввести владельцу или другому существу в пределах досягаемости киберруки.</p></section>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": [
            "healing-received"
          ],
          "value": 2,
          "predicate": [
            {
              "or": [
                "action:battle-medicine",
                "action:treat-wounds"
              ]
            }
          ],
          "type": "item",
          "label": "Лечебный резервуар «Панацея»"
        }
      ],
      "activation": {
        "enabled": true,
        "name": "Ввести лечебную дозу",
        "actionType": "action1",
        "traits": [
          "manipulate"
        ],
        "requirements": "Имплант установлен в киберруку и содержит подготовленную дозу. Перед активацией выберите ровно одну цель инструментом Target; целью может быть владелец или другое согласное существо в пределах досягаемости киберруки.",
        "trigger": "",
        "frequency": "day",
        "frequencyMax": 1,
        "duration": {
          "value": 5,
          "unit": "rounds",
          "expiry": "turn-start",
          "sustained": false
        },
        "effectName": "Встроенный лечебный резервуар «Укус Асклепия» — лечебная доза",
        "effectImg": "modules/cyberpunk-remaster/assets/icons/items/love-injection.webp",
        "effectDescription": "Выбранная в Target цель немедленно восстанавливает @Damage[(6d8+10)[vitality,healing]] ОЗ и получает быстрое исцеление 5 на 5 раундов. Дозу можно ввести владельцу или другому существу в пределах досягаемости киберруки.",
        "effectRules": [
          {
            "key": "FastHealing",
            "value": 5
          }
        ],
        "grantItemUuids": [],
        "tokenIcon": true,
        "chatMessage": true,
        "showOnActionsSheet": true,
        "targetMode": "user-target",
        "targetRequired": false,
        "targetMax": 1
      },
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 1,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "exclusiveFamily": "heal-reservoir-medic",
        "pktFamily": "medicinal-reservoir-panacea",
        "priceEddies": 60000,
        "pktParentFamily": "cyber-arm"
      }
    }
  },
  {
    "id": "306b7240e6f7d9b5",
    "name": "Царапки / Scratchers",
    "pack": "implants",
    "type": "weapon",
    "costs": {
      "hardCost": 1
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-043100e536c90885.webp",
      "description": "<p>Углестеклянные ногти выглядят как часть привычного маникюра. Тонкая рабочая кромка превращает эту мелочь в оружие, которое остаётся с владельцем после любого поверхностного обыска.</p><p>Углестеклянные ногти — лёгкое скрытое оружие. Выдвижение и уборка свободным действием; рука должна быть свободна. В мясной руке это единственный имплант этой кисти.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d4 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 2,
        "stressFormula": "1d4",
        "pktFamily": "dp-306b7240e6f7d9b5",
        "priceEddies": 100,
        "slotsUsed": 1,
        "pktParentFamily": "cyber-arm"
      }
    }
  },
  {
    "id": "Tr5Qh14T1hckBul3",
    "name": "Рекордер брейнданса v.IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 3
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-12b1c8e66ecf46a8.webp",
      "description": "<p>Студийный имплант-рекордер для высокоточной записи брейнданса. Он напрямую получает поток от @UUID[Compendium.cyberpunk-equipment-library.implants.Item.DTyu4ocsPh4m2rWk]{Нейролинк}, синхронизирует сенсорные каналы с расширенной биометрией и сохраняет материал в формате, рассчитанном на последующий профессиональный монтаж.</p><p><strong>Запись:</strong> до 24 часов непрерывно. Пока имплант активен и исправен, он держит 10-минутный циклический буфер; при начале постоянной записи мастер может разрешить сохранить эти предыдущие 10 минут.</p><p><strong>Защита материала:</strong> поток получает контроль целостности и локальную защиту от случайного повреждения данных. Это не делает запись неуязвимой для взлома или физического уничтожения импланта.</p><p><strong>Экспорт и воспроизведение:</strong> можно выгружать целые сессии или отмеченные фрагменты на @UUID[Compendium.cyberpunk-equipment-library.gear.Item.o01LqChZ0IMZM86l]{Щепка}; изображение совместимо с @UUID[Compendium.cyberpunk-equipment-library.implants.Item.egC23zm27jBrXSlq]{Виртуальное зрение} и другими устройствами воспроизведения брейнданса.</p><p><strong>Преимущество над продвинутым:</strong> студийное качество, суточная сессия, 10-минутный ретробуфер, расширенная разметка и более надёжное хранение исходника.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p><section data-cic-activation=\"true\"><hr><p><strong>Активация — Начать запись брейнданса — Рекордер брейнданса [Превосходный]:</strong> @Glyph[Action 1] </p><p><strong>Требования:</strong> Имплант установлен и подключён к рабочему нейролинку.</p><p><strong>Триггер:</strong> Вы начинаете новую запись сенсорного потока.</p><p><strong>Длительность:</strong> 24 hours</p><p><strong>Эффект:</strong> Ведётся студийная запись брейнданса превосходным рекордером. Максимальная непрерывная сессия — 24 часа. Работают расширенная индексация, защищённая запись и 10-минутный циклический буфер.</p></section>",
      "rules": [],
      "activation": {
        "enabled": true,
        "name": "Начать запись брейнданса",
        "actionType": "action1",
        "traits": [
          "concentrate"
        ],
        "requirements": "Имплант установлен и подключён к рабочему нейролинку.",
        "trigger": "Вы начинаете новую запись сенсорного потока.",
        "frequency": "unlimited",
        "frequencyMax": 1,
        "duration": {
          "value": 24,
          "unit": "hours",
          "expiry": null,
          "sustained": false
        },
        "effectName": "Запись брейнданса",
        "effectImg": "modules/cyberpunk-remaster/assets/icons/implants/braindance_recorder.svg",
        "effectDescription": "Ведётся студийная запись брейнданса превосходным рекордером. Максимальная непрерывная сессия — 24 часа. Работают расширенная индексация, защищённая запись и 10-минутный циклический буфер.",
        "effectRules": [],
        "grantItemUuids": [],
        "tokenIcon": true,
        "chatMessage": true,
        "showOnActionsSheet": true
      },
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "exclusiveFamily": "braindance-recorder",
        "pktFamily": "braindance-recorder",
        "pktParentFamily": "neural-link",
        "priceEddies": 4000
      }
    }
  },
  {
    "id": "SCS0MbFKpNXuJWQB",
    "name": "Верификатор восприятия «Тесей»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-6253e393ef7f898c.webp",
      "description": "<p>Параллельно сравнивает поступающие ощущения с физическими ограничениями окружающей среды: задержкой сигнала, геометрией, инерцией, шумами сенсоров и противоречиями между каналами.</p><p>Вы получаете +1 предмета к спасброскам против эффектов с признаком <strong>Илюзия</strong>. Кроме того, ведущий может сообщить, что VR/AR-сцена содержит технически невозможное несоответствие, если «Тесей» способен его измерить.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "saving-throw",
          "type": "item",
          "value": 1,
          "predicate": [
            "trait:illusion"
          ],
          "label": "Верификатор «Тезей»"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "neural-module-theseus",
        "pktParentFamily": "neural-link",
        "priceEddies": 1250
      }
    }
  },
  {
    "id": "gpkZCMEOfIeY0LQV",
    "name": "Разъём для щепок",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 1
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-f135201f0f5085d1.webp",
      "description": "<p>Стандартный нейроразъём позволяет вставлять одну совместимую щепку и извлекать её действием. Сам разъём является модулем @UUID[Compendium.cyberpunk-equipment-library.implants.Item.DTyu4ocsPh4m2rWk]{Нейролинка}.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktFamily": "chip-socket",
        "pktParentFamily": "neural-link",
        "priceEddies": 300
      }
    }
  },
  {
    "id": "vJxDFrH7qyiVWIAS",
    "name": "Разъём для щепок ПКТ",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 1
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-0a5cf1a440cfd658.webp",
      "description": "<p>Изолированный разъём загружает данные и программы с совместимых щепок непосредственно в нейролинк.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "pktOnly": true,
        "pktFamily": "neural-link-module",
        "priceEddies": 200
      }
    }
  },
  {
    "id": "JrqFjnTnsxezxlZg",
    "name": "Ускоритель рефлексов v.I",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "2d6",
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-d68c458d662a0cd0.webp",
      "description": "<p>Компактный нейронный сопроцессор непрерывно сглаживает задержки между сенсорным сигналом и моторным ответом. В отличие от Керезникова и Сандевистана он не разгоняет субъективное время, не даёт бонус к инициативе и не создаёт отдельный боевой режим.</p><p><strong>Пассивный эффект:</strong> вы получаете бонус обстоятельства +1 к @Check[reflex].</p><p><strong>Позиционирование:</strong> облегчённый нейронный ускоритель для повседневной защиты от внезапных угроз.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "label": "Ускоритель рефлексов [Серийный]",
          "selector": [
            "reflex"
          ],
          "type": "circumstance",
          "value": 1
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 2,
        "stressFormula": "1d6",
        "slotsUsed": 1,
        "exclusiveFamily": "neural-accelerator",
        "pktFamily": "reflex-accelerator",
        "priceEddies": 200
      }
    }
  },
  {
    "id": "sG1EbBcJQmETxUP5",
    "name": "Ускоритель рефлексов v.II",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "2d6",
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-d68c458d662a0cd0.webp",
      "description": "<p>Улучшенная версия базового рефлекторного сопроцессора подключается к сенсорным и лимбическим контурам, сокращая время не только физической, но и нервно-психической реакции. Имплант остаётся пассивным и не имеет режима гиперускорения.</p><p><strong>Пассивный эффект:</strong> вы получаете бонус обстоятельства +1 к @Check[reflex] и @Check[will].</p><p><strong>Ограничение:</strong> имплант не даёт бонуса к инициативе, Скорости, КД и не предоставляет состояние Ускорен.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "label": "Ускоритель рефлексов [Тактический]",
          "selector": [
            "reflex",
            "will"
          ],
          "type": "circumstance",
          "value": 1
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "exclusiveFamily": "neural-accelerator",
        "pktFamily": "reflex-accelerator",
        "priceEddies": 1600
      }
    }
  },
  {
    "id": "jqGq9WbfGhajexDH",
    "name": "Ускоритель рефлексов v.III",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "2d6",
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-d68c458d662a0cd0.webp",
      "description": "<p>Высокопроизводительный рефлекторный сопроцессор предугадывает необходимость защитного ответа по совокупности сенсорных импульсов, но всё ещё работает в пределах нормального восприятия времени. Это облегчённая альтернатива полноценным нейронным ускорителям.</p><p><strong>Пассивный эффект:</strong> вы получаете бонус обстоятельства +1 ко всем спасброскам.</p><p><strong>Резервная реакция:</strong> каждый раунд вы можете совершить 1 дополнительную реакцию. Нельзя использовать эту дополнительную реакцию, чтобы второй раз в том же раунде применить одну и ту же реакцию.</p><p><strong>Foundry:</strong> после установки на листе появляется кнопка «Дополнительная реакция». Нажимайте её, когда расходуете резервную реакцию; конструктор блокирует повторное использование кнопки в этом раунде.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 2d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 3</p><p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p><section data-cic-activation=\"true\"><hr><p><strong>Активация — Дополнительная реакция — Ускоритель рефлексов [Продвинутый]:</strong> @Glyph[Free]</p><p><strong>Частота:</strong> Раз в раунд</p><p><strong>Требования:</strong> Обычная реакция персонажа уже израсходована в текущем раунде.</p><p><strong>Триггер:</strong> Вы хотите совершить ещё одну реакцию в этом раунде.</p><p><strong>Длительность:</strong> 1 rounds</p><p><strong>Эффект:</strong> Служебная отметка: дополнительная реакция Ускорителя рефлексов уже использована. Эффект не даёт отдельного модификатора и нужен для отслеживания расхода.</p></section>",
      "rules": [
        {
          "key": "FlatModifier",
          "label": "Ускоритель рефлексов [Продвинутый]",
          "selector": [
            "saving-throw"
          ],
          "type": "circumstance",
          "value": 1
        }
      ],
      "activation": {
        "enabled": true,
        "name": "Дополнительная реакция",
        "actionType": "free",
        "traits": [],
        "requirements": "Обычная реакция персонажа уже израсходована в текущем раунде.",
        "trigger": "Вы хотите совершить ещё одну реакцию в этом раунде.",
        "frequency": "round",
        "frequencyMax": 1,
        "duration": {
          "value": 1,
          "unit": "rounds",
          "expiry": "turn-start",
          "sustained": false
        },
        "effectName": "Резервная реакция использована",
        "effectImg": "modules/cyberpunk-remaster/assets/icons/implants/neural_link.svg",
        "effectDescription": "Служебная отметка: дополнительная реакция Ускорителя рефлексов уже использована. Эффект не даёт отдельного модификатора и нужен для отслеживания расхода.",
        "effectRules": [],
        "grantItemUuids": [],
        "tokenIcon": true,
        "chatMessage": true,
        "showOnActionsSheet": true
      },
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 3,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "exclusiveFamily": "neural-accelerator",
        "pktFamily": "reflex-accelerator",
        "priceEddies": 9000
      }
    }
  },
  {
    "id": "EVaP3m8WgnSqkMWb",
    "name": "ПКТ: Инерционный демпфер «Перо»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "2d6",
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-fdbbc4499fe4ab73.webp",
      "description": "<p>Внутренние гироскопы и реактивные микроприводы перераспределяют импульс при падении, столкновении и резкой остановке.</p><p><strong>Уникальная возможность:</strong> при расчёте урона от падения уменьшайте эффективную высоту падения на 30 футов. Если после этого урон от падения равен 0, вы можете приземлиться на ноги.</p><p>«Перо» не является полноценным устройством нулевой гравитации и не даёт полёта.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 2750
      }
    }
  },
  {
    "id": "fL857C9tIxZBWVyU",
    "name": "ПКТ: Контур сегментации «Матрёшка»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "3d6",
      "hardCost": 3
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-53a683aca6db3004.webp",
      "description": "<p>Критические системы корпуса разделены аппаратными шлюзами. При заражении, коротком замыкании или отказе одна секция может быть физически отрезана от остальных.</p><p><strong>Аварийная изоляция:</strong> один раз в день, когда технологический эффект должен одновременно отключить или подавить несколько ваших киберсистем, выберите одну установленную подсистему. Она игнорирует отключение от этого эффекта, если сама не являлась непосредственной точкой попадания или физически уничтоженной частью. Вы можете устоновить до 4 матрешик</p><p>Модуль особенно ценится в корпусах с большим количеством независимых сенсоров, оружия и средств передвижения.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 10000
      }
    }
  },
  {
    "id": "N80fPNHZ06ic2txI",
    "name": "ПКТ: Массоцентр «Мёбиус»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "4d6",
      "hardCost": 4
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-f897ec3e78cbcdd2.webp",
      "description": "<p>Система перемещает внутренние батареи, балласт и тяжёлые узлы по направляющим корпуса, радикально меняя центр тяжести без изменения внешней формы.</p><p><strong>Уникальная возможность:</strong> за 1 действие вы можете перенастроить баланс корпуса под лазание, протискивание, перенос тяжёлого объекта или удержание необычной позы. В ситуациях, где вопрос упирается именно в геометрию и центр массы, ведущий может позволить ПКТ действовать так, как органическое тело сходного размера физически не смогло бы.</p><p>Это не даёт постоянного числового бонуса и не меняет размер существа.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 1600
      }
    }
  },
  {
    "id": "grRhnbPhAMGpv79a",
    "name": "ПКТ: Микрофабрикатор «Улей»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "3d6",
      "hardCost": 3
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-a8b770523f887099.webp",
      "description": "<p>Миниатюрная фабрика занимает часть брюшной рамы и превращает стандартную технологическую массу в простые детали, кабели, крепёж и герметичные контейнеры. Для ПКТ-Кузнец или его аналоги.</p><p><strong>Экспресс-фабрикация:</strong> один раз в день за 10 минут и при наличии подходящего сырья вы можете изготовить один обычный технологический расходник или инструмент с уровнем не выше вашего уровня − 4. Созданный объект должен физически помещаться в отсеке размером с крупную ладонь.</p><p>Боеприпасы, наркотики, редкие/уникальные предметы и сложная электроника требуют обычного Ремесло и не создаются автоматически.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 2,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 9000
      }
    }
  },
  {
    "id": "OTJBRrRAvrXmwPOp",
    "name": "ПКТ: Моторный буфер «Фантом»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "3d6",
      "hardCost": 3
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-c6be0b561aa8d3b2.webp",
      "description": "<p>Контроллер сохраняет точную последовательность команд приводам: усилие каждого сервомотора, положение суставов и компенсацию инерции.</p><p><strong>Запись движения:</strong> после успешной проверки @Check[athletics] или @Check[acrobatics], связанной с конкретным физическим манёвром, вы можете сохранить этот шаблон на 10 минут.</p><p><strong>Воспроизведение:</strong> один раз до истечения записи, повторяя практически тот же манёвр в сопоставимых условиях, бросьте проверку дважды и используйте лучший результат. После этого шаблон стирается. Одновременно хранится только один шаблон.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 2750
      }
    }
  },
  {
    "id": "g8wsOs5IHnTk72H0",
    "name": "ПКТ: Распределённый командный узел «Оркестр»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "2d6",
      "hardCost": 3
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-fa8593921b5d4bc1.webp",
      "description": "<p>Отдельный вычислитель управляет низкоуровневой синхронизацией нескольких подключённых машин, не заставляя основной мозг ПКТ отслеживать каждую телеметрическую мелочь.</p><p><strong>Синхронная команда:</strong> один раз в раунд, когда вы тратите действие, чтобы отдать команду дрону, роботу или удалённому устройству, «Оркестр» может передать ту же самую команду второму совместимому устройству в вашей сети. Второе устройство должно быть способно выполнить буквально то же действие и иметь собственные необходимые действия/ресурсы.</p><p>Это не даёт дополнительного действия владельцу и не позволяет удвоить управление пилотируемой техникой.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 10000
      }
    }
  },
  {
    "id": "9ae3ueZuV7uJYnX2",
    "name": "ПКТ: Реакторный байпас «Овердрайв»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "2d6",
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-3cb0b9d6b4fb9200.webp",
      "description": "<p>Байпас на несколько секунд снимает штатные лимиты питания приводов и направляет резерв корпуса напрямую в ходовую систему.</p><p><strong>Овердрайв:</strong> 1 действие, один раз в день. На 3 раунда ваша наземная Скорость увеличивается на 10 футов.</p><p><strong>После режима:</strong> система уходит в термозащиту до следующей дневной подготовки. Это не @UUID[Compendium.sf2e.conditions.Item.nlCjDvLMf2EkV2dl]{Ускорен} и не даёт дополнительных действий.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p><section data-cic-activation=\"true\"><hr><p><strong>Активация — Овердрайв — Реакторный байпас «Овердрайв»:</strong> @Glyph[Action 1] (@Trait[concentrate])</p><p><strong>Частота:</strong> Раз в день</p><p><strong>Длительность:</strong> 3 rounds</p><p><strong>Эффект:</strong></p><p>Ходовые приводы получают аварийное питание. Наземная Скорость +10 футов.</p><p></p></section>",
      "rules": [],
      "activation": {
        "enabled": true,
        "name": "Овердрайв",
        "actionType": "action1",
        "traits": [
          "concentrate"
        ],
        "requirements": "",
        "trigger": "",
        "frequency": "day",
        "frequencyMax": 1,
        "duration": {
          "value": 3,
          "unit": "rounds",
          "expiry": null,
          "sustained": false
        },
        "effectName": "Реакторный байпас «Овердрайв»",
        "effectImg": "modules/cyberpunk-remaster/assets/icons/abilities/overdrive.svg",
        "effectDescription": "<p>Ходовые приводы получают аварийное питание. Наземная Скорость +10 футов.</p>",
        "effectRules": [
          {
            "key": "FlatModifier",
            "selector": "land-speed",
            "type": "status",
            "value": 10,
            "label": "ПКТ «Овердрайв»"
          }
        ],
        "grantItemUuids": [],
        "tokenIcon": true,
        "chatMessage": true,
        "showOnActionsSheet": true
      },
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 7500
      }
    }
  },
  {
    "id": "b9fGjVz53Kh0dJAp",
    "name": "ПКТ: Реверсивный суставной пакет «Мантис»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "2d6",
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-45009b1caecfadda.webp",
      "description": "<p>Суставы ПКТ получают дополнительные оси вращения, а ограничители движения заменяются сервозамками. Колени, локти и таз могут работать в направлениях, невозможных для человеческой анатомии.</p><p><strong>Нечеловеческая кинематика:</strong> вы можете ползти вперёд, назад и боком без необходимости разворачиваться, протискиваться через технические тоннели и удерживать тело в позах, которые нормальный гуманоид не способен принять.</p><p>При @UUID[Compendium.pf2e-anachronism.action-macros.Macro.UKHPveLpG7hUs4D0]{Протиснуться: Акробатика} ведущий может разрешить вам использовать проход, рассчитанный на существо на одну категорию размера меньше, если ограничение связано именно с формой тела, а не с реальным объёмом корпуса.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "exclusiveFamily": "pkt-locomotion-configuration",
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 2750
      }
    }
  },
  {
    "id": "IKIcs5IO4mdvJAbS",
    "name": "ПКТ: Сегментный сброс «Ящерица»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "4d6",
      "hardCost": 4
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-0af5536492963a97.webp",
      "description": "<p>Конечности и внешние секции корпуса соединены пироболтами и аварийными муфтами. Иногда лучший способ пережить захват, расплавленную руку или пробитый топливный блок — оставить его врагу.</p><p><strong>Активация — Отстрелить сегмент:</strong> реакция. Когда эффект удерживает вас за киберконечность либо повреждение явно локализовано в одном съёмном сегменте, вы можете аварийно отсоединить этот сегмент. Захват/локальный эффект заканчивается, но соответствующая конечность или модуль становится недоступным до ремонта и повторной установки.</p><p>Решение о том, применим ли сброс к конкретному эффекту, принимает ведущий.</p><hr>\n<p><strong>Тип импланта:</strong> Внутренний</p>\n<p><strong>Слоты:</strong> 1</p>\n<p><strong>Stress Cost:</strong> 0</p>\n<p><strong>Hard Cost:</strong> 0</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 5000
      }
    }
  },
  {
    "id": "hcMj7qinydq98XbB",
    "name": "ПКТ: Сервисный порт «Гном-Гномыч»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "2d6",
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-3972bd76f771ee8f.webp",
      "description": "<p>Быстросъёмная техническая шахта раскрывает доступ к силовой шине, приводам и диагностическим линиям без разборки брони.</p><p><strong>Полевая самодиагностика:</strong> раз в час вы можете потратить 10 минут и совершить проверку @Check[crafting] для ремонта собственного ПКТ. При успехе восстановите [[/r 2d8 + @actor.level]]{2d8 + ваш уровень ОЗ} при критическом успехе — [[/r 4d8 + @actor.level]]{4d8 + ваш уровень ОЗ}. При критическом провале вы не можете использовать «Гремлин» снова до следующей дневной подготовки.</p><p><strong>Важно:</strong> это отдельная процедура ремонта ПКТ, а не @UUID[Compendium.sf2e.actions.Item.1kGNdIIhuglAjIp9]{Лечение ран} и не медицинская помощь.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 1350
      }
    }
  },
  {
    "id": "6OUqBeLCdoVAeiOl",
    "name": "ПКТ: Ходовая конфигурация «Кентавр»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "4d6",
      "hardCost": 4
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-cddaf2e1f1ccf054.webp",
      "description": "<p>Складная пара вспомогательных ходовых опор выходит из нижней части корпуса, переводя ПКТ в четырёхточечную схему движения.</p><p><strong>Кентавр:</strong> 1 действие. Пока режим включён, наземная Скорость увеличивается на 10 футов, а вы получаете +2 обстоятельства к @Check[fortitude]и @Check[reflex] против @UUID[Compendium.pf2e-anachronism.action-macros.Macro.gRj7xUfcpUZQLrOC]{Опрокидывание: Атлетика} и @UUID[Compendium.pf2e-anachronism.action-macros.Macro.yNry1xMZqdWHncbV]{Толкнуть: Атлетика}.</p><p><strong>Ограничение:</strong> две вспомогательные опоры занимают пространство вокруг корпуса; во время режима ведущий может запретить особенно тесные проходы и посадочные места, рассчитанные на гуманоидную форму.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p><section data-cic-activation=\"true\"><hr><p><strong>Активация — Конфигурация «Кентавр» — Ходовая конфигурация «Кентавр»:</strong> @Glyph[Action 1] (@Trait[concentrate] @Trait[manipulate])</p><p><strong>Эффект:</strong></p><p>Дополнительные опоры развёрнуты. Скорость +10 футов; +2 к защите от Опрокидывания и Толчка.</p><p></p></section>",
      "rules": [],
      "activation": {
        "enabled": true,
        "name": "Конфигурация «Кентавр»",
        "actionType": "action1",
        "traits": [
          "concentrate",
          "manipulate"
        ],
        "requirements": "",
        "trigger": "",
        "frequency": "unlimited",
        "frequencyMax": 1,
        "duration": {
          "value": -1,
          "unit": "unlimited",
          "expiry": null,
          "sustained": false
        },
        "effectName": "ПКТ — «Кентавр»",
        "effectImg": "modules/cyberpunk-remaster/assets/icons/implants/extra-joined-cyberleg.svg",
        "effectDescription": "<p>Дополнительные опоры развёрнуты. Скорость +10 футов; +2 к защите от Опрокидывания и Толчка.</p>",
        "effectRules": [
          {
            "key": "FlatModifier",
            "selector": "land-speed",
            "type": "status",
            "value": 10,
            "label": "«Кентавр» — ходовая схема"
          },
          {
            "key": "FlatModifier",
            "selector": [
              "fortitude-dc",
              "reflex-dc"
            ],
            "type": "circumstance",
            "value": 2,
            "predicate": [
              {
                "or": [
                  "action:trip",
                  "action:shove"
                ]
              }
            ],
            "label": "«Кентавр» — четырёхточечная опора"
          }
        ],
        "grantItemUuids": [],
        "tokenIcon": true,
        "chatMessage": true,
        "showOnActionsSheet": true
      },
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 2,
        "exclusiveFamily": "pkt-locomotion-configuration",
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 5000
      }
    }
  },
  {
    "id": "06EIcGlROOcg9qHs",
    "name": "ПКТ: Чёрный ящик «Последний кадр»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "1d4",
      "hardCost": 1
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-abf8279b1d233888.webp",
      "description": "<p>Бронированный независимый накопитель записывает последние 10 минут сенсорного потока ПКТ: видео, звук, телеметрию приводов, направление попаданий, координаты и системные ошибки.</p><p><strong>Уникальная возможность:</strong> запись продолжает существовать после потери сознания, разрушения основной памяти и смерти владельца, пока сам модуль физически не уничтожен. Извлечь данные можно через сервисный порт или лабораторную аппаратуру.</p><p>Идеален для расследований, медиаработы, корпоративных оперативников и тех, кто ожидает не вернуться с задания.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 3250
      }
    }
  },
  {
    "id": "F8IcKck66fKnIkP4",
    "name": "ПКТ: Эвакуационное ядро памяти «Ковчег»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "1d4",
      "hardCost": 1
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-8ed7e96563f59ebe.webp",
      "description": "<p>Защищённое ядро хранит копию выбранных журналов, записей и сенсорных данных. При критическом разрушении корпуса оно может быть автоматически выброшено в бронированной капсуле.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> [[/r 0 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 0</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 3,
        "stressFormula": "2d6",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-memory-core",
        "priceEddies": 1000
      }
    }
  },
  {
    "id": "hHsebe87axYR6CCO",
    "name": "ПКТ: Эвакуационный захват «Крюк»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "2d6",
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-e2df04a224523d08.webp",
      "description": "<p>В грудной раме спрятана силовая лебёдка с 60-футовым композитным тросом и автоматическим карабином.</p><p><strong>Уникальная возможность:</strong> трос можно использовать как страховку, аварийный якорь, буксир, средство вытаскивания раненого или подъёма груза. Развёртывание или втягивание троса требует 1 действия @UUID[Compendium.sf2e.actions.Item.pvQ5rY2zrtPI614F]{Взаимодействовать}.</p><p>При переноске бессознательного союзника, закреплённого в эвакуационной петле, вам не требуется удерживать его руками; Масса цели всё ещё учитывается.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 1600
      }
    }
  },
  {
    "id": "Xi9UOLn33qjxnX9H",
    "name": "ПКТ: Энергопаразит «Пиявка»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "1d4",
      "hardCost": 1
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-e0edc1174559ccbe.webp",
      "description": "<p>Силовой интерфейс позволяет ПКТ безопасно питаться от внешних промышленных сетей, генераторов, машин и реакторов.</p><p><strong>Перезарядка системы:</strong> один раз в день, подключившись к подходящему источнику питания на 10 минут, вы можете восстановить одно потраченное использование <strong>одной</strong> установленной технологии с частотой «раз в день».</p><p><strong>Ограничения:</strong> нельзя восстанавливать расходники, одноразовые предметы, способности другого существа или системы, физически уничтоженные в процессе активации. Источник должен действительно иметь достаточную мощность.</p><hr>\n<p><strong>Тип импланта:</strong> Внутренний</p>\n<p><strong>Слоты:</strong> 1</p>\n<p><strong>Stress Cost:</strong> 0</p>\n<p><strong>Hard Cost:</strong> 0</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 5000
      }
    }
  },
  {
    "id": "ND4ELzC6es8nJlse",
    "name": "ПКТ: Аварийный кокон «Бастион»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "4d6",
      "hardCost": 4
    },
    "special": "bastion",
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-212ec596d2e4f95c.webp",
      "description": "<p>Внутри корпуса спрятаны складные композитные пластины. При угрозе катастрофического повреждения они за долю секунды сходятся вокруг центральной шины, превращая борга в плохо подвижный, но крайне прочный кокон.</p><p><strong>Захлопнуть броню:</strong> реакция, когда вы получаете критическое попадание. Один раз в день. До начала вашего следующего хода вы получаете сопротивление 5 дробящему, колющему и режущему урону.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p><section data-cic-activation=\"true\"><hr><p><strong>Активация — Захлопнуть броню — Аварийный кокон «Бастион»:</strong> @Glyph[Reaction]</p><p><strong>Частота:</strong> Раз в день</p><p><strong>Триггер:</strong> Вы получаете критическое попадание.</p><p><strong>Длительность:</strong> 1 rounds</p><p><strong>Эффект:</strong></p><p>Складные пластины закрывают центральные узлы. Сопротивление 5 физическому урону.</p><p></p></section>",
      "rules": [],
      "activation": {
        "enabled": true,
        "name": "Захлопнуть броню",
        "actionType": "reaction",
        "traits": [],
        "requirements": "",
        "trigger": "Вы получаете критическое попадание.",
        "frequency": "day",
        "frequencyMax": 1,
        "duration": {
          "value": 1,
          "unit": "rounds",
          "expiry": "turn-start",
          "sustained": false
        },
        "effectName": "Кокон «Бастион»",
        "effectImg": "modules/cyberpunk-remaster/assets/icons/armor/bunker-gear.svg",
        "effectDescription": "<p>Складные пластины закрывают центральные узлы. Сопротивление 5 физическому урону.</p>",
        "effectRules": [
          {
            "key": "Resistance",
            "type": "bludgeoning",
            "value": 5
          },
          {
            "key": "Resistance",
            "type": "piercing",
            "value": 5
          },
          {
            "key": "Resistance",
            "type": "slashing",
            "value": 5
          }
        ],
        "grantItemUuids": [],
        "tokenIcon": true,
        "chatMessage": true,
        "showOnActionsSheet": true
      },
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 6000
      }
    }
  },
  {
    "id": "zBkLt6yJ5bjpXyCR",
    "name": "ПКТ: Балластный узел «Якорь»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "2d6",
      "hardCost": 2
    },
    "special": "anchor",
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-d20ec3b102afccba.webp",
      "description": "<p>Подвижные вольфрамовые блоки мгновенно смещают центр массы вниз и блокируют часть суставов. ПКТ буквально «врастает» в поверхность.</p><p><strong>Режим «Якорь»:</strong> включайте переключатель на листе Действием. В режиме вы получаете бонус обстоятельства +2 к КС Стойкости и Рефлекса против @UUID[Compendium.pf2e-anachronism.action-macros.Macro.i95kcGLIQKOTsnv6]{Захватить: Атлетика}, @UUID[Compendium.sf2e.actions.Item.7blmbDrQFNfdT731]{Толкнуть}, @UUID[Compendium.sf2e.actions.Item.ge56Lu1xXVFYUnLP]{Опрокидывание} и @UUID[Compendium.sf2e.actions.Item.lOE4yjUnETTdaf2T]{Перестановка}, но штраф состояния −10 футов к наземной Скорости.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p>",
      "rules": [
        {
          "key": "RollOption",
          "domain": "all",
          "option": "pkt-anchor-mode",
          "label": "ПКТ: режим «Якорь»",
          "toggleable": true
        },
        {
          "key": "FlatModifier",
          "selector": [
            "fortitude-dc",
            "reflex-dc"
          ],
          "type": "circumstance",
          "value": 2,
          "predicate": [
            "pkt-anchor-mode",
            {
              "or": [
                "action:grapple",
                "action:shove",
                "action:trip",
                "action:reposition"
              ]
            }
          ],
          "label": "«Якорь» — стабилизация"
        },
        {
          "key": "FlatModifier",
          "selector": "land-speed",
          "type": "status",
          "value": -10,
          "predicate": [
            "pkt-anchor-mode"
          ],
          "label": "«Якорь» — заблокированные приводы"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 1250
      }
    }
  },
  {
    "id": "7QLUiVnFKvE3APg6",
    "name": "ПКТ: Инерционный накопитель «Маховик»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "3d6",
      "hardCost": 3
    },
    "special": "flywheel",
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-d99fd2368692e0a6.webp",
      "description": "<p>Маховики и суперконденсаторы собирают часть энергии движения корпуса и разово возвращают её в приводную систему.</p><hr>\n<p><strong>Тип импланта:</strong> Внутренний</p>\n<p><strong>Слоты:</strong> 1</p>\n<p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p>\n<p><strong>Hard Cost:</strong> 4</p>\n<p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>\n<section data-cic-activation=\"true\">\n<hr>\n<p><strong>Активация — Разрядить Маховик — ПКТ: Инерционный накопитель «Маховик»:</strong> @Glyph[Free]</p>\n<p><strong>Частота:</strong> Раз в час</p>\n<p><strong>Длительность:</strong> 1 rounds</p>\n<p><strong>Эффект:</strong> Кинетический резерв подан на приводы.</p>\n</section>",
      "rules": [],
      "activation": {
        "enabled": true,
        "name": "Разрядить Маховик",
        "actionType": "free",
        "traits": [],
        "requirements": "",
        "trigger": "",
        "frequency": "hour",
        "frequencyMax": 1,
        "duration": {
          "value": 1,
          "unit": "rounds",
          "expiry": null,
          "sustained": false
        },
        "effectName": "ПКТ: Инерционный накопитель «Маховик»",
        "effectImg": "modules/cyberpunk-remaster/assets/icons/abilities/overdrive.svg",
        "effectDescription": "Кинетический резерв подан на приводы.",
        "effectRules": [
          {
            "key": "FlatModifier",
            "selector": "land-speed",
            "type": "status",
            "value": 10
          },
          {
            "key": "FlatModifier",
            "selector": "athletics",
            "type": "item",
            "value": 1
          }
        ],
        "grantItemUuids": [],
        "tokenIcon": true,
        "chatMessage": true,
        "showOnActionsSheet": true
      },
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 4,
        "stressFormula": "3d6",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-kinetic-accumulator",
        "priceEddies": 1750
      }
    }
  },
  {
    "id": "Ipm074uHGSwMD65U",
    "name": "ПКТ: Контур нулевой сигнатуры «Тишина»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "2d6",
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-31bc22afd626d394.webp",
      "description": "<p>ПКТ отключает радиомодули, гасит служебные маяки, переводит питание на экранированные линии и сбрасывает тепло в внутренний буфер.</p><p><strong>Режим «Тишина»:</strong> включите переключатель на листе. Когда вы скрываетесь именно от электронных, тепловых или радиочастотных средств обнаружения, получаете бонус обстоятельства +2 к Скрытности. ПКТ-На скрытность</p><p><strong>Цена режима:</strong> пока «Тишина» активна, вы не можете использовать беспроводную связь, удалённое управление, активный радар и другие излучающие системы. Проводные интерфейсы продолжают работать.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p>",
      "rules": [
        {
          "key": "RollOption",
          "domain": "all",
          "option": "pkt-zero-signature",
          "label": "ПКТ: «Тишина» — нулевая сигнатура",
          "toggleable": true
        },
        {
          "key": "FlatModifier",
          "selector": "stealth",
          "type": "circumstance",
          "value": 2,
          "predicate": [
            "pkt-zero-signature"
          ],
          "label": "«Тишина» против технологических сенсоров"
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 6000
      }
    }
  },
  {
    "id": "tq18nKiYwS6YyR80",
    "name": "ПКТ: Магнитная обшивка «Полюс»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "2d6",
      "hardCost": 2
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-c8b46f2f4fac8b02.webp",
      "description": "<p>Под бронепластинами проложены управляемые электромагнитные контуры. На ферромагнитных конструкциях ПКТ может буквально приклеиваться к стенам, потолкам и корпусам машин.</p><p><strong>Поляризация:</strong> включается без ограничения. Пока вы на подходящей металлической поверхности, получаете Скорость карабканья равной хотьбы. На немагнитных материалах эффект ничего не даёт.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p><section data-cic-activation=\"true\"><hr><p><strong>Активация — Поляризация — Магнитная обшивка «Полюс»:</strong> @Glyph[Action 1] (@Trait[concentrate])</p><p><strong>Эффект:</strong></p><p>Электромагниты корпуса активны. Используйте Скорость карабканья равной хотьбы только на подходящих металлических поверхностях.</p><p></p></section>",
      "rules": [],
      "activation": {
        "enabled": true,
        "name": "Поляризация",
        "actionType": "action1",
        "traits": [
          "concentrate"
        ],
        "requirements": "",
        "trigger": "",
        "frequency": "unlimited",
        "frequencyMax": 1,
        "duration": {
          "value": -1,
          "unit": "unlimited",
          "expiry": null,
          "sustained": false
        },
        "effectName": "Магнитная обшивка «Полюс»",
        "effectImg": "modules/cyberpunk-remaster/assets/icons/programs/crossed-chains.svg",
        "effectDescription": "<p>Электромагниты корпуса активны. Используйте Скорость карабканья 15 футов только на подходящих металлических поверхностях.</p>",
        "effectRules": [
          {
            "key": "BaseSpeed",
            "selector": "climb",
            "value": 15
          }
        ],
        "grantItemUuids": [],
        "tokenIcon": true,
        "chatMessage": true,
        "showOnActionsSheet": true
      },
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 1250
      }
    }
  },
  {
    "id": "EruWNM88aN38PtPC",
    "name": "ПКТ: Перестраиваемая геометрия брони «Панцирь»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 4
    },
    "special": "carapace",
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-74047892cf7ac1aa.webp",
      "description": "<p>Моторизованные пластины меняют перекрытие и угол брони. Осадный режим повышает защиту ценой подвижности.</p><hr>\n<p><strong>Тип импланта:</strong> Внешний</p>\n<p><strong>Слоты:</strong> 1</p>\n<p><strong>Stress Cost:</strong> [[/r 4d6 #Потеря Человечности]]</p>\n<p><strong>Hard Cost:</strong> 5</p>\n<p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>\n<section data-cic-activation=\"true\">\n<hr>\n<p><strong>Активация — Осадная геометрия — ПКТ: Перестраиваемая геометрия брони «Панцирь»:</strong> @Glyph[Action 1]</p>\n<p><strong>Длительность:</strong> 10 minutes</p>\n<p><strong>Эффект:</strong> Пластины сведены в защитную конфигурацию.</p>\n</section>",
      "rules": [],
      "activation": {
        "enabled": true,
        "name": "Осадная геометрия",
        "actionType": "action1",
        "traits": [],
        "requirements": "",
        "trigger": "",
        "frequency": "unlimited",
        "frequencyMax": 1,
        "duration": {
          "value": 10,
          "unit": "minutes",
          "expiry": null,
          "sustained": false
        },
        "effectName": "ПКТ: Перестраиваемая геометрия брони «Панцирь»",
        "effectImg": "modules/cyberpunk-remaster/assets/icons/armor/smart-armor.svg",
        "effectDescription": "Пластины сведены в защитную конфигурацию.",
        "effectRules": [
          {
            "key": "FlatModifier",
            "selector": "ac",
            "type": "circumstance",
            "value": 1
          },
          {
            "key": "FlatModifier",
            "selector": "land-speed",
            "type": "status",
            "value": -5
          }
        ],
        "grantItemUuids": [],
        "tokenIcon": true,
        "chatMessage": true,
        "showOnActionsSheet": true
      },
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "external",
        "hardCost": 5,
        "stressFormula": "4d6",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-variable-armor",
        "priceEddies": 2500
      }
    }
  },
  {
    "id": "q6bvMxcOnhDBF2kf",
    "name": "ПКТ: Проектор ложных сигнатур «Мираж»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 3
    },
    "special": "mirage",
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-861b356ca9ec34af.webp",
      "description": "<p>Распределённые излучатели создают ложные тепловые, радио- и лидарные отражения вокруг корпуса.</p><hr>\n<p><strong>Тип импланта:</strong> Внешний</p>\n<p><strong>Слоты:</strong> 1</p>\n<p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p>\n<p><strong>Hard Cost:</strong> 4</p>\n<p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>\n<section data-cic-activation=\"true\">\n<hr>\n<p><strong>Активация — Развернуть ложные сигнатуры — ПКТ: Проектор ложных сигнатур «Мираж»:</strong> @Glyph[Action 1]</p>\n<p><strong>Частота:</strong> Раз за столкновение</p>\n<p><strong>Длительность:</strong> 3 rounds</p>\n<p><strong>Эффект:</strong> Сенсорные ложные цели активны.</p>\n</section>",
      "rules": [],
      "activation": {
        "enabled": true,
        "name": "Развернуть ложные сигнатуры",
        "actionType": "action1",
        "traits": [],
        "requirements": "",
        "trigger": "",
        "frequency": "encounter",
        "frequencyMax": 1,
        "duration": {
          "value": 3,
          "unit": "rounds",
          "expiry": null,
          "sustained": false
        },
        "effectName": "ПКТ: Проектор ложных сигнатур «Мираж»",
        "effectImg": "modules/cyberpunk-remaster/assets/icons/abilities/radar-cross-section.svg",
        "effectDescription": "Сенсорные ложные цели активны.",
        "effectRules": [
          {
            "key": "FlatModifier",
            "selector": "stealth",
            "type": "circumstance",
            "value": 2
          }
        ],
        "grantItemUuids": [],
        "tokenIcon": true,
        "chatMessage": true,
        "showOnActionsSheet": true
      },
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "external",
        "hardCost": 4,
        "stressFormula": "3d6",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-signature-decoy",
        "priceEddies": 1750
      }
    }
  },
  {
    "id": "VRV8THCeo0DLLQSe",
    "name": "ПКТ: Распределённая энергосеть «Троица»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "hardCost": 3
    },
    "special": null,
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-92290617d1711387.webp",
      "description": "<p>Три независимых силовых кольца разводят питание по разным участкам корпуса. Отказ одного контура не обесточивает остальные.</p><p><strong>Механика:</strong> сопротивление электричеству 3. Кроме того, одиночный локальный отказ питания по решению ведущего отключает только одну связанную подсистему, а не весь корпус.</p><hr>\n<p><strong>Тип импланта:</strong> Внутренний</p>\n<p><strong>Слоты:</strong> 1</p>\n<p><strong>Stress Cost:</strong> [[/r 3d6 #Потеря Человечности]]</p>\n<p><strong>Hard Cost:</strong> 4</p>\n<p><strong>Проверка:</strong> @Check[flat|dc:8|showDC:all]</p>",
      "rules": [
        {
          "key": "Resistance",
          "type": "electricity",
          "value": 3
        }
      ],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 4,
        "stressFormula": "3d6",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-power-grid",
        "priceEddies": 1000
      }
    }
  },
  {
    "id": "UTEGJUCjvOcdaLjm",
    "name": "ПКТ: Ремонтный рой «Скарабей»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "2d6",
      "hardCost": 3
    },
    "special": "scarab",
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/implants/implants-a53acdeda7a87d77.webp",
      "description": "<p>В полостях корпуса хранится рой микроремонтников, способных запаивать кабели, возвращать на место микроприводы и восстанавливать повреждённые магистрали прямо во время боя.</p><p><strong>Саморемонт:</strong> 2 действия. Один раз в день. На 5 раундов вы получаете быстрое лечение 5. Это именно ремонт ПКТ: органическому телу система бесполезна.</p><p><strong>Особенность:</strong> рой не восстанавливает уничтоженные конечности, оружие или сорванные внешние модули.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p><section data-cic-activation=\"true\"><hr><p><strong>Активация — Выпустить «Скарабеев» — Ремонтный рой «Скарабей»:</strong> @Glyph[Action 2] (@Trait[concentrate] @Trait[manipulate])</p><p><strong>Частота:</strong> Раз в день</p><p><strong>Длительность:</strong> 5 rounds</p><p><strong>Эффект:</strong></p><p>Микроремонтники восстанавливают повреждения корпуса. Быстрое лечение 5.</p><p></p></section>",
      "rules": [],
      "activation": {
        "enabled": true,
        "name": "Выпустить «Скарабеев»",
        "actionType": "action2",
        "traits": [
          "concentrate",
          "manipulate"
        ],
        "requirements": "",
        "trigger": "",
        "frequency": "day",
        "frequencyMax": 1,
        "duration": {
          "value": 5,
          "unit": "rounds",
          "expiry": null,
          "sustained": false
        },
        "effectName": "Ремонтный рой «Скарабей»",
        "effectImg": "modules/cyberpunk-remaster/assets/icons/programs/dna2.svg",
        "effectDescription": "<p>Микроремонтники восстанавливают повреждения корпуса. Быстрое лечение 5.</p>",
        "effectRules": [
          {
            "key": "FastHealing",
            "value": 5
          }
        ],
        "grantItemUuids": [],
        "tokenIcon": true,
        "chatMessage": true,
        "showOnActionsSheet": true
      },
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 4000
      }
    }
  },
  {
    "id": "ZxqnGI1UVlPfsDh0",
    "name": "ПКТ: Тепловой аккумулятор «Криосброс»",
    "pack": "implants",
    "type": "equipment",
    "costs": {
      "stressFormula": "2d6",
      "hardCost": 2
    },
    "special": "cryo",
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-855a0a4aabef15f2.webp",
      "description": "<p>Фазовый теплоаккумулятор накапливает избыточное тепло приводов и силовых блоков, после чего может одномоментно сбросить его в радиаторы.</p><p><strong>Криосброс:</strong> реакция, когда вы должны получить огненный урон. Один раз в час. До начала вашего следующего хода вы получаете сопротивление огню 10.</p><p>После сброса корпус покрывается инеем и заметным паром; скрывать факт активации практически невозможно.</p><hr><p><strong>Тип импланта:</strong> Внутренний</p><p><strong>Слоты:</strong> 1</p><p><strong>Stress Cost:</strong> 0</p><p><strong>Hard Cost:</strong> 0</p><section data-cic-activation=\"true\"><hr><p><strong>Активация — Криосброс — Тепловой аккумулятор «Криосброс»:</strong> @Glyph[Reaction]</p><p><strong>Частота:</strong> Раз в час</p><p><strong>Триггер:</strong> Вы должны получить огненный урон.</p><p><strong>Длительность:</strong> 1 rounds</p><p><strong>Эффект:</strong></p><p>Фазовый аккумулятор принимает тепловой импульс. Сопротивление огню 10.</p><p></p></section>",
      "rules": [],
      "activation": {
        "enabled": true,
        "name": "Криосброс",
        "actionType": "reaction",
        "traits": [],
        "requirements": "",
        "trigger": "Вы должны получить огненный урон.",
        "frequency": "hour",
        "frequencyMax": 1,
        "duration": {
          "value": 1,
          "unit": "rounds",
          "expiry": "turn-start",
          "sustained": false
        },
        "effectName": "Тепловой аккумулятор «Криосброс»",
        "effectImg": "modules/cyberpunk-remaster/assets/icons/programs/icicles-aura.svg",
        "effectDescription": "<p>Фазовый аккумулятор принимает тепловой импульс. Сопротивление огню 10.</p>",
        "effectRules": [
          {
            "key": "Resistance",
            "type": "fire",
            "value": 10
          }
        ],
        "grantItemUuids": [],
        "tokenIcon": true,
        "chatMessage": true,
        "showOnActionsSheet": true
      },
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "internal",
        "hardCost": 0,
        "stressFormula": "0",
        "slotsUsed": 1,
        "pktOnly": true,
        "pktFamily": "pkt-unique",
        "priceEddies": 4000
      }
    }
  },
  {
    "id": "YVMNh7diWO5OQQfj",
    "name": "Интегрированная кибердека",
    "pack": "implants",
    "type": "equipment",
    "costs": {},
    "special": "deck",
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-d32ad112fbad3282.webp",
      "description": "<p>Кибердека физически встраивается в руку и получает дополнительное место для программ/оборудования. Извлечь деку без повреждения нельзя.</p><p><strong>Механика SF2e:</strong> Дает один дополнительный слот установленной в этой руке кибердеке.</p><hr><p><strong>Тип импланта:</strong> Модуль</p><p><strong>Слоты:</strong> 2</p><p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [],
      "activation": null,
      "remaster": {
        "cyberware": true,
        "installed": false,
        "implantType": "module",
        "hardCost": 2,
        "stressFormula": "1d6",
        "slotsUsed": 3,
        "pktFamily": "arm-integrated-cyberdeck",
        "pktParentFamily": "cyber-arm",
        "priceEddies": 1000
      }
    }
  },
  {
    "id": "fJy4hDja05F5Eop1",
    "name": "Углеволоконные сухожилия v.I",
    "pack": "implants",
    "type": "equipment",
    "costs": {},
    "special": "tendons1",
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-9fd0e9f387ee6179.webp",
      "description": "<p><strong>Требуется сопряжение.</strong></p><p>Вы получаете бонус предмета +5 футов к своей наземной Скорости.</p><hr><p><strong>Тип импланта:</strong> Модуль</p>\n<p><strong>Слоты:</strong> 1</p>\n<p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "land-speed",
          "type": "item",
          "value": 5
        }
      ],
      "activation": null,
      "remaster": {
        "priceEddies": 500
      }
    }
  },
  {
    "id": "HgDrZt3f8JMMFrO0",
    "name": "Углеволоконные сухожилия v.II",
    "pack": "implants",
    "type": "equipment",
    "costs": {},
    "special": "tendons2",
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-9fd0e9f387ee6179.webp",
      "description": "<p><strong>Требуется сопряжение.</strong></p><p>Вы получаете бонус предмета +10 футов к своей наземной Скорости.</p><hr><p><strong>Тип импланта:</strong> Модуль</p>\n<p><strong>Слоты:</strong> 1</p>\n<p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "land-speed",
          "type": "item",
          "value": 10
        }
      ],
      "activation": null,
      "remaster": {
        "pktFamily": "cyber-leg-module",
        "priceEddies": 1000
      }
    }
  },
  {
    "id": "Ep52L6D0VkjmCCPz",
    "name": "Углеволоконные сухожилия v.III",
    "pack": "implants",
    "type": "equipment",
    "costs": {},
    "special": "tendons3",
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-9fd0e9f387ee6179.webp",
      "description": "<p><strong>Требуется сопряжение.</strong></p><p>Вы получаете бонус предмета +15 футов к своей наземной Скорости.</p><hr><p><strong>Тип импланта:</strong> Модуль</p>\n<p><strong>Слоты:</strong> 1</p>\n<p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "land-speed",
          "type": "item",
          "value": 15
        }
      ],
      "activation": null,
      "remaster": {
        "priceEddies": 5000
      }
    }
  },
  {
    "id": "rD1vemf2Kl1XnQeV",
    "name": "Углеволоконные сухожилия v.IV",
    "pack": "implants",
    "type": "equipment",
    "costs": {},
    "special": "tendons4",
    "before": {
      "img": "modules/cyberpunk-equipment-library/assets/icons/pictograms-detailed/quality-revision/implants/implants-9fd0e9f387ee6179.webp",
      "description": "<p><strong>Требуется сопряжение.</strong></p><p>Вы получаете бонус предмета +20 футов к своей наземной Скорости.</p><hr><p><strong>Тип импланта:</strong> Модуль</p>\n<p><strong>Слоты:</strong> 1</p>\n<p><strong>Stress Cost:</strong> [[/r 1d6 #Потеря Человечности]]</p><p><strong>Hard Cost:</strong> 2</p><p><strong>Проверка:</strong> @Check[flat|dc:5|showDC:all]</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": [
            "land-speed"
          ],
          "type": "item",
          "value": 20
        }
      ],
      "activation": null,
      "remaster": {
        "priceEddies": 10000
      }
    }
  },
  {
    "id": "0CppIrfMAdm57el0",
    "name": "Стрелы: Стрела-аэрогипо",
    "pack": "weapons",
    "type": "ammo",
    "arrow": true,
    "classDC": false,
    "costs": {},
    "before": {
      "description": "<p>Этот стрелочный боеприпас совместим с механическими метательными системами и не требует порохового заряда. Полая игла в наконечнике работает как дистанционный инъектор для заранее подготовленного препарата. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p>Полая инъекционная стрела доставляет жидкий химический состав вместо обычного урона. При попадании она не наносит урон оружия и вводит одну подготовленную дозу выбранного вещества.</p><p>Если выбранное вещество требует спасбросок или проверку, используйте проверку, указанную в карточке этого вещества; сама стрела не заменяет его КС.</p>",
      "rules": [
        {
          "key": "Note",
          "selector": "{item|_id}-attack",
          "title": "Стрела-аэрогипо",
          "text": "При попадании не наносит обычный урон и доставляет одну подготовленную химическую дозу."
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "DBU6N4gETvA0mFSr",
    "name": "Стрелы: Умные",
    "pack": "weapons",
    "type": "ammo",
    "arrow": true,
    "classDC": false,
    "costs": {},
    "before": {
      "description": "<p>Этот стрелочный боеприпас совместим с механическими метательными системами и не требует порохового заряда. В головной части размещена электроника коррекции, работающая вместе с совместимой системой наведения стрелка. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p><strong>Смарт-наведение:</strong> при загрузке в смарт-оружие боеприпас даёт <strong>+1 бонус состояния к атаке именно этим оружием</strong>. В обычном оружии бонус не действует.</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "{item|_id}-attack",
          "type": "status",
          "value": 1,
          "slug": "neon-smart-ammo",
          "label": "Умные боеприпасы",
          "predicate": [
            "neon-forge:smart-capable:{item|id}"
          ]
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "LvLkh5oZfaYHvDD0",
    "name": "Стрелы: Дешёвые",
    "pack": "weapons",
    "type": "ammo",
    "arrow": true,
    "classDC": false,
    "costs": {},
    "before": {
      "description": "<p>Этот стрелочный боеприпас совместим с механическими метательными системами и не требует порохового заряда. Экономия на материалах и контроле качества делает эти боеприпасы доступными, но менее предсказуемыми. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p>Низкокачественный заряд уменьшает число базовых кубиков урона оружия на 1, минимум до 1 кубика.</p><p>Если используется отдельное правило автоматического огня, ухудшите его показатель ещё на 1 по правилам вашего режима огня.</p>",
      "rules": [
        {
          "key": "DamageAlteration",
          "selectors": [
            "{item|_id}-damage"
          ],
          "property": "dice-number",
          "mode": "override",
          "predicate": [
            "dice:slug:base"
          ],
          "value": "max(1,@weapon.system.damage.dice - 1)"
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "PvZ4PLzmBVUmTN4q",
    "name": "Стрелы: Разрывные",
    "pack": "weapons",
    "type": "ammo",
    "arrow": true,
    "classDC": false,
    "costs": {},
    "before": {
      "description": "<p>Этот стрелочный боеприпас совместим с механическими метательными системами и не требует порохового заряда. Нестабильная внутренняя начинка превращает точное попадание в короткий локальный взрыв прямо в цели. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p>Атака получает <strong>–2 штраф обстоятельства</strong>. При критическом попадании добавляется <strong>2d6 колющий</strong> урона; эти дополнительные критические кубы не удваиваются повторно.</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "{item|_id}-attack",
          "type": "circumstance",
          "value": -2,
          "label": "Разрывные боеприпасы"
        },
        {
          "key": "DamageDice",
          "selector": "{item|_id}-damage",
          "diceNumber": 2,
          "dieSize": "d6",
          "damageType": "piercing",
          "critical": true,
          "label": "Разрывной снаряд"
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "RSDwUXU8EPETR5ag",
    "name": "Стрелы: Зазубренные",
    "pack": "weapons",
    "type": "ammo",
    "arrow": true,
    "classDC": false,
    "costs": {},
    "before": {
      "description": "<p>Этот стрелочный боеприпас совместим с механическими метательными системами и не требует порохового заряда. Зазубренная головка цепляется за ткань и превращает извлечение боеприпаса в отдельную проблему. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p>Полый наконечник или зазубренная головка рвёт ткани при критическом попадании. Критическое попадание добавляет @Damage[1d6[bleed,persistent]]{1d6 постоянного урона кровотечением}.</p>",
      "rules": [
        {
          "key": "DamageDice",
          "selector": "{item|_id}-damage",
          "diceNumber": 1,
          "dieSize": "d6",
          "damageType": "bleed",
          "category": "persistent",
          "critical": true,
          "label": "Полый наконечник / зазубренный снаряд"
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "UNqhn9VtLY5d5o2i",
    "name": "Стрелы: Зажигательные",
    "pack": "weapons",
    "type": "ammo",
    "arrow": true,
    "classDC": false,
    "costs": {},
    "before": {
      "description": "<p>Этот стрелочный боеприпас совместим с механическими метательными системами и не требует порохового заряда. Внутри находится зажигательный состав, который активируется при попадании и продолжает работать уже после удара. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p>Попадание добавляет <strong>1d6 постоянного урона огнём</strong>. Дополнительный куб применяется автоматически.</p>",
      "rules": [
        {
          "key": "DamageDice",
          "selector": "{item|_id}-damage",
          "diceNumber": 1,
          "dieSize": "d6",
          "damageType": "fire",
          "category": "persistent",
          "label": "Зажигательные боеприпасы"
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "UZtfXxhfQyiUeBZT",
    "name": "Стрелы: Усыпляющие",
    "pack": "weapons",
    "type": "ammo",
    "arrow": true,
    "classDC": true,
    "costs": {},
    "before": {
      "description": "<p>Этот стрелочный боеприпас совместим с механическими метательными системами и не требует порохового заряда. Полая головка служит контейнером для седативного вещества, позволяя обездвижить цель без обычной огневой мощи. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p>При попадании стрела не наносит обычный урон. Цель совершает @Check[fortitude|dc:13]{Стойкость КС 13}. При провале примените @UUID[Compendium.cyberpunk-equipment-library.weapons.Item.8Bub2P6EUpjeELEQ]{Усыпляющий эффект • Боеприпас}; он выдаёт штатное состояние «Без сознания».</p>",
      "rules": [
        {
          "key": "Note",
          "selector": "{item|_id}-attack",
          "title": "Усыпляющий боеприпас",
          "text": "При попадании обычный урон не наносится: цель совершает Стойкость КС 13; при провале примените Усыпляющий эффект."
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "V8ZSpy8waysFaYMQ",
    "name": "Жакан: Отравленные",
    "pack": "weapons",
    "type": "ammo",
    "arrow": false,
    "classDC": true,
    "costs": {},
    "before": {
      "description": "<p>Этот тяжёлый цельный заряд для дробовика превращает гладкоствольное оружие в грубый инструмент точечного пробития. Боеприпас несёт химический состав, который должен попасть в организм вместе с поражающим элементом. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p>При попадании этот снаряд не наносит обычный урон оружия. Цель совершает @Check[fortitude|dc:13]{Стойкость КС 13}. При провале она получает @Damage[2d6[poison]]{2d6 урона ядом}; броня не уменьшает этот урон.</p>",
      "rules": [
        {
          "key": "Note",
          "selector": "{item|_id}-attack",
          "title": "Отравленный боеприпас",
          "text": "При попадании обычный урон не наносится: цель совершает Стойкость КС 13; провал — 2d6 урона ядом."
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "VN4T0gk4LKE9fYcA",
    "name": "Стрелы: Улучшенные умные",
    "pack": "weapons",
    "type": "ammo",
    "arrow": true,
    "classDC": false,
    "costs": {},
    "before": {
      "description": "<p>Этот стрелочный боеприпас совместим с механическими метательными системами и не требует порохового заряда. Это дорогая версия умного боеприпаса с более агрессивной коррекцией траектории и расширенной электроникой наведения. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p><strong>Смарт-наведение:</strong> при загрузке в смарт-оружие боеприпас даёт <strong>+2 бонус состояния к атаке именно этим оружием</strong>. В обычном оружии бонус не действует.</p>",
      "rules": [
        {
          "key": "FlatModifier",
          "selector": "{item|_id}-attack",
          "type": "status",
          "value": 2,
          "slug": "neon-smart-ammo",
          "label": "Улучшенные умные боеприпасы",
          "predicate": [
            "neon-forge:smart-capable:{item|id}"
          ]
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "czvwpVnZmndZ8C6n",
    "name": "Винтовочные патроны: Отравленные",
    "pack": "weapons",
    "type": "ammo",
    "arrow": false,
    "classDC": true,
    "costs": {},
    "before": {
      "description": "<p>Эти винтовочные боеприпасы собраны под высокое давление и стабильную работу в длинноствольном оружии. Боеприпас несёт химический состав, который должен попасть в организм вместе с поражающим элементом. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p>При попадании этот снаряд не наносит обычный урон оружия. Цель совершает @Check[fortitude|dc:13]{Стойкость КС 13}. При провале она получает @Damage[2d6[poison]]{2d6 урона ядом}; броня не уменьшает этот урон.</p>",
      "rules": [
        {
          "key": "Note",
          "selector": "{item|_id}-attack",
          "title": "Отравленный боеприпас",
          "text": "При попадании обычный урон не наносится: цель совершает Стойкость КС 13; провал — 2d6 урона ядом."
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "daYUni8hcED8YgOV",
    "name": "Пистолетные патроны: Отравленные",
    "pack": "weapons",
    "type": "ammo",
    "arrow": false,
    "classDC": true,
    "costs": {},
    "before": {
      "description": "<p>Эти пистолетные боеприпасы рассчитаны на компактное оружие и короткие боевые дистанции. Боеприпас несёт химический состав, который должен попасть в организм вместе с поражающим элементом. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p>При попадании этот снаряд не наносит обычный урон оружия. Цель совершает @Check[fortitude|dc:13]{Стойкость КС 13}. При провале она получает @Damage[2d6[poison]]{2d6 урона ядом}; броня не уменьшает этот урон.</p>",
      "rules": [
        {
          "key": "Note",
          "selector": "{item|_id}-attack",
          "title": "Отравленный боеприпас",
          "text": "При попадании обычный урон не наносится: цель совершает Стойкость КС 13; провал — 2d6 урона ядом."
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "fXlv8PjC5Tq1vhrd",
    "name": "Стрелы: Проникающие",
    "pack": "weapons",
    "type": "ammo",
    "arrow": true,
    "classDC": false,
    "costs": {},
    "before": {
      "description": "<p>Этот стрелочный боеприпас совместим с механическими метательными системами и не требует порохового заряда. Геометрия и материал снаряда рассчитаны на сохранение энергии после встречи с преградой. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p>Снаряд формирует глубокий узкий раневой канал. При критическом попадании он добавляет @Damage[1d4[bleed,persistent]]{1d4 постоянного урона кровотечением}.</p>",
      "rules": [
        {
          "key": "DamageDice",
          "selector": "{item|_id}-damage",
          "diceNumber": 1,
          "dieSize": "d4",
          "damageType": "bleed",
          "category": "persistent",
          "critical": true,
          "label": "Проникающие боеприпасы"
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "g1524Ammo0000003",
    "name": "Гранатомётный боеприпас: Усыпляющая",
    "pack": "weapons",
    "type": "ammo",
    "arrow": false,
    "classDC": true,
    "costs": {},
    "before": {
      "description": "<p>@UUID[Compendium.cyberpunk-equipment-library.weapons.Item.LZJliKcfKFaioCET]{Граната: Усыпляющая} — боеприпас для гранатомёта.</p><p><strong>Область:</strong> @Template[burst|distance:10]{10-футовый взрыв}.</p><p><strong>Урон:</strong> прямого урона нет.</p><p><strong>Спасбросок:</strong> @Check[fortitude|against:class]{Стойкость} против КС класса пользователя.</p>",
      "rules": [
        {
          "key": "DamageAlteration",
          "mode": "override",
          "predicate": [
            "dice:slug:base"
          ],
          "property": "dice-number",
          "selectors": [
            "{item|_id}-damage"
          ],
          "value": 0
        },
        {
          "key": "Note",
          "selector": [
            "{item|_id}-attack"
          ],
          "title": "Седативный аэрозоль",
          "text": "Живые цели без герметичной защиты совершают @Check[fortitude|against:class]{Стойкость}; при провале примените @UUID[Compendium.cyberpunk-equipment-library.weapons.Item.lwz5Cko3SQsYELfB]{Усыпляющий эффект • Граната}."
        },
        {
          "key": "AdjustStrike",
          "mode": "add",
          "property": "weapon-traits",
          "value": "area-burst-10",
          "definition": [
            "item:id:{item|id}"
          ]
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "g1524Ammo0000004",
    "name": "Гранатомётный боеприпас: С биотоксином",
    "pack": "weapons",
    "type": "ammo",
    "arrow": false,
    "classDC": true,
    "costs": {},
    "before": {
      "description": "<p>@UUID[Compendium.cyberpunk-equipment-library.weapons.Item.O9fWaJihutT2pQGM]{Граната: С биотоксином} — боеприпас для гранатомёта.</p><p><strong>Область:</strong> @Template[burst|distance:10]{10-футовый взрыв}.</p><p><strong>Урон:</strong> @Damage[4d6[poison]]{4d6 poison}.</p><p><strong>Спасбросок:</strong> @Check[fortitude|against:class]{Стойкость} против КС класса пользователя.</p>",
      "rules": [
        {
          "key": "DamageAlteration",
          "mode": "override",
          "predicate": [
            "dice:slug:base"
          ],
          "property": "dice-number",
          "selectors": [
            "{item|_id}-damage"
          ],
          "value": 4
        },
        {
          "key": "DamageAlteration",
          "mode": "override",
          "predicate": [
            "dice:slug:base"
          ],
          "property": "dice-faces",
          "selectors": [
            "{item|_id}-damage"
          ],
          "value": 6
        },
        {
          "key": "DamageAlteration",
          "mode": "override",
          "predicate": [
            "dice:slug:base"
          ],
          "property": "damage-type",
          "selectors": [
            "{item|_id}-damage"
          ],
          "value": "poison"
        },
        {
          "key": "AdjustStrike",
          "mode": "add",
          "property": "weapon-traits",
          "value": "area-burst-10",
          "definition": [
            "item:id:{item|id}"
          ]
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "g1524Ammo0000011",
    "name": "Гранатомётный боеприпас: С биотоксином [Превосходная]",
    "pack": "weapons",
    "type": "ammo",
    "arrow": false,
    "classDC": true,
    "costs": {},
    "before": {
      "description": "<p>@UUID[Compendium.cyberpunk-equipment-library.weapons.Item.g8c2dc55a58facc4]{Граната: С биотоксином [Превосходная]} — боеприпас для гранатомёта.</p><p><strong>Область:</strong> @Template[burst|distance:10]{10-футовый взрыв}.</p><p><strong>Урон:</strong> @Damage[12d6[poison]]{12d6 урона ядом}.</p><p><strong>Спасбросок:</strong> @Check[fortitude|against:class]{Стойкость} против КС класса пользователя.</p>",
      "rules": [
        {
          "key": "DamageAlteration",
          "mode": "override",
          "predicate": [
            "dice:slug:base"
          ],
          "property": "dice-number",
          "selectors": [
            "{item|_id}-damage"
          ],
          "value": 12
        },
        {
          "key": "DamageAlteration",
          "mode": "override",
          "predicate": [
            "dice:slug:base"
          ],
          "property": "dice-faces",
          "selectors": [
            "{item|_id}-damage"
          ],
          "value": 6
        },
        {
          "key": "DamageAlteration",
          "mode": "override",
          "predicate": [
            "dice:slug:base"
          ],
          "property": "damage-type",
          "selectors": [
            "{item|_id}-damage"
          ],
          "value": "poison"
        },
        {
          "key": "AdjustStrike",
          "mode": "add",
          "property": "weapon-traits",
          "value": "area-burst-10",
          "definition": [
            "item:id:{item|id}"
          ]
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "g1524Ammo0000019",
    "name": "Гранатомётный боеприпас: С биотоксином [Продвинутая]",
    "pack": "weapons",
    "type": "ammo",
    "arrow": false,
    "classDC": true,
    "costs": {},
    "before": {
      "description": "<p>@UUID[Compendium.cyberpunk-equipment-library.weapons.Item.gee3bab99cfb2e6f]{Граната: С биотоксином [Продвинутая]} — боеприпас для гранатомёта.</p><p><strong>Область:</strong> @Template[burst|distance:10]{10-футовый взрыв}.</p><p><strong>Урон:</strong> @Damage[8d6[poison]]{8d6 poison}.</p><p><strong>Спасбросок:</strong> @Check[fortitude|against:class]{Стойкость} против КС класса пользователя.</p>",
      "rules": [
        {
          "key": "DamageAlteration",
          "mode": "override",
          "predicate": [
            "dice:slug:base"
          ],
          "property": "dice-number",
          "selectors": [
            "{item|_id}-damage"
          ],
          "value": 8
        },
        {
          "key": "DamageAlteration",
          "mode": "override",
          "predicate": [
            "dice:slug:base"
          ],
          "property": "dice-faces",
          "selectors": [
            "{item|_id}-damage"
          ],
          "value": 6
        },
        {
          "key": "DamageAlteration",
          "mode": "override",
          "predicate": [
            "dice:slug:base"
          ],
          "property": "damage-type",
          "selectors": [
            "{item|_id}-damage"
          ],
          "value": "poison"
        },
        {
          "key": "AdjustStrike",
          "mode": "add",
          "property": "weapon-traits",
          "value": "area-burst-10",
          "definition": [
            "item:id:{item|id}"
          ]
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "kjGQHW9sNuSdEF8M",
    "name": "Стрелы",
    "pack": "weapons",
    "type": "ammo",
    "arrow": true,
    "classDC": false,
    "costs": {},
    "before": {
      "description": "<p>Этот стрелочный боеприпас совместим с механическими метательными системами и не требует порохового заряда. Стандартные стрелы. Пачка содержит 10 единиц; один обычный выстрел расходует один боеприпас. Его обычно закупают пачками и держат как надёжный стандартный боезапас без лишних сюрпризов.</p><hr><p><strong>Эффект боеприпаса</strong></p><p>Стандартные стрелы. Пачка содержит <strong>10</strong> единиц; один обычный выстрел расходует один боеприпас.</p>",
      "rules": [],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "nkusSIvu8AjYRtfT",
    "name": "Стрелы: Отравленные",
    "pack": "weapons",
    "type": "ammo",
    "arrow": true,
    "classDC": true,
    "costs": {},
    "before": {
      "description": "<p>Этот стрелочный боеприпас совместим с механическими метательными системами и не требует порохового заряда. Боеприпас несёт химический состав, который должен попасть в организм вместе с поражающим элементом. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p>При попадании этот снаряд не наносит обычный урон оружия. Цель совершает @Check[fortitude|dc:13]{Стойкость КС 13}. При провале она получает @Damage[2d6[poison]]{2d6 урона ядом}; броня не уменьшает этот урон.</p>",
      "rules": [
        {
          "key": "Note",
          "selector": "{item|_id}-attack",
          "title": "Отравленный боеприпас",
          "text": "При попадании обычный урон не наносится: цель совершает Стойкость КС 13; провал — 2d6 урона ядом."
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "xADKnwg2qRjwacud",
    "name": "Стрелы: Бронебойные",
    "pack": "weapons",
    "type": "ammo",
    "arrow": true,
    "classDC": false,
    "costs": {},
    "before": {
      "description": "<p>Этот стрелочный боеприпас совместим с механическими метательными системами и не требует порохового заряда. Внутри усиленный сердечник, рассчитанный на бронепластины, композиты и защищённые цели. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p>Пока эти боеприпасы загружены, оружие получает <strong>@Trait[Concussive]{сотрясающее}</strong>. При расчёте сопротивления или иммунитета система использует более слабую защиту цели от колющего или дробящего урона.</p><p><em>Старая механика Cyberpunk со снижением/износом брони удалена: отдельный счётчик брони больше не требуется.</em></p>",
      "rules": [
        {
          "key": "AdjustStrike",
          "mode": "add",
          "property": "weapon-traits",
          "value": "concussive",
          "definition": [
            "item:id:{item|id}"
          ]
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "zI9A4NAbx1lgeVP6",
    "name": "Стрелы: с биотоксином",
    "pack": "weapons",
    "type": "ammo",
    "arrow": true,
    "classDC": true,
    "costs": {},
    "before": {
      "description": "<p>Этот стрелочный боеприпас совместим с механическими метательными системами и не требует порохового заряда. Внутренняя капсула несёт биотоксин и превращает обычное попадание в способ доставки химического агента. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p>При попадании этот снаряд не наносит обычный урон оружия. Живая цель совершает @Check[fortitude|dc:15]{Стойкость КС 15}. При провале она получает @Damage[3d6[poison]]{3d6 урона ядом}; броня не уменьшает этот урон.</p>",
      "rules": [
        {
          "key": "Note",
          "selector": "{item|_id}-attack",
          "title": "Биотоксин",
          "text": "При попадании обычный урон не наносится: цель совершает Стойкость КС 15; провал — 3d6 урона ядом."
        }
      ],
      "baseItem": "projectile-ammo"
    }
  },
  {
    "id": "zoqQMz7JPFNZqoNK",
    "name": "Стрелы: Резиновые",
    "pack": "weapons",
    "type": "ammo",
    "arrow": true,
    "classDC": false,
    "costs": {},
    "before": {
      "description": "<p>Этот стрелочный боеприпас совместим с механическими метательными системами и не требует порохового заряда. Мягкий поражающий элемент снижает вероятность смертельного ранения, сохраняя достаточный импульс для остановки цели. На улицах такие боеприпасы обычно стоят заметно дороже обычных, зато позволяют заранее подобрать магазин под конкретную цель.</p><hr><p><strong>Эффект боеприпаса</strong></p><p>Нелетальный боеприпас. Пока он загружен, атаки этого оружия получают признак <strong>@Trait[Nonlethal]{несмертельное}</strong>.</p>",
      "rules": [
        {
          "key": "AdjustStrike",
          "mode": "add",
          "property": "weapon-traits",
          "value": "nonlethal",
          "definition": [
            "item:id:{item|id}"
          ]
        }
      ],
      "baseItem": "projectile-ammo"
    }
  }
];
