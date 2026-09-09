import { pinyin } from 'pinyin-pro'

export function usePinyin() {
  function getCharPinyin(char: string): string {
    if (!/[\u4e00-\u9fff]/.test(char)) return ''
    return pinyin(char, { toneType: 'symbol', type: 'array' })[0] || ''
  }

  function getTextPinyinPairs(text: string): Array<{ char: string; pinyin: string }> {
    const pairs: Array<{ char: string; pinyin: string }> = []
    for (const part of text.split(/(\s+)/)) {
      if (!part || /^\s+$/.test(part)) continue
      const chars = Array.from(part)
      const values = pinyin(part, { toneType: 'symbol', type: 'array' })
      chars.forEach((char, index) => {
        pairs.push({
          char,
          pinyin: /[\u4e00-\u9fff]/.test(char) ? (values[index] || getCharPinyin(char)) : '',
        })
      })
    }
    return pairs
  }

  function getTextPinyin(text: string): string {
    return text
      .split(/\n/)
      .map(line => line
        .split(/(\s+)/)
        .map(part => /^\s+$/.test(part) ? part : getTextPinyinPairs(part).map(item => item.pinyin).join(' '))
        .join(''))
      .join('\n')
  }

  function isChinese(char: string): boolean {
    return /[\u4e00-\u9fff]/.test(char)
  }

  return { getCharPinyin, getTextPinyinPairs, getTextPinyin, isChinese }
}
