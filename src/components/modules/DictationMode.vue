<template>
  <div class="dictation-module">

    <!-- ① 汉译英默写 / 看图写英文 -->
    <template v-if="dictationMode === 'chinese-hint' || dictationMode === 'emoji-hint'">
      <div class="dictation-header">
        <input
          class="dictation-title editable-field"
          type="text"
          :value="title || defaultTitle"
          aria-label="默写标题"
          @input="updateHeader('dictationTitle', $event)"
        />
        <div class="dictation-info-bar">
          <label>姓名：<input class="info-blank editable-field" type="text" :value="studentName" aria-label="姓名" @input="updateHeader('studentName', $event)" /></label>
          <label>班级：<input class="info-blank editable-field" type="text" :value="studentClass" aria-label="班级" @input="updateHeader('studentClass', $event)" /></label>
          <label>日期：<input class="info-blank date-blank editable-field" type="text" :value="worksheetDate" aria-label="日期" @input="updateHeader('worksheetDate', $event)" /></label>
          <label>评分：<input class="info-blank editable-field" type="text" :value="worksheetScore" aria-label="评分" @input="updateHeader('worksheetScore', $event)" /></label>
        </div>
      </div>

      <!-- 每个行组：提示行 + N 行四线三格 -->
      <div
        v-for="(group, gi) in itemGroups"
        :key="gi"
        class="hint-group"
      >
        <div class="hint-row" :style="{ gridTemplateColumns: `repeat(${group.cols}, 1fr)` }">
          <div
            v-for="(item, ii) in group.items"
            :key="ii"
            class="hint-cell"
            :class="{ emoji: dictationMode === 'emoji-hint' }"
            :style="dictationMode !== 'emoji-hint' ? hintCellStyle : {}"
          >{{ item }}</div>
          <div v-for="e in (group.cols - group.items.length)" :key="'e'+e" class="hint-cell" :style="hintCellStyle" />
        </div>
        <div
          class="writing-row"
          :style="{ gridTemplateColumns: `repeat(${group.cols}, 1fr)` }"
        >
          <EnglishGrid
            v-for="j in group.cols" :key="j"
            class="grid-col"
            :scale="gridScale"
            :top-color="gridTopColor"
            :mid-color="gridMidColor"
            :base-color="gridBaseColor"
            :line-style="gridLineStyle"
          />
        </div>
      </div>

      <!-- 底部统一订正区 -->
      <div v-if="showCorrection" class="correction-zone">
        <div class="correction-header">
          <span class="correction-zone-title">订 正 区</span>
        </div>
        <div class="correction-fill">
          <EnglishGrid
            v-for="i in 16" :key="i"
            class="correction-grid-row"
            :scale="gridScale"
            :top-color="gridTopColor"
            :mid-color="gridMidColor"
            :base-color="gridBaseColor"
            :line-style="gridLineStyle"
          />
        </div>
      </div>
    </template>

    <!-- ② 语文拼音默写：每个字上方四线三格，下方田字格 -->
    <template v-else-if="dictationMode === 'pinyin-only' || dictationMode === 'char-only'">
      <div class="section-title">默写练习 · {{ dictationMode === 'pinyin-only' ? '看拼音写汉字' : '看汉字写拼音' }}</div>
      <div v-for="(row, ri) in dictationRows" :key="ri" class="dictation-practice-row">
        <div v-for="(cell, ci) in row" :key="ci" class="dictation-unit">
          <EnglishGrid
            class="dictation-pinyin-grid"
            :scale="0.72"
            :top-color="gridTopColor"
            :mid-color="gridMidColor"
            :base-color="gridBaseColor"
            :line-style="gridLineStyle"
          >
            <span v-if="dictationDisplayMode !== 'hanzi'" class="hint-pinyin">{{ cell.pinyin }}</span>
          </EnglishGrid>
          <component
            :is="gridComponent"
            :size="52"
            :border-color="gridColor"
            :guide-color="guideColorComputed"
          >
            <span v-if="dictationDisplayMode !== 'pinyin' && cell.showChar" class="hint-char">{{ cell.char }}</span>
          </component>
        </div>
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GridType, DictationSubMode, DictationDisplayMode, WorksheetConfig } from '@/types/worksheet'
import { usePinyin } from '@/composables/usePinyin'
import TianziGrid from '@/components/grids/TianziGrid.vue'
import MiziGrid from '@/components/grids/MiziGrid.vue'
import SquareGrid from '@/components/grids/SquareGrid.vue'
import EnglishGrid from '@/components/grids/EnglishGrid.vue'

