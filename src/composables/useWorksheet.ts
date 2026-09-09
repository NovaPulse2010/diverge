import { reactive, watch } from 'vue'
import { defaultConfig, type WorksheetConfig, type PresetTemplate, type Subject } from '@/types/worksheet'

const SUBJECT_STORAGE_KEYS: Record<Subject, string> = {
  yuwen: 'worksheet-config-yuwen-v1',
  shuxue: 'worksheet-config-shuxue-v1',
  yingyu: 'worksheet-config-yingyu-v1',
}
const LEGACY_STORAGE_KEYS = ['worksheet-config-v2', 'worksheet-config-v1']
const ACTIVE_SUBJECT_KEY = 'worksheet-active-subject-v1'

function readJson(key: string): Partial<WorksheetConfig> | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as Partial<WorksheetConfig> : null
  } catch {
    return null
  }
}

function readLegacy(): Partial<WorksheetConfig> | null {
  for (const key of LEGACY_STORAGE_KEYS) {
    const saved = readJson(key)
    if (saved) return saved
  }
  return null
}

function loadSavedForSubject(subject: Subject): Partial<WorksheetConfig> {
  const current = readJson(SUBJECT_STORAGE_KEYS[subject])
  const saved = current || (readLegacy()?.subject === subject ? readLegacy() : null)
  if (!saved) return {}
  const migratedLegacyDictation = !current && saved.module === 'dictation' && saved.subject === 'yuwen'
    return {
      ...saved,
      ...(migratedLegacyDictation
        ? {
            dictationContent: defaultConfig.dictationContent,
            dictationPinyinContent: '',
            dictationMode: 'pinyin-only' as const,
            dictationDisplayMode: 'pinyin' as const,
            gridType: 'tianzi' as const,
          }
        : {}),
      // 日期始终按当天生成，避免长期缓存旧日期。
      worksheetDate: defaultConfig.worksheetDate,
    }
}

function activeSubject(): Subject {
  const stored = localStorage.getItem(ACTIVE_SUBJECT_KEY)
  if (stored === 'yuwen' || stored === 'shuxue' || stored === 'yingyu') return stored
  const legacy = readLegacy()?.subject
  if (legacy === 'yuwen' || legacy === 'shuxue' || legacy === 'yingyu') return legacy
  return defaultConfig.subject
}

function defaultModuleFor(subject: Subject): WorksheetConfig['module'] {
  if (subject === 'shuxue') return 'number'
  if (subject === 'yingyu') return 'english'
  return 'chinese'
}

const initialSubject = activeSubject()
const config = reactive<WorksheetConfig>({
  ...defaultConfig,
  subject: initialSubject,
  module: defaultModuleFor(initialSubject),
  ...loadSavedForSubject(initialSubject),
  worksheetDate: defaultConfig.worksheetDate,
})

function saveSubjectConfig(subject: Subject, value: WorksheetConfig = config) {
  try {
    localStorage.setItem(SUBJECT_STORAGE_KEYS[subject], JSON.stringify(value))
    localStorage.setItem(ACTIVE_SUBJECT_KEY, subject)
  } catch { /* storage unavailable */ }
}

// Auto-save on every change (shallow fields + deep arrays)
watch(
  config,
  (val) => {
    saveSubjectConfig(val.subject, val)
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
      dictationContent: '床前明月光\n疑是地上霜',
      dictationPinyinContent: '',
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
      const previousSubject = config.subject
      saveSubjectConfig(previousSubject)
      const s = partial.subject as Subject
      const savedTarget = loadSavedForSubject(s)
      const next: WorksheetConfig = {
        ...defaultConfig,
        module: defaultModuleFor(s),
        ...savedTarget,
        ...partial,
        subject: s,
      }
      if (partial.module === undefined && savedTarget.module === undefined) {
        next.module = defaultModuleFor(s)
      }
      if (s === 'yuwen' && partial.module === undefined && savedTarget.module === undefined) {
        next.dictationMode = 'pinyin-only'
        next.dictationDisplayMode = 'pinyin'
      }
      if (s === 'yingyu' && partial.module === undefined && savedTarget.module === undefined) {
        next.dictationMode = 'chinese-hint'
      }
      Object.assign(config, next)
      return
    }
    Object.assign(config, partial)
  }

  function applyPreset(preset: PresetTemplate) {
    saveSubjectConfig(config.subject)
    Object.assign(config, defaultConfig, preset.config)
  }

  function resetConfig() {
    Object.assign(config, defaultConfig)
  }

  return { config, updateConfig, applyPreset, resetConfig, presets }
}
