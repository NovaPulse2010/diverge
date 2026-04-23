<template>
  <aside class="panel" :style="themeVars">
    <!-- ── Brand ── -->
    <header class="panel-brand">
      <div class="brand-mark">字</div>
      <div class="brand-text">
        <p class="brand-title">练习字帖</p>
        <p class="brand-sub">综合生成器</p>
      </div>
    </header>

    <!-- ── Subject Tabs ── -->
    <div class="subject-row">
      <button
        v-for="s in subjects"
        :key="s.id"
        class="subject-btn"
        :class="{ active: config.subject === s.id }"
        @click="switchSubject(s.id)"
      >
        <span class="sbtn-char">{{ s.char }}</span>
        <span class="sbtn-label">{{ s.label }}</span>
      </button>
    </div>

    <!-- ── Scrollable Body ── -->
    <div class="panel-body">
      <!-- Module Grid -->
      <div class="panel-block">
        <div class="block-title">练习内容</div>
        <div class="module-grid" :class="`cols-${currentModules.length}`">
          <button
            v-for="m in currentModules"
            :key="m.uid"
            class="module-btn"
            :class="{ active: isModuleActive(m) }"
            @click="selectModule(m)"
          >
            <span class="mbtn-icon">{{ m.icon }}</span>
            <span class="mbtn-label">{{ m.label }}</span>
          </button>
        </div>
      </div>

      <div class="divider" />

      <!-- Content Textarea -->
      <div v-if="showContentInput" class="panel-block">
        <div class="block-title">{{ contentLabel }}</div>
        <textarea
          class="content-ta"
          :value="config.content"
          :placeholder="contentPlaceholder"
          rows="4"
          @input="
            updateConfig({
              content: ($event.target as HTMLTextAreaElement).value,
            })
          "
        />
      </div>

      <!-- ════ 语文 · 汉字书写 ════ -->
      <template v-if="config.module === 'chinese'">
        <div class="panel-block">
          <div class="block-title">格体</div>
          <div class="chips">
            <button
              v-for="g in gridTypes"
              :key="g.value"
              class="chip"
              :class="{ active: config.gridType === g.value }"
              @click="updateConfig({ gridType: g.value })"
            >
              {{ g.label }}
            </button>
          </div>
        </div>

        <div class="panel-block">
          <div class="block-title">字体样式</div>
          <div class="chips">
            <button
              v-for="f in fontStyles"
              :key="f.value"
              class="chip"
              :class="{ active: config.fontStyle === f.value }"
              @click="updateConfig({ fontStyle: f.value })"
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <div class="panel-block">
          <div class="block-title">墨色</div>
          <div class="swatches">
            <button
              v-for="c in charColors"
              :key="c.value"
              class="swatch"
              :class="{ active: config.color === c.value }"
              :style="{ '--sw': c.hex }"
              :title="c.label"
              @click="updateConfig({ color: c.value })"
            />
          </div>
        </div>

        <div class="panel-block">
          <label class="toggle-row">
            <span class="tr-label">显示拼音</span>
            <span class="toggle-wrap">
              <input
                type="checkbox"
                class="toggle-input"
                :checked="config.showPinyin"
                @change="
                  updateConfig({
                    showPinyin: ($event.target as HTMLInputElement).checked,
                  })
                "
              />
              <span class="toggle-track" />
            </span>
          </label>
        </div>

        <div class="panel-block">
          <div class="block-title">数量</div>
          <div class="field-row">
            <label class="field">
              <span class="field-label">描红次数</span>
              <input
                class="num-input"
                type="number"
                min="0"
                max="5"
                :value="config.traceCount"
                @input="
                  updateConfig({
                    traceCount: +($event.target as HTMLInputElement).value,
                  })
                "
              />
            </label>
            <label class="field">
              <span class="field-label">练习格数</span>
              <input
                class="num-input"
                type="number"
                min="0"
                max="10"
                :value="config.practiceCount"
                @input="
                  updateConfig({
                    practiceCount: +($event.target as HTMLInputElement).value,
                  })
                "
              />
            </label>
          </div>
        </div>

        <div class="panel-block">
          <div class="block-title">格线颜色</div>
          <input
            type="color"
            class="color-picker"
            :value="config.gridColor"
            @input="
              updateConfig({
                gridColor: ($event.target as HTMLInputElement).value,
              })
            "
          />
        </div>
      </template>

      <!-- ════ 语文 · 控笔训练 ════ -->
      <template v-else-if="config.module === 'stroke'">
        <div class="panel-block">
          <div class="block-title">线条类型</div>
          <div class="check-grid">
            <label
              v-for="sp in strokePatternOptions"
              :key="sp.value"
              class="check-item"
              :class="{ active: config.strokePatterns.includes(sp.value) }"
            >
              <input
                type="checkbox"
                :checked="config.strokePatterns.includes(sp.value)"
                @change="toggleStrokePattern(sp.value)"
              />
              {{ sp.label }}
            </label>
          </div>
        </div>

        <div class="panel-block">
          <div class="block-title">难度</div>
          <div class="chips">
            <button
              v-for="d in difficulties"
              :key="d.value"
              class="chip"
              :class="{ active: config.strokeDifficulty === d.value }"
              @click="updateConfig({ strokeDifficulty: d.value })"
            >
              {{ d.label }}
            </button>
          </div>
        </div>
      </template>

      <!-- ════ 语文 · 拼音默写 ════ -->
      <template
        v-else-if="config.module === 'dictation' && config.subject === 'yuwen'"
      >
        <div class="panel-block">
          <div class="block-title">默写模式</div>
          <div class="chips wrap">
            <button
              v-for="dm in yuwenDictModes"
              :key="dm.value"
              class="chip"
              :class="{ active: config.dictationMode === dm.value }"
              @click="updateConfig({ dictationMode: dm.value })"
            >
              {{ dm.label }}
            </button>
          </div>
        </div>

        <div class="panel-block">
          <div class="block-title">格体</div>
          <div class="chips">
            <button
              v-for="g in gridTypes"
              :key="g.value"
              class="chip"
              :class="{ active: config.gridType === g.value }"
              @click="updateConfig({ gridType: g.value })"
            >
              {{ g.label }}
            </button>
          </div>
        </div>

        <div class="panel-block">
          <div class="block-title">格线颜色</div>
          <input
            type="color"
            class="color-picker"
            :value="config.gridColor"
            @input="
              updateConfig({
                gridColor: ($event.target as HTMLInputElement).value,
              })
            "
          />
        </div>
      </template>

      <!-- ════ 数学 · 数字书写 ════ -->
      <template v-else-if="config.module === 'number'">
        <div class="panel-block">
          <div class="block-title">数字范围</div>
          <div class="field-row">
            <label class="field">
              <span class="field-label">起始</span>
              <input
                class="num-input"
                type="number"
                min="0"
                max="100"
                :value="config.numberRange[0]"
                @input="
                  updateConfig({
                    numberRange: [
                      +($event.target as HTMLInputElement).value,
                      config.numberRange[1],
                    ],
                  })
                "
              />
            </label>
            <label class="field">
              <span class="field-label">结束</span>
              <input
                class="num-input"
                type="number"
                min="1"
                max="100"
                :value="config.numberRange[1]"
                @input="
                  updateConfig({
                    numberRange: [
                      config.numberRange[0],
                      +($event.target as HTMLInputElement).value,
                    ],
                  })
                "
              />
            </label>
          </div>
        </div>

        <div class="panel-block">
          <div class="block-title">墨色</div>
          <div class="swatches">
            <button
              v-for="c in charColors"
              :key="c.value"
              class="swatch"
              :class="{ active: config.color === c.value }"
              :style="{ '--sw': c.hex }"
              :title="c.label"
              @click="updateConfig({ color: c.value })"
            />
          </div>
        </div>

        <div class="panel-block">
          <div class="block-title">书写数量</div>
          <div class="field-row">
            <label class="field">
              <span class="field-label">描红次数</span>
              <input
                class="num-input"
                type="number"
                min="0"
                max="5"
                :value="config.traceCount"
                @input="
                  updateConfig({
                    traceCount: +($event.target as HTMLInputElement).value,
                  })
                "
              />
            </label>
            <label class="field">
              <span class="field-label">练习格数</span>
              <input
                class="num-input"
                type="number"
                min="0"
                max="10"
                :value="config.practiceCount"
                @input="
                  updateConfig({
                    practiceCount: +($event.target as HTMLInputElement).value,
                  })
                "
              />
            </label>
          </div>
        </div>

        <div class="panel-block">
          <div class="block-title">运算练习</div>
          <div class="field-row">
            <label class="field">
              <span class="field-label">题数</span>
              <input
                class="num-input"
                type="number"
                min="0"
                max="20"
                :value="config.mathCount"
                @input="
                  updateConfig({
                    mathCount: +($event.target as HTMLInputElement).value,
                  })
                "
              />
            </label>
            <label class="field">
              <span class="field-label">最大数</span>
              <input
                class="num-input"
                type="number"
                min="5"
                max="100"
                :value="config.mathMax"
                @input="
                  updateConfig({
                    mathMax: +($event.target as HTMLInputElement).value,
                  })
                "
              />
            </label>
          </div>
        </div>
      </template>

      <!-- ════ 英语 · 单词书写 ════ -->
      <template v-else-if="config.module === 'english'">
        <div class="panel-block">
          <div class="block-title">书写字体</div>
          <div class="chips">
            <button
              v-for="ef in englishFonts"
              :key="ef.value"
              class="chip"
              :class="{ active: config.englishFont === ef.value }"
              @click="updateConfig({ englishFont: ef.value })"
            >
              {{ ef.label }}
            </button>
          </div>
        </div>

        <div class="panel-block">
          <div class="block-title">墨色</div>
          <div class="swatches">
            <button
              v-for="c in charColors"
              :key="c.value"
              class="swatch"
              :class="{ active: config.color === c.value }"
              :style="{ '--sw': c.hex }"
              :title="c.label"
              @click="updateConfig({ color: c.value })"
            />
          </div>
        </div>

        <div class="panel-block">
          <div class="block-title">数量</div>
          <div class="field-row">
            <label class="field">
              <span class="field-label">描红组数</span>
              <input
                class="num-input"
                type="number"
                min="0"
                max="5"
                :value="config.traceCount"
                @input="
                  updateConfig({
                    traceCount: +($event.target as HTMLInputElement).value,
                  })
                "
              />
            </label>
            <label class="field">
              <span class="field-label">练习组数</span>
              <input
                class="num-input"
                type="number"
                min="0"
                max="5"
                :value="config.practiceCount"
                @input="
                  updateConfig({
                    practiceCount: +($event.target as HTMLInputElement).value,
                  })
                "
              />
            </label>
          </div>
        </div>
      </template>

      <!-- ════ 英语 · 英文默写 ════ -->
      <template
        v-else-if="config.module === 'dictation' && config.subject === 'yingyu'"
      >
        <div class="panel-block">
          <div class="block-title">提示方式</div>
          <div class="chips">
            <button
              v-for="dm in yingyuDictModes"
              :key="dm.value"
              class="chip"
              :class="{ active: config.dictationMode === dm.value }"
              @click="updateConfig({ dictationMode: dm.value })"
            >
              {{ dm.label }}
            </button>
          </div>
        </div>

        <div class="panel-block">
          <div class="block-title-row">
            <span class="block-title">每行列数</span>
            <button class="add-row-btn" @click="addRowCol">＋ 添加行</button>
          </div>
          <div class="row-cols-list">
            <div
              v-for="(cols, ri) in config.englishRowCols"
              :key="ri"
              class="row-col-item"
            >
              <span class="row-col-label">第 {{ ri + 1 }} 行</span>
              <div class="row-col-stepper">
                <button
                  class="step-btn"
                  :disabled="cols <= 1"
                  @click="setRowCol(ri, cols - 1)"
                >
                  −
                </button>
                <span class="step-val">{{ cols }}</span>
                <button
                  class="step-btn"
                  :disabled="cols >= 10"
                  @click="setRowCol(ri, cols + 1)"
                >
                  +
                </button>
              </div>
              <button
                class="row-del-btn"
                :disabled="config.englishRowCols.length <= 1"
                @click="removeRowCol(ri)"
                title="删除此行"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- 提示文字样式 -->
        <div class="panel-block">
          <div class="block-title">提示文字</div>
          <div class="field-row" style="align-items: center; gap: 8px">
            <label class="field">
              <span class="field-label">字号</span>
              <div class="row-col-stepper">
                <button
                  class="step-btn"
                  :disabled="config.hintFontSize <= 10"
                  @click="
                    updateConfig({ hintFontSize: config.hintFontSize - 1 })
                  "
                >
                  −
                </button>
                <span class="step-val" style="min-width: 32px"
                  >{{ config.hintFontSize }}px</span
                >
                <button
                  class="step-btn"
                  :disabled="config.hintFontSize >= 26"
                  @click="
                    updateConfig({ hintFontSize: config.hintFontSize + 1 })
                  "
                >
                  +
                </button>
              </div>
            </label>
            <label class="field">
              <span class="field-label">颜色</span>
              <input
                type="color"
                class="color-picker"
                :value="config.hintColor"
                @input="
                  updateConfig({
                    hintColor: ($event.target as HTMLInputElement).value,
                  })
                "
              />
            </label>
          </div>
          <label class="toggle-row" style="margin-top: 6px">
            <span class="tr-label">加粗</span>
            <span class="toggle-wrap">
              <input
                type="checkbox"
                class="toggle-input"
                :checked="config.hintBold"
                @change="
                  updateConfig({
                    hintBold: ($event.target as HTMLInputElement).checked,
                  })
                "
              />
              <span class="toggle-track" />
            </span>
          </label>
        </div>

        <!-- 订正区 & 四线格样式 -->
        <div class="panel-block">
          <label class="toggle-row">
            <span class="tr-label">显示订正区</span>
            <span class="toggle-wrap">
              <input
                type="checkbox"
                class="toggle-input"
                :checked="config.showCorrection"
                @change="
                  updateConfig({
                    showCorrection: ($event.target as HTMLInputElement).checked,
                  })
                "
              />
              <span class="toggle-track" />
            </span>
          </label>
        </div>

        <!-- 四线格样式 -->
        <div class="panel-block">
          <div class="block-title">四线格样式</div>
          <div class="field-row" style="align-items: center; gap: 8px">
            <label class="field">
              <span class="field-label">行高</span>
              <div class="row-col-stepper">
                <button
                  class="step-btn"
                  :disabled="config.gridScale <= 0.7"
                  @click="
                    updateConfig({
                      gridScale: Math.round((config.gridScale - 0.1) * 10) / 10,
                    })
                  "
                >
                  −
                </button>
                <span class="step-val" style="min-width: 36px"
                  >{{ config.gridScale.toFixed(1) }}x</span
                >
                <button
                  class="step-btn"
                  :disabled="config.gridScale >= 2.0"
                  @click="
                    updateConfig({
                      gridScale: Math.round((config.gridScale + 0.1) * 10) / 10,
                    })
                  "
                >
                  +
                </button>
              </div>
            </label>
          </div>
          <div class="field-row" style="margin-top: 8px">
            <span class="field-label">辅线/基线</span>
            <div class="chips" style="margin-top: 0">
              <button
                class="chip"
                :class="{ active: config.gridLineStyle === 'dashed' }"
                @click="updateConfig({ gridLineStyle: 'dashed' })"
              >
                虚线
              </button>
              <button
                class="chip"
                :class="{ active: config.gridLineStyle === 'solid' }"
                @click="updateConfig({ gridLineStyle: 'solid' })"
              >
                实线
              </button>
            </div>
          </div>
          <div class="grid-colors-row">
            <label class="grid-color-item" title="顶线 / 底线">
              <span
                class="grid-color-dot"
                :style="{ background: config.gridTopColor }"
              />
              <span class="grid-color-label">顶/底</span>
              <input
                type="color"
                class="color-picker-inline"
                :value="config.gridTopColor"
                @input="
                  updateConfig({
                    gridTopColor: ($event.target as HTMLInputElement).value,
                  })
                "
              />
            </label>
            <label class="grid-color-item" title="第二辅助线">
              <span
                class="grid-color-dot"
                :style="{ background: config.gridMidColor }"
              />
              <span class="grid-color-label">辅线</span>
              <input
                type="color"
                class="color-picker-inline"
                :value="config.gridMidColor"
                @input="
                  updateConfig({
                    gridMidColor: ($event.target as HTMLInputElement).value,
                  })
                "
              />
            </label>
            <label class="grid-color-item" title="基线（第三线）">
              <span
                class="grid-color-dot"
                :style="{ background: config.gridBaseColor }"
              />
              <span class="grid-color-label">基线</span>
              <input
                type="color"
                class="color-picker-inline"
                :value="config.gridBaseColor"
                @input="
                  updateConfig({
                    gridBaseColor: ($event.target as HTMLInputElement).value,
                  })
                "
              />
            </label>
          </div>
        </div>
      </template>
    </div>
    <!-- /panel-body -->

    <!-- ── Print Footer ── -->
    <footer class="panel-footer">
      <button class="btn-print" @click="printWorksheet">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 6 2 18 2 18 9" />
          <path
            d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
          />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        打印字帖
      </button>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type {
  WorksheetConfig,
  PresetTemplate,
  StrokePattern,
  Subject,
  ModuleType,
  DictationSubMode,
} from "@/types/worksheet";
import { usePrint } from "@/composables/usePrint";

