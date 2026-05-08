import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' })

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) useAuthStore.getState().logout()
    return Promise.reject(err)
  }
)

export const login = (data) => api.post('/api/auth/login', data)
export const sendOTP = (identifier) => api.post(`/api/auth/send-otp?identifier=${identifier}`)
export const verifyOTP = (identifier, otp) => api.post(`/api/auth/verify-otp?identifier=${identifier}&otp=${otp}`)
export default api
