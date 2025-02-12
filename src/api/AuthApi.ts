import axiosInstance from './AxiosConfig'
import * as SecureStore from 'expo-secure-store'

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post('/users/sessions', { user: { email, password } })
  const token = response.headers['authorization']
  if (token) {
    await SecureStore.setItemAsync('jwt', token)
  }
  return response.data
}

export const userSignUp = async (email: string, password: string, name: string) => {
  const response = await axiosInstance.post('/users/registrations', {
    user: { email, password, name }
  })
  return response.data
}

export const userConfirmed = async (email: string) => {
  const response = await axiosInstance.get(`/users/verified`, { params: { email } })
  return response.data
}

export const logout = async () => {
  const response = await axiosInstance.delete('/users/sessions')
  return response.data
}

export const getDecks = async () => {
  const response = await axiosInstance.get('/decks')
  return response.data
}
