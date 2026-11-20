import { HOST_MODULE_ID, LEGACY_MODULE_ID, MODULE_ID, safeInt } from "./cyberware-schema.mjs";

let catalogPromise = null;

function collectionValues(collection) {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  if (Array.isArray(collection.contents)) return collection.contents;
  return [...collection].map((value) =>
    Array.isArray(value) && value.length === 2 ? value[1] : value,
  );
}

function compareByName(left, right) {
  return String(left?.name ?? "").localeCompare(
    String(right?.name ?? ""),
    "ru",
    { sensitivity: "base", numeric: true },
  );
}

function normalizeName(value) {
  return String(value ?? "")
    .toLocaleLowerCase("ru-RU")
    .replaceAll("ё", "е")
    .replace(/\s+/gu, " ")
    .trim();
}


function itemLevel(entry) {
  const value = Number(entry?.system?.level?.value ?? entry?.level?.value ?? entry?.level);
  return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : Number.NaN;
}

function pktBaseGrade(entry) {
  const flagged = Number(
    entry?.flags?.[HOST_MODULE_ID]?.pktGrade ??
      entry?.flags?.[MODULE_ID]?.pktGrade ??
      entry?.flags?.[LEGACY_MODULE_ID]?.pktGrade,
  );
  if (Number.isFinite(flagged) && flagged > 0) return Math.trunc(flagged);

  const match = String(entry?.name ?? '').match(/\b(I|II|III|IV|V)(?=\s*(?:\(ПКТ\)|\[ПКТ\]|$))/iu);
  if (match) {
    return { I: 1, II: 2, III: 3, IV: 4, V: 5 }[match[1].toUpperCase()] ?? Number.NaN;
  }

  const level = itemLevel(entry);
  if (Number.isFinite(level) && level > 0) return Math.max(1, Math.ceil(level / 4));

  const legacyQuality = Number(
    entry?.flags?.[HOST_MODULE_ID]?.pktComponentQuality ??
      entry?.flags?.[MODULE_ID]?.pktComponentQuality ??
      entry?.flags?.[LEGACY_MODULE_ID]?.pktComponentQuality,
  );
  return Number.isFinite(legacyQuality) && legacyQuality >= 0
    ? Math.max(1, Math.min(5, Math.trunc(legacyQuality) + 1))
    : Number.NaN;
}

function packPackageName(pack) {
  const collection = String(pack?.collection ?? pack?.metadata?.id ?? pack?.metadata?.name ?? "");
  return String(pack?.metadata?.packageName ?? pack?.metadata?.package ?? collection.split(".")[0] ?? "");
}

function modelItemIds(models) {
  const ids = new Set();
  for (const model of models) {
    if (model.requiredBodyId) ids.add(model.requiredBodyId);
    for (const entry of [
      ...(model.unique ?? []),
      ...(model.components ?? []),
    ]) {
      if (entry.itemId) ids.add(entry.itemId);
    }
    for (const choice of model.choices ?? []) {
      for (const itemId of choice.itemIds ?? []) ids.add(itemId);
    }
  }
  return ids;
}

async function loadDetailedEntries(itemPack, itemIndex, itemIds) {
  const entries = new Map();
  await Promise.all(
    [...itemIds].map(async (itemId) => {
      const indexed = itemIndex.get(itemId);
      const document =
        typeof itemPack.getDocument === "function"
          ? await itemPack.getDocument(itemId)
          : null;
      if (document ?? indexed) entries.set(itemId, document ?? indexed);
    }),
  );
  return entries;
}

export function clearPktCatalogCache() {
  catalogPromise = null;
}

