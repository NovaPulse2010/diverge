<template>
  <div class="number-module">
    <!-- 数字书写区 -->
    <div class="section-title">数字规范书写</div>
    <div v-for="(row, ri) in numberRows" :key="'n' + ri" class="practice-row">
      <div class="grid-row">
        <SquareGrid
          v-for="(cell, ci) in row"
          :key="ci"
          :size="44"
          :border-color="'#333'"
        >
          <span
            v-if="cell.value !== ''"
            class="num-char"
            :style="{ color: cell.isTrace ? charColorValue : 'transparent' }"
          >{{ cell.value }}</span>
        </SquareGrid>
      </div>
    </div>

    <!-- 运算题区 -->
    <div v-if="mathProblems.length" class="math-section">
      <div class="section-title">口算练习</div>
      <div class="math-grid">
        <div v-for="(problem, pi) in mathProblems" :key="'m' + pi" class="math-problem">
          {{ problem.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CharColor } from '@/types/worksheet'
import SquareGrid from '@/components/grids/SquareGrid.vue'

const props = withDefaults(
  defineProps<{
    numberRange?: [number, number]
    color?: CharColor
    traceCount?: number
    practiceCount?: number
    mathCount?: number
    mathMax?: number
  }>(),
  {
    numberRange: () => [1, 20] as [number, number],
    color: 'lightgray',
    traceCount: 2,
    practiceCount: 5,
    mathCount: 5,
    mathMax: 10,
  },
)

const colorMap: Record<CharColor, string> = {
  lightgray: '#c0c0c0',
  black: '#222',
  blue: '#1a5fb4',
  red: '#dc3545',
}

const charColorValue = computed(() => colorMap[props.color])

interface NumCell {
  value: string
  isTrace: boolean
}

const numberRows = computed(() => {
  const rows: NumCell[][] = []
  for (let n = props.numberRange[0]; n <= props.numberRange[1]; n++) {
    const numStr = String(n)
    const row: NumCell[] = []
    for (let t = 0; t < props.traceCount; t++) {
      row.push({ value: numStr, isTrace: true })
    }
    for (let p = 0; p < props.practiceCount; p++) {
      row.push({ value: '', isTrace: false })
    }
    rows.push(row)
  }
  return rows
})

interface MathProblem {
  text: string
}

const mathProblems = computed(() => {
  const problems: MathProblem[] = []
  for (let i = 0; i < props.mathCount; i++) {
    const isAdd = Math.random() > 0.3
    if (isAdd) {
      const a = Math.floor(Math.random() * props.mathMax)
      const b = Math.floor(Math.random() * (props.mathMax - a))
      problems.push({ text: `${a} + ${b} = ______` })
    } else {
      const a = Math.floor(Math.random() * props.mathMax) + 1
      const b = Math.floor(Math.random() * a)
      problems.push({ text: `${a} − ${b} = ______` })
    }
  }
  return problems
})
</script>

<style scoped>
.number-module {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-title {
  font-family: var(--font-kai);
  font-size: 14px;
  color: var(--text-secondary);
  margin: 8px 0 4px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 4px;
}

.practice-row {
  page-break-inside: avoid;
}

.grid-row {
  display: flex;
  flex-wrap: nowrap;
  font-family: var(--font-kai);
  font-size: 24px;
}

.num-char {
  line-height: 1;
}

.math-section {
  margin-top: 16px;
}

.math-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 24px;
  font-family: var(--font-kai);
  font-size: 18px;
  color: var(--text-primary);
}

.math-problem {
  padding: 6px 0;
  border-bottom: 1px dotted #ddd;
}
</style>
