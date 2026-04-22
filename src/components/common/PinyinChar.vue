<template>
  <span
    class="char-text"
    :class="{ hollow }"
    :style="{ color: charColor, '--stroke-color': charColor, fontFamily: 'var(--font-kai)' }"
  >{{ char }}</span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    char: string
    charColor?: string
    hollow?: boolean
  }>(),
  {
    charColor: '#c0c0c0',
    hollow: false,
  },
)
</script>

<style scoped>
.char-text {
  font-size: inherit;
  line-height: 1;
  display: block;
}

.char-text.hollow {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--stroke-color, #c0c0c0);
  paint-order: stroke fill;
}
</style>
