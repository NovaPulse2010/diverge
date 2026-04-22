<template>
  <div class="english-module">
    <div v-for="(word, wi) in words" :key="wi" class="practice-row">
      <!-- 描红行 -->
      <div v-for="t in traceCount" :key="'t' + t" class="line-wrap">
        <EnglishGrid :scale="1">
          <span
            class="en-word"
            :style="{ color: charColorValue, fontFamily: fontFamily }"
          >{{ word }}</span>
        </EnglishGrid>
      </div>
      <!-- 空练习行 -->
      <div v-for="p in practiceCount" :key="'p' + p" class="line-wrap">
        <EnglishGrid :scale="1" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CharColor, EnglishFont } from '@/types/worksheet'
import EnglishGrid from '@/components/grids/EnglishGrid.vue'

const props = withDefaults(
  defineProps<{
    content: string
    color?: CharColor
    englishFont?: EnglishFont
    traceCount?: number
    practiceCount?: number
  }>(),
  {
    color: 'lightgray',
    englishFont: 'Caveat',
    traceCount: 1,
    practiceCount: 2,
  },
)

const colorMap: Record<CharColor, string> = {
  lightgray: '#c0c0c0',
  black: '#222',
  blue: '#1a5fb4',
  red: '#dc3545',
}

const charColorValue = computed(() => colorMap[props.color])
const fontFamily = computed(() => `'${props.englishFont}', cursive`)

const words = computed(() =>
  props.content
    .split(/[,，\n]+/)
    .map((w) => w.trim())
    .filter(Boolean),
)
</script>

<style scoped>
.english-module {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.practice-row {
  page-break-inside: avoid;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 10px;
}

.line-wrap {
  width: 100%;
}

.en-word {
  font-size: 26px;
  line-height: 1;
  letter-spacing: 0.05em;
}
</style>
