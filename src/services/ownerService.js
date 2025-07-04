import api from './axiosInstance'

export const getAllOwners = async () => {
    const response = await api.get('/owners')
    return response.data
}

export const getOwnerByDeceasedId = async (id) => {
  const response = await api.get(`/owners/deceased/${id}`)
  return response.data
}

export const createOwner = async (data) => {
  const response = await api.post('/owners', data)
  return response.data
}

export const updateOwner = async (id, ownerData) => {
  const response = await api.put(`/owners/${id}`, ownerData)
  return response.data
}