/** Return a weapon range increment across current SF2e v14 and legacy CPEL shapes. */
export function weaponRangeIncrement(document) {
  const raw = document?.system?.range;
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return raw;
  if (raw && typeof raw === "object") {
    const increment = Number(raw.increment);
    return Number.isFinite(increment) && increment > 0 ? increment : null;
  }
  return null;
}