const props = defineProps<{
  config: WorksheetConfig;
  presets: PresetTemplate[];
}>();

const emit = defineEmits<{
  update: [partial: Partial<WorksheetConfig>];
  preset: [preset: PresetTemplate];
}>();

const { printWorksheet } = usePrint();

function updateConfig(partial: Partial<WorksheetConfig>) {
  emit("update", partial);
}

// ── Theme ──
const subjectThemes: Record<
  Subject,
  { color: string; bg: string; light: string }
> = {
  yuwen: { color: "#e54d42", bg: "#fff5f4", light: "#fde8e6" },
  shuxue: { color: "#2979d9", bg: "#f0f6ff", light: "#ddeaff" },
  yingyu: { color: "#22a870", bg: "#f0fdf7", light: "#d4f5e9" },
};

const themeVars = computed(() => {
  const t = subjectThemes[props.config.subject] ?? subjectThemes.yuwen;
  return { "--t-color": t.color, "--t-bg": t.bg, "--t-light": t.light };
});

// ── Subjects ──
const subjects = [
  { id: "yuwen" as Subject, char: "文", label: "语文" },
  { id: "shuxue" as Subject, char: "算", label: "数学" },
  { id: "yingyu" as Subject, char: "En", label: "英语" },
];

function switchSubject(id: Subject) {
  updateConfig({ subject: id });
}

