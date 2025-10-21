<template>
  <div class="home-page">
    <!-- Header/Navigation Bar -->
    <div class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1>Home</h1>
            <div class="logo-icon-small">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6H2V4C2 2.89 2.89 2 4 2H6V4H4V6M20 2H22V4H20V6H22V8H20V10H18V8H16V6H18V4H16V2H18V0H20V2M4 20H2V22C2 23.11 2.89 24 4 24H6V22H4V20M22 22V20H20V18H22V16H20V14H18V16H16V18H18V20H16V22H18V24H20V22H22Z"/>
              </svg>
            </div>
          </div>
          <div class="nav-links">
            <router-link to="/mis-cursos" class="nav-link">Mis cursos</router-link>
            <router-link to="/chat" class="nav-link">Chats</router-link>
            <router-link to="/explorar" class="nav-link">Explorar</router-link>
            <div class="user-icon" @click="handleProfile">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="container">
        <h2 class="search-title">Buscar Cursos</h2>
        <div class="search-container">
          <input
            type="text"
            class="search-input"
            placeholder="Guitarra"
            v-model="searchQuery"
            @input="handleSearch"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-search">×</button>
        </div>
        
        <div class="filter-tags">
          <button
            v-for="categoria in categorias"
            :key="categoria._id"
            :class="['filter-tag', { active: selectedCategory === categoria.nombre }]"
            @click="filterByCategory(categoria.nombre)"
          >
            {{ categoria.nombre }}
          </button>
          <button
            :class="['filter-tag', { active: selectedCategory === 'todas' }]"
            @click="filterByCategory('todas')"
          >
            Todas
          </button>
        </div>
      </div>
    </div>

    <!-- Courses Section -->
    <div class="courses-section">
      <div class="container">
        <h2 class="section-title">Explora Cursos</h2>
        
        <div v-if="loading" class="loading">
          Cargando cursos...
        </div>

        <div v-else-if="cursos.length === 0" class="no-courses">
          No se encontraron cursos
        </div>

        <div v-else class="courses-grid">
          <div
            v-for="curso in cursos"
            :key="curso._id"
            class="course-card"
            @click="viewCourse(curso)"
          >
            <div class="course-image">
              <template v-if="coverUrl(curso)">
                <img
                  :src="coverUrl(curso)"
                  :alt="`Portada curso: ${curso.nombre}`"
                  loading="lazy"
                  @error="onImageError"
                />
              </template>
              <template v-else>
                <span>Sin imagen</span>
              </template>
            </div>
            <div class="course-content">
              <h3 class="course-title">{{ curso.nombre }}</h3>
              <span class="course-tag">{{ curso.modalidad }}</span>
              <p class="course-description">{{ curso.descripcion }}</p>
              <div class="course-price">
                <strong>Bs{{ curso.precio_reserva }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="pagination">
          <button
            @click="changePage(pagination.currentPage - 1)"
            :disabled="!pagination.hasPrev"
            class="pagination-btn"
          >
            ← Anterior
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            :class="['pagination-btn', { active: page === pagination.currentPage }]"
            @click="typeof page === 'number' && changePage(page)"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>
          
          <button
            @click="changePage(pagination.currentPage + 1)"
            :disabled="!pagination.hasNext"
            class="pagination-btn"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="footer-logo">
              <div class="logo-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 6H2V4C2 2.89 2.89 2 4 2H6V4H4V6M20 2H22V4H20V6H22V8H20V10H18V8H16V6H18V4H16V2H18V0H20V2M4 20H2V22C2 23.11 2.89 24 4 24H6V22H4V20M22 22V20H20V18H22V16H20V14H18V16H16V18H18V20H16V22H18V24H20V22H22Z"/>
                </svg>
              </div>
            </div>
            <div class="social-icons">
              <div class="social-icon">X</div>
              <div class="social-icon">IG</div>
              <div class="social-icon">YT</div>
              <div class="social-icon">LI</div>
            </div>
          </div>
          
          <div class="footer-section">
            <h3 class="footer-title">Use cases</h3>
            <ul class="footer-links">
              <li><a href="#">UI design</a></li>
              <li><a href="#">UX design</a></li>
              <li><a href="#">Wireframing</a></li>
              <li><a href="#">Diagramming</a></li>
              <li><a href="#">Brainstorming</a></li>
              <li><a href="#">Online whiteboard</a></li>
              <li><a href="#">Team collaboration</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3 class="footer-title">Explore</h3>
            <ul class="footer-links">
              <li><a href="#">Design</a></li>
              <li><a href="#">Prototyping</a></li>
              <li><a href="#">Development features</a></li>
              <li><a href="#">Design systems</a></li>
              <li><a href="#">Collaboration features</a></li>
              <li><a href="#">Design process</a></li>
              <li><a href="#">FigJam</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3 class="footer-title">Resources</h3>
            <ul class="footer-links">
              <li><a href="#">Blog</a></li>
              <li><a href="#">Best practices</a></li>
              <li><a href="#">Colors</a></li>
              <li><a href="#">Color wheel</a></li>
              <li><a href="#">Support</a></li>
              <li><a href="#">Developers</a></li>
              <li><a href="#">Resource library</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cursosAPI } from '../api/cursos'
