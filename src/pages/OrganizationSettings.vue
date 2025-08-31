<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Organization Settings</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage your organization's profile and preferences</p>
    </div>

    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Profile Tab -->
      <div v-if="activeTab === 'profile'" class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Organization Profile</h2>
          
          <form @submit.prevent="updateOrganizationProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="orgName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organization Name
                </label>
                <input
                  id="orgName"
                  v-model="orgProfile.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter organization name"
                  required
                />
              </div>

              <div>
                <label for="orgEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Email
                </label>
                <input
                  id="orgEmail"
                  v-model="orgProfile.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="contact@organization.com"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="orgPhone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  id="orgPhone"
                  v-model="orgProfile.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label for="orgWebsite" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <input
                  id="orgWebsite"
                  v-model="orgProfile.website"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://www.organization.com"
                />
              </div>
            </div>

            <div>
              <label for="orgAddress" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <textarea
                id="orgAddress"
                v-model="orgProfile.address"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter organization address"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isUpdatingProfile"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isUpdatingProfile ? 'Updating...' : 'Update Profile' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Preferences Tab -->
      <div v-if="activeTab === 'preferences'" class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Organization Preferences</h2>
          
          <form @submit.prevent="updatePreferences" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label for="timezone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  id="timezone"
                  v-model="preferences.timezone"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>

              <div>
                <label for="currency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  id="currency"
                  v-model="preferences.currency"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>

              <div>
                <label for="language" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  v-model="preferences.language"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center">
                <input
                  id="notifications"
                  v-model="preferences.emailNotifications"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="notifications" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Email notifications
                </label>
              </div>

              <div class="flex items-center">
                <input
                  id="twoFactor"
                  v-model="preferences.twoFactorAuth"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="twoFactor" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Two-factor authentication
                </label>
              </div>
            </div>

            <button
              type="submit"
              :disabled="isUpdatingPreferences"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isUpdatingPreferences ? 'Updating...' : 'Update Preferences' }}
            </button>
          </form>
        </div>
      </div>

      <!-- SMTP Configuration Tab -->
      <div v-if="activeTab === 'smtp'" class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">SMTP Configuration</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">Configure your email server settings for sending emails from the system.</p>
          
          <form @submit.prevent="updateSmtpSettings" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label for="smtpHost" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SMTP Host
                </label>
                <input
                  id="smtpHost"
                  v-model="smtpSettings.host"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="smtp.gmail.com"
                  required
                />
              </div>

              <div>
                <label for="smtpPort" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SMTP Port
                </label>
                <input
                  id="smtpPort"
                  v-model="smtpSettings.port"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="587"
                  required
                />
              </div>

              <div>
                <label for="smtpEncryption" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Encryption
                </label>
                <select
                  id="smtpEncryption"
                  v-model="smtpSettings.encryption"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="smtpUsername" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username/Email
                </label>
                <input
                  id="smtpUsername"
                  v-model="smtpSettings.username"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="your-email@gmail.com"
                  required
                />
              </div>

              <div>
                <label for="smtpPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password/App Password
                </label>
                <input
                  id="smtpPassword"
                  v-model="smtpSettings.password"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter password or app password"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="smtpFromName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From Name
                </label>
                <input
                  id="smtpFromName"
                  v-model="smtpSettings.fromName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Your Organization Name"
                  required
                />
              </div>

              <div>
                <label for="smtpFromEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From Email
                </label>
                <input
                  id="smtpFromEmail"
                  v-model="smtpSettings.fromEmail"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="noreply@yourorganization.com"
                  required
                />
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <button
                type="button"
                @click="testSmtpConnection"
                :disabled="isTestingSmtp"
                class="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isTestingSmtp ? 'Testing...' : 'Test Connection' }}
              </button>

              <button
                type="submit"
                :disabled="isUpdatingSmtp"
                class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isUpdatingSmtp ? 'Updating...' : 'Save SMTP Settings' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
            <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mt-4">Delete Organization</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your organization? This action cannot be undone and will permanently remove all data.
            </p>
          </div>
          <div class="flex justify-center space-x-3 mt-4">
            <button
              @click="showDeleteConfirm = false"
              class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm font-medium"
            >
              Cancel
            </button>
            <button
              @click="deleteOrganization"
              :disabled="isDeleting"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
            >
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'

