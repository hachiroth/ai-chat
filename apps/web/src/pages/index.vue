<script setup lang="ts">
  import api from '@/api'
  import ChatInput from '@/components/ChatInput.vue'
import { useConversationStore } from '@/stores'
  import { useRouter } from 'vue-router'

  const conversationStore = useConversationStore()
  const router = useRouter()

  async function onSend(userInput: string) {
    try {
      const conversation = await api.conversations.create()
      await api.contexts.create(userInput, conversation._id)
      router.push({ name: '/[id]', params: { id: conversation._id } })
      conversationStore.addConversation({...conversation})
    } catch (err) {
      console.error(err)
    }
  }
</script>

<template>
  <div class="size-full flex flex-col gap-8 justify-center items-center">
    <div class="text-2xl text-center">有什么可以帮忙的?</div>
    <ChatInput @send="onSend" style="view-transition-name: chat-input;" />
  </div>
</template>

<style scoped></style>