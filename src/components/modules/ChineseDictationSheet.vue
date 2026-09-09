<template>
  <section class="chinese-sheet">
    <header class="chinese-sheet__header">
      <h1>语文默写 · {{ modeTitle }}</h1>
      <div class="chinese-sheet__meta">
        <label>姓名：<input :value="studentName" aria-label="姓名" @input="updateHeader('studentName', $event)" /></label>
        <label>班级：<input :value="studentClass" aria-label="班级" @input="updateHeader('studentClass', $event)" /></label>
        <label>日期：<input :value="worksheetDate" aria-label="日期" @input="updateHeader('worksheetDate', $event)" /></label>
        <label>评分：<input :value="worksheetScore" aria-label="评分" @input="updateHeader('worksheetScore', $event)" /></label>
      </div>
    </header>

    <div class="chinese-sheet__guide">
      <span>{{ guidePrimary }}</span>
      <span>按词语分组，超过 8 格自动换行</span>
    </div>

    <div v-if="rows.length" class="chinese-sheet__grid">
      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="chinese-sheet__row"
      >
        <div
          v-for="(cell, cellIndex) in row"
          :key="`${rowIndex}-${cellIndex}-${cell.char}`"
          class="chinese-sheet__unit"
        >
          <PinyinGuide
            :text="showPinyin ? cell.pinyin : ''"
            :top-color="gridTopColor"
            :mid-color="gridMidColor"
            :base-color="gridBaseColor"
            line-style="solid"
          />
          <component
            :is="gridComponent"
            :size="52"
            :border-color="gridColor"
            :guide-color="guideColor"
            class="chinese-sheet__hanzi-grid"
          >
            <span v-if="showHanzi" class="chinese-sheet__hanzi">{{ cell.char }}</span>
          </component>
        </div>
      </div>
    </div>
    <div v-else class="chinese-sheet__empty">
      在左侧输入汉字后，这里会按每行 8 格生成默写纸。
    </div>

    <footer class="chinese-sheet__footer">
      <span>{{ footerText }}</span>
      <span>{{ cellCount }} 格 / {{ rows.length }} 行</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DictationDisplayMode, DictationSubMode, GridType, WorksheetConfig } from '@/types/worksheet'
import { usePinyin } from '@/composables/usePinyin'
import PinyinGuide from '@/components/grids/PinyinGuide.vue'
import TianziGrid from '@/components/grids/TianziGrid.vue'
import MiziGrid from '@/components/grids/MiziGrid.vue'
import SquareGrid from '@/components/grids/SquareGrid.vue'

interface DictationCell {
  char: string
  pinyin: string
}

const props = withDefaults(
  defineProps<{
    content: string
    pinyinContent?: string
    dictationMode?: DictationSubMode
    displayMode?: DictationDisplayMode
    gridType?: GridType
    gridColor?: string
    gridTopColor?: string
    gridMidColor?: string
    gridBaseColor?: string
    studentName?: string
    studentClass?: string
    worksheetDate?: string
    worksheetScore?: string
  }>(),
  {
    pinyinContent: '',
    dictationMode: 'pinyin-only',
    displayMode: 'pinyin',
    gridType: 'tianzi',
    gridColor: '#dc3545',
    gridTopColor: '#237a45',
    gridMidColor: '#78cc95',
    gridBaseColor: '#e87060',
    studentName: '',
    studentClass: '',
    worksheetDate: '',
    worksheetScore: '',
  },
)

const { getTextPinyinPairs, isChinese } = usePinyin()

const modeTitle = computed(() =>
  props.dictationMode === 'char-only' ? '看汉字写拼音' : '看拼音写汉字',
)
const showPinyin = computed(() => props.displayMode !== 'hanzi')
const showHanzi = computed(() => props.displayMode !== 'pinyin')
const guidePrimary = computed(() => {
  if (props.displayMode === 'both') return '拼音与汉字同时显示'
  return props.dictationMode === 'char-only' ? '上方写拼音，下方看汉字' : '上方看拼音，下方写汉字'
})
const footerText = computed(() => guidePrimary.value)

const emit = defineEmits<{
  updateHeader: [partial: Partial<WorksheetConfig>]
}>()

function updateHeader(field: 'studentName' | 'studentClass' | 'worksheetDate' | 'worksheetScore', event: Event) {
  emit('updateHeader', { [field]: (event.target as HTMLInputElement).value })
}

const gridComponent = computed(() => {
  switch (props.gridType) {
    case 'mizi': return MiziGrid
    case 'square': return SquareGrid
    default: return TianziGrid
  }
})

