import api from './config'

export const cursosAPI = {
  // Obtener todos los cursos
  getCursos: (params = {}) => {
    return api.get('/cursos', { params })
  },

  // Obtener un curso específico
  getCurso: (id) => {
    return api.get(`/cursos/${id}`)
  },

  // Crear curso (solo tutores)
  createCurso: (cursoData) => {
    return api.post('/cursos', cursoData)
  },

  // Actualizar curso
  updateCurso: (id, cursoData) => {
    return api.put(`/cursos/${id}`, cursoData)
  },

  // Eliminar curso
  deleteCurso: (id) => {
    return api.delete(`/cursos/${id}`)
  }
}
