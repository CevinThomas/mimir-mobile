import axiosInstance from './AxiosConfig'

export const getFolders = async () => {
  const response = await axiosInstance.get('/folders')
  return response.data
}