const guideColor = computed(() => {
  if (props.gridColor.toLowerCase() === '#dc3545') return '#e8a0a8'
  return `${props.gridColor}66`
})

const wordSeparator = /[\s,，、;；。.!！?？]+/u

function contentWordLines(text: string): string[][] {
  return text.split(/\r?\n/u).map(line =>
    line
      .split(wordSeparator)
      .map(word => Array.from(word).filter(isChinese).join(''))
      .filter(Boolean),
  )
}

function manualPinyinWords(text: string): string[][] {
  return text
    .split(/\r?\n/u)
    .map(line =>
      line
        .trim()
        .split(/[\s·・,，、;；]+/u)
        .map(item => item.trim())
        .filter(Boolean),
    )
}

const cellsByWord = computed<DictationCell[][]>(() => {
  const sourceWordLines = contentWordLines(props.content)
  const overrideLines = manualPinyinWords(props.pinyinContent)
  const overrideSyllables = overrideLines.flat()
  const hasMatchingSourceLines = overrideLines.length === sourceWordLines.length
  let sequentialOverrideIndex = 0

  return sourceWordLines.flatMap((words, lineIndex) => {
    const lineOverrides = hasMatchingSourceLines ? (overrideLines[lineIndex] ?? []) : []
    let lineOverrideIndex = 0
    return words.map(word => {
      const automaticPairs = getTextPinyinPairs(word)
      return automaticPairs.map(pair => {
        const override = hasMatchingSourceLines
          ? lineOverrides[lineOverrideIndex++]
          : overrideSyllables[sequentialOverrideIndex++]
        return { char: pair.char, pinyin: override || pair.pinyin }
      })
    })
  })
})

const rows = computed<DictationCell[][]>(() => {
  const result: DictationCell[][] = []
  let row: DictationCell[] = []

  const flush = () => {
    if (row.length) result.push(row)
    row = []
  }

  for (const word of cellsByWord.value) {
    if (word.length <= 8 && row.length && row.length + word.length > 8) flush()

    let offset = 0
    while (offset < word.length) {
      const free = 8 - row.length
      row.push(...word.slice(offset, offset + free))
      offset += free
      if (row.length === 8) flush()
    }
  }

  flush()
  return result
})

const cellCount = computed(() => cellsByWord.value.reduce((sum, word) => sum + word.length, 0))
</script>

<style scoped>
.chinese-sheet {
  width: 100%;
  color: #26352f;
}

.chinese-sheet__header {
  margin-bottom: 10px;
}

.chinese-sheet__header h1 {
  margin: 0 0 8px;
  color: #26352f;
  font: 700 20px/1.3 var(--font-kai);
  letter-spacing: 0.08em;
  text-align: center;
}

.chinese-sheet__meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 13px;
  padding-bottom: 8px;
  border-bottom: 1px solid #dce3df;
  color: #26352f;
  font: 12px/1.2 var(--font-kai);
}

.chinese-sheet__meta label {
  min-width: 0;
  white-space: nowrap;
}

.chinese-sheet__meta input {
  display: inline-block;
  min-width: 56px;
  max-width: 90px;
  overflow: hidden;
  padding: 0 3px 2px;
  border: 0;
  border-bottom: 1px solid #69716e;
  border-radius: 0;
  outline: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  font-weight: 400;
  text-overflow: ellipsis;
  vertical-align: bottom;
  white-space: nowrap;
}

.chinese-sheet__guide {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 7px;
  padding: 8px 14px;
  border: 1px solid #cad7d0;
  color: #267a56;
  background: #f2faf5;
  font: 700 12px/1 var(--font-kai);
}

.chinese-sheet__grid {
  border-top: 1px solid #dce3df;
  border-left: 1px solid #dce3df;
}

.chinese-sheet__row {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 5px;
  padding: 8px 10px;
  border-right: 1px solid #dce3df;
  border-bottom: 1px solid #dce3df;
  break-inside: avoid;
  page-break-inside: avoid;
}

.chinese-sheet__unit {
  min-width: 0;
  text-align: center;
}

.chinese-sheet__hanzi-grid {
  margin: 4px auto 0;
  flex-shrink: 0;
}

.chinese-sheet__hanzi {
  color: #b8b8b8;
  font: 28px/1 var(--font-kai);
}

.chinese-sheet__empty {
  display: grid;
  min-height: 132px;
  place-items: center;
  border: 1px solid #dce3df;
  color: #8b9390;
  font: 12px/1.5 var(--font-kai);
}

.chinese-sheet__footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  color: #8b9390;
  font: 10px/1 var(--font-kai);
}

@media print {
  .chinese-sheet__guide,
  .chinese-sheet__row {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>
