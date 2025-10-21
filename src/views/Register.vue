<template>
  <div class="register-page">
    <div class="auth-wrapper">
      <!-- Grupo ajustable: mueve el brand con --brand-offset-x / --brand-offset-y -->
      <!-- Ejemplo rápido: style="--brand-offset-x:-18px; --brand-offset-y:4px;" -->
      <div class="brand-group" style="--brand-offset-x:-18px;">
        <div class="brand" aria-label="Enseñamelo branding">
          <img class="brand-logo" src="../assets/logo3.png" alt="Enseñamelo" />
          <div class="brand-name">ENSEÑAMELO</div>
        </div>
      </div>

      <!-- Caja de formulario -->
      <div class="form-box">
        <h2>Crea tu cuenta</h2>
        <p class="subtitle">Completa tus datos para registrarte</p>

        <form @submit.prevent="handleRegister" novalidate>
          <div class="two-col">
            <div class="form-group">
              <label class="form-label">Nombre</label>
              <input
                type="text"
                class="form-input"
                placeholder="Ej.: María"
                v-model.trim="form.nombre"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Apellido</label>
              <input
                type="text"
                class="form-input"
                placeholder="Ej.: López"
                v-model.trim="form.apellido"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
            <input
              type="email"
              class="form-input"
              placeholder="tu@email.com"
              v-model.trim="form.email"
              autocomplete="email"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Teléfono (opcional)</label>
            <input
              type="tel"
              class="form-input"
              placeholder="+51 999 888 777"
              v-model.trim="form.telefono"
              autocomplete="tel"
            />
          </div>

          <div class="two-col">
            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <div class="input-with-icon">
                <input
                  :type="showPass ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Mínimo 6 caracteres"
                  v-model="form.password"
                  autocomplete="new-password"
                  required
                />
                <button
                  type="button"
                  class="icon-btn"
                  @click="showPass = !showPass"
                  :aria-label="showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  <svg v-if="!showPass" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.1 3.51 3.5 2.1l18.4 18.4-1.41 1.41-3.05-3.05A12.6 12.6 0 0 1 12 19c-7 0-10-7-10-7a20.3 20.3 0 0 1 5.12-6.16L2.1 3.51ZM12 7c7 0 10 7 10 7a20.9 20.9 0 0 1-4.23 5.36l-2.04-2.04A5 5 0 0 0 9.68 9.28L7.64 7.24A12.6 12.6 0 0 1 12 7Zm0 3a3 3 0 0 1 3 3c0 .47-.11.9-.3 1.3L10.7 10.3c.4-.19.83-.3 1.3-.3Z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Confirmar contraseña</label>
              <div class="input-with-icon">
                <input
                  :type="showConfirm ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Repite tu contraseña"
                  v-model="form.confirmPassword"
                  autocomplete="new-password"
                  required
                />
                <button
                  type="button"
                  class="icon-btn"
                  @click="showConfirm = !showConfirm"
                  :aria-label="showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  <svg v-if="!showConfirm" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.1 3.51 3.5 2.1l18.4 18.4-1.41 1.41-3.05-3.05A12.6 12.6 0 0 1 12 19c-7 0-10-7-10-7a20.3 20.3 0 0 1 5.12-6.16L2.1 3.51ZM12 7c7 0 10 7 10 7a20.9 20.9 0 0 1-4.23 5.36l-2.04-2.04A5 5 0 0 0 9.68 9.28L7.64 7.24A12.6 12.6 0 0 1 12 7Zm0 3a3 3 0 0 1 3 3c0 .47-.11.9-.3 1.3L10.7 10.3c.4-.19.83-.3 1.3-.3Z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Rol -->
          <div class="role-group">
            <p class="role-title">Tipo de usuario</p>
            <label class="role-option">
              <input type="radio" value="estudiante" v-model="form.rol" />
              <span>Estudiante</span>
            </label>
            <label class="role-option">
              <input type="radio" value="docente" v-model="form.rol" />
              <span>Docente</span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Registrando...' : 'Registrarse' }}
          </button>

          <div class="login-link">
            <p>¿Ya tienes cuenta? <a href="#" @click.prevent="goToLogin">Inicia sesión aquí</a></p>
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
      rol: 'estudiante'
    })
    const loading = ref(false)
    const showPass = ref(false)
    const showConfirm = ref(false)

    const handleRegister = async () => {
      if (form.value.password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres')
        return
      }
      if (form.value.password !== form.value.confirmPassword) {
        alert('Las contraseñas no coinciden')
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        alert('Ingresa un correo válido')
        return
      }

      try {
        loading.value = true
        const userData = {
          email: form.value.email,
          password: form.value.password,
          rol: form.value.rol,
          nombre: form.value.nombre || 'Usuario',
          apellido: form.value.apellido || '',
          telefono: form.value.telefono || ''
        }
        const { data } = await authAPI.register(userData)
        if (data.success) {
          alert('¡Registro exitoso! Ahora puedes iniciar sesión.')
          router.push('/login')
        } else {
          alert('Error en el registro: ' + (data.message || 'Intenta de nuevo'))
        }
      } catch (error) {
        console.error('Error:', error)
        const message =
          error.response?.data?.message ||
          'Error al registrarse. Es posible que el email ya esté en uso.'
        alert(message)
      } finally {
        loading.value = false
      }
    }

    const goToLogin = () => router.push('/login')

    return {
      form,
      loading,
      showPass,
      showConfirm,
      handleRegister,
      goToLogin
    }
  }
}
</script>