// ── Modules per subject ──
interface ModuleItem {
  uid: string;
  id: ModuleType;
  icon: string;
  label: string;
  dictMode?: DictationSubMode;
}

const subjectModules: Record<Subject, ModuleItem[]> = {
  yuwen: [
    { uid: "chinese", id: "chinese", icon: "楷", label: "汉字书写" },
    { uid: "stroke", id: "stroke", icon: "✎", label: "控笔训练" },
    {
      uid: "dict-yuwen",
      id: "dictation",
      icon: "默",
      label: "拼音默写",
      dictMode: "pinyin-only",
    },
  ],
  shuxue: [{ uid: "number", id: "number", icon: "123", label: "数字书写" }],
  yingyu: [
    { uid: "english", id: "english", icon: "ABC", label: "单词书写" },
    {
      uid: "dict-yingyu",
      id: "dictation",
      icon: "写",
      label: "英文默写",
      dictMode: "chinese-hint",
    },
  ],
};

const currentModules = computed(
  () => subjectModules[props.config.subject] ?? [],
);

function isModuleActive(m: ModuleItem): boolean {
  return props.config.module === m.id;
}

function selectModule(m: ModuleItem) {
  const partial: Partial<WorksheetConfig> = { module: m.id };
  if (m.dictMode) partial.dictationMode = m.dictMode;
  updateConfig(partial);
}

