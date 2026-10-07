// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../../pages/loginPage.vue'
import RegisterPage from '../../pages/registerPage.vue'
import ProfilePage from '../../pages/profilePage.vue'
import RequestsPage from '../../pages/requestsPage.vue'
import CreateRequestPage from '../../pages/createRequestPage.vue'

const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

const routes = [
  {
    path: '/',
    redirect: '/profile'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next('/profile')
      } else {
        next()
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next('/profile')
      } else {
        next()
      }
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next()
      } else {
        next('/login')
      }
    }
  },
  {
    path: '/requests',
    name: 'Requests',
    component: RequestsPage,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next()
      } else {
        next('/login')
      }
    }
  },
  {
    path: '/create_requests',
    name: 'Create Request',
    component: CreateRequestPage,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next()
      } else {
        next('/login')
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router