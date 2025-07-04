import { defineStore } from 'pinia'
import { getMyProfile } from '@/services/userService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null
  }),
  getters: {
    isLoggedIn: (state) => !!state.user && !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },
  actions: {
    async hasAdminRole() {
      try {
        const data = await getMyProfile()
        return data.role === 'admin'
      } catch (err) {
        return false
      }
    },
    setAuth(token, user) {
      this.token = token
      this.user = user
      localStorage.setItem('token', token)
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  },
  persist: {
    storage: localStorage,
    paths: ['token', 'user']
  }
})