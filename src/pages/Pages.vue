<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Pages Manager</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage your landing pages and their performance</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="refreshPages"
          :disabled="loading"
          class="px-3 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh pages"
        >
          <i class="fas fa-sync-alt w-4 h-4" :class="{ 'fa-spin': loading }"></i>
        </button>
        
        <!-- Clear Search Button - only show when there's an active search -->
        <button
          v-if="searchQuery && searchQuery.trim() !== ''"
          @click="clearSearch"
          class="px-3 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500"
          title="Clear search"
        >
          <i class="fas fa-times w-4 h-4"></i>
        </button>
        
        <button
          @click="createNewPage"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <i class="fas fa-plus w-4 h-4"></i>
          Create New Page
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading pages...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
          <i class="fas fa-exclamation-triangle text-2xl text-red-600 dark:text-red-400"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to Load Pages</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <button
          @click="refreshPages"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <i class="fas fa-redo mr-2"></i>
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="pages.length === 0" class="p-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full">
          <i class="fas fa-file-alt text-2xl text-gray-400 dark:text-gray-500"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Pages Found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ pagination.total > 0 ? 'No pages match your search criteria.' : 'Get started by creating your first landing page.' }}
        </p>
        
        <!-- Show clear search button if there's an active search -->
        <div v-if="searchQuery && searchQuery.trim() !== ''" class="space-y-3">
          <button
            @click="clearSearch"
            class="px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <i class="fas fa-times mr-2"></i>
            Clear Search
          </button>
        </div>
        
        <!-- Show create button only if no pages exist at all -->
        <button
          v-if="pagination.total === 0"
          @click="createNewPage"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <i class="fas fa-plus mr-2"></i>
          Create Your First Page
        </button>
      </div>

      <!-- Data Table -->
      <Datatable
        v-else
        :data="pages"
        :columns="columns"
        :total-pages="pagination.last_page"
        :current-page="pagination.current_page"
        :items-per-page="pagination.per_page"
        :show-checkboxes="true"
        @update:current-page="handlePageChange"
        @update:items-per-page="handlePerPageChange"
        @search="handleSearch"
        @selected-ids="handleSelectedIds"
      >
        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <button
              @click="viewPage(row)"
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              title="View Page"
            >
              <i class="fas fa-eye w-4 h-4"></i>
            </button>
            <button
              @click="editPage(row)"
              class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
              title="Edit Page"
            >
              <i class="fas fa-edit w-4 h-4"></i>
            </button>
            <button
              @click="togglePageStatus(row)"
              :class="row.is_active ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'"
              :title="row.is_active ? 'Deactivate Page' : 'Activate Page'"
            >
              <i :class="row.is_active ? 'fas fa-pause w-4 h-4' : 'fas fa-play w-4 h-4'"></i>
            </button>
            <button
              @click="deletePage(row)"
              class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              title="Delete Page"
            >
              <i class="fas fa-trash w-4 h-4"></i>
            </button>
          </div>
        </template>
      </Datatable>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <i class="fas fa-file-alt text-blue-600 dark:text-blue-400 w-5 h-5"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pages</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ pagination.total }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <i class="fas fa-eye text-green-600 dark:text-green-400 w-5 h-5"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ pages.reduce((sum, page) => sum + (page.views || 0), 0) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <i class="fas fa-users text-purple-600 dark:text-purple-400 w-5 h-5"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Leads</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ pages.reduce((sum, page) => sum + (page.leads_count || 0), 0) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <i class="fas fa-mouse-pointer text-orange-600 dark:text-orange-400 w-5 h-5"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clicks</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ pages.reduce((sum, page) => sum + (page.total_clicks || 0), 0) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedPages.length > 0" class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <div class="flex items-center justify-between">
        <span class="text-sm text-blue-700 dark:text-blue-300">
          {{ selectedPages.length }} page(s) selected
        </span>
        <div class="flex gap-2">
          <button
            @click="bulkActivate"
            class="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Activate All
          </button>
          <button
            @click="bulkDeactivate"
            class="px-3 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            Deactivate All
          </button>
          <button
            @click="bulkDelete"
            class="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete All
          </button>
        </div>
      </div>
    </div>

    <!-- Create Page Modal -->
    <CreatePageModal
      :is-open="showCreateModal"
      @close="closeCreateModal"
      @page-created="handlePageCreated"
    />

    <!-- Edit Page Modal -->
    <CreatePageModal
      :is-open="showEditModal"
      @close="closeEditModal"
      @page-updated="handlePageUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePageFormStore } from '../store/pageFormStore'
import Datatable from '../components/Datatable.vue'
import CreatePageModal from '../components/CreatePageModal.vue'
import pagesService from '../services/pagesService'

// Use Pinia store
const pageFormStore = usePageFormStore()

