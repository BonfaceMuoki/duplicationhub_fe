<template>
  <aside :class="[
    'bg-white shadow-md z-40 md:relative md:translate-x-0 md:flex md:flex-col md:w-64',
    sidebarOpen ? 'fixed inset-y-0 left-0 w-64' : 'hidden md:block'
  ]">
    <!-- Logo -->
    <div class="p-5 border-b border-gray-200 flex items-center justify-center">
      <img src="/duplicationhublogo.jpeg" class="w-28 h-auto object-contain" />
    </div>

    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <!-- Dashboard - Always visible -->
      <router-link to="/dashboard" class="flex items-center gap-3 px-4 py-2 rounded-md" :class="navLinkClass('/dashboard')">
        <i class="fas fa-home w-5"></i>
        <span>Dashboard</span>
      </router-link>

      <!-- Admin Only Navigation -->
      <template v-if="isAdmin">
        <!-- Pages Manager -->
        <router-link to="/pages" class="flex items-center gap-3 px-4 py-2 rounded-md" :class="navLinkClass('/pages')">
          <i class="fas fa-copy w-5"></i>
          <span>Pages Manager</span>
        </router-link>

        <!-- Page Requests -->
        <router-link to="/page-requests" class="flex items-center gap-3 px-4 py-2 rounded-md" :class="navLinkClass('/page-requests')">
          <i class="fas fa-clipboard-list w-5"></i>
          <span>Page Requests</span>
        </router-link>

        <!-- Settings -->
        <!-- <router-link to="/organization-settings" class="flex items-center gap-3 px-4 py-2 rounded-md" :class="navLinkClass('/settings')">
          <i class="fas fa-cogs w-5"></i>
          <span>Settings</span>
        </router-link> -->
      </template>

      <!-- Common Navigation for All Users -->
      <!-- Leads -->
      <router-link to="/leads" class="flex items-center gap-3 px-4 py-2 rounded-md" :class="navLinkClass('/leads')">
        <i class="fas fa-address-book w-5"></i>
        <span>Leads</span>
      </router-link>

      <!-- Referrers -->
      <router-link to="/referrers" class="flex items-center gap-3 px-4 py-2 rounded-md" :class="navLinkClass('/referrers')">
        <i class="fas fa-users w-5"></i>
        <span>Referrers</span>
      </router-link>

      <!-- User Role Indicator -->
      <div class="mt-8 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div class="flex items-center gap-2 text-sm">
          <i class="fas fa-user-shield text-gray-500"></i>
          <span class="text-gray-600">Role: </span>
          <span class="font-medium text-gray-800">{{ userRole || 'Loading...' }}</span>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { authStore } from '../store/authStore'

defineProps({ sidebarOpen: Boolean })

const route = useRoute()
const openMenu = ref(null)
const auth = authStore()

// Computed properties for user role and admin status
const userRole = computed(() => auth.role)
const isAdmin = computed(() => { 
  const role = auth.role?.toLowerCase()
  return role === 'admin' || role === 'administrator' || role === 'super_admin' || role === 'superadmin' || role === 'super admin'
})

const toggleMenu = (menu) => {
  openMenu.value = openMenu.value === menu ? null : menu
}

watch(() => route.path, (path) => {
  if (path.startsWith('/classes')) {
    openMenu.value = 'classes'
  } else if (path.startsWith('/set-exam') || path.startsWith('/exams')) {
    openMenu.value = 'exams'
  } else if (path.startsWith('/teachers') || path.startsWith('/nurses')) {
    openMenu.value = 'staff'
  } else if (path.startsWith('/parents')) {
    openMenu.value = 'parent'
  } else if (path.startsWith('/new-admission')) {
    openMenu.value = 'admissions'
  } else if (path.startsWith('/students-medical')) {
    openMenu.value = 'medical'
  } else if (path.startsWith('/parents-events') || path.startsWith('/student-event-parent-consent')) {
    openMenu.value = 'notice-board'
  } else {
    openMenu.value = null
  }
}, { immediate: true })

const navLinkClass = (path) => {
  return route.path === path || route.path.startsWith(path)
    ? 'bg-green-600 text-white font-medium shadow-sm'
    : 'text-gray-700 hover:bg-green-100 hover:text-green-700 transition-colors duration-150'
}

const menuButtonClass = (menu) => {
  return openMenu.value === menu
    ? 'bg-green-100 text-green-700 font-medium'
    : 'text-gray-700 hover:bg-green-100 hover:text-green-700 transition-colors duration-150'
}
</script>
