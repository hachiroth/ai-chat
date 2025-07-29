<script setup lang="ts">
  import { ref, onMounted, useTemplateRef, computed } from 'vue'

  const emit = defineEmits<{
    (e: 'send', userInput: string): string
  }>()
  const input = ref('')
  const isInputValid = computed(() => input.value.trim() !== '')
  const textarea = useTemplateRef<HTMLDivElement>('textarea')

  function onInput(e: Event) {
    const target = e.target as HTMLDivElement
    input.value = target.innerText
  }

  function send(e: Event | KeyboardEvent) {
    e.preventDefault()
    emit('send', input.value)
    input.value = ''
    if (textarea.value) {
      textarea.value.innerText = ''
    }
  }

  function handlePaste(e: ClipboardEvent) {
    e.preventDefault()
    const text = e.clipboardData?.getData('text/plain') || ''
    document.execCommand('insertText', false, text)
  }

  onMounted(() => {
    if (textarea.value) {
      textarea.value.innerText = input.value
      textarea.value.addEventListener('paste', handlePaste)
    }
  })
</script>

<template>
  <div class="chat-input w-full max-w-lg bg-base-200 p-4 rounded relative" @keydown.enter="send">
    <div id="textarea" ref="textarea" contenteditable="true"
      class="focus-visible:outline-0 max-h-28 scroll-area pr-[1px]" @input="onInput">
    </div>
    <div id="placeholder" class="absolute top-4 opacity-50 pointer-events-none" :class="{ 'hidden': isInputValid }">
      描述你的问题
    </div>
    <div id="toolbar" class="flex justify-between items-center mt-4">
      <div class="flex items-center">
        <button class="btn btn-text btn-circle shadow-none">
          <span class="icon-[mingcute--file-upload-line] size-6"></span>
        </button>
        <button class="btn btn-text btn-circle shadow-none">
          <span class="icon-[mingcute--settings-6-line] size-6"></span>
        </button>
      </div>
      <button class="btn btn-circle shadow-none" :class="{ 'btn-primary': isInputValid }" @click="send"
        :disabled="!isInputValid">
        <span class="icon-[mingcute--arrow-up-line] size-6"></span>
      </button>
    </div>
  </div>
</template>

<style scoped></style>