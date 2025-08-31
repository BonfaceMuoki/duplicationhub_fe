<template>
  <div class="h-screen p-15 flex flex-col justify-center items-center">
    <div class="p-5 uppercase text-center">
      Reset Password
    </div>
    <form @submit.prevent="handleResetPassword" class="w-full">
      <div class="card w-full p-3 min-h-[500px] flex flex-col justify-center bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="mb-6">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
          <input 
            type="email" 
            v-model="email"
            id="email" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="john.doe@company.com" 
            required 
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>
        
        <div class="mb-6">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
          <input 
            v-model="password"
            type="password"
            id="password" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:ring-blue-500" 
            placeholder="•••••••••" 
            required 
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>
        
        <div class="mb-6">
          <label for="password_confirmation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm New Password</label>
          <input 
            v-model="password_confirmation"
            type="password"
            id="password_confirmation" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:ring-blue-500" 
            placeholder="•••••••••" 
            required 
          />
          <p v-if="errors.password_confirmation" class="text-red-500 text-sm mt-1">{{ errors.password_confirmation }}</p>
        </div>
        
        <button 
          type="submit" 
          :disabled="isLoading"
          class="text-white bg-[#28a745] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Resetting...' : 'Reset Password' }}
        </button>
        
        <div class="mt-4 text-center">
          <router-link to="/auth/login" class="text-blue-600 hover:text-blue-800 text-sm">
            Back to Login
          </router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { resetPassword } from '../services/authService'
import { useToast } from 'vue-toast-notification'

const toast = useToast()
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const errors = ref({})
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()

onMounted(() => {
  // Get token from URL query parameters
  const token = route.query.token
  if (!token) {
    toast.error('Reset token is missing')
    router.push('/auth/forgot-password')
    return
  }
})

const validateForm = () => {
  const newErrors = {}
  
  if (!email.value) {
    newErrors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    newErrors.email = 'Invalid email format'
  }

  if (!password.value) {
    newErrors.password = 'Password is required'
  } else if (password.value.length < 8) {
    newErrors.password = 'Password must be at least 8 characters'
  }

  if (!password_confirmation.value) {
    newErrors.password_confirmation = 'Password confirmation is required'
  } else if (password.value !== password_confirmation.value) {
    newErrors.password_confirmation = 'Passwords do not match'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleResetPassword = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  try {
    const token = route.query.token
    await resetPassword({
      token: token,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value
    })
    
    toast.success('Password reset successfully! Please login with your new password.')
    router.push('/auth/login')
  } catch (error) {
    console.error('Reset password error:', error)
    toast.error(error.response?.data?.message || 'Failed to reset password')
  } finally {
    isLoading.value = false
  }
}
</script> 