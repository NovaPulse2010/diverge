<template>
  <div class="chinese-module">
    <div v-for="(item, ri) in rows" :key="ri" class="char-section practice-row">
      <!-- 拼音行 -->
      <div v-if="showPinyin" class="pinyin-row">
        <div
          v-for="(cell, ci) in item.cells"
          :key="ci"
          class="pinyin-cell"
          :style="{ width: '52px' }"
        >
          <span v-if="cell.pinyin" class="pinyin-label">{{ cell.pinyin }}</span>
        </div>
      </div>
      <!-- 格子行 -->
      <div class="grid-row">
        <component
          v-for="(cell, ci) in item.cells"
          :key="ci"
          :is="gridComponent"
          :size="52"
          :border-color="gridColor"
          :guide-color="guideColorComputed"
        >
          <PinyinChar
            v-if="cell.char"
            :char="cell.char"
            :char-color="charColorValue"
            :hollow="fontStyle === 'hollow'"
          />
        </component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GridType, FontStyle, CharColor } from '@/types/worksheet'
import { usePinyin } from '@/composables/usePinyin'
import TianziGrid from '@/components/grids/TianziGrid.vue'
import MiziGrid from '@/components/grids/MiziGrid.vue'
import SquareGrid from '@/components/grids/SquareGrid.vue'
import PinyinChar from '@/components/common/PinyinChar.vue'

const props = withDefaults(
  defineProps<{
    content: string
    gridType?: GridType
    fontStyle?: FontStyle
    color?: CharColor
    showPinyin?: boolean
    traceCount?: number
    practiceCount?: number
    gridColor?: string
  }>(),
  {
    gridType: 'tianzi',
    fontStyle: 'kai',
    color: 'lightgray',
    showPinyin: true,
    traceCount: 2,
    practiceCount: 4,
    gridColor: '#dc3545',
  },
)

const { getCharPinyin } = usePinyin()

const colorMap: Record<CharColor, string> = {
  lightgray: '#c0c0c0',
  black: '#222',
  blue: '#1a5fb4',
  red: '#dc3545',
}

const charColorValue = computed(() => colorMap[props.color])

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

interface CellData {
  char: string
  pinyin: string
}

interface RowData {
  cells: CellData[]
}

const rows = computed((): RowData[] => {
  const chars = props.content.replace(/\s+/g, '').split('')
  return chars.map((char) => {
    const cells: CellData[] = []
    const py = getCharPinyin(char)
    for (let t = 0; t < props.traceCount; t++) {
      cells.push({ char, pinyin: t === 0 ? py : '' })
    }
    for (let p = 0; p < props.practiceCount; p++) {
      cells.push({ char: '', pinyin: '' })
    }
    return { cells }
  })
})
</script>

<style scoped>
.chinese-module {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.char-section {
  display: flex;
  flex-direction: column;
}

.pinyin-row {
  display: flex;
  flex-direction: row;
  height: 20px;
  align-items: flex-end;
}

.pinyin-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pinyin-label {
  font-family: var(--font-ui);
  font-size: 13px;
  color: #444;
  line-height: 1;
  letter-spacing: 0;
}

.grid-row {
  display: flex;
  flex-wrap: nowrap;
  font-size: 36px;
  font-family: var(--font-kai);
}

.practice-row {
  page-break-inside: avoid;
}
</style>
