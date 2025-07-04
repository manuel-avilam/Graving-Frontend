import api from './axiosInstance'

export const getAllRepairs = async () => {
  const response = await api.get('/repairs')
  return response.data
}

export const createRepair = async (data) => {
  const response = await api.post('/repairs', data)
  return response.data
}

export const markRepairAsCompleted = async (id) => {
  const response = await api.patch(`/repairs/complete/${id}`)
  return response.data
}