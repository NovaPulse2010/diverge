export function usePrint() {
  function printWorksheet() {
    window.print()
  }

  return { printWorksheet }
}
