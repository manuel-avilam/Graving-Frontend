import api from './axiosInstance'

export const getAllGraves = async () => {
  const response = await api.get('/graves')
  return response.data
}

export const updateGrave = async (id, data) => {
  const response = await api.put(`/graves/${id}`, data)
  return response.data
}