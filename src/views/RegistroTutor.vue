<template>
  <div class="registro-tutor-page">
    <div class="form-container">
      <div class="form-box">
        <h2 class="form-title">Registro de Tutor</h2>

        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label class="form-label">Apellidos y Nombres</label>
            <input
              type="text"
              class="form-input"
              placeholder="Pérez Juan Carlos"
              v-model="form.nombreCompleto"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Teléfono</label>
            <input
              type="tel"
              class="form-input"
              placeholder="+51 987654321"
              v-model="form.telefono"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
            <input
              type="email"
              class="form-input"
              placeholder="tutor@correo.com"
              v-model="form.email"
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

          <!-- Foto de perfil -->
          <div class="form-group">
            <label class="form-label">Foto de perfil</label>
            <div class="photo-upload">
              <div class="photo-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Documentos profesionales -->
          <div class="form-group">
            <label class="form-label">Documentos profesionales</label>
            <div class="file-upload">
              <input
                type="file"
                class="file-input"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <div class="file-display">
                <span class="file-text">Selecciona tus archivos</span>
                <button type="button" class="submit-files-btn">
                  Subir archivos
                </button>
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
                Acepto los <a href="#" @click.prevent="showTerms">Términos y condiciones</a>
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Registrando...' : 'Registrar cuenta' }}
          </button>

          <div class="login-link">
            <p>
              ¿Ya tienes cuenta?
              <a href="#" @click.prevent="goToLogin">Inicia sesión aquí</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authAPI } from "../api/auth";

export default {
  name: "RegistroTutor",
  setup() {
    const router = useRouter();
    const form = ref({
      nombreCompleto: "",
      telefono: "",
      email: "",
      password: "",
      acceptTerms: false,
    });
    const loading = ref(false);

    const handleRegister = async () => {
      if (!form.value.acceptTerms) {
        alert("Debe aceptar los términos y condiciones");
        return;
      }

      if (form.value.password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      try {
        loading.value = true;

        const nameParts = form.value.nombreCompleto.split(" ");
        const nombre = nameParts[0] || "";
        const apellido = nameParts.slice(1).join(" ") || "";

        const userData = {
          email: form.value.email,
          password: form.value.password,
          rol: "docente",
          nombre,
          apellido,
          telefono: form.value.telefono,
        };

        const response = await authAPI.register(userData);

        if (response.data.success) {
          alert("¡Registro de tutor exitoso! Por favor, inicia sesión.");
          router.push("/login");
        } else {
          alert("Error en el registro: " + response.data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        const message =
          error.response?.data?.message ||
          "Error al registrarse. El email puede estar en uso.";
        alert(message);
      } finally {
        loading.value = false;
      }
    };

    const goToLogin = () => {
      router.push("/login");
    };

    const showTerms = () => {
      alert("Términos y condiciones próximamente disponibles");
    };

    return {
      form,
      loading,
      handleRegister,
      goToLogin,
      showTerms,
    };
  },
};
</script>

<style scoped>
.registro-tutor-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #2c3e50, #36759e);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.form-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.form-box {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.form-title {
  font-size: 26px;
  font-weight: 800;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 22px;
}

.form-label {
  display: block;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background-color: #f4f6f7;
  font-size: 16px;
}

.form-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(54, 117, 158, 0.3);
}

/* Foto */
.photo-upload {
  display: flex;
  justify-content: center;
}
.photo-placeholder {
  width: 150px;
  height: 150px;
  background-color: #ecf0f1;
  border: 2px dashed #bdc3c7;
  border-radius: 10px;
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

/* Archivos */
.file-upload {
  display: flex;
  align-items: center;
  gap: 10px;
}
.file-input {
  display: none;
}
.file-display {
  display: flex;
  align-items: center;
  gap: 10px;
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
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.submit-files-btn:hover {
  background-color: #2c3e50;
}

/* Checkbox */
.checkbox-group {
  margin-top: 15px;
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
}
.checkbox-label a {
  color: #36759e;
  text-decoration: underline;
}
.checkbox-label a:hover {
  text-decoration: none;
}

/* Botón */
.btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 700;
}
.btn-primary {
  background-color: #365d6e;
  color: white;
}
.btn-primary:hover:not(:disabled) {
  background-color: #2c4a5a;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Link */
.login-link {
  text-align: center;
  margin-top: 18px;
}
.login-link p {
  color: #2c3e50;
  font-size: 14px;
}
.login-link a {
  color: #36759e;
  text-decoration: underline;
  font-weight: 600;
}
.login-link a:hover {
  text-decoration: none;
}

@media (max-width: 768px) {
  .form-box {
    padding: 30px 22px;
  }
}
</style>
