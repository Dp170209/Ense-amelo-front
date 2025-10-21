// src/api/uploads.js
import api from './config'; // debe ser tu Axios preconfigurado con baseURL '/api' y Authorization

/**
 * Sube una imagen al backend y devuelve { success, url, filename }.
 * Acepta File/Blob.
 */
async function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)

  // Nota: 'api' ya debería tener el token via interceptor o header por defecto.
  // Si no lo tienes, puedes pasar headers aquí:
  // const token = localStorage.getItem('token')
  // const headers = { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }

  const res = await api.post('/uploads/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res
}

const uploadsAPI = { uploadImage }

// Export nombrado y default para evitar errores de import
export { uploadsAPI }
export default uploadsAPI
