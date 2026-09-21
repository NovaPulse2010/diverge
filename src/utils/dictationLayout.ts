/**
 * Pack complete input entries without splitting an entry across rows.
 *
 * `columns` is a width budget measured in character-cell units. `separator`
 * lets the visual gap between entries be narrower than a full character cell.
 * `characterGap` reserves space only between characters inside each entry.
 */
export function packDictationWords<T>(
  words: readonly (readonly T[])[],
  columns = 8,
  separator = 1,
  characterGap = 0,
): (T | null)[][] {
  const rows: (T | null)[][] = []
  let row: (T | null)[] = []
  let rowWidth = 0

  for (const word of words) {
    if (!word.length) continue
    const wordWidth = word.length + (word.length - 1) * characterGap
    const separatorWidth = row.length ? separator : 0
    if (row.length && rowWidth + separatorWidth + wordWidth > columns + 1e-9) {
      rows.push(row)
      row = []
      rowWidth = 0
    }
    if (row.length) {
      row.push(null)
      rowWidth += separator
    }
    row.push(...word)
    rowWidth += wordWidth
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

/** Keep character tracks fixed; share the remaining row width only between words. */
export function dictationRowTemplate<T>(
  row: readonly (T | null)[],
  cellSize: number,
  characterGap: number,
  minimumWordGap: number,
): string {
  return row.map((cell, index) => {
    if (cell === null) return `minmax(${minimumWordGap}px, 1fr)`
    const hasNextCharacter = index + 1 < row.length && row[index + 1] !== null
    return `${cellSize + (hasNextCharacter ? characterGap : 0)}px`
  }).join(' ')
}