// ── Content input ──
const showContentInput = computed(() =>
  ["chinese", "english", "dictation"].includes(props.config.module),
);

const contentLabel = computed(() => {
  switch (props.config.module) {
    case "chinese":
      return "练习汉字";
    case "english":
      return "单词 / 短语（逗号分隔）";
    case "dictation":
      if (props.config.subject === "yuwen") return "默写内容（汉字）";
      return "每行一个条目，换行分隔";
    default:
      return "内容";
  }
});

const contentPlaceholder = computed(() => {
  switch (props.config.module) {
    case "chinese":
      return "输入要练习的汉字，如：床前明月光";
    case "english":
      return "如：Apple, Banana, Good morning";
    case "dictation":
      if (props.config.subject === "yuwen") return "如：床前明月光疑是地上霜";
      return "如：apple\ngood morning\nhow are you";
    default:
      return "";
  }
});

// ── Options ──
const gridTypes = [
  { value: "tianzi" as const, label: "田字格" },
  { value: "mizi" as const, label: "米字格" },
  { value: "square" as const, label: "方格" },
];
const fontStyles = [
  { value: "kai" as const, label: "楷体" },
  { value: "hollow" as const, label: "空心字" },
];
const charColors = [
  { value: "lightgray" as const, label: "浅灰(描红)", hex: "#c8c8c8" },
  { value: "black" as const, label: "黑色(临摹)", hex: "#222222" },
  { value: "blue" as const, label: "蓝色", hex: "#1a5fb4" },
  { value: "red" as const, label: "红色", hex: "#e03030" },
];
const englishFonts = [
  { value: "Caveat" as const, label: "Caveat" },
  { value: "Dancing Script" as const, label: "Dancing Script" },
];
const strokePatternOptions = [
  { value: "straight" as const, label: "直线" },
  { value: "wave" as const, label: "波浪" },
  { value: "zigzag" as const, label: "锯齿" },
  { value: "curve" as const, label: "曲线" },
  { value: "spiral" as const, label: "螺旋" },
  { value: "circle" as const, label: "圆形" },
];
const difficulties = [
  { value: "easy" as const, label: "简单" },
  { value: "medium" as const, label: "中等" },
  { value: "hard" as const, label: "困难" },
];
const yuwenDictModes = [
  { value: "pinyin-only" as const, label: "看拼音写汉字" },
  { value: "char-only" as const, label: "看汉字写拼音" },
];
const yingyuDictModes = [
  { value: "chinese-hint" as const, label: "中文提示" },
  { value: "emoji-hint" as const, label: "图片提示" },
];

