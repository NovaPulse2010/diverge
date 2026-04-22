<script setup lang="ts">
import { useWorksheet } from '@/composables/useWorksheet'
import ControlPanel from '@/components/layout/ControlPanel.vue'
import WorksheetPage from '@/components/layout/WorksheetPage.vue'
import ChineseModule from '@/components/modules/ChineseModule.vue'
import EnglishModule from '@/components/modules/EnglishModule.vue'
import NumberModule from '@/components/modules/NumberModule.vue'
import StrokeTraining from '@/components/modules/StrokeTraining.vue'
import DictationMode from '@/components/modules/DictationMode.vue'

const { config, updateConfig, applyPreset, presets } = useWorksheet()
</script>

<template>
  <div class="app-layout">
    <ControlPanel
      :config="config"
      :presets="presets"
      @update="updateConfig"
      @preset="applyPreset"
    />
    <main class="preview-area">
      <WorksheetPage :show-meta="!(config.module === 'dictation' && (config.dictationMode === 'chinese-hint' || config.dictationMode === 'emoji-hint'))">
        <ChineseModule
          v-if="config.module === 'chinese'"
          :content="config.content"
          :grid-type="config.gridType"
          :font-style="config.fontStyle"
          :color="config.color"
          :show-pinyin="config.showPinyin"
          :trace-count="config.traceCount"
          :practice-count="config.practiceCount"
          :grid-color="config.gridColor"
        />
        <EnglishModule
          v-else-if="config.module === 'english'"
          :content="config.content"
          :color="config.color"
          :english-font="config.englishFont"
          :trace-count="config.traceCount"
          :practice-count="config.practiceCount"
        />
        <NumberModule
          v-else-if="config.module === 'number'"
          :number-range="config.numberRange"
          :color="config.color"
          :trace-count="config.traceCount"
          :practice-count="config.practiceCount"
          :math-count="config.mathCount"
          :math-max="config.mathMax"
        />
        <StrokeTraining
          v-else-if="config.module === 'stroke'"
          :patterns="config.strokePatterns"
          :difficulty="config.strokeDifficulty"
        />
        <DictationMode
          v-else-if="config.module === 'dictation'"
          :content="config.content"
          :dictation-mode="config.dictationMode"
          :row-cols="config.englishRowCols"
          :grid-type="config.gridType"
          :grid-color="config.gridColor"
          :hint-font-size="config.hintFontSize"
          :hint-color="config.hintColor"
          :hint-bold="config.hintBold"
          :grid-scale="config.gridScale"
          :grid-top-color="config.gridTopColor"
          :grid-mid-color="config.gridMidColor"
          :grid-base-color="config.gridBaseColor"
          :grid-line-style="config.gridLineStyle"
          :show-correction="config.showCorrection"
        />
        <div v-else class="empty-hint">
          请在左侧面板选择练习类型并输入内容
        </div>
      </WorksheetPage>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-app);
}

.preview-area {
  flex: 1;
  overflow-y: auto;
  padding: 36px 40px;
  background: #e8ecf2;
  background-image: radial-gradient(circle, #cdd3dc 1px, transparent 1px);
  background-size: 22px 22px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.empty-hint {
  text-align: center;
  color: var(--text-secondary);
  font-family: var(--font-kai);
  font-size: 16px;
  padding: 60px 0;
}

@media print {
  .app-layout {
    display: block;
    background: none;
  }

  .preview-area {
    padding: 0;
    overflow: visible;
    background: none;
    background-image: none;
    display: block;
  }
}
</style>

<style>
@page {
  size: A4;
  margin: 0;
}

@media print {
  /* 隐藏控制面板，只打印字帖内容 */
  .panel {
    display: none !important;
  }
}
</style>
