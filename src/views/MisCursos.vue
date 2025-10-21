<template>
  <div class="mis-cursos-page">
    <!-- Header -->
    <div class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1>Mis Cursos</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Bar -->
    <div class="nav-bar">
      <div class="container">
        <div class="nav-content">
          <div class="nav-left">
            <div class="nav-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3H21V5H3V3M3 7H21V9H3V7M3 11H21V13H3V11M3 15H21V17H3V15M3 19H21V21H3V19Z"/>
              </svg>
            </div>
          </div>
          <div class="nav-right">
            <router-link to="/panel-tutor" class="nav-link">Panel</router-link>
            <router-link to="/mis-cursos" class="nav-link active">Cursos</router-link>
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

    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <div class="cursos-header">
          <h2>Mis Cursos Creados</h2>
          <button @click="createNewCourse" class="create-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
            </svg>
            Crear Nuevo Curso
          </button>
        </div>

        <div v-if="loading" class="loading">
          Cargando cursos...
        </div>

        <div v-else-if="cursos.length === 0" class="no-cursos">
          <div class="no-cursos-content">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z"/>
            </svg>
            <h3>No tienes cursos creados</h3>
            <p>Crea tu primer curso para comenzar a enseñar</p>
            <button @click="createNewCourse" class="create-first-btn">
              Crear Mi Primer Curso
            </button>
          </div>
        </div>

        <div v-else class="cursos-grid">
          <div v-for="curso in cursos" :key="curso._id" class="curso-card">
            <div class="curso-image">
              <span>Imagen del curso</span>
            </div>
            <div class="curso-content">
              <h3 class="curso-title">{{ curso.nombre }}</h3>
              <p class="curso-description">{{ curso.descripcion }}</p>
              <div class="curso-meta">
                <span class="curso-modalidad">{{ curso.modalidad }}</span>
                <span class="curso-precio">{{ curso.precio_reserva }} Bs/hora</span>
              </div>
              <div class="curso-actions">
                <button @click="editCurso(curso)" class="edit-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"/>
                  </svg>
                  Editar
                </button>
                <button @click="deleteCurso(curso)" class="delete-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z"/>
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { cursosAPI } from '../api/cursos'

export default {
  name: 'MisCursos',
  setup() {
    const router = useRouter()
    const cursos = ref([])
    const loading = ref(true)

    const fetchMisCursos = async () => {
      try {
        loading.value = true
        const response = await cursosAPI.getCursos({ limit: 100 })
        if (response.data.success) {
          // Filtrar solo los cursos del tutor actual
          const user = JSON.parse(localStorage.getItem('user') || '{}')
          cursos.value = response.data.cursos.filter(curso => 
            curso.id_tutor?.id_usuario?.toString() === user.id
          )
        }
      } catch (error) {
        console.error('Error obteniendo cursos:', error)
        alert('Error al cargar los cursos')
      } finally {
        loading.value = false
      }
    }

    const createNewCourse = () => {
      router.push('/config-curso')
    }

    const editCurso = (curso) => {
      // Por ahora redirigir a crear curso con datos precargados
      router.push('/config-curso')
    }

    const deleteCurso = async (curso) => {
      if (confirm(`¿Estás seguro de que quieres eliminar el curso "${curso.nombre}"?`)) {
        try {
          const response = await cursosAPI.deleteCurso(curso._id)
          if (response.data.success) {
            alert('Curso eliminado exitosamente')
            fetchMisCursos() // Recargar la lista
          } else {
            alert('Error al eliminar el curso: ' + response.data.message)
          }
        } catch (error) {
          console.error('Error eliminando curso:', error)
          alert('Error al eliminar el curso')
        }
      }
    }

    const handleProfile = () => {
      router.push('/perfil-tutor')
    }

    onMounted(() => {
      fetchMisCursos()
    })

    return {
      cursos,
      loading,
      createNewCourse,
      editCurso,
      deleteCurso,
      handleProfile
    }
  }
}
</script>

<style scoped>
.mis-cursos-page {
  min-height: 100vh;
  background-color: #ffffff;
}

.header {
  background-color: #7f8c8d;
  color: white;
  padding: 15px 0;
}

.header-content {
  display: flex;
  align-items: center;
}

.header-left h1 {
  font-size: 18px;
  margin: 0;
}

.nav-bar {
  background-color: #36759e;
  color: white;
  padding: 10px 0;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-icon {
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: opacity 0.3s;
}

.nav-link.active {
  font-weight: bold;
  text-decoration: underline;
}

.nav-link:hover {
  opacity: 0.8;
}

.user-icon {
  width: 35px;
  height: 35px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.user-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.main-content {
  padding: 40px 0;
  background-color: #f8f9fa;
}

.cursos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.cursos-header h2 {
  color: #2c3e50;
  margin: 0;
}

.create-btn {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s;
}

.create-btn:hover {
  background-color: #229954;
}

.create-btn svg {
  width: 16px;
  height: 16px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-size: 18px;
}

.no-cursos {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.no-cursos-content {
  text-align: center;
  padding: 40px;
}

.no-cursos-content svg {
  width: 80px;
  height: 80px;
  color: #bdc3c7;
  margin-bottom: 20px;
}

.no-cursos-content h3 {
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.no-cursos-content p {
  color: #7f8c8d;
  margin: 0 0 20px 0;
}

.create-first-btn {
  background-color: #36759e;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.create-first-btn:hover {
  background-color: #2c5aa0;
}

.cursos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.curso-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.curso-card:hover {
  transform: translateY(-5px);
}

.curso-image {
  width: 100%;
  height: 200px;
  background-color: #ecf0f1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
}

.curso-content {
  padding: 20px;
}

.curso-title {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.curso-description {
  color: #7f8c8d;
  line-height: 1.5;
  margin: 0 0 15px 0;
  font-size: 14px;
}

.curso-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.curso-modalidad {
  background-color: #27ae60;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.curso-precio {
  background-color: #f39c12;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.curso-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.3s;
}

.edit-btn {
  background-color: #3498db;
  color: white;
}

.edit-btn:hover {
  background-color: #2980b9;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.edit-btn svg, .delete-btn svg {
  width: 14px;
  height: 14px;
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
  padding: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s;
  font-size: 14px;
}

.footer-links a:hover {
  color: white;
}

@media (max-width: 768px) {
  .cursos-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
  
  .create-btn {
    justify-content: center;
  }
  
  .cursos-grid {
    grid-template-columns: 1fr;
  }
  
  .curso-actions {
    flex-direction: column;
  }
  
  .nav-right {
    gap: 10px;
  }
  
  .nav-link {
    font-size: 14px;
  }
  
  .footer-content {
    flex-direction: column;
  }
}
</style>
