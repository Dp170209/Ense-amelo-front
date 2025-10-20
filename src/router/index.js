import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import CursoDetalle from '../views/CursoDetalle.vue'
import PerfilEstudiante from '../views/PerfilEstudiante.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
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
    path: '/home',
    name: 'Home',
    component: Home,
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
    // Si ya está logueado, redirigir al home
    next('/home')
  } else if (to.path === '/register' && token) {
    // Si ya está logueado, redirigir al home
    next('/home')
  } else {
    next()
  }
})

export default router
