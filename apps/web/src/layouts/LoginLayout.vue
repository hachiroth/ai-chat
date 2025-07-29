<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function back() {
  router.back()
}
</script>

<template>
  <div class="size-full min-h-screen flex flex-col">
    <header class="p-4 flex gap-1 justify-between items-center font-bold sticky top-0 z-50 bg-base-100">
      <div id="logo" class="tracking-widest text-lg">
        IFLYTEK
      </div>
      <div class="link link-animated font-bold! text-xs" @click="back">
        继续使用匿名对话
      </div>
    </header>
    <main class="py-4 px-8 grow relative mx-4">
      <RouterView></RouterView>
    </main>
  </div>
</template>

<style scoped></style>