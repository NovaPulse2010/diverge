<script setup lang="ts">
import { computed } from "vue";
import { useWorksheet } from "@/composables/useWorksheet";
import ControlPanel from "@/components/layout/ControlPanel.vue";
import WorksheetPage from "@/components/layout/WorksheetPage.vue";
import ChineseModule from "@/components/modules/ChineseModule.vue";
import EnglishModule from "@/components/modules/EnglishModule.vue";
import NumberModule from "@/components/modules/NumberModule.vue";
import StrokeTraining from "@/components/modules/StrokeTraining.vue";
import DictationMode from "@/components/modules/DictationMode.vue";

const { config, updateConfig, applyPreset, presets } = useWorksheet();

const dictationCellCount = computed(() =>
  config.dictationContent.replace(/\s+/g, '').length,
);
const dictationRowCount = computed(() =>
  Math.max(1, Math.ceil(dictationCellCount.value / 8)),
);

const worksheetTitle = computed(() => {
  if (config.module === "dictation") {
    switch (config.dictationMode) {
      case "emoji-hint":
        return "单词默写：看图写英文";
      case "chinese-hint":
        return config.dictationTitle || "默写练习：汉译英";
      case "char-only":
        return "默写练习 · 看汉字写拼音";
      default:
        return "默写练习 · 看拼音写汉字";
    }
  }

  switch (config.module) {
    case "english":
      return "英文书写练习";
    case "number":
      return "数字练习";
    case "stroke":
      return "控笔训练";
    default:
      return "汉字书写练习";
  }
});
</script>

<template>
  <div
    class="app-layout"
    :class="{
      'dictation-layout': config.module === 'dictation' && config.subject === 'yuwen',
    }"
  >
    <ControlPanel
      :config="config"
      :presets="presets"
      @update="updateConfig"
      @preset="applyPreset"
    />
    <main class="preview-area">
      <div v-if="config.module === 'dictation' && config.subject === 'yuwen'" class="dictation-preview-status">
        <span>打印预览 · A4</span>
        <span>每行 8 格 · {{ dictationCellCount }} 格 / {{ dictationRowCount }} 行</span>
      </div>
      <WorksheetPage
        :show-meta="
          !(
            config.module === 'dictation' &&
            (config.subject === 'yuwen' ||
              config.dictationMode === 'chinese-hint' ||
              config.dictationMode === 'emoji-hint')
          )
        "
        :show-print-header="!(config.module === 'dictation' && config.subject === 'yuwen')"
        :title="worksheetTitle"
        :student-name="config.studentName"
        :student-class="config.studentClass"
        :worksheet-date="config.worksheetDate"
        :worksheet-score="config.worksheetScore"
      >
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
          :dictation-content="config.dictationContent"
          :dictation-pinyin-content="config.dictationPinyinContent"
          :dictation-pinyin-font-size="config.dictationPinyinFontSize"
          :dictation-pinyin-guide-height="config.dictationPinyinGuideHeight"
          :dictation-hanzi-font-size="config.dictationHanziFontSize"
          :dictation-hanzi-color="config.dictationHanziColor"
          :dictation-grid-size="config.dictationGridSize"
          :dictation-mode="config.dictationMode"
          :dictation-display-mode="config.dictationDisplayMode"
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
          :title="config.dictationTitle"
          :student-name="config.studentName"
          :student-class="config.studentClass"
          :worksheet-date="config.worksheetDate"
          :worksheet-score="config.worksheetScore"
          @update-header="updateConfig"
        />
        <div v-else class="empty-hint">请在左侧面板选择练习类型并输入内容</div>
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

.dictation-layout .preview-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 26px 34px 46px;
  background-color: #edf3f0;
  background-image: none;
}

.dictation-preview-status {
  display: flex;
  justify-content: space-between;
  width: min(750px, 100%);
  margin: 0 auto 12px;
  color: #74817a;
  font-size: 12px;
}

.dictation-layout :deep(.panel) {
  width: 280px;
  min-width: 280px;
}

.dictation-layout :deep(.worksheet-page) {
  width: min(750px, 100%);
  min-height: 970px;
  padding: 38px;
  box-shadow: 0 10px 34px rgba(34, 49, 45, 0.16);
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

  .dictation-layout .worksheet-page {
    width: 210mm;
    min-height: 297mm;
    padding: 15mm;
    box-shadow: none;
  }

  .dictation-layout .dictation-preview-status {
    display: none;
  }
}
</style>

<style>
@media print {
  /* 隐藏控制面板，只打印字帖内容 */
  .panel {
    display: none !important;
  }

  .dictation-layout .print-page-header {
    display: none !important;
  }

  .dictation-layout .worksheet-page {
    page: chinese-dictation;
    width: 210mm !important;
    min-height: 297mm !important;
    padding: 15mm !important;
  }
}

@page chinese-dictation {
  size: A4;
  margin: 0;
}
</style>
