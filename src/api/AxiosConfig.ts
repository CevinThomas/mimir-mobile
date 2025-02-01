import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' }
})

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('jwt')
    if (token) {
      config.headers['Authorization'] = `${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
