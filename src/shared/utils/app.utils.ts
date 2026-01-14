const uniqueBy = <T, K>(arr: T[], keyFn: (item: T) => K): T[] => {
  const seen = new Set<K>()
  const out: T[] = []
  for (const item of arr) {
    const k = keyFn(item)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(item)
  }
  return out
}

export const AppUtils = {
  uniqueBy,
} as const