function setRowCol(index: number, val: number) {
  const cols = [...props.config.englishRowCols];
  cols[index] = Math.max(1, Math.min(10, val));
  updateConfig({ englishRowCols: cols });
}

function addRowCol() {
  const cols = [...props.config.englishRowCols];
  cols.push(cols[cols.length - 1] ?? 4);
  updateConfig({ englishRowCols: cols });
}

function removeRowCol(index: number) {
  if (props.config.englishRowCols.length <= 1) return;
  const cols = [...props.config.englishRowCols];
  cols.splice(index, 1);
  updateConfig({ englishRowCols: cols });
}

function toggleStrokePattern(pattern: StrokePattern) {
  const current = [...props.config.strokePatterns];
  const idx = current.indexOf(pattern);
  if (idx >= 0) current.splice(idx, 1);
  else current.push(pattern);
  updateConfig({ strokePatterns: current });
}
</script>

<style scoped>
.panel {
  width: 296px;
  min-width: 296px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-right: 1px solid #eaeef3;
  font-family: var(--font-ui);
  -webkit-font-smoothing: antialiased;
}

/* ── Brand ── */
.panel-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px 10px;
  flex-shrink: 0;
}
.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    var(--t-color),
    color-mix(in srgb, var(--t-color) 55%, #000)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: var(--font-kai);
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
  transition: background 0.3s ease;
}
.brand-text {
  flex: 1;
}
.brand-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.3;
}
.brand-sub {
  margin: 0;
  margin-top: 2px;
  font-size: 11px;
  color: #b0b8c4;
}

