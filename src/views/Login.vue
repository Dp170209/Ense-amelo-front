<template>
  <div class="login-page">
    <!-- Header superior -->
    <div class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1>Login</h1>
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
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label class="form-label">Correo electronico</label>
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

            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Ingresando...' : 'Ingresar' }}
            </button>

            <div class="forgot-password">
              <a href="#" @click.prevent="handleForgotPassword">Olvidaste tu contraseña?</a>
            </div>
            
            <div class="register-link">
              <p>¿No tienes cuenta? <a href="#" @click.prevent="goToRegister">Regístrate aquí</a></p>
              <p>¿Eres tutor? <a href="#" @click.prevent="goToRegisterTutor">Registro de tutor</a></p>
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
  name: 'Login',
  setup() {
    const router = useRouter()
    const form = ref({
      email: '',
      password: ''
    })
    const loading = ref(false)

    const handleLogin = async () => {
      try {
        loading.value = true
        const response = await authAPI.login(form.value.email, form.value.password)

        if (response.data.success) {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          
          // Redirigir según el rol del usuario
          if (response.data.user.rol === 'docente') {
            router.push('/panel-tutor')
          } else {
            router.push('/home')
          }
        } else {
          alert('Error en el login: ' + response.data.message)
        }
      } catch (error) {
        console.error('Error:', error)
        const message = error.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.'
        alert(message)
      } finally {
        loading.value = false
      }
    }

    const handleForgotPassword = () => {
      alert('Función de recuperar contraseña próximamente disponible')
    }

    const goToRegister = () => {
      router.push('/register')
    }

    const goToRegisterTutor = () => {
      router.push('/registro-tutor')
    }

    return {
      form,
      loading,
      handleLogin,
      handleForgotPassword,
      goToRegister,
      goToRegisterTutor
    }
  }
}
</script>

<style scoped>
.login-page {
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

.btn-primary {
  background-color: #365d6e;
  color: white;
}

.btn-primary:hover {
  background-color: #2c4a5a;
}

.forgot-password {
  text-align: left;
  margin-top: 15px;
}

.forgot-password a {
  color: #2c3e50;
  text-decoration: underline;
  font-size: 14px;
}

.forgot-password a:hover {
  text-decoration: none;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}

.register-link p {
  color: #2c3e50;
  font-size: 14px;
  margin: 0;
}

.register-link a {
  color: #36759e;
  text-decoration: underline;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: none;
}
</style>