const toast = useToast()

// Tab management
const tabs = [
  { id: 'profile', name: 'Profile' },
  { id: 'preferences', name: 'Preferences' },
  { id: 'smtp', name: 'SMTP Settings' }
]
const activeTab = ref('profile')

// Organization Profile
const orgProfile = ref({
  name: '',
  email: '',
  phone: '',
  website: '',
  address: ''
})

// Preferences
const preferences = ref({
  timezone: 'UTC',
  currency: 'USD',
  language: 'en',
  emailNotifications: true,
  twoFactorAuth: false
})

// SMTP Settings
const smtpSettings = ref({
  host: '',
  port: '',
  username: '',
  password: '',
  encryption: 'tls',
  fromName: '',
  fromEmail: ''
})

// Loading states
const isUpdatingProfile = ref(false)
const isUpdatingPreferences = ref(false)
const isUpdatingSmtp = ref(false)
const isTestingSmtp = ref(false)
const isDeleting = ref(false)

// Modal state
const showDeleteConfirm = ref(false)

onMounted(async () => {
  await loadOrganizationSettings()
})

const loadOrganizationSettings = async () => {
  try {
    // TODO: Replace with actual API call
    // const response = await getOrganizationSettings()
    // orgProfile.value = response.data.profile
    // preferences.value = response.data.preferences
    // smtpSettings.value = response.data.smtp
    
    // Mock data for now
    orgProfile.value = {
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+1 (555) 123-4567',
      website: 'https://www.acme.com',
      address: '123 Business St, Suite 100, City, State 12345'
    }
    
    preferences.value = {
      timezone: 'America/New_York',
      currency: 'USD',
      language: 'en',
      emailNotifications: true,
      twoFactorAuth: false
    }
    
    smtpSettings.value = {
      host: 'smtp.gmail.com',
      port: '587',
      username: 'noreply@acme.com',
      password: '',
      encryption: 'tls',
      fromName: 'Acme Corporation',
      fromEmail: 'noreply@acme.com'
    }
  } catch (error) {
    console.error('Error loading organization settings:', error)
    toast.error('Failed to load organization settings')
  }
}

const updateOrganizationProfile = async () => {
  isUpdatingProfile.value = true
  try {
    // TODO: Replace with actual API call
    // await updateOrganizationProfile(orgProfile.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Organization profile updated successfully!')
  } catch (error) {
    console.error('Error updating profile:', error)
    toast.error('Failed to update organization profile')
  } finally {
    isUpdatingProfile.value = false
  }
}

const updatePreferences = async () => {
  isUpdatingPreferences.value = true
  try {
    // TODO: Replace with actual API call
    // await updatePreferences(preferences.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Preferences updated successfully!')
  } catch (error) {
    console.error('Error updating preferences:', error)
    toast.error('Failed to update preferences')
  } finally {
    isUpdatingPreferences.value = false
  }
}

const updateSmtpSettings = async () => {
  isUpdatingSmtp.value = true
  try {
    // TODO: Replace with actual API call
    // await updateSmtpSettings(smtpSettings.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('SMTP settings updated successfully!')
  } catch (error) {
    console.error('Error updating SMTP settings:', error)
    toast.error('Failed to update SMTP settings')
  } finally {
    isUpdatingSmtp.value = false
  }
}

const testSmtpConnection = async () => {
  isTestingSmtp.value = true
  try {
    // TODO: Replace with actual API call
    // await testSmtpConnection(smtpSettings.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('SMTP connection test successful!')
  } catch (error) {
    console.error('Error testing SMTP connection:', error)
    toast.error('SMTP connection test failed')
  } finally {
    isTestingSmtp.value = false
  }
}

const deleteOrganization = async () => {
  isDeleting.value = true
  try {
    // TODO: Replace with actual API call
    // await deleteOrganization()
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('Organization deleted successfully')
    showDeleteConfirm.value = false
    
    // Redirect to login or home page
    // router.push('/auth/login')
  } catch (error) {
    console.error('Error deleting organization:', error)
    toast.error('Failed to delete organization')
  } finally {
    isDeleting.value = false
  }
}
</script> 