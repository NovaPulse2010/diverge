export type Subject = 'yuwen' | 'shuxue' | 'yingyu'
export type GridType = 'tianzi' | 'mizi' | 'english' | 'square'
export type FontStyle = 'kai' | 'hollow'
export type CharColor = 'lightgray' | 'black' | 'blue' | 'red'
export type ModuleType = 'chinese' | 'english' | 'number' | 'stroke' | 'dictation'
export type EnglishFont = 'Caveat' | 'Dancing Script'
export type DictationSubMode = 'pinyin-only' | 'char-only' | 'chinese-hint' | 'emoji-hint'
export type StrokePattern = 'straight' | 'wave' | 'zigzag' | 'curve' | 'spiral' | 'circle'
export type StrokeDifficulty = 'easy' | 'medium' | 'hard'

export interface WorksheetConfig {
  subject: Subject
  module: ModuleType
  content: string
  gridType: GridType
  fontStyle: FontStyle
  color: CharColor
  showPinyin: boolean
  /** 描红模式: 每个字重复几遍描红 */
  traceCount: number
  /** 临摹模式: 每个字后面留几个空格 */
  practiceCount: number
  /** 英文字体 */
  englishFont: EnglishFont
  /** 数字范围 */
  numberRange: [number, number]
  /** 运算题数量 */
  mathCount: number
  /** 运算最大数 */
  mathMax: number
  /** 控笔线条类型 */
  strokePatterns: StrokePattern[]
  /** 控笔难度 */
  strokeDifficulty: StrokeDifficulty
  /** 默写子模式 */
  dictationMode: DictationSubMode
  /** 默写内容类型：可多选，'words' | 'sentences' */
  dictationContentType: string[]
  /** 英文默写书写横线数 */
  writingLineCount: number
  /** 英文默写每行列数列表，每个元素对应一行的列数 */
  englishRowCols: number[]
  /** 格子边框颜色 */
  gridColor: string
  /** 英文默写是否显示订正区 */
  showCorrection: boolean
  /** 中文提示字号(px) */
  hintFontSize: number
  /** 中文提示颜色 */
  hintColor: string
  /** 中文提示加粗 */
  hintBold: boolean
  /** 四线格行高缩放比 */
  gridScale: number
  /** 四线格顶线/底线颜色 */
  gridTopColor: string
  /** 四线格第二线（辅助线）颜色 */
  gridMidColor: string
  /** 四线格第三线（基线）颜色 */
  gridBaseColor: string
  /** 辅线/基线线型：实线或虚线 */
  gridLineStyle: 'dashed' | 'solid'
}

export const defaultConfig: WorksheetConfig = {
  subject: 'yuwen',
  module: 'chinese',
  content: '',
  gridType: 'tianzi',
  fontStyle: 'kai',
  color: 'lightgray',
  showPinyin: true,
  traceCount: 2,
  practiceCount: 4,
  englishFont: 'Caveat',
  numberRange: [1, 20],
  mathCount: 5,
  mathMax: 10,
  strokePatterns: ['straight', 'wave', 'zigzag'],
  strokeDifficulty: 'easy',
  dictationMode: 'pinyin-only',
  dictationContentType: ['words'],
  writingLineCount: 3,
  englishRowCols: [4],
  gridColor: '#dc3545',
  showCorrection: false,
  hintFontSize: 14,
  hintColor: '#2c3040',
  hintBold: false,
  gridScale: 1.1,
  gridTopColor: '#237a45',
  gridMidColor: '#78cc95',
  gridBaseColor: '#e87060',
  gridLineStyle: 'dashed',
}

export interface PresetTemplate {
  name: string
  description: string
  config: Partial<WorksheetConfig>
}