// Reactive data
const pages = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 1,
  to: 1
})
const selectedPages = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatStatus = (status) => {
  const statusMap = {
    'published': { text: 'Published', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    'draft': { text: 'Draft', class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
    'archived': { text: 'Archived', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
  }
  return statusMap[status] || { text: status, class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }
}

// Table columns configuration
const columns = [
  { key: 'title', label: 'Title' },
  { key: 'slug', label: 'Slug' },
  { key: 'status', label: 'Status' },
  { key: 'views', label: 'Views' },
  { key: 'leads_count', label: 'Leads' },
  { key: 'total_clicks', label: 'Clicks' },
  { key: 'publish_at', label: 'Published' },
  { key: 'is_active', label: 'Active' }
]

// Format data for display
const formatPageData = (pages) => {
  return pages.map(page => ({
    ...page,
    status: formatStatus(page.status).text,
    publish_at: formatDate(page.publish_at),
    is_active: page.is_active ? 'Yes' : 'No'
  }))
}

// Fetch pages data
const fetchPages = async (page = 1, perPage = 15, search = '') => {
  loading.value = true
  error.value = null // Clear any previous errors
  
  console.log('Fetching pages with params:', { page, perPage, search })
  
  try {
    // Use the pages service to fetch from /admin/pages endpoint
    const response = await pagesService.getPages(page, perPage, search)
    
    console.log('Pages service response:', response)
    
    if (response.success) {
      pages.value = formatPageData(response.data)
      pagination.value = response.pagination
      console.log('Pages loaded successfully:', pages.value.length, 'pages')
    } else {
      console.error('API returned error:', response.message)
      error.value = response.message || 'Failed to fetch pages'
      // Show error message to user (you could add a toast notification here)
      pages.value = []
      pagination.value = {
        current_page: 1,
        last_page: 1,
        per_page: perPage,
        total: 0,
        from: 0,
        to: 0
      }
    }
  } catch (error) {
    console.error('Error fetching pages:', error)
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        error.value = 'Unauthorized - please check your authentication'
      } else if (error.response.status === 403) {
        error.value = 'Forbidden - you don\'t have permission to access this resource'
      } else if (error.response.status === 404) {
        error.value = 'API endpoint not found'
      } else if (error.response.status >= 500) {
        error.value = 'Server error - please try again later'
      } else {
        error.value = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`
      }
    } else if (error.request) {
      // Request was made but no response received
      error.value = 'No response received from server - please check your connection'
    } else {
      // Something else happened
      error.value = `Error: ${error.message}`
    }
    
    // Set empty state on error
    pages.value = []
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: perPage,
      total: 0,
      from: 0,
      to: 0
    }
  } finally {
    loading.value = false
  }
}

// Event handlers
const handlePageChange = (page) => {
  pagination.value.current_page = page
  fetchPages(page, pagination.value.per_page, searchQuery.value)
}

const handlePerPageChange = (perPage) => {
  pagination.value.per_page = perPage
  pagination.value.current_page = 1
  fetchPages(1, perPage, searchQuery.value)
}

const handleSearch = (query) => {
  searchQuery.value = query || ''
  fetchPages(1, pagination.value.per_page, searchQuery.value)
}

const handleSelectedIds = (ids) => {
  selectedPages.value = pages.value.filter(page => ids.includes(page.id))
}

// Refresh pages and clear any errors
const refreshPages = () => {
  error.value = null
  fetchPages(pagination.value.current_page, pagination.value.per_page, searchQuery.value)
}

// Clear search and refresh pages
const clearSearch = () => {
  searchQuery.value = ''
  fetchPages(1, pagination.value.per_page, '')
}

// Page actions
const createNewPage = () => {
  pageFormStore.resetForm()
  pageFormStore.setEditMode(false)
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  pageFormStore.resetForm()
}

const handlePageCreated = (newPage) => {
  // Refresh the pages list
  fetchPages()
  // You could also add the new page to the existing list instead of refreshing
  // pages.value.unshift(newPage)
}

const editPage = (page) => {
  pageFormStore.setEditingPage(page)
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  pageFormStore.clearEditingPage()
}

const handlePageUpdated = (updatedPage) => {
  // Update the page in the list
  const index = pages.value.findIndex(p => p.id === updatedPage.id)
  if (index !== -1) {
    pages.value[index] = formatPageData([updatedPage])[0]
  }
  // Refresh the pages list to ensure consistency
  fetchPages()
}

const viewPage = (page) => {
  console.log('Viewing page:', page)
  // Implement view logic
}

const togglePageStatus = (page) => {
  console.log('Toggling status for page:', page)
  // Implement toggle logic
}

const deletePage = (page) => {
  if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
    console.log('Deleting page:', page)
    // Implement delete logic
  }
}

// Bulk actions
const bulkActivate = () => {
  console.log('Activating pages:', selectedPages.value)
  // Implement bulk activate logic
}

const bulkDeactivate = () => {
  console.log('Deactivating pages:', selectedPages.value)
  // Implement bulk deactivate logic
}

const bulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedPages.value.length} pages?`)) {
    console.log('Deleting pages:', selectedPages.value)
    // Implement bulk delete logic
  }
}

// Lifecycle
onMounted(() => {
  fetchPages()
})
</script>

<style scoped>
/* Ensure proper z-index layering */
.bg-white {
  position: relative;
  z-index: 1;
}

/* Ensure modal appears above everything */
:deep(.fixed) {
  z-index: 9999 !important;
}
</style> 