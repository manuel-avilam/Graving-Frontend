import api from './axiosInstance'

export const getAllVisits = async () => {
  const response = await api.get('/visits')
  return response.data
}

export const getMyVisits = async () => {
  const response = await api.get('/visits/me')
  return response.data
}

export const createVisit = async (data) => {
  const response = await api.post('/visits', data)
  return response.data
}

export const createVisitAsAdmin = async (data) => {
  const response = await api.post('/visits/admin', data)
  return response.data
}