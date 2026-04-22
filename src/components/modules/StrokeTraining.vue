<template>
  <div class="stroke-training">
    <div class="section-title">控笔训练</div>
    <div v-for="(pattern, pi) in patterns" :key="pi" class="stroke-row practice-row">
      <div class="pattern-label">{{ patternLabels[pattern] }}</div>
      <svg
        :width="svgWidth"
        :height="rowHeight"
        :viewBox="`0 0 ${svgWidth} ${rowHeight}`"
        class="stroke-svg"
      >
        <!-- 参考线 (淡色实线) -->
        <path
          :d="getPath(pattern)"
          fill="none"
          stroke="#e0e0e0"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <!-- 虚线描红 -->
        <path
          :d="getPath(pattern)"
          fill="none"
          :stroke="strokeColor"
          :stroke-width="strokeWidth"
          :stroke-dasharray="dashArray"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StrokePattern, StrokeDifficulty } from '@/types/worksheet'

const props = withDefaults(
  defineProps<{
    patterns?: StrokePattern[]
    difficulty?: StrokeDifficulty
    color?: string
  }>(),
  {
    patterns: () => ['straight', 'wave', 'zigzag'] as StrokePattern[],
    difficulty: 'easy',
    color: '#999',
  },
)

const patternLabels: Record<StrokePattern, string> = {
  straight: '直线',
  wave: '波浪线',
  zigzag: '锯齿线',
  curve: '曲线',
  spiral: '螺旋线',
  circle: '圆形',
}

const svgWidth = 580
const rowHeight = computed(() => {
  const base = props.difficulty === 'hard' ? 50 : props.difficulty === 'medium' ? 65 : 80
  return base
})

const strokeWidth = computed(() =>
  props.difficulty === 'hard' ? 1.5 : props.difficulty === 'medium' ? 2 : 2.5,
)

const dashArray = computed(() =>
  props.difficulty === 'hard' ? '2,4' : props.difficulty === 'medium' ? '3,5' : '4,6',
)

const strokeColor = computed(() => props.color)

function getPath(pattern: StrokePattern): string {
  const w = svgWidth
  const h = rowHeight.value
  const cy = h / 2
  const margin = 20

  switch (pattern) {
    case 'straight':
      return `M ${margin} ${cy} L ${w - margin} ${cy}`

    case 'wave': {
      const segments = 8
      const segW = (w - margin * 2) / segments
      const amp = h * 0.35
      let d = `M ${margin} ${cy}`
      for (let i = 0; i < segments; i++) {
        const x1 = margin + i * segW + segW / 3
        const x2 = margin + i * segW + (segW * 2) / 3
        const x3 = margin + (i + 1) * segW
        const yDir = i % 2 === 0 ? -1 : 1
        d += ` C ${x1} ${cy + yDir * amp}, ${x2} ${cy + yDir * amp}, ${x3} ${cy}`
      }
      return d
    }

    case 'zigzag': {
      const segments = 10
      const segW = (w - margin * 2) / segments
      const amp = h * 0.35
      let d = `M ${margin} ${cy}`
      for (let i = 0; i < segments; i++) {
        const x = margin + (i + 1) * segW
        const y = i % 2 === 0 ? cy - amp : cy + amp
        d += ` L ${x} ${y}`
      }
      return d
    }

    case 'curve': {
      const amp = h * 0.35
      return `M ${margin} ${cy} Q ${w * 0.25} ${cy - amp}, ${w * 0.5} ${cy} Q ${w * 0.75} ${cy + amp}, ${w - margin} ${cy}`
    }

    case 'spiral': {
      const cx = w / 2
      const points: string[] = []
      const turns = 3
      const maxR = Math.min(h * 0.42, 60)
      for (let i = 0; i <= turns * 36; i++) {
        const angle = (i / 36) * Math.PI * 2
        const r = (i / (turns * 36)) * maxR
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        points.push(i === 0 ? `M ${x} ${y}` : `L ${x.toFixed(1)} ${y.toFixed(1)}`)
      }
      return points.join(' ')
    }

    case 'circle': {
      const cx = w / 2
      const r = Math.min(h * 0.38, 30)
      return `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy}`
    }

    default:
      return `M ${margin} ${cy} L ${w - margin} ${cy}`
  }
}
</script>

<style scoped>
.stroke-training {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-title {
  font-family: var(--font-kai);
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 4px;
}

.stroke-row {
  page-break-inside: avoid;
}

.pattern-label {
  font-family: var(--font-kai);
  font-size: 12px;
  color: #999;
  margin-bottom: 2px;
}

.stroke-svg {
  display: block;
  border: 1px solid #eee;
  border-radius: 2px;
  background: white;
}
</style>
