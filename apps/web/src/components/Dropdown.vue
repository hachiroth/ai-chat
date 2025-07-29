<script setup lang="ts">

const {id} = defineProps<{
  id: string
}>()
</script>

<template>
  <div class="dropdown relative inline-flex">
    <slot name="toggle"></slot> 
    <ul class="dropdown-menu dropdown-open:opacity-100 hidden z-100 rounded" role="menu" aria-orientation="vertical"
      :aria-labelledby="id">
      <slot name="menu"></slot>
    </ul>
  </div>
</template>

<style scoped></style>