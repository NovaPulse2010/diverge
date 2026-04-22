<template>
  <div class="worksheet-page">
    <PageMeta v-if="showMeta" />
    <div class="worksheet-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageMeta from '@/components/common/PageMeta.vue'

withDefaults(defineProps<{ showMeta?: boolean }>(), { showMeta: true })
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

@media print {
  .worksheet-page {
    box-shadow: none;
    margin: 0;
    padding: 10mm;
    height: 297mm;
    min-height: unset;
    overflow: hidden;
  }
}
</style>
