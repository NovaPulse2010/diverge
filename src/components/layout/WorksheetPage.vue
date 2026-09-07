<template>
  <div class="worksheet-page">
    <div class="print-page-header" aria-hidden="true">
      <div class="print-page-title">{{ title }}</div>
      <div class="print-page-meta">
        <span>姓名：{{ studentName || "__________" }}</span>
        <span>班级：{{ studentClass || "__________" }}</span>
        <span>日期：{{ worksheetDate || "__________" }}</span>
        <span>评分：{{ worksheetScore || "__________" }}</span>
      </div>
    </div>
    <PageMeta v-if="showMeta" />
    <div class="worksheet-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageMeta from "@/components/common/PageMeta.vue";

withDefaults(
  defineProps<{
    showMeta?: boolean;
    title?: string;
    studentName?: string;
    studentClass?: string;
    worksheetDate?: string;
    worksheetScore?: string;
  }>(),
  {
    showMeta: true,
    title: "练习字帖",
    studentName: "",
    studentClass: "",
    worksheetDate: "",
    worksheetScore: "",
  },
);
</script>

<style scoped>
.worksheet-page {
  width: 210mm;
  min-height: 297mm;
  background: white;
  padding: 15mm;
  box-sizing: border-box;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.worksheet-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.print-page-header {
  display: none;
}

@media print {
  .worksheet-page {
    display: block;
    box-shadow: none;
    margin: 0;
    padding: 0;
    height: auto;
    min-height: unset;
    overflow: visible;
  }

  .worksheet-content {
    display: block;
    flex: none;
    overflow: visible;
  }

  .print-page-header {
    display: block;
    position: fixed;
    top: -22mm;
    left: 0;
    right: 0;
    height: 18mm;
    color: #222;
    font-family: var(--font-kai);
  }

  .print-page-title {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    text-align: center;
    margin-bottom: 4mm;
  }

  .print-page-meta {
    display: flex;
    justify-content: center;
    gap: 10mm;
    font-size: 12px;
    line-height: 1;
    padding-bottom: 3mm;
    border-bottom: 1px solid #ddd;
  }
}
</style>
