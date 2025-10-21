<template>
  <div class="edit-perfil-page">
    <!-- Header -->
    <div class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1>Editar Perfil Estudiante</h1>
            <p class="header-subtitle">Container</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <div class="edit-form">
          <form @submit.prevent="handleSave">
            <!-- Personal Information -->
            <div class="form-section">
              <h3 class="section-title">Información Personal</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Nombre</label>
                  <input
                    type="text"
                    class="form-input"
                    v-model="form.nombre"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Apellido</label>
                  <input
                    type="text"
                    class="form-input"
                    v-model="form.apellido"
                    required
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-input"
                    v-model="form.email"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Teléfono</label>
                  <input
                    type="tel"
                    class="form-input"
                    v-model="form.telefono"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Foto de Perfil</label>
                <div class="photo-upload">
                  <div class="photo-preview">
                    <img v-if="form.foto" :src="form.foto" alt="Foto de perfil" />
                    <div v-else class="photo-placeholder">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                      </svg>
                    </div>
                  </div>
                  <input type="file" @change="handlePhotoChange" accept="image/*" class="file-input" />
                  <button type="button" @click="triggerFileInput" class="upload-btn">Cambiar Foto</button>
                </div>
              </div>
            </div>

            <!-- Description Section -->
            <div class="form-section">
              <h3 class="section-title">Descripción</h3>
              <div class="form-group">
                <label class="form-label">Biografía</label>
                <textarea
                  class="form-textarea"
                  v-model="form.descripcion"
                  placeholder="Cuéntanos sobre ti..."
                  rows="4"
                ></textarea>
              </div>
            </div>

            <!-- Password Section -->
            <div class="form-section">
              <h3 class="section-title">Cambiar Contraseña</h3>
              
              <div class="form-group">
                <label class="form-label">Contraseña Actual</label>
                <input
                  type="password"
                  class="form-input"
                  v-model="form.currentPassword"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Nueva Contraseña</label>
                  <input
                    type="password"
                    class="form-input"
                    v-model="form.newPassword"
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    class="form-input"
                    v-model="form.confirmPassword"
                  />
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="form-actions">
              <button type="button" @click="goBack" class="cancel-btn">Cancelar</button>
              <button type="submit" class="save-btn" :disabled="loading">
                {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
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
  name: 'EditPerfilEstudiante',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    
    const form = ref({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      foto: '',
      descripcion: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const fetchUserProfile = async () => {
      try {
        const response = await authAPI.getProfile()
        if (response.data.success) {
          const user = response.data.user
          form.value.nombre = user.nombre || ''
          form.value.apellido = user.apellido || ''
          form.value.email = user.email || ''
          form.value.telefono = user.telefono || ''
          form.value.foto = user.foto || ''
          form.value.descripcion = user.descripcion || ''
        }
      } catch (error) {
        console.error('Error obteniendo perfil:', error)
        // Usar datos del localStorage como fallback
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        form.value.nombre = userData.nombre || ''
        form.value.apellido = userData.apellido || ''
        form.value.email = userData.email || ''
        form.value.telefono = userData.telefono || ''
        form.value.foto = userData.foto || ''
      }
    }

    const handlePhotoChange = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          form.value.foto = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const triggerFileInput = () => {
      document.querySelector('.file-input').click()
    }

    const handleSave = async () => {
      // Validar contraseñas si se están cambiando
      if (form.value.newPassword && form.value.newPassword !== form.value.confirmPassword) {
        alert('Las contraseñas no coinciden')
        return
      }

      if (form.value.newPassword && form.value.newPassword.length < 6) {
        alert('La nueva contraseña debe tener al menos 6 caracteres')
        return
      }

      try {
        loading.value = true
        
        // Aquí iría la lógica para actualizar el perfil
        // Por ahora simulamos el guardado
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Actualizar datos en localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        userData.nombre = form.value.nombre
        userData.apellido = form.value.apellido
        userData.email = form.value.email
        userData.telefono = form.value.telefono
        userData.foto = form.value.foto
        localStorage.setItem('user', JSON.stringify(userData))
        
        alert('Perfil actualizado exitosamente')
        router.push('/perfil')
        
      } catch (error) {
        console.error('Error actualizando perfil:', error)
        alert('Error al actualizar el perfil')
      } finally {
        loading.value = false
      }
    }

    const goBack = () => {
      router.push('/perfil')
    }

    onMounted(() => {
      fetchUserProfile()
    })

    return {
      form,
      loading,
      handlePhotoChange,
      triggerFileInput,
      handleSave,
      goBack
    }
  }
}
</script>

<style scoped>
.edit-perfil-page {
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
  padding: 8px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.edit-form {
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #36759e;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #ecf0f1;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 16px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #36759e;
  box-shadow: 0 0 0 2px rgba(54, 117, 158, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  resize: vertical;
  min-height: 100px;
  box-sizing: border-box;
}

.form-textarea:focus {
  outline: none;
  border-color: #36759e;
  box-shadow: 0 0 0 2px rgba(54, 117, 158, 0.1);
}

.photo-upload {
  display: flex;
  align-items: center;
  gap: 20px;
}

.photo-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #ecf0f1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  width: 50px;
  height: 50px;
  color: #7f8c8d;
}

.photo-placeholder svg {
  width: 100%;
  height: 100%;
}

.file-input {
  display: none;
}

.upload-btn {
  background-color: #36759e;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: #2c5aa0;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background-color: #c0392b;
}

.save-btn {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.save-btn:hover:not(:disabled) {
  background-color: #229954;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .save-btn {
    width: 100%;
  }
  
  .photo-upload {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
