import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/api'

export const useUserStore = defineStore('user', () => {
  const uid = ref<string | null>(null)
  const isLoggedIn = computed(() => !!uid.value)

  const login = async (username: string, password: string) => {
    const resp = await api.auth.login(username, password)
    uid.value = resp?._id
    return resp
  }

  const logout = async () => {
    await api.auth.logout()
    uid.value = null
  }

  const me = async () => {
    const resp = await api.users.me()
    if (resp._id) {
      uid.value = resp._id
    }
    else {
      uid.value = null
    }
    return resp
  }

  return {
    uid,
    isLoggedIn,
    login,
    logout,
    me,
  }
})