/* ── Subject Tabs ── */
.subject-row {
  display: flex;
  gap: 6px;
  padding: 0 10px 10px;
  flex-shrink: 0;
}
.subject-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 9px 4px 8px;
  border: 1.5px solid #eaeef3;
  border-radius: 11px;
  background: #f6f8fa;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.subject-btn:hover:not(.active) {
  border-color: var(--t-color);
  background: var(--t-bg);
  color: var(--t-color);
  transform: translateY(-1px);
}
.subject-btn.active {
  background: var(--t-color);
  border-color: var(--t-color);
  color: white;
  box-shadow: 0 3px 12px color-mix(in srgb, var(--t-color) 38%, transparent);
  transform: translateY(-1px);
}
.sbtn-char {
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
}
.sbtn-label {
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}

/* ── Body ── */
.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 10px 8px;
  scroll-behavior: smooth;
}
.panel-body::-webkit-scrollbar {
  width: 3px;
}
.panel-body::-webkit-scrollbar-track {
  background: transparent;
}
.panel-body::-webkit-scrollbar-thumb {
  background: #dde2e8;
  border-radius: 2px;
}

.panel-block {
  margin-bottom: 14px;
}
.block-title {
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #adb5bd;
  margin-bottom: 7px;
}
.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #eaeef3, transparent);
  margin: 2px 0 14px;
}

