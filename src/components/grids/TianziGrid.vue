<template>
  <div
    class="tianzi-cell"
    :style="{
      width: size + 'px',
      height: size + 'px',
      '--border-c': borderColor,
      '--guide-c': guideColor,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
    borderColor?: string
    guideColor?: string
  }>(),
  {
    size: 52,
    borderColor: '#dc3545',
    guideColor: '#e8a0a8',
  },
)
</script>

<style scoped>
.tianzi-cell {
  position: relative;
  border: var(--border-c) solid 1.5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(to right, transparent calc(50% - 0.4px), var(--guide-c) calc(50% - 0.4px), var(--guide-c) calc(50% + 0.4px), transparent calc(50% + 0.4px)),
    linear-gradient(to bottom, transparent calc(50% - 0.4px), var(--guide-c) calc(50% - 0.4px), var(--guide-c) calc(50% + 0.4px), transparent calc(50% + 0.4px));
}

/* 合并相邻边框 */
.tianzi-cell + .tianzi-cell {
  margin-left: -1.5px;
}
</style>
