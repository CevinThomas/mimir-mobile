import axiosInstance from './AxiosConfig'

export const getAccountInfo = async () => {
  const response = await axiosInstance.get('/accounts')
  return response.data
}
