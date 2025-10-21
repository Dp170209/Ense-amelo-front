<template>
  <div class="panel-tutor-page">
    <!-- Header/Navigation Bar -->
    <div class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <div class="logo-icon-small">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6H2V4C2 2.89 2.89 2 4 2H6V4H4V6M20 2H22V4H20V6H22V8H20V10H18V8H16V6H18V4H16V2H18V0H20V2M4 20H2V22C2 23.11 2.89 24 4 24H6V22H4V20M22 22V20H20V18H22V16H20V14H18V16H16V18H18V20H16V22H18V24H20V22H22Z"/>
              </svg>
            </div>
            <h1>Panel Tutor</h1>
          </div>
          <div class="nav-links">
            <router-link to="/panel-tutor" class="nav-link active">Panel</router-link>
            <router-link to="/mis-cursos" class="nav-link">Mis cursos</router-link>
            <router-link to="/chat" class="nav-link">Chats</router-link>
            <router-link to="/explorar" class="nav-link">Explorar</router-link>
            <button @click="handleLogout" class="logout-btn">Cerrar Sesión</button>
            <div class="user-icon" @click="handleProfile">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12Chief14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <div class="content-layout">
          <!-- Left Content -->
          <div class="left-content">
            <!-- Panel de Tutores Banner -->
            <div class="tutor-banner">
              <div class="banner-content">
                <div class="banner-info">
                  <h2>Panel de Tutores</h2>
                  <p>Gestiona tus cursos y horarios</p>
                  <div class="banner-actions">
                    <button class="action-btn" @click="createNewCourse">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                      </svg>
                      Crear Nuevo Curso
                    </button>
                    <button class="action-btn" @click="viewCalendar">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z"/>
                      </svg>
                      Ver mis chats
                    </button>
                  </div>
                </div>
                <div class="banner-icons">
                  <div class="placeholder-icon">△</div>
                  <div class="placeholder-icon">⚙</div>
                  <div class="placeholder-icon">□</div>
                </div>
              </div>
            </div>

            <!-- Clases List -->
            <div class="clases-section">
              <div class="clase-item" v-for="clase in clases" :key="clase.id">
                <div class="clase-icon">
                  <div class="icon-placeholder">△</div>
                  <div class="icon-placeholder">⚙</div>
                  <div class="icon-placeholder">□</div>
                </div>
                <div class="clase-info">
                  <h3>{{ clase.titulo }}</h3>
                  <p class="clase-details">{{ clase.categoria }} - {{ clase.precio }} - {{ clase.distancia }}</p>
                  <p class="clase-description">{{ clase.descripcion }}</p>
                </div>
                <div class="clase-actions">
                  <button class="action-btn-small" @click="verDetalle(clase)">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"/>
                    </svg>
                    Detalle
                  </button>
                  <button class="action-btn-small reject" @click="rechazar(clase)">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,4C13.1,4 14,4.9 14,6C14,7.1 13.1,8 12,8C10.9,8 10,7.1 10,6C10,4.9 10.9,4 12,4M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M12,6A4,4 0 0,0 8,10V11H16V10A4,4 0 0,0 12,6Z"/>
                    </svg>
                    Rechazar
                  </button>
                  <button class="action-btn-small accept" @click="aceptar(clase)">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                    </svg>
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Content - Calendar -->
          <div class="right-content">
            <div class="calendar-widget">
              <h3>Seleccionar una fecha</h3>
              <div class="current-date">Lunes, 21 de Octubre</div>
              
              <div class="month-selector">
                <button class="nav-btn">‹</button>
                <select class="month-dropdown">
                  <option>Octubre 2025</option>
                </select>
                <button class="nav-btn">›</button>
              </div>

              <div class="calendar-grid">
                <div class="calendar-header">
                  <div class="day-header">S</div>
                  <div class="day-header">D</div>
                  <div class="day-header">L</div>
                  <div class="day-header">M</div>
                  <div class="day-header">M</div>
                  <div class="day-header">J</div>
                  <div class="day-header">V</div>
                </div>
                <div class="calendar-days">
                  <div class="calendar-day" v-for="day in calendarDays" :key="day" 
                       :class="{ selected: day === 21, highlighted: day === 5 }">
                    {{ day }}
                  </div>
                </div>
              </div>

              <div class="calendar-actions">
                <button class="calendar-btn">Cancelar</button>
                <button class="calendar-btn primary">OK</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'PanelTutor',
  setup() {
    const router = useRouter()
    
    const clases = ref([
      {
        id: 1,
        titulo: 'Clase 1',
        categoria: 'Matemáticas',
        precio: 'Bs 50',
        modalidad: 'presencial',
        descripcion: 'Clases de matemáticas para estudiantes de primaria'
      },
      {
        id: 2,
        titulo: 'Clase 2',
        categoria: 'Programación',
        precio: 'Bs 100',
        modalidad: 'presencial',
        descripcion: 'Aprende a programar en python desde cero'
      },
      {
        id: 3,
        titulo: 'Clase 3',
        categoria: 'Inglés',
        precio: 'Bs 150',
        distancia: 'virtual',
        descripcion: 'Clases virtuales de inglés nivel B2'
      }
    ])

    const calendarDays = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])

    const verDetalle = (clase) => {
      alert(`Ver detalles de ${clase.titulo}`)
    }

    const rechazar = (clase) => {
      alert(`Rechazar ${clase.titulo}`)
    }

    const aceptar = (clase) => {
      alert(`Aceptar ${clase.titulo}`)
    }

    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }

    const handleProfile = () => {
      router.push('/perfil-tutor')
    }

    const createNewCourse = () => {
      router.push('/config-curso')
    }

    const viewCalendar = () => {
      router.push('/chat')
    }

    return {
      clases,
      calendarDays,
      verDetalle,
      rechazar,
      aceptar,
      handleLogout,
      handleProfile,
      createNewCourse,
      viewCalendar
    }
  }
}
</script>

