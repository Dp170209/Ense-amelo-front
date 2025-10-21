<template>
  <div class="registro-tutor-page">
    <!-- Header superior -->
    <div class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1>Registro Tutor</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="main-content">
      <div class="form-container">
        <div class="form-box">
          <h2 class="form-title">Formulario Tutor</h2>
          
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label class="form-label">Apellidos y Nombres</label>
              <input
                type="text"
                class="form-input"
                placeholder="Value"
                v-model="form.nombreCompleto"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <input
                type="tel"
                class="form-input"
                placeholder="Value"
                v-model="form.telefono"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Email</label>
              <input
                type="email"
                class="form-input"
                placeholder="Value"
                v-model="form.email"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <input
                type="password"
                class="form-input"
                placeholder="Value"
                v-model="form.password"
                required
              />
            </div>

            <!-- Foto de perfil -->
            <div class="form-group">
              <label class="form-label">Foto de perfil</label>
              <div class="photo-upload">
                <div class="photo-placeholder">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Documentos profesionales -->
            <div class="form-group">
              <label class="form-label">Documentos Profesionales</label>
              <div class="file-upload">
                <input type="file" class="file-input" multiple accept=".pdf,.jpg,.jpeg,.png" />
                <div class="file-display">
                  <span class="file-text">Files</span>
                  <button type="button" class="submit-files-btn">Submit</button>
                </div>
              </div>
            </div>

            <!-- Términos y condiciones -->
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input
                  type="checkbox"
                  id="terms"
                  class="checkbox-input"
                  v-model="form.acceptTerms"
                  required
                />
                <label for="terms" class="checkbox-label">
                  I accept the terms <a href="#" @click.prevent="showTerms">Read our T&Cs</a>
                </label>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Registrando...' : 'Save shipping information' }}
            </button>
            
            <div class="login-link">
              <p>¿Ya tienes cuenta? <a href="#" @click.prevent="goToLogin">Inicia sesión aquí</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../api/auth'

export default {
  name: 'RegistroTutor',
  setup() {
    const router = useRouter()
    const form = ref({
      nombreCompleto: '',
      telefono: '',
      email: '',
      password: '',
      acceptTerms: false
    })
    const loading = ref(false)

    const handleRegister = async () => {
      if (!form.value.acceptTerms) {
        alert('Debe aceptar los términos y condiciones')
        return
      }

      if (form.value.password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres')
        return
      }

      try {
        loading.value = true
        
        // Separar nombre completo en nombre y apellido
        const nameParts = form.value.nombreCompleto.split(' ')
        const nombre = nameParts[0] || ''
        const apellido = nameParts.slice(1).join(' ') || ''

        const userData = {
          email: form.value.email,
          password: form.value.password,
          rol: 'docente',
          nombre,
          apellido,
          telefono: form.value.telefono
        }

        const response = await authAPI.register(userData)

        if (response.data.success) {
          alert('Registro de tutor exitoso! Por favor inicie sesión.')
          router.push('/login')
        } else {
          alert('Error en el registro: ' + response.data.message)
        }
      } catch (error) {
        console.error('Error:', error)
        const message = error.response?.data?.message || 'Error al registrarse. El email puede estar en uso.'
        alert(message)
      } finally {
        loading.value = false
      }
    }

    const goToLogin = () => {
      router.push('/login')
    }

    const showTerms = () => {
      alert('Términos y condiciones próximamente disponibles')
    }

    return {
      form,
      loading,
      handleRegister,
      goToLogin,
      showTerms
    }
  }
}
</script>

<style scoped>
.registro-tutor-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.header {
  background-color: #2c3e50;
  color: white;
  padding: 10px 0;
}

.header-left h1 {
  font-size: 18px;
  margin: 0;
}

.main-content {
  padding: 40px 0;
  min-height: calc(100vh - 80px);
}

.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.form-box {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
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
  padding: 12px;
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

.photo-upload {
  display: flex;
  justify-content: center;
}

.photo-placeholder {
  width: 150px;
  height: 150px;
  background-color: #ecf0f1;
  border: 2px dashed #bdc3c7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.photo-placeholder:hover {
  background-color: #d5dbdb;
  border-color: #36759e;
}

.photo-placeholder svg {
  width: 60px;
  height: 60px;
  color: #7f8c8d;
}

.file-upload {
  display: flex;
  gap: 10px;
  align-items: center;
}

.file-input {
  display: none;
}

.file-display {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.file-text {
  color: #7f8c8d;
  font-size: 14px;
}

.submit-files-btn {
  background-color: #34495e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.submit-files-btn:hover {
  background-color: #2c3e50;
}

.checkbox-group {
  margin-bottom: 20px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  accent-color: #36759e;
}

.checkbox-label {
  color: #2c3e50;
  font-size: 14px;
  cursor: pointer;
}

.checkbox-label a {
  color: #36759e;
  text-decoration: underline;
}

.checkbox-label a:hover {
  text-decoration: none;
}

.btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;
  margin-bottom: 20px;
}

.btn-primary {
  background-color: #34495e;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2c3e50;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
}

.login-link p {
  color: #2c3e50;
  font-size: 14px;
  margin: 0;
}

.login-link a {
  color: #36759e;
  text-decoration: underline;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: none;
}

@media (max-width: 768px) {
  .form-box {
    padding: 30px 20px;
  }
  
  .file-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