const props = withDefaults(
  defineProps<{
    content: string
    dictationMode?: DictationSubMode
    dictationDisplayMode?: DictationDisplayMode
    rowCols?: number[]
    gridType?: GridType
    gridColor?: string
    hintFontSize?: number
    hintColor?: string
    hintBold?: boolean
    gridScale?: number
    gridTopColor?: string
    gridMidColor?: string
    gridBaseColor?: string
    gridLineStyle?: 'dashed' | 'solid'
    showCorrection?: boolean
    title?: string
    studentName?: string
    studentClass?: string
    worksheetDate?: string
    worksheetScore?: string
  }>(),
  {
    dictationMode: 'pinyin-only',
    dictationDisplayMode: 'pinyin',
    rowCols: () => [4],
    gridType: 'tianzi',
    gridColor: '#dc3545',
    hintFontSize: 14,
    hintColor: '#2c3040',
    hintBold: false,
    gridScale: 1.1,
    gridTopColor: '#237a45',
    gridMidColor: '#78cc95',
    gridBaseColor: '#e87060',
    gridLineStyle: 'dashed',
    showCorrection: false,
    title: '',
    studentName: '',
    studentClass: '',
    worksheetDate: '',
    worksheetScore: '',
  },
)

const defaultTitle = computed(() =>
  props.dictationMode === 'emoji-hint' ? '单词默写：看图写英文' : '默写练习：汉译英'
)

const emit = defineEmits<{
  updateHeader: [partial: Partial<WorksheetConfig>]
}>()

function updateHeader(field: 'dictationTitle' | 'studentName' | 'studentClass' | 'worksheetDate' | 'worksheetScore', event: Event) {
  emit('updateHeader', { [field]: (event.target as HTMLInputElement).value })
}

// 提示文字内联样式
const hintCellStyle = computed(() => ({
  fontSize: props.hintFontSize + 'px',
  color: props.hintColor,
  fontWeight: props.hintBold ? '700' : '400',
}))

const { getCharPinyin } = usePinyin()

// 内容按换行分割，每行是一个条目（单词/短语/句子均可）
const items = computed(() => {
  if (props.dictationMode === 'emoji-hint') {
    if (!props.content.trim()) return ['🍎', '🍌', '🍒', '🐱', '🐶']
    return props.content.split(/[,，\n]+/).map(s => s.trim()).filter(Boolean)
  }
  return props.content.split(/\n/).map(s => s.trim()).filter(Boolean)
})

// 按 rowCols 将 items 分组
const itemGroups = computed(() => {
  const rc = props.rowCols.length ? props.rowCols : [4]
  const groups: Array<{ cols: number; items: string[] }> = []
  let pos = 0
  let ri = 0
  const all = items.value
  while (pos < all.length) {
    const cols = Math.max(1, rc[Math.min(ri, rc.length - 1)])
    groups.push({ cols, items: all.slice(pos, pos + cols) })
    pos += cols
    ri++
  }
  if (!groups.length) {
    groups.push({ cols: Math.max(1, rc[0] ?? 4), items: [] })
  }
  return groups
})

// 订正区不再需要 computed

const guideColorComputed = computed(() => {
  if (props.gridColor === '#dc3545') return '#e8a0a8'
  return props.gridColor + '66'
})

const gridComponent = computed(() => {
  switch (props.gridType) {
    case 'mizi': return MiziGrid
    case 'square': return SquareGrid
    default: return TianziGrid
  }
})

// 语文默写固定 A4 每行 8 格：上方四线三格，下方田字格。
const dictationRows = computed(() => {
  const chars = props.content.replace(/\s+/g, '').split('')
  const colsPerRow = 8
  const rows: Array<Array<{ char: string; pinyin: string; showChar: boolean }>> = []
  let currentRow: Array<{ char: string; pinyin: string; showChar: boolean }> = []
  for (const ch of chars) {
    currentRow.push({
      char: ch,
      pinyin: getCharPinyin(ch) || ch,
      showChar: props.dictationMode === 'char-only' || props.dictationDisplayMode !== 'pinyin',
    })
    if (currentRow.length >= colsPerRow) { rows.push(currentRow); currentRow = [] }
  }
  if (currentRow.length) rows.push(currentRow)
  return rows
})
</script>

