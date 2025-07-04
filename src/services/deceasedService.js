import api from './axiosInstance'
import { useCloudinaryUpload } from '@/composables/useCloudinaryUpload'

const { uploadFile, deleteFile } = useCloudinaryUpload()

export const getAllDeceased = async () => {
  const response = await api.get('/deceased')
  return response.data
}

export const getDeceasedById = async (id) => {
  const response = await api.get(`/deceased/${id}`)
  return response.data
}

export const getInactiveDeceased = async () => {
  const response = await api.get('/deceased/inactive')
  return response.data
}

export const registerDeceased = async (data, imageFile, certificateFile) => {
  let imageResult = null
  let certificateResult = null

  try {
    if (imageFile) {
      imageResult = await uploadFile(imageFile, 'deceased')
    }

    if (certificateFile) {
      certificateResult = await uploadFile(certificateFile, 'death_certificates')
    }

    const response = await api.post('/deceased', {
      ...data,
      imageUrl: imageResult?.url || null,
      imageDeleteToken: imageResult?.deleteToken || null,
      deathCertificateUrl: certificateResult?.url || null,
      deathCertificateDeleteToken: certificateResult?.deleteToken || null
    })

    return response.data

  } catch (error) {
    if (imageResult?.deleteToken) await deleteFile(imageResult.deleteToken)
    if (certificateResult?.deleteToken) await deleteFile(certificateResult.deleteToken)
    throw error
  }
}

export const updateDeceased = async (id, data, imageFile, previousDeleteToken) => {
  let imageResult = null

  try {
    if (imageFile) {
      imageResult = await uploadFile(imageFile, 'deceased')
    }

    const response = await api.put(`/deceased/${id}`, {
      ...data,
      imageUrl: imageResult?.url || data.imageUrl,
      imageDeleteToken: imageResult?.deleteToken || data.imageDeleteToken
    })

    if (imageResult?.deleteToken && previousDeleteToken) {
      await deleteFile(previousDeleteToken)
    }

    return response.data

  } catch (error) {
    if (imageResult?.deleteToken) {
      await deleteFile(imageResult.deleteToken)
    }
    throw error
  }
}

export const deleteDeceased = async (id) => {
  const deceased = await getDeceasedById(id)

  await api.delete(`/deceased/${id}`)

  return {
    message: 'Difunto olvidado correctamente',
    name: deceased.name
  }
}
