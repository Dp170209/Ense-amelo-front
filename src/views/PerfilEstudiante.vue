<template>
  <div class="perfil-page">
    <!-- Header -->
    <div class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1>Perfil Estudiante</h1>
            <p class="header-subtitle">Container</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <div class="perfil-card">
          <!-- Profile Header -->
          <div class="profile-header">
            <div class="profile-banner">
              <div class="banner-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
                </svg>
              </div>
            </div>
            
            <div class="profile-info">
              <div class="profile-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                </svg>
              </div>
              
              <div class="profile-details">
                <h2 class="profile-name">{{ user?.nombre }} {{ user?.apellido }}</h2>
                <p class="profile-email">{{ user?.email }}</p>
                <p class="profile-role">Estudiante</p>
              </div>
              
              <div class="profile-actions">
                <button class="message-btn" @click="handleSendMessage">
                  Enviar Mensaje
                </button>
                <div class="chat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div class="description-section">
            <h3 class="section-title">Descripción</h3>
            <div class="description-content">
              <p v-if="user?.descripcion">{{ user.descripcion }}</p>
              <p v-else class="placeholder-text">No hay descripción disponible</p>
            </div>
          </div>

          <!-- Comments/Activities Section -->
          <div class="comments-section">
            <h3 class="section-title">Actividades</h3>
            <div class="activities-grid">
              <div class="activity-card">
                <div class="activity-header">
                  <h4>Open to work</h4>
                </div>
                <div class="activity-content">
                  <p>Digital Designer, UI/UX Designer, Website Developer, Wordpress Developer roles</p>
                </div>
                <div class="activity-action">
                  <a href="#" @click.prevent="showDetails('work')" class="details-link">Show details</a>
                </div>
              </div>

              <div class="activity-card">
                <div class="activity-header">
                  <h4>Providing Services</h4>
                </div>
                <div class="activity-content">
                  <p>SEO Marketing, Website Optimization, Web Design</p>
                </div>
                <div class="activity-action">
                  <a href="#" @click.prevent="showDetails('services')" class="details-link">Show details</a>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Actions -->
          <div class="profile-actions-section">
            <button class="edit-profile-btn" @click="editProfile">
              Editar Perfil
            </button>
            <button class="logout-btn" @click="handleLogout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../api/auth'

export default {
  name: 'PerfilEstudiante',
  setup() {
    const router = useRouter()
    const user = ref(null)
    const loading = ref(true)

    const fetchUserProfile = async () => {
      try {
        const response = await authAPI.getProfile()
        if (response.data.success) {
          user.value = response.data.user
        }
      } catch (error) {
        console.error('Error obteniendo perfil:', error)
        // Si hay error, usar datos del localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        user.value = userData
      } finally {
        loading.value = false
      }
    }

    const handleSendMessage = () => {
      alert('Funcionalidad de mensajes próximamente disponible')
    }

    const editProfile = () => {
      router.push('/edit-perfil')
    }

    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }

    const showDetails = (type) => {
      if (type === 'work') {
        alert('Mostrando detalles de trabajo')
      } else if (type === 'services') {
        alert('Mostrando detalles de servicios')
      }
    }

    onMounted(() => {
      fetchUserProfile()
    })

    return {
      user,
      loading,
      handleSendMessage,
      editProfile,
      handleLogout,
      showDetails
    }
  }
}
</script>

<style scoped>
.perfil-page {
  min-height: 100vh;
  background-color: #2c3e50;
}

.header {
  background-color: #2c3e50;
  color: white;
  padding: 20px 0;
}

.header-content {
  display: flex;
  align-items: center;
}

.header-left h1 {
  font-size: 24px;
  margin: 0;
  color: white;
}

.header-subtitle {
  font-size: 14px;
  color: #bdc3c7;
  margin: 5px 0 0 0;
}

.main-content {
  padding: 40px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.perfil-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.profile-header {
  position: relative;
}

.profile-banner {
  width: 100%;
  height: 200px;
  background-color: #ecf0f1;
  position: relative;
}

.banner-placeholder {
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background-color: #bdc3c7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-placeholder svg {
  width: 30px;
  height: 30px;
  color: #7f8c8d;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 30px;
  position: relative;
  margin-top: -40px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  background-color: #ecf0f1;
  border-radius: 50%;
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-avatar svg {
  width: 50px;
  height: 50px;
  color: #2c3e50;
}

.profile-details {
  flex: 1;
}

.profile-name {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 5px 0;
}

.profile-email {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0 0 5px 0;
}

.profile-role {
  font-size: 14px;
  color: #27ae60;
  font-weight: 500;
  margin: 0;
}

.profile-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.message-btn {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.message-btn:hover {
  background-color: #34495e;
}

.chat-icon {
  width: 40px;
  height: 40px;
  background-color: #ecf0f1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chat-icon:hover {
  background-color: #bdc3c7;
}

.chat-icon svg {
  width: 20px;
  height: 20px;
  color: #2c3e50;
}

.description-section {
  padding: 30px;
  border-bottom: 1px solid #ecf0f1;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #36759e;
  margin: 0 0 15px 0;
}

.description-content {
  color: #2c3e50;
  line-height: 1.6;
}

.placeholder-text {
  color: #7f8c8d;
  font-style: italic;
}

.comments-section {
  padding: 30px;
  border-bottom: 1px solid #ecf0f1;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.activity-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #ecf0f1;
}

.activity-header h4 {
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.activity-content p {
  color: #7f8c8d;
  line-height: 1.5;
  margin: 0 0 15px 0;
  font-size: 14px;
}

.activity-action {
  text-align: right;
}

.details-link {
  color: #36759e;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.details-link:hover {
  text-decoration: underline;
}

.profile-actions-section {
  padding: 30px;
  display: flex;
  gap: 15px;
  justify-content: center;
}

.edit-profile-btn {
  background-color: #36759e;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-profile-btn:hover {
  background-color: #2c5aa0;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c0392b;
}

@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .profile-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .message-btn {
    width: 100%;
  }
  
  .activities-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-actions-section {
    flex-direction: column;
  }
  
  .edit-profile-btn,
  .logout-btn {
    width: 100%;
  }
}
</style>
