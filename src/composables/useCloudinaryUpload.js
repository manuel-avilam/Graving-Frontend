export function useCloudinaryUpload() {
  const cloudName = 'dsesbuouz'
  const uploadPreset = 'Graving'

  const uploadFile = async (file, folder = 'general') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', folder)

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error al subir archivo a Cloudinary')
    }

    return {
      url: data.secure_url,
      deleteToken: data.delete_token
    }
  }

  const deleteFile = async (deleteToken) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ token: deleteToken }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error al eliminar archivo de Cloudinary')
    }

    return data
  }

  return { uploadFile, deleteFile }
}