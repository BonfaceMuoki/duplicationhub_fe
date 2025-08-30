// src/routes/index.js or similar

import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import Pages from '../pages/Pages.vue'
import Leads from '../pages/Leads.vue'
import Referrers from '../pages/Referrers.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import { authStore } from '../store/authStore'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    meta: { isProtected: true, requiresAuth: true },
    children: [ 
      { 
        path: '', 
        name: 'Dashboard', 
        component: Dashboard, 
        meta: { isProtected: true, requiresAuth: true } 
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { isProtected: false, requiresAuth: true }
      },
      {
        path: '/pages',
        name: 'Pages',
        component: Pages,
        meta: { isProtected: false, requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/leads',
        name: 'Leads',
        component: Leads,
        meta: { isProtected: false, requiresAuth: true }
      },
      {
        path: '/referrers',
        name: 'Referrers',
        component: Referrers,
        meta: { isProtected: false, requiresAuth: true }
      },      
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [{
      path: "login",
      name: "Login",
      component: Login
    }]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Helper function to check if user is admin
const isAdmin = (role) => {
  if (!role) return false
  const roleLower = role.toLowerCase()
  return roleLower === 'admin' || 
         roleLower === 'administrator' || 
         roleLower === 'super_admin' || 
         roleLower === 'superadmin' || 
         roleLower === 'super admin'
}

router.beforeEach((to, from, next) => {
  const auth = authStore();
  console.log('Auth state:', auth);
  console.log('Token:', auth.token);
  console.log('isAuthenticated:', auth.isAuthenticated);
  
  // Check if route requires authentication and user is not authenticated
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    console.log('Redirecting to login - user not authenticated');
    next('/auth/login');
    return;
  }
  
  // Check if route requires admin privileges
  if (to.meta.requiresAdmin && !isAdmin(auth.role)) {
    return;
  }
  
  // If user is logged in and trying to access login page, redirect to dashboard
  if (to.path === '/auth/login' && auth.isAuthenticated) {
    next('/dashboard');
    return;
  }
  
  // Allow access to the route
  next();
});

export default router
