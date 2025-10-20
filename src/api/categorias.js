import api from './config'

export const categoriasAPI = {
  // Obtener todas las categorías
  getCategorias: () => {
    return api.get('/categorias')
  },

  // Obtener una categoría específica
  getCategoria: (id) => {
    return api.get(`/categorias/${id}`)
  }
}
