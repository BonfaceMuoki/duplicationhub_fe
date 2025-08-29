<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Referrers</h1>
        <p class="text-gray-600 dark:text-gray-400">Track your referral network and performance</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="refreshReferrers"
          :disabled="loading"
          class="px-3 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh referrers"
        >
          <i class="fas fa-sync-alt w-4 h-4" :class="{ 'fa-spin': loading }"></i>
        </button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <i class="fas fa-users text-blue-600 dark:text-blue-400 w-5 h-5"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Referrers</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ pagination.total }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <i class="fas fa-check-circle text-green-600 dark:text-green-400 w-5 h-5"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Referrers</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ activeReferrersCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <i class="fas fa-mouse-pointer text-purple-600 dark:text-purple-400 w-5 h-5"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clicks</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalClicks }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <i class="fas fa-user-plus text-orange-600 dark:text-orange-400 w-5 h-5"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Leads</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalLeads }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading referrers...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
          <i class="fas fa-exclamation-triangle text-2xl text-red-600 dark:text-red-400"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to Load Referrers</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <button
          @click="refreshReferrers"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <i class="fas fa-redo mr-2"></i>
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="referrers.length === 0" class="p-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full">
          <i class="fas fa-users text-2xl text-gray-400 dark:text-gray-500"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Referrers Found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Referrers will appear here once they start sharing your links.
        </p>
      </div>

      <!-- Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Referrer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Handle
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Joined Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Activity
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Network
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Performance
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="referrer in referrers" :key="referrer.invite_id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <!-- Referrer Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {{ referrer.user.name.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ referrer.user.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ referrer.user.email }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Handle -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {{ referrer.handle }}
                </span>
              </td>

              <!-- Joined Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatDate(referrer.joined_date) }}
              </td>

              <!-- Activity -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  <div class="flex items-center gap-4">
                    <div>
                      <span class="font-medium">{{ referrer.activity.clicks }}</span>
                      <span class="text-gray-500 dark:text-gray-400"> clicks</span>
                    </div>
                    <div>
                      <span class="font-medium">{{ referrer.activity.leads_count }}</span>
                      <span class="text-gray-500 dark:text-gray-400"> leads</span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Network -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  <div class="flex items-center gap-4">
                    <div>
                      <span class="font-medium">{{ referrer.referral_network.immediate_invitees }}</span>
                      <span class="text-gray-500 dark:text-gray-400"> direct</span>
                    </div>
                    <div>
                      <span class="font-medium">{{ referrer.referral_network.total_downline }}</span>
                      <span class="text-gray-500 dark:text-gray-400"> total</span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Performance -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <!-- Has Joined Status -->
                  <span v-if="referrer.performance_summary.has_joined" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    <i class="fas fa-check-circle w-3 h-3 mr-1"></i>
                    Joined
                  </span>
                  <span v-else 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                    <i class="fas fa-clock w-3 h-3 mr-1"></i>
                    Pending
                  </span>

                  <!-- Referral Potential -->
                  <span :class="getPotentialBadgeClass(referrer.performance_summary.referral_potential)"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ referrer.performance_summary.referral_potential }}
                  </span>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <button
                    @click="viewReferrerDetails(referrer)"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    title="View Details"
                  >
                    <i class="fas fa-eye w-4 h-4"></i>
                  </button>
                  <button
                    @click="launchWhatsAppForReferrer(referrer)"
                    class="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                    title="WhatsApp Referrer"
                  >
                    <i class="fab fa-whatsapp w-4 h-4"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="referrers.length > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="!pagination.prev_page_url"
              class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span class="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              Page {{ pagination.current_page }} of {{ pagination.last_page }}
            </span>
            <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="!pagination.next_page_url"
              class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api.js'

// Reactive data
const referrers = ref([])
const loading = ref(false)
const error = ref(null)

// Pagination
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0,
  from: 0,
  to: 0
})

// Computed properties
const activeReferrersCount = computed(() => {
  return referrers.value.filter(ref => ref.performance_summary.is_active_referrer).length
})

const totalClicks = computed(() => {
  return referrers.value.reduce((sum, ref) => sum + ref.activity.clicks, 0)
})

const totalLeads = computed(() => {
  return referrers.value.reduce((sum, ref) => sum + ref.activity.leads_count, 0)
})

// Methods
const fetchReferrers = async (page = 1) => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.get(`/invites/1/my-joiners?page=${page}`)
    
    if (response.data.success) {
      referrers.value = response.data.data.data
      pagination.value = {
        current_page: response.data.data.current_page || 1,
        last_page: response.data.data.last_page || 1,
        per_page: response.data.data.per_page || 20,
        total: response.data.data.total || 0,
        from: response.data.data.from || 0,
        to: response.data.data.to || 0
      }
    } else {
      error.value = 'Failed to fetch referrers'
    }
  } catch (err) {
    console.error('Error fetching referrers:', err)
    error.value = err.response?.data?.message || 'Failed to fetch referrers'
  } finally {
    loading.value = false
  }
}

const refreshReferrers = () => {
  pagination.value.current_page = 1
  fetchReferrers()
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page
    fetchReferrers(page)
  }
}

const viewReferrerDetails = (referrer) => {
  console.log('View referrer details:', referrer)
  // Implement referrer details view
}

const launchWhatsAppForReferrer = (referrer) => {
  console.log('Launch WhatsApp for referrer:', referrer)
  // Implement WhatsApp launch for referrer
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPotentialBadgeClass = (potential) => {
  switch (potential) {
    case 'New':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    case 'Active':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    case 'High':
      return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  }
}

// Lifecycle
onMounted(() => {
  fetchReferrers()
})
</script>

<style scoped>
/* Add any custom styles here */
</style> 