<template>
  <!-- 整行四线三格：用 SVG 精确绘制四条线 -->
  <div class="english-line-row" :style="{ height: totalHeight + 'px' }">
    <svg
      class="english-lines-svg"
      :height="totalHeight"
      width="100%"
      preserveAspectRatio="none"
    >
      <!-- 顶线：粗实绿线 -->
      <line x1="0" :y1="0.5" x2="100%" :y2="0.5"
        :stroke="topColor" stroke-width="1.8" />
      <!-- 第二线：辅助线 -->
      <line x1="0" :y1="topH + 0.5" x2="100%" :y2="topH + 0.5"
        :stroke="midColor" stroke-width="0.8" :stroke-dasharray="lineDash" />
      <!-- 第三线：基线 -->
      <line x1="0" :y1="topH + midH + 0.5" x2="100%" :y2="topH + midH + 0.5"
        :stroke="baseColor" stroke-width="0.8" :stroke-dasharray="lineDash" />
      <!-- 底线：粗实绿线 -->
      <line x1="0" :y1="totalHeight - 0.5" x2="100%" :y2="totalHeight - 0.5"
        :stroke="topColor" stroke-width="1.8" />
    </svg>
    <!-- 文字插槽，基线对齐第三线 -->
    <div class="english-char-wrap" :style="{ paddingBottom: botH + 'px' }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 区域高度缩放比 */
    scale?: number
    /** 顶线和底线颜色（粗实线） */
    topColor?: string
    /** 第二线颜色（辅助线） */
    midColor?: string
    /** 第三线颜色（基线） */
    baseColor?: string
    /** 辅线/基线线型 */
    lineStyle?: 'dashed' | 'solid'
  }>(),
  {
    scale: 1,
    topColor: '#1a7a3a',
    midColor: '#6dc88a',
    baseColor: '#f08070',
    lineStyle: 'dashed',
  },
)

// 线型计算
const lineDash = computed(() => props.lineStyle === 'solid' ? 'none' : '4,4')

// 三区等间距：上区 = 主区 = 下区，各占 zoneH
const zoneH = computed(() => Math.round(18 * props.scale))
const topH  = computed(() => zoneH.value)          // line1 → line2
const midH  = computed(() => zoneH.value)          // line2 → line3
const botH  = computed(() => zoneH.value)          // line3 → line4
const totalHeight = computed(() => zoneH.value * 3)
</script>

<style scoped>
.english-line-row {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.english-lines-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  display: block;
}

.english-char-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding-left: 4px;
  gap: 2px;
  overflow: hidden;
}
</style>
