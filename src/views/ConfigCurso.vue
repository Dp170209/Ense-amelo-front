<template>
  <div class="config-curso-page">
    <!-- Header -->
    <div class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1>Configuracion Curso (Docente)</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Bar -->
    <div class="nav-bar">
      <div class="container">
        <div class="nav-content">
          <div class="nav-left">
            <div class="nav-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3H21V5H3V3M3 7H21V9H3V7M3 11H21V13H3V11M3 15H21V17H3V15M3 19H21V21H3V19Z"/>
              </svg>
            </div>
          </div>
          <div class="nav-right">
            <router-link to="/panel-tutor" class="nav-link">Panel</router-link>
            <router-link to="/mis-cursos" class="nav-link">Cursos</router-link>
            <router-link to="/chat" class="nav-link">Chats</router-link>
            <router-link to="/explorar" class="nav-link">Explorar</router-link>
            <div class="user-icon" @click="handleProfile">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <div class="form-container">
          <form @submit.prevent="handleSubmit">
            <div class="form-layout">
              <!-- Left Section -->
              <div class="left-section">
                <button type="button" @click="goBack" class="back-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"/>
                  </svg>
                </button>
                
                <div class="image-upload-large">
                  <div class="image-placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                    </svg>
                  </div>
                </div>

                <div class="description-section">
                  <h3>DESCRIPCION DEL CURSO</h3>
                  <textarea
                    class="description-textarea"
                    v-model="form.descripcion"
                    placeholder="Describe detalladamente el contenido del curso, objetivos, metodología y lo que aprenderán los estudiantes..."
                    rows="8"
                    required
                  ></textarea>
                </div>
              </div>

              <!-- Right Section -->
              <div class="right-section">
                <div class="form-group">
                  <label class="form-label">Titulo curso</label>
                  <input
                    type="text"
                    class="form-input"
                    v-model="form.nombre"
                    placeholder="Nombre del curso"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Tag</label>
                  <div class="tag-container">
                    <div class="tag-display">
                      <span class="tag-text">Tag</span>
                      <button type="button" @click="addTag" class="add-tag-btn">+</button>
                    </div>
                    <div class="tags-list">
                      <div 
                        v-for="(tag, index) in form.tags" 
                        :key="index"
                        class="tag-item"
                      >
                        {{ tag }}
                        <button type="button" @click="removeTag(index)" class="remove-tag">×</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Bs/hora</label>
                  <div class="price-container">
                    <input
                      type="number"
                      class="form-input price-input"
                      v-model="form.precio_reserva"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                    />
                    <div class="toggle-container">
                      <label class="toggle-label">
                        <input type="checkbox" v-model="form.necesita_reserva" class="toggle-input">
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p class="price-hint">Texto cualquiera para poder poner información del curso</p>
                </div>

                <div class="form-group">
                  <label class="form-label">Modalidad</label>
                  <select class="form-select" v-model="form.modalidad" required>
                    <option value="">Seleccionar modalidad</option>
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                    <option value="hibrida">Híbrida</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Categoría</label>
                  <select class="form-select" v-model="form.categoria" required>
                    <option value="">Seleccionar categoría</option>
                    <option v-for="categoria in categorias" :key="categoria._id" :value="categoria._id">
                      {{ categoria.nombre }}
                    </option>
                  </select>
                </div>

                <div class="image-upload-small">
                  <div class="image-placeholder-small">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                    </svg>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="button" @click="goBack" class="cancel-btn">Cancelar</button>
                  <button type="submit" class="save-btn" :disabled="loading">
                    {{ loading ? 'Guardando...' : 'Guardar Curso' }}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="footer-logo">
              <div class="logo-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 6H2V4C2 2.89 2.89 2 4 2H6V4H4V6M20 2H22V4H20V6H22V8H20V10H18V8H16V6H18V4H16V2H18V0H20V2M4 20H2V22C2 23.11 2.89 24 4 24H6V22H4V20M22 22V20H20V18H22V16H20V14H18V16H16V18H18V20H16V22H18V24H20V22H22Z"/>
                </svg>
              </div>
            </div>
            <div class="social-icons">
              <div class="social-icon">X</div>
              <div class="social-icon">IG</div>
              <div class="social-icon">YT</div>
              <div class="social-icon">LI</div>
            </div>
          </div>
          
          <div class="footer-section">
            <h3 class="footer-title">Use cases</h3>
            <ul class="footer-links">
              <li><a href="#">UI design</a></li>
              <li><a href="#">UX design</a></li>
              <li><a href="#">Wireframing</a></li>
              <li><a href="#">Diagramming</a></li>
              <li><a href="#">Brainstorming</a></li>
              <li><a href="#">Online whiteboard</a></li>
              <li><a href="#">Team collaboration</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3 class="footer-title">Explore</h3>
            <ul class="footer-links">
              <li><a href="#">Design</a></li>
              <li><a href="#">Prototyping</a></li>
              <li><a href="#">Development features</a></li>
              <li><a href="#">Design systems</a></li>
              <li><a href="#">Collaboration features</a></li>
              <li><a href="#">Design process</a></li>
              <li><a href="#">FigJam</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3 class="footer-title">Resources</h3>
            <ul class="footer-links">
              <li><a href="#">Blog</a></li>
              <li><a href="#">Best practices</a></li>
              <li><a href="#">Colors</a></li>
              <li><a href="#">Color wheel</a></li>
              <li><a href="#">Support</a></li>
              <li><a href="#">Developers</a></li>
              <li><a href="#">Resource library</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { cursosAPI } from '../api/cursos'
