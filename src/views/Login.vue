<template>
  <div class="login-page">
    <div class="login-stack">
      <div class="brand-group" style="--brand-offset-x:-18px;">
        <div class="brand" aria-label="Enseñamelo branding">
          <img class="brand-logo" src="../assets/logo3.png" alt="Enseñamelo" />
          <div class="brand-name">ENSEÑAMELO</div>
        </div>
      </div>

      <!-- Caja de formulario -->
      <div class="form-box">
        <h2>Inicia sesión</h2>
        <p class="subtitle">Accede a tu cuenta para continuar</p>

        <form @submit.prevent="handleLogin" novalidate>
          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
            <input
              type="email"
              class="form-input"
              placeholder="tu@email.com"
              v-model="form.email"
              autocomplete="email"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <div class="input-with-icon">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Ingresa tu contraseña"
                v-model="form.password"
                autocomplete="current-password"
                required
              />
              <button
                type="button"
                class="icon-btn"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                <!-- ojo / ojo tachado -->
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.1 3.51 3.5 2.1l18.4 18.4-1.41 1.41-3.05-3.05A12.6 12.6 0 0 1 12 19c-7 0-10-7-10-7a20.3 20.3 0 0 1 5.12-6.16L2.1 3.51ZM12 7c7 0 10 7 10 7a20.9 20.9 0 0 1-4.23 5.36l-2.04-2.04A5 5 0 0 0 9.68 9.28L7.64 7.24A12.6 12.6 0 0 1 12 7Zm0 3a3 3 0 0 1 3 3c0 .47-.11.9-.3 1.3L10.7 10.3c.4-.19.83-.3 1.3-.3Zm-3 3a3 3 0 0 1 3-3c.12 0 .24 0 .36.02L9.02 9.36C9 9.76 9 10.2 9 10.7 9 12.1 9.9 13.3 11.2 13.8L9.7 12.3c-.45-.45-.7-1.05-.7-1.3Z"/>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>

          <div class="row-actions">
            <a href="#" @click.prevent="handleForgotPassword">¿Olvidaste tu contraseña?</a>
          </div>

          <div class="divider"><span>o</span></div>

          <div class="register-link">
            <p>¿No tienes cuenta? <a href="#" @click.prevent="goToRegister">Regístrate aquí</a></p>
            <p>¿Eres tutor? <a href="#" @click.prevent="goToRegisterTutor">Registro de tutor</a></p>
          </div>
        </form>
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
    const form = ref({ email: '', password: '' })
    const loading = ref(false)
    const showPassword = ref(false)

    const handleLogin = async () => {
      try {
        loading.value = true
        const { data } = await authAPI.login(form.value.email, form.value.password)
        if (data.success) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          if (data.user.rol === 'docente') router.push('/panel-tutor')
          else router.push('/home')
        } else {
          alert('Error en el login: ' + (data.message || 'Credenciales inválidas'))
        }
      } catch (error) {
        console.error(error)
        const message = error.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.'
        alert(message)
      } finally {
        loading.value = false
      }
    }

    const handleForgotPassword = () => alert('Función de recuperar contraseña próximamente disponible')
    const goToRegister = () => router.push('/register')
    const goToRegisterTutor = () => router.push('/registro-tutor')

    return {
      form,
      loading,
      showPassword,
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
  background: linear-gradient(135deg, #2c3e50 0%, #36759e 100%);
  display: grid;
  place-items: center;
  padding: 24px;
}

.login-stack {
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.brand-group {
  width: 100%;
  max-width: 560px;
  align-self: center;

  --brand-offset-x: 0px;
  --brand-offset-y: 0px;

  display: flex;
  justify-content: center;
  transform: translate(
    var(--brand-offset-x),
    var(--brand-offset-y)
  );
}

/* Branding */
.brand {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: #ecf0f1;
  user-select: none;
}

.brand-logo {
  width: 120px;
  height: auto;
  object-fit: contain;
  border-radius: 0;
  box-shadow: none;
  transform: translateY(12px);
}

.brand-name {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.5px;
  line-height: 1;
}

/* Caja del formulario */
.form-box {
  width: 100%;
  background: #90c0d8;
  border-radius: 16px;
  padding: 28px 36px 28px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, .25);
  box-sizing: border-box;
}

/* Títulos */
.form-box h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 26px;
  font-weight: 800;
  text-align: center;
}

.subtitle {
  margin: 6px 0 24px;
  color: #2c3e50;
  opacity: .8;
  text-align: center;
}

/* Inputs */
.form-group { margin-bottom: 18px; }
.form-label { display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600; }

.form-input {
  width: 100%;
  padding: 14px 14px;
  border: none;
  border-radius: 10px;
  background: #fff;
  font-size: 16px;
  box-sizing: border-box;
  transition: box-shadow .2s ease;
}
.form-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(54, 117, 158, .35); }

/* Input con icono (ojo) */
.input-with-icon { position: relative; }
.icon-btn {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  border: 0; background: transparent; width: 36px; height: 36px;
  display: grid; place-items: center; cursor: pointer; color: #2c3e50; opacity: .8;
}
.icon-btn svg { width: 22px; height: 22px; }
.icon-btn:hover { opacity: 1; }

/* Botón principal */
.btn { width: 100%; padding: 14px; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer; transition: transform .02s ease, background-color .2s ease; }
.btn:active { transform: translateY(1px); }
.btn-primary { background-color: #365d6e; color: #fff; }
.btn-primary:hover { background-color: #2c4a5a; }

/* Links */
.row-actions { margin-top: 12px; text-align: left; }
.row-actions a { color: #2c3e50; text-decoration: underline; font-size: 14px; }
.row-actions a:hover { text-decoration: none; }

/* Separador */
.divider { position: relative; text-align: center; margin: 22px 0 6px; }
.divider::before, .divider::after {
  content: ""; position: absolute; top: 50%; width: 42%; height: 1px; background: rgba(44, 62, 80, .35);
}
.divider::before { left: 0; } .divider::after { right: 0; }
.divider span { color: #2c3e50; font-size: 13px; padding: 0 8px; background: #90c0d8; border-radius: 999px; }

.register-link { text-align: center; margin-top: 10px; }
.register-link p { margin: 0 0 6px; color: #2c3e50; font-size: 14px; }
.register-link a { color: #36759e; text-decoration: underline; font-weight: 600; }
.register-link a:hover { text-decoration: none; }

/* Responsivo */
@media (max-width: 640px) {
  .brand-logo { width: 108px; }
  .brand-name { font-size: 24px; }
}
@media (max-width: 520px) {
  .form-box { padding: 24px 22px 22px; }
}
</style>
