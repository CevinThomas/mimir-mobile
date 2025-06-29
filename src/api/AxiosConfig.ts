import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
const production_url = 'https://backend-976522134397.europe-west1.run.app'
const development_url = 'http://192.168.1.185:3001'

const axiosInstance = axios.create({
  baseURL: production_url,
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