import { categoriasAPI } from '../api/categorias'

export default {
  name: 'ConfigCurso',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const categorias = ref([])
    
    const form = ref({
      nombre: '',
      descripcion: '',
      modalidad: '',
      precio_reserva: 0,
      necesita_reserva: true,
      categoria: '',
      tags: []
    })

    const fetchCategorias = async () => {
      try {
        const response = await categoriasAPI.getCategorias()
        if (response.data.success) {
          categorias.value = response.data.categorias
        }
      } catch (error) {
        console.error('Error obteniendo categorías:', error)
      }
    }

    const addTag = () => {
      const tag = prompt('Ingresa el tag:')
      if (tag && tag.trim() && !form.value.tags.includes(tag.trim())) {
        form.value.tags.push(tag.trim())
      }
    }

    const removeTag = (index) => {
      form.value.tags.splice(index, 1)
    }

    const handleSubmit = async () => {
      if (!form.value.nombre || !form.value.descripcion || !form.value.modalidad || !form.value.categoria) {
        alert('Por favor completa todos los campos requeridos')
        return
      }

      if (form.value.precio_reserva <= 0) {
        alert('El precio debe ser mayor a 0')
        return
      }

      try {
        loading.value = true
        
        const cursoData = {
          nombre: form.value.nombre,
          descripcion: form.value.descripcion,
          modalidad: form.value.modalidad,
          precio_reserva: form.value.precio_reserva,
          necesita_reserva: form.value.necesita_reserva,
          categorias: [form.value.categoria], // Convertir a array como espera el modelo
          tags: form.value.tags,
          fotos: [] // Por ahora sin imágenes
        }

        const response = await cursosAPI.createCurso(cursoData)
        
        if (response.data.success) {
          alert('Curso creado exitosamente!')
          router.push('/panel-tutor')
        } else {
          alert('Error al crear el curso: ' + response.data.message)
        }
      } catch (error) {
        console.error('Error creando curso:', error)
        alert('Error al crear el curso. Inténtalo de nuevo.')
      } finally {
        loading.value = false
      }
    }

    const goBack = () => {
      router.push('/panel-tutor')
    }

    const handleProfile = () => {
      router.push('/perfil-tutor')
    }

    onMounted(() => {
      fetchCategorias()
    })

    return {
      form,
      loading,
      categorias,
      addTag,
      removeTag,
      handleSubmit,
      goBack,
      handleProfile
    }
  }
}
</script>

