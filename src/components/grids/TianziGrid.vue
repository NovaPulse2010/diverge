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
  background: transparent;
}

.tianzi-cell::before,
.tianzi-cell::after {
  content: '';
  position: absolute;
  pointer-events: none;
  opacity: 0.72;
}

.tianzi-cell::before {
  top: 0;
  bottom: 0;
  left: 50%;
  border-left: 1px solid var(--guide-c);
}

.tianzi-cell::after {
  left: 0;
  right: 0;
  top: 50%;
  border-top: 1px solid var(--guide-c);
}

/* 合并相邻边框 */
.tianzi-cell + .tianzi-cell {
  margin-left: -1.5px;
}
</style>
