/** Pack complete input lines, reserving one empty cell between neighbouring entries. */
export function packDictationWords<T>(words: readonly (readonly T[])[], columns = 8): (T | null)[][] {
  const rows: (T | null)[][] = []
  let row: (T | null)[] = []

  for (const word of words) {
    if (!word.length) continue
    const separator = row.length ? 1 : 0
    if (row.length && row.length + separator + word.length > columns) {
      rows.push(row)
      row = []
    }
    if (row.length) row.push(null)
    row.push(...word)
    // An entry longer than the normal capacity gets its own row, never a partial word.
    if (row.length >= columns) {
      rows.push(row)
      row = []
    }
  }

  if (row.length) rows.push(row)
  return rows
}
