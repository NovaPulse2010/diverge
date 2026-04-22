<template>
  <div
    class="square-cell"
    :style="{
      width: size + 'px',
      height: size + 'px',
      borderColor: borderColor,
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
  }>(),
  {
    size: 44,
    borderColor: '#333',
  },
)
</script>

<style scoped>
.square-cell {
  border: 1.5px solid;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.square-cell + .square-cell {
  margin-left: -1.5px;
}
</style>
