import api from './axiosInstance'

export const getAllLogs = async () => {
  const response = await api.get('/logs')
  return response.data
}