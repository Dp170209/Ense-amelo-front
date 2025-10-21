<template>
  <div class="curso-detalle-page">
    <!-- Header/Navigation Bar -->
    <div class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1>Información Curso</h1>
            <div class="logo-icon-small">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6H2V4C2 2.89 2.89 2 4 2H6V4H4V6M20 2H22V4H20V6H22V8H20V10H18V8H16V6H18V4H16V2H18V0H20V2M4 20H2V22C2 23.11 2.89 24 4 24H6V22H4V20M22 22V20H20V18H22V16H20V14H18V16H16V18H18V20H16V22H18V24H20V22H22Z"/>
              </svg>
            </div>
          </div>
          <div class="nav-links">
            <router-link to="/home" class="nav-link">Mis cursos</router-link>
            <router-link to="/chats" class="nav-link">Chats</router-link>
            <router-link to="/explorar" class="nav-link">Explorar</router-link>
            <button @click="handleLogout" class="logout-btn">Cerrar Sesión</button>
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
        <div v-if="loading" class="loading">
          Cargando información del curso...
        </div>

        <div v-else-if="curso" class="curso-container">
          <!-- Course Details Section -->
          <div class="curso-details">
            <!-- Left Column - Course Media -->
            <div class="curso-media">
              <div class="curso-image">
                <span>Imagen del curso</span>
              </div>
              <div class="image-navigation">
                <button class="nav-arrow">‹</button>
                <button class="nav-arrow">›</button>
              </div>
              
              <!-- Instructor Info -->
              <div class="instructor-info">
                <div class="instructor-avatar">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                  </svg>
                </div>
                <div class="instructor-details">
                  <h4>{{ curso.id_tutor?.id_usuario?.nombre }} {{ curso.id_tutor?.id_usuario?.apellido }}</h4>
                  <p>{{ curso.id_tutor?.biografia || 'Instructor experimentado' }}</p>
                </div>
                <div class="message-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Right Column - Course Information -->
            <div class="curso-info">
              <h2 class="curso-title">{{ curso.nombre }}</h2>
              <div class="curso-tag">{{ curso.modalidad }}</div>
              <div class="curso-price">{{ curso.precio_reserva }} Bs/hora</div>
              <p class="curso-summary">{{ curso.descripcion }}</p>
              
              <button class="reservar-btn" @click="handleReservar">
                Reservar
              </button>

              <div class="descripcion-section">
                <h3>DESCRIPCIÓN DEL CURSO</h3>
                <p>{{ curso.descripcion }}</p>
                <div class="curso-details-list">
                  <div class="detail-item">
                    <strong>Modalidad:</strong> {{ curso.modalidad }}
                  </div>
                  <div class="detail-item">
                    <strong>Precio:</strong> {{ curso.precio_reserva }} Bs por hora
                  </div>
                  <div class="detail-item">
                    <strong>Instructor:</strong> {{ curso.id_tutor?.id_usuario?.nombre }} {{ curso.id_tutor?.id_usuario?.apellido }}
                  </div>
                  <div class="detail-item">
                    <strong>Calificación:</strong> {{ curso.id_tutor?.clasificacion?.toFixed(1) || 'N/A' }} ⭐
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="reviews-section">
            <h3>Reseñas</h3>
            <div class="reviews-grid">
              <div class="review-card" v-for="i in 3" :key="i">
                <div class="stars">★★★★☆</div>
                <h4>Título Reseña {{ i }}</h4>
                <p>Cuerpo Reseña {{ i }} - Excelente curso, muy recomendado para aprender.</p>
                <div class="reviewer-info">
                  <div class="reviewer-avatar">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                    </svg>
                  </div>
                  <div class="reviewer-details">
                    <span class="reviewer-name">Nombre usuario reseña {{ i }}</span>
                    <span class="review-date">Fecha</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="error">
          Curso no encontrado
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
import { useRoute, useRouter } from 'vue-router'
import { cursosAPI } from '../api/cursos'

export default {
  name: 'CursoDetalle',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const curso = ref(null)
    const loading = ref(true)

    const fetchCurso = async () => {
      try {
        const cursoId = route.params.id
        const response = await cursosAPI.getCurso(cursoId)
        if (response.data.success) {
          curso.value = response.data.curso
        }
      } catch (error) {
        console.error('Error obteniendo curso:', error)
        alert('Error al cargar el curso')
      } finally {
        loading.value = false
      }
    }

    const handleReservar = () => {
      // Redirigir al chat para comunicarse con el tutor
      router.push('/chat')
    }

    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }

    const handleProfile = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user.rol === 'docente') {
        router.push('/perfil-tutor')
      } else {
        router.push('/perfil')
      }
    }

    onMounted(() => {
      fetchCurso()
    })

    return {
      curso,
      loading,
      handleReservar,
      handleLogout,
      handleProfile
    }
  }
}
</script>

<style scoped>
.curso-detalle-page {
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

.main-content {
  padding: 40px 0;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-size: 18px;
}

.curso-container {
  max-width: 1200px;
  margin: 0 auto;
}

.curso-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

.curso-media {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.curso-image {
  width: 100%;
  height: 300px;
  background-color: #ecf0f1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  border-radius: 8px;
  position: relative;
}

.image-navigation {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  pointer-events: none;
}

.nav-arrow {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  pointer-events: auto;
}

.instructor-info {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.instructor-avatar {
  width: 50px;
  height: 50px;
  background-color: #ecf0f1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.instructor-avatar svg {
  width: 25px;
  height: 25px;
  color: #2c3e50;
}

.instructor-details {
  flex: 1;
}

.instructor-details h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.instructor-details p {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.message-icon {
  width: 40px;
  height: 40px;
  background-color: #36759e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.message-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.curso-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.curso-title {
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.curso-tag {
  display: inline-block;
  background-color: #27ae60;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.curso-price {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.curso-summary {
  color: #7f8c8d;
  line-height: 1.6;
  font-size: 16px;
}

.reservar-btn {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  width: fit-content;
}

.reservar-btn:hover {
  background-color: #34495e;
}

.descripcion-section h3 {
  color: #2c3e50;
  font-size: 18px;
  margin-bottom: 15px;
}

.descripcion-section p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 20px;
}

.curso-details-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-item {
  color: #2c3e50;
  font-size: 14px;
}

.reviews-section {
  margin-top: 40px;
}

.reviews-section h3 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 30px;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.review-card {
  background-color: #90c0d8;
  padding: 20px;
  border-radius: 8px;
}

.stars {
  color: #ffc107;
  font-size: 18px;
  margin-bottom: 10px;
}

.review-card h4 {
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-size: 16px;
}

.review-card p {
  color: #2c3e50;
  line-height: 1.5;
  margin-bottom: 15px;
  font-size: 14px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reviewer-avatar {
  width: 30px;
  height: 30px;
  background-color: #ecf0f1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reviewer-avatar svg {
  width: 15px;
  height: 15px;
  color: #2c3e50;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
}

.reviewer-name {
  color: #2c3e50;
  font-size: 12px;
  font-weight: 500;
}

.review-date {
  color: #7f8c8d;
  font-size: 11px;
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
  .curso-details {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .nav-links {
    display: none;
  }
  
  .reviews-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
  }
}
</style>