export function loadPktCatalog({
  game,
  itemPackId,
  journalPackId,
  getFlag,
  getImplantType,
  getSlots,
  readCyberwareDescription,
  isPktBody,
  isPktBiosystem,
  getPktBodyQuality,
  refresh = false,
}) {
  if (refresh) catalogPromise = null;
  if (catalogPromise) return catalogPromise;

  catalogPromise = (async () => {
    const itemPack = game?.packs?.get?.(itemPackId);
    if (!itemPack) {
      throw new Error("Компендий предметов ПКТ недоступен.");
    }

    // Remaster has renamed/repacked its journal compendium more than once.
    // Prefer the configured pack, but also scan Remaster/CPEL journal packs so
    // Forge never collapses to only “Без ПКТ / Случайная” after a pack rename.
    const exactJournalPack = game?.packs?.get?.(journalPackId);
    const journalPacks = [];
    if (exactJournalPack) journalPacks.push(exactJournalPack);
    for (const pack of collectionValues(game?.packs)) {
      const documentName = pack?.documentName ?? pack?.metadata?.type;
      const packageName = packPackageName(pack);
      if (documentName !== "JournalEntry") continue;
      if (![MODULE_ID, HOST_MODULE_ID].includes(packageName)) continue;
      if (!journalPacks.includes(pack)) journalPacks.push(pack);
    }
    const journals = [];
    for (const pack of journalPacks) {
      try {
        journals.push(...collectionValues(await pack?.getDocuments?.()));
      } catch {
        // One optional journal pack being unavailable must not hide the others.
      }
    }

    const index = await itemPack.getIndex({
      fields: [
        "name",
        "img",
        "system.level.value",
        `flags.${HOST_MODULE_ID}.pktFamily`,
        `flags.${HOST_MODULE_ID}.pktComponentQuality`,
        `flags.${HOST_MODULE_ID}.pktReplaceable`,
        `flags.${HOST_MODULE_ID}.pktBody`,
        `flags.${HOST_MODULE_ID}.pktBiosystem`,
        `flags.${HOST_MODULE_ID}.pktQuality`,
        `flags.${HOST_MODULE_ID}.implantType`,
        `flags.${HOST_MODULE_ID}.slots`,
        `flags.${MODULE_ID}.pktFamily`,
        `flags.${MODULE_ID}.pktComponentQuality`,
        `flags.${MODULE_ID}.pktReplaceable`,
        `flags.${MODULE_ID}.pktBody`,
        `flags.${MODULE_ID}.pktBiosystem`,
        `flags.${MODULE_ID}.pktQuality`,
        `flags.${MODULE_ID}.implantType`,
        `flags.${MODULE_ID}.slots`,
        `flags.${LEGACY_MODULE_ID}.pktBody`,
        `flags.${LEGACY_MODULE_ID}.pktBiosystem`,
        `flags.${LEGACY_MODULE_ID}.pktQuality`,
        `flags.${LEGACY_MODULE_ID}.implantType`,
        `flags.${LEGACY_MODULE_ID}.slots`,
      ],
    });
    const itemIndex = new Map(
      collectionValues(index).map((entry) => [entry._id ?? entry.id, entry]),
    );
    const indexEntries = collectionValues(index);
    const idsByName = new Map();
    for (const entry of indexEntries) {
      const key = normalizeName(entry.name);
      if (!key) continue;
      const values = idsByName.get(key) ?? [];
      values.push(entry._id ?? entry.id);
      idsByName.set(key, values);
    }

    // PKT journals live in cyberpunk-remaster and can legitimately keep IDs
    // from an older copy of the library. Resolve such IDs through the active
    // Remaster item packs, then bind them to the current CPEL item with the
    // same canonical name. This avoids hard failures after CPEL ID migrations.
    const foreignItemPacks = collectionValues(game?.packs).filter((pack) => {
      const documentName = pack?.documentName ?? pack?.metadata?.type;
      return documentName === "Item" && packPackageName(pack) === MODULE_ID;
    });
    const foreignLookupCache = new Map();
    const exactNameId = (name) => {
      const matches = idsByName.get(normalizeName(name)) ?? [];
      return matches.length === 1 ? matches[0] : null;
    };
    const foreignDocument = async (itemId) => {
      if (!itemId) return null;
      if (foreignLookupCache.has(itemId)) return foreignLookupCache.get(itemId);
      const promise = (async () => {
        for (const pack of foreignItemPacks) {
          try {
            const document = await pack?.getDocument?.(itemId);
            if (document) return document;
          } catch {
            // A pack may not expose this ID; continue to the next Remaster pack.
          }
        }
        return null;
      })();
      foreignLookupCache.set(itemId, promise);
      return promise;
    };
    const resolveModelItemId = async (itemId, hintName = "") => {
      if (!itemId || itemIndex.has(itemId)) return itemId;
      const hinted = exactNameId(hintName);
      if (hinted) return hinted;
      const foreign = await foreignDocument(itemId);
      return exactNameId(foreign?.name) ?? itemId;
    };

    const rawModelsByKey = new Map();
    for (const journal of collectionValues(journals)) {
      for (const page of collectionValues(journal.pages)) {
        const model =
          page.flags?.[MODULE_ID]?.pktModel ??
          page.flags?.[HOST_MODULE_ID]?.pktModel ??
          page.flags?.[LEGACY_MODULE_ID]?.pktModel;
        if (model?.key && !rawModelsByKey.has(model.key)) {
          rawModelsByKey.set(model.key, model);
        }
      }
    }
    const rawModels = [...rawModelsByKey.values()];
    const models = await Promise.all(rawModels.map(async (source) => {
      const model = structuredClone(source);
      const oldBodyId = model.requiredBodyId;
      model.requiredBodyId = await resolveModelItemId(
        model.requiredBodyId,
        model.requiredBodyName ?? model.bodyName ?? "",
      );
      if (oldBodyId && oldBodyId !== model.requiredBodyId) model.legacyRequiredBodyId = oldBodyId;
      for (const listName of ["unique", "components"]) {
        for (const entry of model[listName] ?? []) {
          const oldId = entry.itemId;
          entry.itemId = await resolveModelItemId(entry.itemId, entry.name ?? entry.label ?? "");
          if (oldId && oldId !== entry.itemId) entry.legacyItemId = oldId;
        }
      }
      for (const choice of model.choices ?? []) {
        choice.itemIds = await Promise.all((choice.itemIds ?? []).map((itemId) => resolveModelItemId(itemId)));
      }
      model.unresolvedItemIds = [...modelItemIds([model])].filter((itemId) => !itemIndex.has(itemId));
      return model;
    }));
    const replaceableIds = indexEntries
      .filter((entry) => getFlag(entry, "pktReplaceable") === true)
      .map((entry) => entry._id ?? entry.id);

    const bodyIdSet = new Set(
      indexEntries
        .filter((entry) =>
          (typeof isPktBody === "function" && isPktBody(entry)) ||
          /^Полная\s+Конверсия\s+Тела(?:\s|\[|$)/iu.test(String(entry?.name ?? ""))
        )
        .map((entry) => entry._id ?? entry.id),
    );
    // A structured model's required body is authoritative even after an ID
    // migration or if the lightweight index omitted one of the body flags.
    for (const model of models) {
      if (model.requiredBodyId && itemIndex.has(model.requiredBodyId)) {
        bodyIdSet.add(model.requiredBodyId);
      }
    }
    const bodyIds = [...bodyIdSet];

    const biosystemIdSet = new Set(
      indexEntries
        .filter((entry) =>
          (typeof isPktBiosystem === "function" && isPktBiosystem(entry)) ||
          /^Биосистема$/iu.test(String(entry?.name ?? ""))
        )
        .map((entry) => entry._id ?? entry.id),
    );
    const biosystemIds = [...biosystemIdSet];
    const requiredIds = modelItemIds(models);
    for (const itemId of replaceableIds) requiredIds.add(itemId);
    for (const itemId of bodyIds) requiredIds.add(itemId);
    for (const itemId of biosystemIds) requiredIds.add(itemId);
    const detailedEntries = await loadDetailedEntries(
      itemPack,
      itemIndex,
      requiredIds,
    );

    // A PKT model may intentionally use a Remaster-only component while the
    // structured loader's primary pack is CPEL. Keep that foreign document as
    // the detailed source instead of degrading its name to “Предмет <id>”.
    // Forge's merged catalog will later decide which equivalent copy is the
    // canonical generated item.
    await Promise.all(
      [...requiredIds]
        .filter((itemId) => !detailedEntries.has(itemId))
        .map(async (itemId) => {
          const foreign = await foreignDocument(itemId);
          if (foreign) detailedEntries.set(itemId, foreign);
        }),
    );

    const itemInfo = (itemId, fallbackName = "") => {
      const entry = detailedEntries.get(itemId) ?? itemIndex.get(itemId);
      const described = entry ? readCyberwareDescription(entry) : {};
      const flaggedHardCost = entry ? getFlag(entry, "hardCost") : null;
      const flaggedStressFormula = entry
        ? getFlag(entry, "stressFormula")
        : null;
      const hardCost =
        described.hardCost ??
        (flaggedHardCost === undefined || flaggedHardCost === null
          ? null
          : safeInt(flaggedHardCost));
      const stressFormula =
        described.stressFormula ??
        (typeof flaggedStressFormula === "string" && flaggedStressFormula
          ? flaggedStressFormula
          : null);
      return {
        itemId,
        name: entry?.name ?? fallbackName ?? `Предмет ${itemId}`,
        img: entry?.img ?? "icons/svg/item-bag.svg",
        ...(hardCost === null ? {} : { hardCost: safeInt(hardCost) }),
        ...(typeof stressFormula === "string" && stressFormula
          ? { stressFormula }
          : {}),
      };
    };
    const enrich = (entry, fallbackKey) => ({
      ...entry,
      ...itemInfo(entry.itemId, entry.name ?? entry.label ?? ""),
      key: entry.key ?? fallbackKey,
    });

    const enrichedModels = models.map((source) => {
      const model = structuredClone(source);
      return {
        ...model,
        requiredBodyName: itemInfo(
          model.requiredBodyId,
          model.requiredBodyName ?? model.bodyName ?? "",
        ).name,
        unique: (model.unique ?? []).map((entry, index) =>
          enrich(entry, `unique-${index + 1}`),
        ),
        components: (model.components ?? []).map((entry, index) =>
          enrich(entry, `component-${index + 1}`),
        ),
        choices: (model.choices ?? []).map((choice) => ({
          ...choice,
          options: (choice.itemIds ?? []).map(itemInfo),
        })),
      };
    });
    const bodies = bodyIds
      .map((itemId) => detailedEntries.get(itemId) ?? itemIndex.get(itemId))
      .filter(Boolean)
      .map((entry) => ({
        itemId: entry._id ?? entry.id,
        name: entry.name,
        img: entry.img,
        quality: typeof getPktBodyQuality === "function" ? Number(getPktBodyQuality(entry)) : Number.NaN,
        slots: getSlots(entry),
      }))
      .sort((left, right) =>
        (Number.isFinite(left.quality) ? left.quality : 999) -
          (Number.isFinite(right.quality) ? right.quality : 999) ||
        compareByName(left, right),
      );
    const biosystem = biosystemIds.length
      ? itemInfo(biosystemIds[0])
      : null;

    const replacements = replaceableIds
      .map((itemId) => detailedEntries.get(itemId) ?? itemIndex.get(itemId))
      .filter(Boolean)
      .map((entry) => ({
        itemId: entry._id ?? entry.id,
        name: entry.name,
        img: entry.img,
        family: getFlag(entry, "pktFamily") ?? null,
        quality: Number(getFlag(entry, "pktComponentQuality")),
        grade: pktBaseGrade(entry),
        level: itemLevel(entry),
        replaceable: getFlag(entry, "pktReplaceable") === true,
        slots: getSlots(entry),
        implantType: getImplantType(entry),
      }))
      .filter(
        (entry) =>
          entry.implantType === "base" &&
          entry.family &&
          Number.isFinite(entry.grade),
      )
      .sort(compareByName);

    return { models: enrichedModels, replacements, bodies, biosystem };
  })().catch((error) => {
    catalogPromise = null;
    throw error;
  });
  return catalogPromise;
}