<style scoped>
.dictation-module {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* 标题 & 信息栏 */
.dictation-header {
  flex-shrink: 0;
}

.dictation-title {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  font-family: var(--font-kai);
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 10px;
  outline: none;
}

.editable-field:hover {
  background: rgba(41, 121, 217, 0.06);
  border-radius: 3px;
  cursor: text;
}
.editable-field:focus {
  outline: 1.5px dashed #2979d9;
  border-radius: 3px;
}
@media print {
  .editable-field:hover,
  .editable-field:focus {
    background: none;
    outline: none;
  }
}

.dictation-info-bar {
  display: flex;
  gap: 24px;
  font-family: var(--font-kai);
  font-size: 13px;
  color: var(--text-primary);
  margin-bottom: 14px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}

.dictation-info-bar label {
  display: inline-flex;
  align-items: baseline;
  white-space: nowrap;
}

.info-blank {
  width: 80px;
  padding: 0 2px 1px;
  border: 0;
  border-bottom: 1px solid #555;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  vertical-align: bottom;
  margin-left: 2px;
}

.date-blank {
  width: 88px;
}

.correction-zone {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  border-top: 1.5px solid #e87060;
}

.correction-header {
  display: flex;
  align-items: center;
  padding: 4px 0 6px;
}

.correction-zone-title {
  font-family: var(--font-kai);
  font-size: 12px;
  font-weight: 600;
  color: #e03030;
  letter-spacing: 0.3em;
  flex-shrink: 0;
  padding-right: 10px;
}

.correction-fill {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media print {
  .dictation-module {
    display: block;
    flex: none;
  }

  .dictation-header,
  .hint-group,
  .correction-header,
  .correction-grid-row {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .dictation-header {
    break-after: avoid;
    page-break-after: avoid;
  }

  .correction-header {
    break-after: avoid;
    page-break-after: avoid;
  }

  .correction-zone,
  .correction-fill {
    display: block;
    flex: none;
    overflow: visible;
  }

  .correction-grid-row {
    margin-bottom: 20px;
  }
}

.correction-grid-row {
  flex-shrink: 0;
}

/* ---- 单词/短语多列模式 ---- */
.hint-group {
  margin-bottom: 20px;
  page-break-inside: avoid;
}

.hint-row {
  display: grid;
  gap: 6px;
  margin-bottom: 4px;
}

.hint-cell {
  font-family: var(--font-kai);
  font-size: 14px;
  color: var(--text-primary);
  padding: 3px 4px 3px;
  border-bottom: 1px solid #ddd;
  line-height: 1.6;
  min-height: 22px;
}

.hint-cell.emoji {
  font-size: 24px;
  line-height: 1.3;
  padding-bottom: 2px;
}

.writing-row {
  display: grid;
  gap: 6px;
  margin-bottom: 4px;
}

.grid-col {
  /* EnglishGrid 已是 width:100%，grid 列宽自动适配 */
}

/* ---- 句子模式：单列 ---- */
.sentence-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sentence-list.has-separator {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px dashed #d0d8e4;
}

.sentence-item {
  page-break-inside: avoid;
}

.sentence-header {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 4px;
}

.sentence-number {
  font-family: var(--font-ui);
  font-size: 13px;
  color: var(--text-secondary);
  min-width: 18px;
  flex-shrink: 0;
}

.sentence-hint {
  font-family: var(--font-kai);
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.5;
}

.sentence-grid {
  /* EnglishGrid 全宽 */
}

/* ---- 书写横线（共用） ---- */
.writing-lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 6px;
}

.writing-line {
  width: 100%;
  height: 0;
  border-bottom: 1px solid #ccc;
}

.writing-line:first-child {
  border-bottom: 1px solid #aaa;
}

.writing-line:not(:first-child) {
  border-bottom: 1px dotted #ccc;
}

/* ---- 田字格默写 ---- */
.section-title {
  font-family: var(--font-kai);
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 4px;
}

.practice-row {
  page-break-inside: avoid;
}

.grid-row {
  display: flex;
  flex-wrap: nowrap;
}

.dictation-practice-row {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 5px;
  padding: 7px 0 9px;
  border-bottom: 1px solid #dce3df;
  page-break-inside: avoid;
}

.dictation-unit {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dictation-pinyin-grid {
  width: 100%;
}

.dictation-pinyin-grid .hint-pinyin {
  display: block;
  width: 100%;
  color: #333;
  font-family: var(--font-ui);
  font-size: 14px;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}

.dictation-unit > .tianzi-cell,
.dictation-unit > .mizi-cell,
.dictation-unit > .square-cell {
  flex-shrink: 0;
  margin-top: 4px;
}

.dictation-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.dictation-cell.pinyin-mode {
  position: relative;
}

.hint-pinyin {
  font-family: var(--font-ui);
  font-size: 13px;
  color: #333;
  position: absolute;
  top: 3px;
}

.hint-char {
  font-family: var(--font-kai);
  font-size: 28px;
  color: #bbb;
}

.pinyin-mode .hint-char {
  position: absolute;
  bottom: 3px;
  color: #bbb;
  font-size: 24px;
}

.char-mode .hint-pinyin {
  top: 3px;
  font-size: 12px;
}
</style>
