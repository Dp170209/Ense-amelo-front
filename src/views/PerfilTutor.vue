<!-- src/views/PerfilTutor.vue -->
<style scoped>
.perfil-tutor-page {
  min-height: 100vh;
  background-color: #2c3e50;
}

/* Header: título más limpio y sin subtítulo "Container" */
.header {
  background-color: #2c3e50;
  color: white;
  padding: 16px 0; /* un poco más compacto */
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

/* Quitamos el subtítulo anterior */
.header-subtitle {
  display: none;
}

/* Empujamos el contenido hacia abajo para que no quede tan pegado al top */
.main-content {
  padding: 64px 0 40px; /* antes 40px 0; incrementamos el top */
}

.container {
  max-width: 900px;       /* un poco más ancho para respirar */
  margin: 0 auto;
  padding: 0 20px;
}

.perfil-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-top: 8px;        /* un poco de separación extra debajo del header */
}

/* Encabezado del perfil */
.profile-header { position: relative; }

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
  margin-top: -40px; /* mantiene el avatar montado sobre el banner */
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

.profile-details { flex: 1; }

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
.message-btn:hover { background-color: #34495e; }

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
.chat-icon:hover { background-color: #bdc3c7; }
.chat-icon svg { width: 20px; height: 20px; color: #2c3e50; }

/* Secciones */
.description-section, .courses-section, .comments-section {
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

/* Cursos */
.courses-content { margin-top: 15px; }
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}
.course-card {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ecf0f1;
}
.course-card h4 {
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-size: 16px;
}
.course-card p {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0 0 10px 0;
  line-height: 1.4;
}
.course-price {
  color: #27ae60;
  font-weight: 500;
  font-size: 14px;
}

/* Comentarios */
.comments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 15px;
}
.comment-card {
  background-color: #90c0d8;
  padding: 20px;
  border-radius: 8px;
}
.stars { color: #ffc107; font-size: 18px; margin-bottom: 10px; }
.comment-card h4 {
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-size: 16px;
}
.comment-card p {
  color: #2c3e50;
  line-height: 1.5;
  margin-bottom: 15px;
  font-size: 14px;
}
.commenter-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.commenter-avatar {
  width: 30px; height: 30px; border-radius: 50%; overflow: hidden;
}
.commenter-avatar img { width: 100%; height: 100%; object-fit: cover; }
.commenter-details { display: flex; flex-direction: column; }
.commenter-name { color: #2c3e50; font-size: 12px; font-weight: 500; }
.comment-date { color: #7f8c8d; font-size: 11px; }

/* Acciones */
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
.edit-profile-btn:hover { background-color: #2c5aa0; }
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
.logout-btn:hover { background-color: #c0392b; }

/* Responsive */
@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  .profile-actions { flex-direction: column; width: 100%; }
  .message-btn { width: 100%; }

  .courses-grid, .comments-grid { grid-template-columns: 1fr; }

  .profile-actions-section { flex-direction: column; }
  .edit-profile-btn, .logout-btn { width: 100%; }
}
</style>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../api/auth'
import { cursosAPI } from '../api/cursos'

export default {
  name: 'PerfilTutor',
  setup() {
    const router = useRouter()
    const user = ref(null)
    const cursos = ref([])
    const loading = ref(true)

    const comentarios = ref([
      {
        id: 1,
        titulo: 'Excelente profesor',
        cuerpo: 'Muy buen profesor, explica muy bien y es muy paciente con los estudiantes.',
        nombre: 'María García',
        fecha: '15 Oct 2025',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
      },
      {
        id: 2,
        titulo: 'Recomendado 100%',
        cuerpo: 'Las clases son muy dinámicas y aprendí mucho. Definitivamente lo recomiendo.',
        nombre: 'Carlos López',
        fecha: '12 Oct 2025',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
      }
    ])

    const fetchUserProfile = async () => {
      try {
        const response = await authAPI.getProfile()
        if (response.data.success) {
          user.value = response.data.user
        }
      } catch (error) {
        console.error('Error obteniendo perfil:', error)
        // Fallback al localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        user.value = userData
      }
    }

    const fetchCursos = async () => {
      try {
        const response = await cursosAPI.getCursos({ limit: 100 })
        if (response.data.success) {
          // Filtrar solo los cursos del tutor actual (ajusta la clave si tu API usa otro nombre)
          cursos.value = response.data.cursos.filter(curso =>
            curso.id_tutor?.id_usuario?.toString() === user.value?.id
          )
        }
      } catch (error) {
        console.error('Error obteniendo cursos:', error)
      }
    }

    const handleSendMessage = () => {
      alert('Funcionalidad de mensajes próximamente disponible')
    }

    const editProfile = () => {
      router.push('/edit-perfil-tutor')
    }

    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }

    onMounted(async () => {
      await fetchUserProfile()
      await fetchCursos()
      loading.value = false
    })

    return {
      user,
      cursos,
      comentarios,
      loading,
      handleSendMessage,
      editProfile,
      handleLogout
    }
  }
}
</script>

<template>
  <div class="perfil-tutor-page">
    <!-- Header -->


    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <div class="perfil-card">
          <!-- Profile Header -->
          <div class="profile-header">
            <div class="profile-banner">
              <div class="banner-placeholder" aria-label="Imagen de portada">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
            </div>

            <div class="profile-info">
              <div class="profile-avatar" aria-label="Avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                </svg>
              </div>

              <div class="profile-details">
                <h2 class="profile-name">{{ user?.nombre || 'Tutor' }}</h2>
                <p class="profile-email">{{ user?.email }}</p>
                <p class="profile-role">Tutor verificado</p>
              </div>

              <div class="profile-actions">
                <button class="message-btn" @click="handleSendMessage">Enviar mensaje</button>
                <div class="chat-icon" title="Abrir chat">
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
              <p v-else class="placeholder-text">No hay descripción disponible.</p>
            </div>
          </div>

          <!-- Courses Section -->
          <div class="courses-section">
            <h3 class="section-title">Cursos</h3>
            <div class="courses-content">
              <div v-if="cursos.length > 0" class="courses-grid">
                <div v-for="curso in cursos" :key="curso._id" class="course-card">
                  <h4>{{ curso.nombre }}</h4>
                  <p>{{ curso.descripcion }}</p>
                  <span class="course-price">{{ curso.precio_reserva }} Bs/hora</span>
                </div>
              </div>
              <p v-else class="placeholder-text">No hay cursos disponibles.</p>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="comments-section">
            <h3 class="section-title">Comentarios</h3>
            <div class="comments-grid">
              <div class="comment-card" v-for="comentario in comentarios" :key="comentario.id">
                <div class="stars">★★★★☆</div>
                <h4>{{ comentario.titulo }}</h4>
                <p>{{ comentario.cuerpo }}</p>
                <div class="commenter-info">
                  <div class="commenter-avatar">
                    <img :src="comentario.avatar" :alt="comentario.nombre" />
                  </div>
                  <div class="commenter-details">
                    <span class="commenter-name">{{ comentario.nombre }}</span>
                    <span class="comment-date">{{ comentario.fecha }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Actions -->
          <div class="profile-actions-section">
            <button class="edit-profile-btn" @click="editProfile">Editar perfil</button>
            <button class="logout-btn" @click="handleLogout">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
