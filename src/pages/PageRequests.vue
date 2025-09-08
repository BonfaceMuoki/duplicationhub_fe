<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Page Requests</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage and review page requests from users</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="refreshData"
          :disabled="loading"
          class="px-3 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh data"
        >
          <i class="fas fa-sync-alt w-4 h-4" :class="{ 'fa-spin': loading }"></i>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading page requests...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
        <i class="fas fa-exclamation-triangle text-2xl text-red-600 dark:text-red-400"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to Load Page Requests</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
      <button
        @click="fetchPageRequests"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <i class="fas fa-redo mr-2"></i>
        Try Again
      </button>
    </div>

    <!-- Content -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <!-- Table Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Page Requests ({{ pageRequests.length }})
          </h2>
          <div class="flex items-center gap-2">
            <select
              v-model="statusFilter"
              @change="filterRequests"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Phone
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Message
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="filteredRequests.length === 0" class="text-center">
              <td colspan="6" class="px-6 py-12 text-gray-500 dark:text-gray-400">
                <div class="flex flex-col items-center">
                  <i class="fas fa-inbox text-4xl mb-4 text-gray-300 dark:text-gray-600"></i>
                  <p class="text-lg font-medium">No page requests found</p>
                  <p class="text-sm">There are no page requests to display at the moment.</p>
                </div>
              </td>
            </tr>
            <tr
              v-for="request in filteredRequests"
              :key="request.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <i class="fas fa-user text-blue-600 dark:text-blue-400"></i>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ request.name }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ request.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="text-sm text-gray-900 dark:text-white">{{ request.phone_number }}</div>
                  <button
                    v-if="request.phone_number"
                    @click="openWhatsApp(request.phone_number)"
                    class="text-green-400 hover:text-green-600 dark:hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md p-1"
                    title="Send WhatsApp Message"
                  >
                    <i class="fab fa-whatsapp w-4 h-4"></i>
                  </button>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white max-w-xs truncate" :title="request.message">
                  {{ request.message }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(request.status)"
                >
                  {{ request.status.charAt(0).toUpperCase() + request.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(request.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <button
                    @click="viewRequest(request)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="View Details"
                  >
                    <i class="fas fa-eye w-4 h-4"></i>
                  </button>
                  <button
                    v-if="request.status === 'pending'"
                    @click="updateRequestStatus(request.id, 'approved')"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    title="Approve"
                  >
                    <i class="fas fa-check w-4 h-4"></i>
                  </button>
                  <button
                    v-if="request.status === 'pending'"
                    @click="updateRequestStatus(request.id, 'rejected')"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Reject"
                  >
                    <i class="fas fa-times w-4 h-4"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Request Details Modal -->
    <div
      v-if="selectedRequest"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800"
        @click.stop
      >
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Request Details</h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i class="fas fa-times w-5 h-5"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedRequest.name }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedRequest.email }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
              <div class="mt-1 flex items-center gap-2">
                <p class="text-sm text-gray-900 dark:text-white">{{ selectedRequest.phone_number }}</p>
                <button
                  v-if="selectedRequest.phone_number"
                  @click="openWhatsApp(selectedRequest.phone_number)"
                  class="text-green-400 hover:text-green-600 dark:hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md p-1"
                  title="Send WhatsApp Message"
                >
                  <i class="fab fa-whatsapp w-4 h-4"></i>
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{{ selectedRequest.message }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <span
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1"
                :class="getStatusClass(selectedRequest.status)"
              >
                {{ selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1) }}
              </span>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Created</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(selectedRequest.created_at) }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(selectedRequest.updated_at) }}</p>
            </div>
          </div>
          
          <div v-if="selectedRequest.status === 'pending'" class="mt-6 flex justify-end gap-3">
            <button
              @click="updateRequestStatus(selectedRequest.id, 'rejected')"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <i class="fas fa-times mr-2"></i>
              Reject
            </button>
            <button
              @click="updateRequestStatus(selectedRequest.id, 'approved')"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <i class="fas fa-check mr-2"></i>
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import pagesService from '../services/pagesService'

// Reactive data
const loading = ref(false)
const error = ref(null)
const pageRequests = ref([])
const selectedRequest = ref(null)
const statusFilter = ref('')

// Computed properties
const filteredRequests = computed(() => {
  if (!statusFilter.value) {
    return pageRequests.value
  }
  return pageRequests.value.filter(request => request.status === statusFilter.value)
})

// Methods
const fetchPageRequests = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await pagesService.getPageRequests()
    pageRequests.value = response.data || []
  } catch (err) {
    console.error('Error fetching page requests:', err)
    error.value = err.response?.data?.message || 'Failed to fetch page requests'
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchPageRequests()
}

const filterRequests = () => {
  // Filtering is handled by computed property
}

const viewRequest = (request) => {
  selectedRequest.value = request
}

const closeModal = () => {
  selectedRequest.value = null
}

const updateRequestStatus = async (requestId, newStatus) => {
  try {
    await pagesService.updatePageRequestStatus(requestId, newStatus)
    
    // Update the local data
    const requestIndex = pageRequests.value.findIndex(req => req.id === requestId)
    if (requestIndex !== -1) {
      pageRequests.value[requestIndex].status = newStatus
      pageRequests.value[requestIndex].updated_at = new Date().toISOString()
    }
    
    // Close modal if open
    if (selectedRequest.value && selectedRequest.value.id === requestId) {
      selectedRequest.value.status = newStatus
      selectedRequest.value.updated_at = new Date().toISOString()
    }
    
    // Show success message (you can add a toast notification here)
    console.log(`Request ${requestId} status updated to ${newStatus}`)
  } catch (err) {
    console.error('Error updating request status:', err)
    error.value = err.response?.data?.message || 'Failed to update request status'
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openWhatsApp = (phoneNumber) => {
  if (phoneNumber) {
    // Clean the phone number (remove any non-digit characters except +)
    const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '')
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}`
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }
}

// Lifecycle
onMounted(() => {
  fetchPageRequests()
})
</script>