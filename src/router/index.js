import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import RegistroTutor from '../views/RegistroTutor.vue'
import Home from '../views/Home.vue'
import PanelTutor from '../views/PanelTutor.vue'
import Chat from '../views/Chat.vue'
import CursoDetalle from '../views/CursoDetalle.vue'
import PerfilEstudiante from '../views/PerfilEstudiante.vue'
import PerfilTutor from '../views/PerfilTutor.vue'
import EditPerfilEstudiante from '../views/EditPerfilEstudiante.vue'
import EditPerfilTutor from '../views/EditPerfilTutor.vue'
import ConfigCurso from '../views/ConfigCurso.vue'
import MisCursos from '../views/MisCursos.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/registro-tutor',
    name: 'RegistroTutor',
    component: RegistroTutor
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/panel-tutor',
    name: 'PanelTutor',
    component: PanelTutor,
    meta: { requiresAuth: true }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: { requiresAuth: true }
  },
  {
    path: '/curso/:id',
    name: 'CursoDetalle',
    component: CursoDetalle,
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil',
    name: 'PerfilEstudiante',
    component: PerfilEstudiante,
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil-tutor',
    name: 'PerfilTutor',
    component: PerfilTutor,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-perfil',
    name: 'EditPerfilEstudiante',
    component: EditPerfilEstudiante,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-perfil-tutor',
    name: 'EditPerfilTutor',
    component: EditPerfilTutor,
    meta: { requiresAuth: true }
  },
  {
    path: '/config-curso',
    name: 'ConfigCurso',
    component: ConfigCurso,
    meta: { requiresAuth: true }
  },
  {
    path: '/mis-cursos',
    name: 'MisCursos',
    component: MisCursos,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de autenticación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    // Si ya está logueado, redirigir según el rol
    if (user.rol === 'docente') {
      next('/panel-tutor')
    } else {
      next('/home')
    }
  } else if (to.path === '/register' && token) {
    // Si ya está logueado, redirigir según el rol
    if (user.rol === 'docente') {
      next('/panel-tutor')
    } else {
      next('/home')
    }
  } else if (to.path === '/registro-tutor' && token) {
    // Si ya está logueado, redirigir según el rol
    if (user.rol === 'docente') {
      next('/panel-tutor')
    } else {
      next('/home')
    }
  } else {
    next()
  }
})

export default router
