<template>
  <svg
    class="pinyin-guide"
    width="100%"
    height="43"
    :aria-label="text || undefined"
  >
    <line x1="0" y1="0.5" x2="100%" y2="0.5" :stroke="topColor" />
    <line
      x1="0"
      y1="14.5"
      x2="100%"
      y2="14.5"
      :stroke="midColor"
      :stroke-dasharray="lineDash"
    />
    <line
      x1="0"
      y1="28.5"
      x2="100%"
      y2="28.5"
      :stroke="baseColor"
      :stroke-dasharray="lineDash"
    />
    <line x1="0" y1="42.5" x2="100%" y2="42.5" :stroke="topColor" />
    <text
      v-if="text"
      x="50%"
      y="28.5"
      class="pinyin-guide__text"
      :class="textSizeClass"
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
  }>(),
  {
    text: '',
    topColor: '#318b63',
    midColor: '#9bd2b6',
    baseColor: '#e79a93',
    lineStyle: 'solid',
  },
)

const lineDash = computed(() => props.lineStyle === 'dashed' ? '4 3' : undefined)

const textSizeClass = computed(() => {
  const length = Array.from(props.text).length
  if (length >= 7) return 'pinyin-guide__text--small'
  if (length >= 5) return 'pinyin-guide__text--compact'
  return ''
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

.pinyin-guide__text--compact {
  font-size: 23px;
  letter-spacing: -0.55px;
}

.pinyin-guide__text--small {
  font-size: 20px;
  letter-spacing: -0.65px;
}

@media print {
  .pinyin-guide {
    break-inside: avoid;
  }
}
</style>
