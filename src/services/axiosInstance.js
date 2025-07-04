import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }

    return Promise.reject(error)
  }
)

export default api;