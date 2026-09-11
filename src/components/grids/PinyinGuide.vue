<template>
  <svg
    class="pinyin-guide"
    width="100%"
    :height="height"
    :style="{ height: height + 'px' }"
    :aria-label="text || undefined"
  >
    <line x1="0" :y1="lineTop" x2="100%" :y2="lineTop" :stroke="topColor" />
    <line
      x1="0"
      :y1="lineUpper"
      x2="100%"
      :y2="lineUpper"
      :stroke="midColor"
      :stroke-dasharray="lineDash"
    />
    <line
      x1="0"
      :y1="lineBaseline"
      x2="100%"
      :y2="lineBaseline"
      :stroke="baseColor"
      :stroke-dasharray="lineDash"
    />
    <line x1="0" :y1="lineBottom" x2="100%" :y2="lineBottom" :stroke="topColor" />
    <text
      v-if="text"
      x="50%"
      :y="lineBaseline"
      class="pinyin-guide__text"
      :style="textStyle"
      dominant-baseline="alphabetic"
      text-anchor="middle"
    >{{ text }}</text>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    text?: string
    topColor?: string
    midColor?: string
    baseColor?: string
    lineStyle?: 'dashed' | 'solid'
    height?: number
    fontSize?: number
  }>(),
  {
    text: '',
    topColor: '#318b63',
    midColor: '#9bd2b6',
    baseColor: '#e79a93',
    lineStyle: 'solid',
    height: 43,
    fontSize: 26,
  },
)

const lineDash = computed(() => props.lineStyle === 'dashed' ? '4 3' : undefined)
const lineTop = computed(() => 0.5)
const lineUpper = computed(() => Math.round(props.height / 3) + 0.5)
const lineBaseline = computed(() => Math.round(props.height * 2 / 3) + 0.5)
const lineBottom = computed(() => props.height - 0.5)

const textStyle = computed(() => {
  const length = Array.from(props.text).length
  const scale = length >= 7 ? 0.76 : length >= 5 ? 0.88 : 1
  return { fontSize: `${Math.round(props.fontSize * scale)}px` }
})
</script>

<style scoped>
.pinyin-guide {
  display: block;
  width: 100%;
  height: 43px;
  overflow: visible;
  color: #26352f;
}

.pinyin-guide__text {
  fill: #26352f;
  color: #26352f;
  font-family: Arial, "Helvetica Neue", sans-serif;
  font-size: 26px;
  font-weight: 400;
  font-variant-ligatures: none;
  letter-spacing: -0.35px;
}


@media print {
  .pinyin-guide {
    break-inside: avoid;
  }
}
</style>
