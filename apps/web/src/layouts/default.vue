<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useConversationStore, useUserStore } from '@/stores'
  import api from '@/api'
  import type { IConversation } from '@ai-chat/typed'
  import { formatRelativeDate } from '@/utils'
  import Tooltip from '@/components/Tooltip.vue'

  const userStore = useUserStore()
  const conversationStore = useConversationStore()

  const isChecking = ref(false)
  const asideMens = [
    { label: '新对话', icon: 'icon-[mingcute--edit-line]', path: '/' },
    { label: '搜索对话', icon: 'icon-[mingcute--list-search-line]' },
  ]
  const isCollapse = ref(true)
  const conversationHistory = ref<IConversation[]>( conversationStore.conversations)

  function toggleCollapse() {
    isCollapse.value = !isCollapse.value
  }

  onMounted(async () => {
    isChecking.value = true
    const resp = await userStore.me()
    isChecking.value = false
    if (resp && resp._id) {
     conversationHistory.value = await api.users.conversations(resp._id)
     conversationStore.conversations = conversationHistory.value
    }
  })
</script>

<template>
  <aside class="sticky top-0 h-screen bg-base-200 flex flex-col justify-between transition-all duration-300"
    :class="[isCollapse ? 'w-[74px] min-w-[74px]' : 'w-72 min-w-72']">
    <div class="flex flex-col py-3 px-4">
      <label class="btn btn-circle btn-text swap swap-rotate mb-8" @change="toggleCollapse">
        <input type="checkbox" :checked="!isCollapse" />
        <span class="icon-[mingcute--menu-line] swap-off size-6"></span>
        <span class="icon-[mingcute--close-line] swap-on size-6 scale-70"></span>
      </label>
      <div v-for="item in asideMens" :key="item.icon" class="flex items-center overflow-hidden cursor-default"
        :class="{ 'hover:bg-neutral/10 transition-colors duration-300 rounded cursor-pointer': !isCollapse }"
        @click="$router.push(item.path || '')">
        <Tooltip placement="left" :disabled="!isCollapse">
          <template #toggle>
            <button class="btn btn-circle btn-text opacity-100!" :disabled="!isCollapse">
              <span :class="['size-6', item.icon]"></span>
            </button>
          </template>
          {{ item.label }}
        </Tooltip>
        <span class="whitespace-nowrap transition-opacity duration-300 font-bold opacity-80"
          :class="{ 'opacity-0!': isCollapse }">
          {{ item.label }}
        </span>
      </div>
    </div>
    <ul v-if="userStore.isLoggedIn" class="menu flex-nowrap grow scroll-area overflow-x-hidden mr-1 whitespace-nowrap transition-opacity duration-300"
      :class="{ 'opacity-0': isCollapse }">
      <li class="menu-title font-bold opacity-80">历史对话</li>
      <li v-for="item in conversationHistory" :key="item._id">
        <RouterLink :to="{ name: '/[id]', params: { id: item._id } }"
          class="flex flex-col  gap-0 items-start font-bold whitespace-nowrap rounded"
          :class="{ 'menu-active': item._id === ($route.params as any)?.id }">
          <span class="text-xs opacity-80">
            {{ formatRelativeDate(item.createdAt) }}
          </span>
          <span class="grow text-sm">{{ item.title || '新对话' }}</span>
        </RouterLink>
      </li>
    </ul>
    <RouterLink v-if="userStore.isLoggedIn" to="/"
      class="aside-footer p-2 mb-6 mx-3 flex items-center rounded transition-all duration-300"
      :class="[isCollapse ? 'hover:[&_.avatar]:scale-125' : 'hover:bg-neutral/10']">
      <div class="avatar avatar-placeholder transition-all duration-300">
        <div class="bg-primary text-primary-content w-8 rounded-full">
          <span>H</span>
        </div>
      </div>
      <div class="whitespace-nowrap transition-opacity duration-300 ml-4" :class="{ 'opacity-0': isCollapse }">
        Ethan Cruz
      </div>
    </RouterLink>
  </aside>
  <main class="grow flex flex-col">
    <div class="p-4 flex gap-1 justify-between items-center font-bold sticky top-0 z-50 bg-base-100">
      <div id="logo" class="tracking-widest text-lg">
        IFLYTEK
      </div>
      <div v-if="!userStore.isLoggedIn" class="text-sm flex gap-2 items-center">
        您正在使用
        <Tooltip placement="bottom">
          <template #toggle>
            <span class="text-bg-primary p-1 rounded cursor-default">匿名对话</span>
          </template>
          在匿名模式下，我们无法追溯您的对话记录，并且所有匿名对话仅存留24小时。
        </Tooltip>
        <router-link to="/login" class="hover:text-bg-primary p-1 rounded transition-all duration-300">
          登录
        </router-link>
      </div>
    </div>
    <div v-if="!isChecking" class="pt-4 px-8 grow">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" :key="$route.fullPath" />
        </KeepAlive>
      </RouterView>
    </div>
  </main>
</template>

<style scoped></style>