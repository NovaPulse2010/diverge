import assert from 'node:assert/strict'
import test from 'node:test'
import { packDictationWords } from '../src/utils/dictationLayout.ts'

const pack = words => packDictationWords(words.map(word => Array.from(word)))
const textRows = rows => rows.map(row => row.map(char => char ?? ' ').join(''))

test('one blank cell between entries, never between characters', () => {
  assert.deepEqual(textRows(pack(['帽子', '橱窗', '脑袋'])), ['帽子 橱窗 脑袋'])
})

test('moves the entire next word when the separator makes it exceed eight cells', () => {
  assert.deepEqual(textRows(pack(['各式各样', '方方正正', '人山人海', '密密麻麻'])),
    ['各式各样', '方方正正', '人山人海', '密密麻麻'])
})

test('fits exact-width rows without leading or trailing blank cells', () => {
  assert.deepEqual(textRows(pack(['专卖', '古董', '一溜烟', '大吃一惊'])),
    ['专卖 古董', '一溜烟 大吃一惊'])
})

test('empty entries do not generate gaps or empty rows', () => {
  assert.deepEqual(pack([]), [])
  assert.deepEqual(pack(['', '']), [])
  assert.deepEqual(textRows(pack(['', '春天', '', '花朵', ''])), ['春天 花朵'])
})

test('an entry longer than eight cells stays intact on a dedicated row', () => {
  assert.deepEqual(textRows(pack(['古诗', '一二三四五六七八九十', '老师'])),
    ['古诗', '一二三四五六七八九十', '老师'])
})

test('preserves every character in input order', () => {
  const words = ['专卖', '古董', '一溜烟', '各式各样', '方方正正', '人山人海', '密密麻麻', '大吃一惊']
  assert.equal(pack(words).flat().filter(Boolean).join(''), words.join(''))
})