/* ── Module Grid ── */
.module-grid {
  display: grid;
  gap: 7px;
}
.module-grid.cols-1 {
  grid-template-columns: 1fr;
}
.module-grid.cols-2 {
  grid-template-columns: 1fr 1fr;
}
.module-grid.cols-3 {
  grid-template-columns: 1fr 1fr 1fr;
}

.module-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 11px 4px 9px;
  border: 1.5px solid #eaeef3;
  border-radius: 11px;
  background: #f6f8fa;
  cursor: pointer;
  color: #5a6270;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.module-btn:hover:not(.active) {
  border-color: var(--t-color);
  background: var(--t-bg);
  color: var(--t-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
.module-btn.active {
  background: var(--t-color);
  border-color: var(--t-color);
  color: white;
  box-shadow: 0 4px 14px color-mix(in srgb, var(--t-color) 38%, transparent);
  transform: translateY(-2px);
}
.mbtn-icon {
  font-size: 19px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
}
.mbtn-label {
  font-size: 11px;
  font-weight: 500;
  line-height: 1.3;
  text-align: center;
}

/* ── Textarea ── */
.content-ta {
  width: 100%;
  padding: 9px 11px;
  border: 1.5px solid #eaeef3;
  border-radius: 9px;
  background: #f6f8fa;
  font-size: 13px;
  color: #1a1a2e;
  resize: vertical;
  min-height: 76px;
  line-height: 1.65;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
}
.content-ta:focus {
  border-color: var(--t-color);
  background: #fff;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--t-color) 14%, transparent);
}

/* ── Chips ── */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chip {
  padding: 5px 13px;
  border: 1.5px solid #eaeef3;
  border-radius: 20px;
  background: #f6f8fa;
  font-size: 12px;
  font-weight: 500;
  color: #5a6270;
  cursor: pointer;
  transition: all 0.18s ease;
  line-height: 1.4;
}
.chip:hover:not(.active) {
  border-color: var(--t-color);
  color: var(--t-color);
  background: var(--t-bg);
}
.chip.active {
  background: var(--t-color);
  border-color: var(--t-color);
  color: white;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--t-color) 30%, transparent);
}

/* ── Color Swatches ── */
.swatches {
  display: flex;
  gap: 10px;
  align-items: center;
}
.swatch {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--sw);
  border: 2.5px solid transparent;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  outline: none;
}
.swatch:hover {
  transform: scale(1.18);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}
.swatch.active {
  border-color: var(--t-color);
  transform: scale(1.18);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--t-color) 22%, transparent);
}

