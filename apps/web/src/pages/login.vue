<route lang="yaml">
meta:
  layout: LoginLayout
</route>
<script setup lang="ts">
import api from '@/api'
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from "vue-toastification";

const userStore = useUserStore()
const router = useRouter()
const toast = useToast()

const username = ref('')
const password = ref('')

async function onLogin() {
  const resp = await userStore.login(username.value, password.value)
  if(resp.message) {
    toast.error(resp.message)
  }else {
    router.replace('/')
  }
}

async function onRegister() {
  const resp = await api.auth.register(username.value, password.value)
  if(resp.message) {
    toast.error(resp.message)
  }
}
</script>

<template>
  <div class="login-page abs-c w-full max-w-sm bg-base-200 p-8 rounded">
    <form @submit.prevent="" class="space-y-4">
      <div class="text-2xl text-center font-bold">
        登录到AI-Chat
      </div>
      <div class="space-y-4">
        <input type="text" placeholder="用户名" class="input no-focus border-0" v-model="username">
        <input type="password" placeholder="密码" class="input no-focus border-0" v-model="password">
      </div>
      <div class="text-sm flex justify-between items-center">
        <div class="flex items-center gap-1">
          <input type="checkbox" class="checkbox checkbox-xs checkbox-primary" id="remember" checked/>
          <label class="label-text text-sm text-base-content/80 select-none" for="remember">
            记住我
          </label>
        </div>
        <span class="link link-hover underline-offset-4">忘记密码</span>
      </div>
      <div class="w-full flex items-center gap-2">
        <button type="button" class="btn btn-primary grow" @click="onLogin">
          登录
        </button>
        <button type="button" class="btn w-24" @click="onRegister">
          注册
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>