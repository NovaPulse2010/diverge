<template>
  <div
    class="mizi-cell"
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
.mizi-cell {
  position: relative;
  border: var(--border-c) solid 1.5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(to right, transparent 49%, var(--guide-c) 49%, var(--guide-c) 51%, transparent 51%),
    linear-gradient(to bottom, transparent 49%, var(--guide-c) 49%, var(--guide-c) 51%, transparent 51%),
    linear-gradient(45deg, transparent 49%, var(--guide-c) 49%, var(--guide-c) 51%, transparent 51%),
    linear-gradient(135deg, transparent 49%, var(--guide-c) 49%, var(--guide-c) 51%, transparent 51%);
}

.mizi-cell + .mizi-cell {
  margin-left: -1.5px;
}
</style>
