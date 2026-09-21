import assert from 'node:assert/strict'
import test from 'node:test'
import { dictationRowTemplate, packDictationWords } from '../src/utils/dictationLayout.ts'

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

test('uses a fractional separator when packing to the actual row width', () => {
  assert.deepEqual(
    textRows(packDictationWords(['帽子', '橱窗', '脑袋', '书包', '香蕉', '春天'].map(word => Array.from(word)), 12, 0.35)),
    ['帽子 橱窗 脑袋 书包 香蕉', '春天'],
  )
})

test('includes character gaps in the row budget without adding gaps at word edges', () => {
  const words = ['帽子', '橱窗', '脑袋'].map(word => Array.from(word))
  // Two 52px cells + 5px per word, plus an 18.2px word separator = 236.2px.
  assert.deepEqual(textRows(packDictationWords(words, 236.2 / 52, 0.35, 5 / 52)),
    ['帽子 橱窗', '脑袋'])
  assert.deepEqual(textRows(packDictationWords(words, 236 / 52, 0.35, 5 / 52)),
    ['帽子', '橱窗', '脑袋'])
})

test('supports the requested 10px gap between characters in one word', () => {
  const words = ['帽子', '橱窗'].map(word => Array.from(word))
  // Two 52px cells plus a 10px internal gap per word.
  assert.deepEqual(textRows(packDictationWords(words, 246.2 / 52, 0.35, 10 / 52)),
    ['帽子 橱窗'])
  assert.deepEqual(textRows(packDictationWords(words, 245 / 52, 0.35, 10 / 52)),
    ['帽子', '橱窗'])
})

test('single characters have no internal gap and four-character words stay intact', () => {
  const words = ['春', '夏', '各式各样', '秋'].map(word => Array.from(word))
  assert.deepEqual(textRows(packDictationWords(words, 223 / 52, 0.35, 5 / 52)),
    ['春 夏', '各式各样', '秋'])
})

test('word separators share remaining width equally while character tracks remain fixed', () => {
  const row = ['春', null, '帽', '子', null, '一', '溜', '烟']
  assert.equal(dictationRowTemplate(row, 52, 10, 18.2),
    '52px minmax(18.2px, 1fr) 62px 52px minmax(18.2px, 1fr) 62px 62px 52px')
})

test('a single word stays left aligned without stretching its character spacing', () => {
  assert.equal(dictationRowTemplate(['各', '式', '各', '样'], 52, 10, 18.2),
    '62px 62px 62px 52px')
  assert.equal(dictationRowTemplate(['春'], 52, 10, 18.2), '52px')
  assert.equal(dictationRowTemplate([], 52, 10, 18.2), '')
})

test('word spacing adapts to the selected cell size with the same internal 10px gap', () => {
  assert.equal(dictationRowTemplate(['帽', '子', null, '春'], 60, 10, 21),
    '70px 60px minmax(21px, 1fr) 60px')
})
