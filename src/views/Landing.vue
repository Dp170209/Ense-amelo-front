<template>
  <div class="landing-page">
    <!-- Header -->
    <div class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <div class="logo">
              <div class="logo-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z"/>
                </svg>
              </div>
              <span class="logo-text">ENSEÑAMELO</span>
            </div>
          </div>
          <div class="header-actions">
            <button class="login-btn" @click="goToLogin">Iniciar Sesión</button>
            <button class="register-btn" @click="goToRegister">Registrarse</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-image">
            <div class="image-placeholder">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                <path d="M2 17L12 22L22 17"/>
                <path d="M2 12L12 17L22 12"/>
              </svg>
            </div>
            <button class="nav-arrow left" @click="previousSlide">‹</button>
            <button class="nav-arrow right" @click="nextSlide">›</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Courses Section -->
    <div class="courses-section">
      <div class="container">
        <div class="courses-grid">
          <div 
            v-for="curso in cursos" 
            :key="curso._id" 
            class="course-card"
            @click="viewCourse(curso)"
          >
            <div class="course-image">
              <span>Imagen del curso</span>
            </div>
            <div class="course-content">
              <h3 class="course-title">{{ curso.nombre }}</h3>
              <span class="course-tag">{{ curso.modalidad }}</span>
              <p class="course-description">{{ curso.descripcion }}</p>
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
  name: 'Landing',
  setup() {
    const router = useRouter()
    const cursos = ref([])
    const loading = ref(true)

    const fetchCursos = async () => {
      try {
        const response = await cursosAPI.getCursos({ limit: 4 })
        if (response.data.success) {
          cursos.value = response.data.cursos
        }
      } catch (error) {
        console.error('Error obteniendo cursos:', error)
      } finally {
        loading.value = false
      }
    }

    const goToLogin = () => {
      router.push('/login')
    }

    const goToRegister = () => {
      router.push('/register')
    }

    const viewCourse = (curso) => {
      // Redirigir al login si no está autenticado
      router.push('/login')
    }

    const previousSlide = () => {
      // Funcionalidad del carrusel
      console.log('Previous slide')
    }

    const nextSlide = () => {
      // Funcionalidad del carrusel
      console.log('Next slide')
    }

    onMounted(() => {
      fetchCursos()
    })

    return {
      cursos,
      loading,
      goToLogin,
      goToRegister,
      viewCourse,
      previousSlide,
      nextSlide
    }
  }
}
</script>

<style scoped>
.landing-page {
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
}

.logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background-color: #ecf0f1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon svg {
  width: 25px;
  height: 25px;
  color: #2c3e50;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.login-btn {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.login-btn:hover {
  background-color: white;
  color: #2c3e50;
}

.register-btn {
  background-color: #36759e;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.register-btn:hover {
  background-color: #2c5aa0;
}

.hero-section {
  background-color: #f8f9fa;
  padding: 60px 0;
}

.hero-content {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.hero-image {
  width: 100%;
  max-width: 800px;
  height: 400px;
  background-color: #ecf0f1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.image-placeholder {
  width: 200px;
  height: 200px;
  background-color: #bdc3c7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder svg {
  width: 100px;
  height: 100px;
  color: #7f8c8d;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  transition: background-color 0.3s;
}

.nav-arrow:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.nav-arrow.left {
  left: 20px;
}

.nav-arrow.right {
  right: 20px;
}

.courses-section {
  padding: 60px 0;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.course-card {
  background-color: #90c0d8;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
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
}

.course-content {
  padding: 20px;
}

.course-title {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.course-tag {
  display: inline-block;
  background-color: #27ae60;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 15px;
}

.course-description {
  color: #2c3e50;
  line-height: 1.5;
  margin: 0;
  font-size: 14px;
}

.footer {
  background-color: #2c3e50;
  color: white;
  padding: 40px 0;
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
  .header-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
  }
  
  .nav-arrow {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>