/* ── Toggle ── */
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 3px 0;
}
.tr-label {
  font-size: 13px;
  font-weight: 500;
  color: #3d4451;
}
.toggle-wrap {
  position: relative;
  width: 38px;
  height: 21px;
  flex-shrink: 0;
}
.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-track {
  position: absolute;
  inset: 0;
  border-radius: 11px;
  background: #dde4ec;
  transition: background 0.22s ease;
  cursor: pointer;
}
.toggle-track::after {
  content: "";
  position: absolute;
  top: 2.5px;
  left: 2.5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toggle-input:checked + .toggle-track {
  background: var(--t-color);
}
.toggle-input:checked + .toggle-track::after {
  transform: translateX(17px);
}

/* ── Fields ── */
.field-row {
  display: flex;
  gap: 8px;
}
.field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.field-label {
  font-size: 11px;
  font-weight: 500;
  color: #adb5bd;
}
.num-input {
  width: 100%;
  padding: 7px 8px;
  border: 1.5px solid #eaeef3;
  border-radius: 8px;
  background: #f6f8fa;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: #1a1a2e;
  outline: none;
  transition:
    border-color 0.2s,
    background 0.2s,
    box-shadow 0.2s;
}
.num-input:focus {
  border-color: var(--t-color);
  background: #fff;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--t-color) 14%, transparent);
}

/* ── Color Picker ── */
.color-picker {
  width: 44px;
  height: 28px;
  padding: 2px 3px;
  border: 1.5px solid #eaeef3;
  border-radius: 7px;
  background: #f6f8fa;
  cursor: pointer;
  transition: border-color 0.2s;
}
.color-picker:hover {
  border-color: var(--t-color);
}

/* ── Stroke Check Grid ── */
.check-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.check-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1.5px solid #eaeef3;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s ease;
  background: #f6f8fa;
  color: #5a6270;
}
.check-item input {
  accent-color: var(--t-color);
  cursor: pointer;
  width: 13px;
  height: 13px;
}
.check-item.active {
  border-color: var(--t-color);
  background: var(--t-bg);
  color: var(--t-color);
}

/* ── Row Cols Editor ── */
.block-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
}

.block-title-row .block-title {
  margin-bottom: 0;
}

.add-row-btn {
  font-size: 11px;
  font-weight: 600;
  color: var(--t-color);
  background: var(--t-bg);
  border: 1.5px solid var(--t-color);
  border-radius: 14px;
  padding: 3px 10px;
  cursor: pointer;
  transition: all 0.18s ease;
  line-height: 1.4;
}
.add-row-btn:hover {
  background: var(--t-color);
  color: white;
}

.row-cols-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.row-col-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #f6f8fa;
  border: 1.5px solid #eaeef3;
  border-radius: 9px;
  transition: border-color 0.18s;
}
.row-col-item:hover {
  border-color: var(--t-color);
}

.row-col-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  flex: 1;
  white-space: nowrap;
}

.row-col-stepper {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1.5px solid #dde4ec;
  border-radius: 7px;
  overflow: hidden;
  background: white;
}

.step-btn {
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 700;
  color: #5a6270;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.step-btn:hover:not(:disabled) {
  background: var(--t-color);
  color: white;
}
.step-btn:disabled {
  color: #c8d0da;
  cursor: not-allowed;
}

.step-val {
  min-width: 24px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: #1a1a2e;
  border-left: 1px solid #eaeef3;
  border-right: 1px solid #eaeef3;
  line-height: 26px;
}

.row-del-btn {
  width: 22px;
  height: 22px;
  border: none;
  background: transparent;
  color: #c0c8d4;
  font-size: 16px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s,
    color 0.15s;
  padding: 0;
  flex-shrink: 0;
}
.row-del-btn:hover:not(:disabled) {
  background: #fee2e2;
  color: #e03030;
}
.row-del-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ── Grid color row ── */
.grid-colors-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.grid-color-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;
}
.grid-color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #e0e6ef;
}
.grid-color-label {
  font-size: 10px;
  color: #888;
  text-align: center;
}
.color-picker-inline {
  width: 100%;
  height: 20px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

/* ── Footer ── */
.panel-footer {
  padding: 10px 10px 14px;
  border-top: 1px solid #eaeef3;
  flex-shrink: 0;
}
.btn-print {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 12px;
  background: var(--t-color);
  color: white;
  border: none;
  border-radius: 11px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--t-color) 36%, transparent);
}
.btn-print:hover {
  filter: brightness(1.07);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--t-color) 44%, transparent);
}
.btn-print:active {
  transform: translateY(0);
  filter: brightness(0.96);
}
</style>
