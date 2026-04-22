import { reactive, watch } from 'vue'
import { defaultConfig, type WorksheetConfig, type PresetTemplate, type Subject } from '@/types/worksheet'

const STORAGE_KEY = 'worksheet-config-v1'

function loadSaved(): Partial<WorksheetConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const config = reactive<WorksheetConfig>({ ...defaultConfig, ...loadSaved() })

// Auto-save on every change (shallow fields + deep arrays)
watch(
  config,
  (val) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(val)) } catch { /* quota */ }
  },
  { deep: true },
)

export const presets: PresetTemplate[] = [
  {
    name: '古诗带拼音默写',
    description: '《静夜思》前两句，田字格描红 + 默写行',
    config: {
      subject: 'yuwen',
      module: 'chinese',
      content: '床前明月光疑是地上霜',
      gridType: 'tianzi',
      fontStyle: 'kai',
      color: 'lightgray',
      showPinyin: true,
      traceCount: 1,
      practiceCount: 3,
      gridColor: '#dc3545',
    },
  },
  {
    name: '英文单词书写',
    description: '常见水果单词四线格书写',
    config: {
      subject: 'yingyu',
      module: 'english',
      content: 'Apple, Banana, Cherry',
      color: 'blue',
      englishFont: 'Caveat',
    },
  },
  {
    name: '数字书写 + 运算',
    description: '数字 1-20 描红书写 + 10以内加法',
    config: {
      subject: 'shuxue',
      module: 'number',
      content: '',
      gridType: 'square',
      color: 'lightgray',
      numberRange: [1, 20],
      traceCount: 2,
      practiceCount: 5,
      mathCount: 5,
      mathMax: 10,
    },
  },
  {
    name: '控笔训练',
    description: '直线、波浪线、锯齿线、曲线综合训练',
    config: {
      subject: 'yuwen',
      module: 'stroke',
      strokePatterns: ['straight', 'wave', 'zigzag', 'curve', 'spiral'],
      strokeDifficulty: 'easy',
    },
  },
  {
    name: '拼音默写',
    description: '显示拼音，隐藏汉字，田字格留空',
    config: {
      subject: 'yuwen',
      module: 'dictation',
      content: '床前明月光疑是地上霜',
      gridType: 'tianzi',
      dictationMode: 'pinyin-only',
      gridColor: '#dc3545',
    },
  },
]

export function useWorksheet() {
  function updateConfig(partial: Partial<WorksheetConfig>) {
    // Auto-switch module & dictation mode when subject changes
    if (partial.subject !== undefined && partial.subject !== config.subject) {
      const s = partial.subject as Subject
      if (s === 'yuwen' && partial.module === undefined) {
        partial.module = 'chinese'
        if (config.dictationMode === 'chinese-hint' || config.dictationMode === 'emoji-hint') {
          partial.dictationMode = 'pinyin-only'
        }
      } else if (s === 'shuxue') {
        partial.module = 'number'
      } else if (s === 'yingyu' && partial.module === undefined) {
        partial.module = 'english'
        if (config.dictationMode === 'pinyin-only' || config.dictationMode === 'char-only') {
          partial.dictationMode = 'chinese-hint'
        }
      }
    }
    Object.assign(config, partial)
  }

  function applyPreset(preset: PresetTemplate) {
    Object.assign(config, defaultConfig, preset.config)
  }

  function resetConfig() {
    Object.assign(config, defaultConfig)
  }

  return { config, updateConfig, applyPreset, resetConfig, presets }
}
