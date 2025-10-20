import api from './config'

export const authAPI = {
  // Login
  login: (email, password) => {
    return api.post('/auth/login', { email, password })
  },

  // Registro
  register: (userData) => {
    return api.post('/auth/register', userData)
  },

  // Obtener perfil
  getProfile: () => {
    return api.get('/auth/profile')
  }
}
