<script setup lang="ts">
import type { ContextRole } from '@ai-chat/typed'
import { computed } from 'vue'

const {role = 'user'} = defineProps<{
  role?: ContextRole
}>()
const roleClass = computed(() => role === 'user' ? 'chat-sender' : 'chat-receiver')
</script>

<template>
  <div class="chat" :class="[roleClass]">
    <div class="chat-bubble tracking-wider" :class="{'text-left!': role === 'user', 'w-full!': role === 'assistant'}">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>