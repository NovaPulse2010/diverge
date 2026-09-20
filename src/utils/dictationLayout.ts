/**
 * Pack complete input entries without splitting an entry across rows.
 *
 * `columns` is a width budget measured in character-cell units. `separator`
 * lets the visual gap between entries be narrower than a full character cell.
 */
export function packDictationWords<T>(
  words: readonly (readonly T[])[],
  columns = 8,
  separator = 1,
): (T | null)[][] {
  const rows: (T | null)[][] = []
  let row: (T | null)[] = []
  let rowWidth = 0

  for (const word of words) {
    if (!word.length) continue
    const separatorWidth = row.length ? separator : 0
    if (row.length && rowWidth + separatorWidth + word.length > columns) {
      rows.push(row)
      row = []
      rowWidth = 0
    }
    if (row.length) {
      row.push(null)
      rowWidth += separator
    }
    row.push(...word)
    rowWidth += word.length
    // An entry longer than the available width gets its own row, never a partial word.
    if (rowWidth >= columns) {
      rows.push(row)
      row = []
      rowWidth = 0
    }
  }

  if (row.length) rows.push(row)
  return rows
}
