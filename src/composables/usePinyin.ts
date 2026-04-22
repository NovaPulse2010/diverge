import { pinyin } from 'pinyin-pro'

export function usePinyin() {
  function getCharPinyin(char: string): string {
    if (!/[\u4e00-\u9fff]/.test(char)) return ''
    return pinyin(char, { toneType: 'symbol', type: 'array' })[0] || ''
  }

  function getTextPinyinPairs(text: string): Array<{ char: string; pinyin: string }> {
    const chars = text.split('')
    return chars
      .filter((c) => c.trim())
      .map((c) => ({
        char: c,
        pinyin: getCharPinyin(c),
      }))
  }

  function isChinese(char: string): boolean {
    return /[\u4e00-\u9fff]/.test(char)
  }

  return { getCharPinyin, getTextPinyinPairs, isChinese }
}
