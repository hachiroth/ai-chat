import type { IConversation } from '@ai-chat/typed'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConversationStore = defineStore('conversation', () => {
  const conversations = ref<IConversation[]>([])

  const addConversation = (...items: IConversation[]) => {
    conversations.value.unshift(...items)
  }

  return {
    conversations,
    addConversation,
  }
})
