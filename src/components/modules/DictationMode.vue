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

    <!-- ② 语文拼音默写使用独立版式，避免和英文四线格样式互相覆盖 -->
    <template v-else-if="dictationMode === 'pinyin-only' || dictationMode === 'char-only'">
      <ChineseDictationSheet
        :content="chineseContent"
        :pinyin-content="dictationPinyinContent"
        :dictation-mode="dictationMode"
        :display-mode="dictationDisplayMode"
        grid-type="tianzi"
        grid-color="#df7269"
        grid-top-color="#318b63"
        grid-mid-color="#9bd2b6"
        grid-base-color="#e79a93"
        :student-name="studentName"
        :student-class="studentClass"
        :worksheet-date="worksheetDate"
        :worksheet-score="worksheetScore"
        @update-header="emit('updateHeader', $event)"
      />
    </template>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GridType, DictationSubMode, DictationDisplayMode, WorksheetConfig } from '@/types/worksheet'
import EnglishGrid from '@/components/grids/EnglishGrid.vue'
import ChineseDictationSheet from '@/components/modules/ChineseDictationSheet.vue'

const props = withDefaults(
  defineProps<{
    content: string
    /** 语文默写专用汉字内容；存在时优先于通用 content */
    dictationContent?: string
    dictationPinyinContent?: string
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
    dictationPinyinContent: '',
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

// 语文默写内容与其它模块隔离。只有旧调用方未传专用字段时才回退到 content；
// 用户主动清空专用内容时要保持空白，不能被旧的通用内容重新填回。
const chineseContent = computed(() =>
  props.dictationContent !== undefined ? props.dictationContent : props.content,
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
.practice-row {
  page-break-inside: avoid;
}

.grid-row {
  display: flex;
  flex-wrap: nowrap;
}

</style>
