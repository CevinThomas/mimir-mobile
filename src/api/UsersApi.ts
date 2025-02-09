import axiosInstance from './AxiosConfig'

export const getUsers = async () => {
  const response = await axiosInstance.get('/users/for_current_account')
  return response.data
}