<style scoped>
/* Fondo igual al login */
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #2c3e50 0%, #36759e 100%);
  display: grid;
  place-items: center;
  padding: 34px;
}

/* Contenedor centrado */
.auth-wrapper {
  width: 100%;
  max-width: 1040px;
  display: grid;
  gap: 16px;
  justify-items: center;
}

/* ===== Grupo del brand con offsets configurables ===== */
.brand-group {
  width: 100%;
  max-width: 840px; /* mismo ancho visual que el form */
  align-self: center;

  /* offsets editables por ti */
  --brand-offset-x: 0px;   /* izquierda(-) / derecha(+) */
  --brand-offset-y: 0px;   /* arriba(-) / abajo(+) */

  display: flex;
  justify-content: center;
  transform: translate(var(--brand-offset-x), var(--brand-offset-y));
}

/* Branding (sin burbuja) */
.brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;                 /* logo pegado al título */
  color: #ecf0f1;
  user-select: none;
  transform: translateY(18px);
}

.brand-logo {
  width: 120px;             /* un poco más grande */
  height: auto;
  object-fit: contain;
  border-radius: 0;
  box-shadow: none;
  transform: translateY(12px);
}

.brand-name {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: .5px;
  line-height: 1;
}

/* Formulario amplio y centrado */
.form-box {
  width: 100%;
  max-width: 840px;
  background: #90c0d8;
  border-radius: 16px;
  padding: 44px;
  box-shadow: 0 24px 60px rgba(0,0,0,.26);
}
.form-box h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 28px;
  font-weight: 800;
}
.subtitle {
  margin: 8px 0 24px;
  color: #2c3e50;
  opacity: .85;
}

/* Siempre una columna */
.two-col { display: block; }
.two-col .form-group { margin-bottom: 18px; }

/* Inputs */
.form-group { margin-bottom: 18px; }
.form-label { display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600; }

.form-input {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background: #fff;
  font-size: 17px;
  box-sizing: border-box;
  transition: box-shadow .2s ease;
}
.form-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(54,117,158,.35); }

/* Input con icono (ojo) */
.input-with-icon { position: relative; }
.icon-btn {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  border: 0; background: transparent; width: 38px; height: 38px;
  display: grid; place-items: center; cursor: pointer; color: #2c3e50; opacity: .85;
}
.icon-btn svg { width: 22px; height: 22px; }
.icon-btn:hover { opacity: 1; }

/* Rol (radios) */
.role-group { margin: 12px 0 20px; }
.role-title { color: #2c3e50; font-weight: 600; margin-bottom: 8px; }
.role-option { display: inline-flex; align-items: center; gap: 8px; margin-right: 18px; font-size: 16px; color: #2c3e50; }
.role-option input { width: 16px; height: 16px; accent-color: #36759e; }

/* Botón */
.btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform .02s ease, background-color .2s ease;
}
.btn:active { transform: translateY(1px); }
.btn-primary { background-color: #365d6e; color: #fff; }
.btn-primary:hover { background-color: #2c4a5a; }

/* Link a login */
.login-link { text-align: center; margin-top: 14px; }
.login-link p { margin: 0; color: #2c3e50; font-size: 14px; }
.login-link a { color: #36759e; text-decoration: underline; font-weight: 600; }
.login-link a:hover { text-decoration: none; }

/* Responsivo */
@media (max-width: 640px) {
  .form-box { max-width: 100%; padding: 28px 22px 24px; }
  .brand-group { max-width: 100%; }
  .brand-logo { width: 108px; }
  .brand-name { font-size: 24px; }
}
</style>
