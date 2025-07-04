import api from './axiosInstance'

export const getMyProfile = async () => {
    const response = await api.get('/users/profile')
    return response.data
}

export const updateMyProfile = async (data) => {
    const response = await api.put('/users/profile', data)
    return response.data
}

export const getMyVisits = async () => {
    const response = await api.get('/visits/me')
    return response.data
}

export const getAllUsers = async () => {
  const response = await api.get('/users')
  return response.data
}