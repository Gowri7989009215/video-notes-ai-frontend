import axios, { AxiosError } from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  withCredentials: false,
  timeout: 30000
})

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Surface a friendly message if backend sends one
    if (error.response && error.response.data && typeof error.response.data === 'object') {
      const anyData = error.response.data as any
      if (anyData.message) {
        return Promise.reject(new Error(anyData.message))
      }
    }
    return Promise.reject(error)
  }
)

export const api = {
  client: instance,
  setToken: (token: string | null) => {
    if (token) {
      instance.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
      delete instance.defaults.headers.common.Authorization
    }
  },
  get: instance.get,
  post: instance.post,
  put: instance.put,
  patch: instance.patch,
  delete: instance.delete
}