<style scoped>
.panel-tutor-page {
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

.header-left h1 {
  font-size: 18px;
  margin: 0;
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

.content-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.tutor-banner {
  background: linear-gradient(135deg, #ecf0f1 0%, #d5dbdb 100%);
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner-info h2 {
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.banner-info p {
  color: #7f8c8d;
  margin: 0 0 20px 0;
}

.banner-actions {
  display: flex;
  gap: 15px;
}

.action-btn {
  background-color: #90c0d8;
  color: #2c3e50;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s;
}

.action-btn:hover {
  background-color: #7bb3d1;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.banner-icons {
  display: flex;
  gap: 10px;
}

.placeholder-icon {
  width: 40px;
  height: 40px;
  background-color: rgba(44, 62, 80, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #7f8c8d;
}

.clases-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.clase-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.clase-icon {
  display: flex;
  gap: 5px;
  flex-shrink: 0;
}

.icon-placeholder {
  width: 20px;
  height: 20px;
  background-color: #ecf0f1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #7f8c8d;
}

.clase-info {
  flex: 1;
}

.clase-info h3 {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 5px 0;
}

.clase-details {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0 0 5px 0;
}

.clase-description {
  color: #2c3e50;
  font-size: 14px;
  margin: 0;
}

.clase-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.action-btn-small {
  background-color: #90c0d8;
  color: #2c3e50;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.action-btn-small:hover {
  background-color: #7bb3d1;
}

.action-btn-small.reject {
  background-color: #e74c3c;
  color: white;
}

.action-btn-small.reject:hover {
  background-color: #c0392b;
}

.action-btn-small.accept {
  background-color: #27ae60;
  color: white;
}

.action-btn-small.accept:hover {
  background-color: #229954;
}

.action-btn-small svg {
  width: 14px;
  height: 14px;
}

.calendar-widget {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.calendar-widget h3 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.current-date {
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 20px;
}

.month-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.nav-btn {
  background-color: #ecf0f1;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  color: #2c3e50;
}

.nav-btn:hover {
  background-color: #d5dbdb;
}

.month-dropdown {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px 10px;
  background-color: white;
  color: #2c3e50;
}

.calendar-grid {
  margin-bottom: 20px;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 10px;
}

.day-header {
  text-align: center;
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 500;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #2c3e50;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.calendar-day:hover {
  background-color: #ecf0f1;
}

.calendar-day.selected {
  background-color: #36759e;
  color: white;
}

.calendar-day.highlighted {
  background-color: #90c0d8;
  color: #2c3e50;
}

.calendar-actions {
  display: flex;
  gap: 10px;
}

.calendar-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  background-color: white;
  color: #2c3e50;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.calendar-btn:hover {
  background-color: #ecf0f1;
}

.calendar-btn.primary {
  background-color: #36759e;
  color: white;
  border-color: #36759e;
}

.calendar-btn.primary:hover {
  background-color: #2c5aa0;
}

@media (max-width: 768px) {
  .content-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .nav-links {
    display: none;
  }
  
  .clase-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .clase-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .banner-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
}
</style>