import { categoriasAPI } from '../api/categorias'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const cursos = ref([])
    const categorias = ref([])
    const loading = ref(true)
    const searchQuery = ref('')
    const selectedCategory = ref('todas')
    const currentPage = ref(1)
    const pagination = ref({
      currentPage: 1,
      totalPages: 1,
      totalCursos: 0,
      hasNext: false,
      hasPrev: false
    })

    // Origen del backend (para normalizar URLs relativas)
    const BACKEND_ORIGIN =
      (import.meta.env.VITE_BACKEND_ORIGIN) ||
      ((import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '')) ||
      'http://localhost:3000';

    const absolutize = (u) => {
      if (!u) return ''
      if (/^https?:\/\//i.test(u)) return u
      if (u.startsWith('/')) return `${BACKEND_ORIGIN}${u}`
      return `${BACKEND_ORIGIN}/${u.replace(/^\/+/, '')}`
    }

    const coverUrl = (curso) => {
      const u = curso?.portada_url || (Array.isArray(curso?.galeria_urls) && curso.galeria_urls[0]) || ''
      return absolutize(u)
    }

    const onImageError = (e) => {
      // ver en consola qué URL está fallando
      console.warn('Fallo al cargar imagen:', e.target?.src)
      e.target.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
          <rect width="100%" height="100%" fill="#ecf0f1"/>
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#7f8c8d" font-family="Arial" font-size="20">
            Imagen no disponible
          </text>
        </svg>`
      )
    }

    // Obtener cursos
    const fetchCursos = async () => {
      try {
        loading.value = true
        const params = {
          page: currentPage.value,
          limit: 6
        }

        if (selectedCategory.value !== 'todas') {
          params.categoria = selectedCategory.value
        }

        if (searchQuery.value.trim()) {
          params.search = searchQuery.value.trim()
        }

        const response = await cursosAPI.getCursos(params)

        if (response.data.success) {
          cursos.value = response.data.cursos
          pagination.value = response.data.pagination
        }
      } catch (error) {
        console.error('Error obteniendo cursos:', error)
        alert('Error al cargar los cursos')
      } finally {
        loading.value = false
      }
    }

    // Obtener categorías
    const fetchCategorias = async () => {
      try {
        const response = await categoriasAPI.getCategorias()
        if (response.data.success) {
          categorias.value = response.data.categorias
        }
      } catch (error) {
        console.error('Error obteniendo categorias:', error)
      }
    }

    // Filtrar por categoría
    const filterByCategory = (categoria) => {
      selectedCategory.value = categoria
      currentPage.value = 1
      fetchCursos()
    }

    // Buscar cursos
    const handleSearch = () => {
      currentPage.value = 1
      fetchCursos()
    }

    // Limpiar búsqueda
    const clearSearch = () => {
      searchQuery.value = ''
      fetchCursos()
    }

    // Cambiar página
    const changePage = (page) => {
      if (page >= 1 && page <= pagination.value.totalPages) {
        currentPage.value = page
        fetchCursos()
      }
    }

    // Ver curso
    const viewCourse = (curso) => {
      router.push(`/curso/${curso._id}`)
    }

    // Manejar perfil
    const handleProfile = () => {
      router.push('/perfil')
    }

    // Cerrar sesión
    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    // Páginas visibles en paginación
    const visiblePages = computed(() => {
      const pages = []
      const current = pagination.value.currentPage
      const total = pagination.value.totalPages

      if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) pages.push(i)
          pages.push('...')
          pages.push(total)
        } else if (current >= total - 3) {
          pages.push(1)
          pages.push('...')
          for (let i = total - 4; i <= total; i++) pages.push(i)
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) pages.push(i)
          pages.push('...')
          pages.push(total)
        }
      }

      return pages
    })

    onMounted(() => {
      fetchCursos()
      fetchCategorias()
    })

    return {
      cursos,
      categorias,
      loading,
      searchQuery,
      selectedCategory,
      pagination,
      filterByCategory,
      handleSearch,
      clearSearch,
      changePage,
      viewCourse,
      handleProfile,
      handleLogout,
      visiblePages,
      coverUrl,
      onImageError
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #ffffff;
}

.header {
  background-color: #2c3e50;
  color: white;
  padding: 15px 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left h1 {
  font-size: 18px;
  margin: 0;
}

.logo-icon-small {
  width: 30px;
  height: 30px;
  background-color: #ecf0f1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon-small svg {
  width: 20px;
  height: 20px;
  color: #2c3e50;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 16px;
}

.nav-link:hover {
  text-decoration: underline;
}

.logout-btn {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.logout-btn:hover {
  background-color: white;
  color: #2c3e50;
}

.user-icon {
  width: 35px;
  height: 35px;
  background-color: #ecf0f1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.user-icon svg {
  width: 20px;
  height: 20px;
  color: #2c3e50;
}

.search-section {
  text-align: center;
  padding: 40px 0;
  background-color: #f8f9fa;
}

.search-title {
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
}

.search-container {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  padding-right: 40px;
}

.clear-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.filter-tags {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-tag {
  padding: 8px 16px;
  background-color: #ecf0f1;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  color: #2c3e50;
}

.filter-tag.active {
  background-color: #27ae60;
  color: white;
}

.filter-tag:hover {
  background-color: #bdc3c7;
}

.courses-section {
  padding: 40px 0;
}

.section-title {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.loading, .no-courses {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-size: 18px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.course-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  cursor: pointer;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-image {
  width: 100%;
  height: 200px;
  background-color: #ecf0f1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  overflow: hidden;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.course-content {
  padding: 20px;
}

.course-title {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
}

.course-tag {
  color: #27ae60;
  font-size: 14px;
  margin-bottom: 15px;
  display: inline-block;
}

.course-description {
  color: #7f8c8d;
  line-height: 1.5;
  margin-bottom: 15px;
}

.course-price {
  color: #2c3e50;
  font-size: 16px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
}

.pagination-btn {
  padding: 8px 12px;
  background-color: #ecf0f1;
  color: #2c3e50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #36759e;
  color: white;
}

.pagination-btn.active {
  background-color: #36759e;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.footer {
  background-color: #2c3e50;
  color: white;
  padding: 40px 0;
  margin-top: 60px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 40px;
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.footer-logo {
  margin-bottom: 20px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background-color: #ecf0f1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon svg {
  width: 25px;
  height: 25px;
  color: #2c3e50;
}

.social-icons {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.social-icon {
  width: 30px;
  height: 30px;
  background-color: #34495e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 12px;
}

.social-icon:hover {
  background-color: #36759e;
}

.footer-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: white;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
  }
}
</style>
