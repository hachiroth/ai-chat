<script setup lang="ts">
  import { computed } from 'vue'


  const { placement = 'top', disabled = false } = defineProps<{
    placement?: 'right' | 'left' | 'top' | 'bottom',
    disabled?: boolean
  }>()

  const placementClass = computed(() => {
    return {
      '[--placement:left]': placement === 'left',
      '[--placement:right]': placement === 'right',
      '[--placement:top]': placement === 'top',
      '[--placement:bottom]': placement === 'bottom',
    }
  })
</script>

<template>
  <div class="tooltip" :class="placementClass">
    <slot name="toggle"></slot>
    <span v-if="!disabled" class="tooltip-content tooltip-shown:opacity-100 tooltip-shown:visible z-50" role="tooltip">
      <span class="tooltip-body tooltip-secondary rounded">
        <slot></slot>
      </span>
    </span>
  </div>
</template>

<style scoped></style>