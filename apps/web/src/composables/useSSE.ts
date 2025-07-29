// composables/useSSE.ts
import { ref } from 'vue'

export function useSSE() {
  const data = ref<string | null>(null)
  const error = ref<Error | null>(null)
  const isConnected = ref(false)
  let eventSource: EventSource | null = null

  const connect = (url: string) => {
    eventSource = new EventSource(url, {withCredentials: true})

    eventSource.onopen = () => {
      isConnected.value = true
    }

    eventSource.addEventListener('replying', (e) => {
      data.value = e.data
    })

    eventSource.onerror = (err: Event) => {
      console.error(err)
      error.value = new Error('SSE error')
      isConnected.value = false
      eventSource?.close()
    }
  }

  const close = () => {
    eventSource?.close()
    isConnected.value = false
  }

  return {
    data,
    error,
    isConnected,
    connect,
    close,
  }
}