<style scoped>
.config-curso-page {
  min-height: 100vh;
  background-color: #ffffff;
}

.header {
  background-color: #7f8c8d;
  color: white;
  padding: 15px 0;
}

.header-content {
  display: flex;
  align-items: center;
}

.header-left h1 {
  font-size: 18px;
  margin: 0;
}

.nav-bar {
  background-color: #36759e;
  color: white;
  padding: 10px 0;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-icon {
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 0.8;
}

.user-icon {
  width: 35px;
  height: 35px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.user-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.main-content {
  padding: 40px 0;
  background-color: #f8f9fa;
}

.form-container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
  align-self: flex-start;
}

.back-btn:hover {
  background-color: #f0f0f0;
}

.back-btn svg {
  width: 24px;
  height: 24px;
  color: #2c3e50;
}

.image-upload-large {
  width: 100%;
  height: 300px;
  background-color: #ecf0f1;
  border: 2px dashed #bdc3c7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.image-upload-large:hover {
  background-color: #d5dbdb;
  border-color: #36759e;
}

.image-placeholder {
  width: 60px;
  height: 60px;
  color: #7f8c8d;
}

.image-placeholder svg {
  width: 100%;
  height: 100%;
}

.description-section h3 {
  color: #2c3e50;
  font-size: 16px;
  margin-bottom: 15px;
  font-weight: 500;
}

.description-textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  resize: vertical;
  min-height: 200px;
  box-sizing: border-box;
}

.description-textarea:focus {
  outline: none;
  border-color: #36759e;
  box-shadow: 0 0 0 2px rgba(54, 117, 158, 0.1);
}

.right-section {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  color: #2c3e50;
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

.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  box-sizing: border-box;
}

.form-select:focus {
  outline: none;
  border-color: #36759e;
  box-shadow: 0 0 0 2px rgba(54, 117, 158, 0.1);
}

.tag-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tag-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tag-text {
  background-color: #27ae60;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.add-tag-btn {
  background-color: #36759e;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.add-tag-btn:hover {
  background-color: #2c5aa0;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  background-color: #ecf0f1;
  color: #2c3e50;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.remove-tag {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.price-input {
  flex: 1;
}

.toggle-container {
  display: flex;
  align-items: center;
}

.toggle-label {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #bdc3c7;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-input:checked + .toggle-slider {
  background-color: #8e44ad;
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.price-hint {
  color: #7f8c8d;
  font-size: 14px;
  margin: 5px 0 0 0;
  font-style: italic;
}

.image-upload-small {
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

.image-upload-small:hover {
  background-color: #d5dbdb;
  border-color: #36759e;
}

.image-placeholder-small {
  width: 30px;
  height: 30px;
  color: #7f8c8d;
}

.image-placeholder-small svg {
  width: 100%;
  height: 100%;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
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

.footer {
  background-color: #2c3e50;
  color: white;
  padding: 40px 0;
  margin-top: 60px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 40px;
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.footer-logo {
  margin-bottom: 20px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background-color: #ecf0f1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon svg {
  width: 25px;
  height: 25px;
  color: #2c3e50;
}

.social-icons {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.social-icon {
  width: 30px;
  height: 30px;
  background-color: #34495e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 12px;
}

.social-icon:hover {
  background-color: #36759e;
}

.footer-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s;
  font-size: 14px;
}

.footer-links a:hover {
  color: white;
}

@media (max-width: 768px) {
  .form-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .nav-right {
    gap: 10px;
  }
  
  .nav-link {
    font-size: 14px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .save-btn {
    width: 100%;
  }
  
  .price-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .footer-content {
    flex-direction: column;
  }
}
</style>
