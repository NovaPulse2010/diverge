export type Subject = 'yuwen' | 'shuxue' | 'yingyu'
export type GridType = 'tianzi' | 'mizi' | 'english' | 'square'
export type FontStyle = 'kai' | 'hollow'
export type CharColor = 'lightgray' | 'black' | 'blue' | 'red'
export type ModuleType = 'chinese' | 'english' | 'number' | 'stroke' | 'dictation'
export type EnglishFont = 'Caveat' | 'Dancing Script'
export type DictationSubMode = 'pinyin-only' | 'char-only' | 'chinese-hint' | 'emoji-hint'
export type DictationDisplayMode = 'pinyin' | 'hanzi' | 'both'
export type StrokePattern = 'straight' | 'wave' | 'zigzag' | 'curve' | 'spiral' | 'circle'
export type StrokeDifficulty = 'easy' | 'medium' | 'hard'

export const DEFAULT_CHINESE_DICTATION_CONTENT = `爸爸
皮球
古诗
雨衣
老师
太阳
学校
朋友
春天
高兴
公园
生日
早上
小河
花朵
风筝
秋天
新年
中国
动物
图书馆
博物馆`

function getCurrentDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export interface WorksheetConfig {
  subject: Subject
  module: ModuleType
  content: string
  /** 语文默写汉字内容，与其他模块内容隔离 */
  dictationContent: string
  /** 可人工校正的语文默写拼音，每行对应一个词语 */
  dictationPinyinContent: string
  /** 语文默写拼音字号 */
  dictationPinyinFontSize: number
  /** 语文默写四线格高度 */
  dictationPinyinGuideHeight: number
  /** 语文默写汉字字号 */
  dictationHanziFontSize: number
  /** 语文默写汉字颜色 */
  dictationHanziColor: string
  /** 语文默写田字格尺寸 */
  dictationGridSize: number
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
  /** 语文默写提示显示方式 */
  dictationDisplayMode: DictationDisplayMode
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
  /** 英文默写抬头 */
  dictationTitle: string
  /** 学生姓名 */
  studentName: string
  /** 班级 */
  studentClass: string
  /** 字帖日期 */
  worksheetDate: string
  /** 评分 */
  worksheetScore: string
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
  dictationContent: DEFAULT_CHINESE_DICTATION_CONTENT,
  dictationPinyinContent: '',
  dictationPinyinFontSize: 26,
  dictationPinyinGuideHeight: 43,
  dictationHanziFontSize: 30,
  dictationHanziColor: '#a5a5a5',
  dictationGridSize: 52,
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
  dictationDisplayMode: 'pinyin',
  dictationContentType: ['words'],
  writingLineCount: 3,
  englishRowCols: [4],
  gridColor: '#dc3545',
  showCorrection: false,
  dictationTitle: '',
  studentName: '',
  studentClass: '',
  worksheetDate: getCurrentDate(),
  worksheetScore: '',
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
