<template>
  <div class="register-page">
    <!-- Header superior -->
    <div class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1>Registro</h1>
            <p class="header-subtitle">Image</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Banner principal -->
    <div class="banner">
      <div class="container">
        <div class="banner-content">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z"/>
            </svg>
          </div>
          <div class="logo-text">ENSEÑAMELO</div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="main-content">
      <div class="form-container">
        <div class="form-box">
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label class="form-label">Nombre</label>
              <input
                type="text"
                class="form-input"
                placeholder="Ingrese su nombre"
                v-model="form.nombre"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Apellido</label>
              <input
                type="text"
                class="form-input"
                placeholder="Ingrese su apellido"
                v-model="form.apellido"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Correo electronico</label>
              <input
                type="email"
                class="form-input"
                placeholder="Ingrese su email"
                v-model="form.email"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <input
                type="tel"
                class="form-input"
                placeholder="Ingrese su teléfono"
                v-model="form.telefono"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <input
                type="password"
                class="form-input"
                placeholder="Mínimo 6 caracteres"
                v-model="form.password"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Confirmar Contraseña</label>
              <input
                type="password"
                class="form-input"
                placeholder="Confirme su contraseña"
                v-model="form.confirmPassword"
                required
              />
            </div>

            <div class="checkbox-group">
              <p class="checkbox-title">Tipo de Usuario</p>
              <div class="checkbox-item">
                <input
                  type="checkbox"
                  id="estudiante"
                  class="checkbox-input"
                  v-model="form.rol"
                  value="estudiante"
                />
                <label for="estudiante" class="checkbox-label">Estudiante</label>
              </div>
              <div class="checkbox-item">
                <input
                  type="checkbox"
                  id="docente"
                  class="checkbox-input"
                  v-model="form.rol"
                  value="docente"
                />
                <label for="docente" class="checkbox-label">Docente</label>
              </div>
            </div>

            <button type="submit" class="btn btn-secondary" :disabled="loading">
              {{ loading ? 'Registrando...' : 'Registrarse' }}
            </button>
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
  name: 'Register',
  setup() {
    const router = useRouter()
    const form = ref({
      email: '',
      password: '',
      confirmPassword: '',
      nombre: '',
      apellido: '',
      telefono: '',
      rol: ['estudiante'] // Por defecto estudiante seleccionado
    })
    const loading = ref(false)

    const handleRegister = async () => {
      // Validar que las contraseñas coincidan
      if (form.value.password !== form.value.confirmPassword) {
        alert('Las contraseñas no coinciden')
        return
      }

      // Validar que se haya seleccionado un rol
      if (form.value.rol.length === 0) {
        alert('Debe seleccionar al menos un tipo de usuario')
        return
      }

      // Validar longitud de contraseña
      if (form.value.password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres')
        return
      }

      try {
        loading.value = true
        const userData = {
          email: form.value.email,
          password: form.value.password,
          rol: form.value.rol[0], // Tomar el primer rol seleccionado
          nombre: form.value.nombre || 'Usuario',
          apellido: form.value.apellido || '',
          telefono: form.value.telefono || 0
        }

        const response = await authAPI.register(userData)

        if (response.data.success) {
          alert('Registro exitoso! Por favor inicie sesión.')
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

    return {
      form,
      loading,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background-color: #ffffff;
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

.header-subtitle {
  font-size: 12px;
  color: #bdc3c7;
  margin: 0;
  margin-top: 2px;
}

.banner {
  background-color: #36759e;
  color: white;
  padding: 20px 0;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  width: 50px;
  height: 50px;
  background-color: #ecf0f1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon svg {
  width: 30px;
  height: 30px;
  color: #2c3e50;
}

.logo-text {
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 1px;
}

.main-content {
  background-color: #ffffff;
  min-height: calc(100vh - 140px);
}

.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

.form-box {
  background-color: #90c0d8;
  padding: 40px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  border: none;
  border-radius: 5px;
  font-size: 16px;
  background-color: white;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #36759e;
}

.checkbox-group {
  margin-bottom: 20px;
}

.checkbox-title {
  color: #bdc3c7;
  font-size: 14px;
  margin-bottom: 15px;
  font-weight: normal;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  accent-color: #36759e;
}

.checkbox-label {
  color: #2c3e50;
  font-size: 16px;
  cursor: pointer;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;
}

.btn-secondary {
  background-color: #2c3e50;
  color: white;
}

.btn-secondary:hover {
  background-color: #34495e;
}
</style>
