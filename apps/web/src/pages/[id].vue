<script setup lang="ts">
import { computed, nextTick, onActivated, onDeactivated, onMounted, ref, useTemplateRef, watch } from 'vue'
import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async'
import { codeToHtml } from 'shiki'
import MarkdownItAsync from 'markdown-it-async'
import api from '@/api'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router'
import ChatInput from '@/components/ChatInput.vue'
import ChatBubble from '@/components/ChatBubble.vue'
import { useSSE } from '@/composables/useSSE'
import type { IContext } from '@ai-chat/typed'

type IEnhancedContext = Omit<IContext, 'conversationId' | 'updatedAt' | 'uid'> & {
  rawText?: string
  renderedHtml?: string
}

const { connect, data } = useSSE()
const route = useRoute()
const id = computed(() => (route.params as any).id)
const chattingList = ref<IEnhancedContext[]>([])
const input = ref('')
const anchor = useTemplateRef<HTMLDivElement>('anchor')

const md = MarkdownItAsync()
md.use(fromAsyncCodeToHtml(codeToHtml, {
  themes: {
    light: 'github-light',
    dark: 'github-dark',
  },
}))

function scrollToBottom(behavior: ScrollBehavior = 'auto') {
  nextTick(() => {
    anchor.value?.scrollIntoView({behavior})
  })
}

async function onSend(content: string) {
  const resp = await api.contexts.create(content, id.value)
  const contextId = resp._id

  chattingList.value.push({
    _id: contextId,
    role: 'user',
    content,
    createdAt: new Date().toISOString(),
  })

  setTimeout(() => {
    connect(`http://localhost:3000/api/chat/${id.value}/${contextId}`);
    scrollToBottom('smooth');
  }, 100);
}

function fixUnclosedCodeBlocks(text: string): string {
  const matches = text.match(/```/g)
  const openCount = matches ? matches.length : 0
  return openCount % 2 === 1 ? text + '\n```' : text
}

function isCodeBlockClosed(text: string): boolean {
  const count = (text.match(/```/g) || []).length
  return count % 2 === 0
}

// Recover chatting history.
onMounted(async () => {
  const history = await api.conversations.resume(id.value)
  chattingList.value = history.map(item => ({
    ...item,
    rawText: item.role === 'assistant' ? item.content : undefined,
    renderedHtml: item.role === 'assistant' ? '' : undefined,
  }))

  if (chattingList.value.length === 1) {
    const last = chattingList.value[0]
    if (last.role === 'user') {
      connect(`http://localhost:3000/api/chat/${id.value}/${last._id}`)
    }
  }
  
  // Render assistant's markdown in history.
  for (const item of chattingList.value) {
    if (item.role === 'assistant' && item.rawText) {
      item.renderedHtml = await md.renderAsync(item.rawText)
    }
  }

  scrollToBottom()
})

onActivated(() => {
  scrollToBottom()
})

watch(data, async (chunk) => {
  console.log(chunk)
  let last = chattingList.value[chattingList.value.length - 1]

  // Insert one if there no assistant or the last one is not assistant.
  if (!last || last.role !== 'assistant' || !last._id.startsWith('streaming-')) {
    const streamingContext: IEnhancedContext = {
      _id: `streaming-${Date.now()}`,
      role: 'assistant',
      content: '',
      rawText: '',
      renderedHtml: '',
      createdAt: new Date().toISOString(),
    }
    chattingList.value.push(streamingContext)
    last = streamingContext
  }
  
  last.rawText! += chunk
  // last.renderedHtml = await md.renderAsync(fixUnclosedCodeBlocks(last.rawText!))

  if (isCodeBlockClosed(last.rawText!)) {
    try {
      last.renderedHtml = await md.renderAsync(last.rawText!)
    } catch (err) {
      console.warn(err)
    }
  } else {
    last.renderedHtml = last.rawText!.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  scrollToBottom('smooth')
})
</script>

<template>
  <div class="size-full flex flex-col">
    <div class="chatting-list grow w-full max-w-3xl mx-auto px-4 py-2">
      <div v-for="item in chattingList" :key="item._id" class="mb-4">
        <ChatBubble v-if="item.role === 'user'">
          {{ item.content }}
        </ChatBubble>

        <ChatBubble v-else role="assistant">
          <div v-html="item.renderedHtml" class="assistant-reply"></div>
        </ChatBubble>
      </div>
      <div ref="anchor" />
    </div>

    <div class="w-full h-fit sticky bottom-0 pb-4 bg-base-100">
      <ChatInput
        v-model="input"
        class="max-w-3xl! mx-auto"
        style="view-transition-name: chat-input;"
        @send="onSend"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
