<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Leads Manager</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage and track all your leads from landing pages</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="refreshLeads"
          :disabled="loading"
          class="px-3 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh leads"
        >
          <i class="fas fa-sync-alt w-4 h-4" :class="{ 'fa-spin': loading }"></i>
        </button>
        
        <button
          v-if="searchQuery && searchQuery.trim() !== ''"
          @click="clearSearch"
          class="px-3 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500"
          title="Clear search"
        >
          <i class="fas fa-times w-4 h-4"></i>
        </button>
<!--         
        <button
          @click="exportLeads"
          :disabled="leads.length === 0"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fas fa-download w-4 h-4"></i>
          Export Leads
        </button>
        
        <button
          @click="launchWhatsApp"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 border-2 border-green-400"
        >
          <i class="fab fa-whatsapp w-4 h-4"></i>
          Launch WhatsApp
        </button> -->
        
        <!-- Quick WhatsApp Button (like Laravel template) -->
        <!-- <a
          :href="quickWhatsAppLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.86 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.86 0 0020.885 3.488"/>
          </svg>
          WhatsApp Us
        </a> -->
        
        <!-- Debug: Show modal state -->
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Modal: {{ showWhatsAppModal ? 'Open' : 'Closed' }}
        </div>
        
        <!-- Device Info -->
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Device: {{ isDesktop ? 'Desktop' : 'Mobile' }}
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <i class="fas fa-users text-blue-600 dark:text-blue-400 w-5 h-5"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Leads</p>
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
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">New Leads</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ newLeadsCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <i class="fas fa-phone text-blue-600 dark:text-blue-400 w-5 h-5"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Contacted</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.contacted_leads }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <i class="fas fa-file-alt text-purple-600 dark:text-purple-400 w-5 h-5"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Pages</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ activePagesCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <i class="fas fa-calendar text-orange-600 dark:text-orange-400 w-5 h-5"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ thisMonthLeadsCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <i class="fas fa-user-check text-purple-600 dark:text-purple-400 w-5 h-5"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Joined</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.joined_leads }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading leads...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
          <i class="fas fa-exclamation-triangle text-2xl text-red-600 dark:text-red-400"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to Load Leads</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <button
          @click="refreshLeads"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <i class="fas fa-redo mr-2"></i>
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="leads.length === 0" class="p-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full">
          <i class="fas fa-users text-2xl text-gray-400 dark:text-gray-500"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Leads Found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ pagination.total > 0 ? 'No leads match your search criteria.' : 'Leads will appear here once visitors submit forms on your landing pages.' }}
        </p>
        
        <div v-if="searchQuery && searchQuery.trim() !== ''" class="space-y-3">
          <button
            @click="clearSearch"
            class="px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-md hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <i class="fas fa-times mr-2"></i>
            Clear Search
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <Datatable
        v-else
        :data="leads"
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
            <!-- <button
              @click="viewLead(row)"
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              title="View Lead Details"
            >
              <i class="fas fa-eye w-4 h-4"></i>
            </button>
            <button
              @click="editLead(row)"
              class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
              title="Edit Lead"
            > -->
              <!-- <i class="fas fa-edit w-4 h-4"></i>
            </button> -->
                          <div class="relative group">
                <button
                  @click="launchWhatsAppForLead(row)"
                  class="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  title="WhatsApp - Landing Page"
                >
                  <i class="fab fa-whatsapp w-4 h-4"></i>
                </button>
              </div>
              
              <div class="relative group">
                <button
                  @click="launchWhatsAppForAdvertisement(row)"
                  class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  title="WhatsApp - Advertisement Link"
                >
                  <i class="fas fa-ad w-4 h-4"></i>
                </button>
              </div>
            <button
              @click="toggleLeadStatus(row)"
              :class="row.status === 'new' ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'"
              :title="row.status === 'new' ? 'Mark as Contacted' : 'Mark as New'"
            >
              <i :class="row.status === 'new' ? 'fas fa-phone w-4 h-4' : 'fas fa-undo w-4 h-4'"></i>
            </button>
            <button
              @click="deleteLead(row)"
              class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              title="Delete Lead"
            >
              <i class="fas fa-trash w-4 h-4"></i>
            </button>
          </div>
        </template>
      </Datatable>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedLeads.length > 0" class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <div class="flex items-center justify-between">
        <span class="text-sm text-blue-700 dark:text-blue-300">
          {{ selectedLeads.length }} lead(s) selected
        </span>
        <div class="flex gap-2">
          <button
            @click="bulkWhatsApp"
            class="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <i class="fab fa-whatsapp mr-2"></i>
            WhatsApp Selected
          </button>
          <button
            @click="bulkMarkContacted"
            class="px-3 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <i class="fas fa-phone mr-2"></i>
            Mark as Contacted
          </button>
          <button
            @click="bulkDelete"
            class="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <i class="fas fa-trash mr-2"></i>
            Delete Selected
          </button>
        </div>
      </div>
    </div>

    <!-- WhatsApp Modal -->
    <div v-if="showWhatsAppModal" class="fixed inset-0 z-[9999] overflow-y-auto">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 transition-opacity modal-backdrop" 
        style="background-color: rgba(0, 0, 0, 0.3);"
        @click="closeWhatsAppModal"
      ></div>
      
              <!-- Modal -->
      <div class="flex min-h-full items-start justify-center p-4 pt-8">
        <div class="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 modal-content ring-4 ring-white dark:ring-gray-800 bg-opacity-95 dark:bg-opacity-95">
          <!-- Header -->
          <div class="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
              <div class="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <i class="fab fa-whatsapp text-green-600 dark:text-green-400 w-6 h-6"></i>
              </div>
              Build WhatsApp Link
            </h3>
            <button
              @click="closeWhatsAppModal"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <i class="fas fa-times w-5 h-5"></i>
            </button>
          </div>
        
        <form @submit.prevent="submitWhatsAppCampaign" class="p-6 space-y-6">
          <!-- Lead Info Display -->
          <div v-if="whatsAppForm.selectedLead" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                <i class="fas fa-user text-green-600 dark:text-green-400 w-4 h-4"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-green-800 dark:text-green-200">Selected Lead</p>
                <p class="text-sm text-green-700 dark:text-green-300">
                  {{ whatsAppForm.selectedLead.name }} ({{ whatsAppForm.selectedLead.whatsapp_number }})
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <label for="pageUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Landing Page URL
            </label>
            <input
              id="pageUrl"
              v-model="whatsAppForm.pageUrl"
              type="url"
              placeholder="https://example.com/landing-page"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
              required
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              The page you want to share with this lead
            </p>
          </div>
          
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Personal Message
            </label>
            <textarea
              id="message"
              v-model="whatsAppForm.message"
              rows="4"
              maxlength="1000"
              placeholder="Enter a personal message to include with the link..."
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white resize-none transition-colors"
              required
            ></textarea>
            <div class="flex items-center justify-between mt-2">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ whatsAppForm.message.length }}/1000 characters
              </p>
              <div class="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-green-500 transition-all duration-300"
                  :style="{ width: (whatsAppForm.message.length / 10) + '%' }"
                ></div>
              </div>
            </div>
            
            <!-- Message Templates -->
            <div class="mt-4">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Message Templates</p>
              <div class="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  @click="useTemplate('Hi! Check out our new landing page: {{url}}')"
                  class="p-3 text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:scale-105"
                >
                  <div class="text-center">
                    <div class="text-lg mb-1">📝</div>
                    <span class="font-medium">Simple</span>
                  </div>
                </button>
                <button
                  type="button"
                  @click="useTemplate('🚀 Exciting news! We just launched a new page that could transform your business. Check it out: {{url}}')"
                  class="p-3 text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:scale-105"
                >
                  <div class="text-center">
                    <div class="text-lg mb-1">🚀</div>
                    <span class="font-medium">Emoji</span>
                  </div>
                </button>
                <button
                  type="button"
                  @click="useTemplate('Hey there! 👋 I thought you might be interested in this: {{url}}')"
                  class="p-3 text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:scale-105"
                >
                  <div class="text-center">
                    <div class="text-lg mb-1">👋</div>
                    <span class="font-medium">Friendly</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="closeWhatsAppModal"
              class="px-6 py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="whatsAppForm.submitting"
              class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <i class="fas fa-link w-4 h-4" :class="{ 'fa-spin': whatsAppForm.submitting }"></i>
              {{ whatsAppForm.submitting ? 'Creating...' : 'Create & Launch WhatsApp' }}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api.js'
import Datatable from '../components/Datatable.vue'

// Reactive data
const leads = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const selectedLeads = ref([])
const showWhatsAppModal = ref(false)
const stats = ref({
  total_leads: 0,
  new_leads: 0,
  contacted_leads: 0,
  joined_leads: 0
})

const whatsAppForm = ref({
  pageUrl: '',
  message: '',
  submitting: false,
  selectedLead: null
})

// Pagination
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
})

// Table columns configuration
const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'whatsapp_number', label: 'WhatsApp' },
  { key: 'page_title', label: 'Page' },
  { key: 'status', label: 'Status' },
  { key: 'formatted_date', label: 'Submitted' }
]

// Computed properties
const newLeadsCount = computed(() => {
  return stats.value.new_leads || leads.value.filter(lead => lead.status === 'new').length
})

const activePagesCount = computed(() => {
  const uniquePages = new Set(leads.value.map(lead => lead.page_id))
  return uniquePages.size
})

const thisMonthLeadsCount = computed(() => {
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return leads.value.filter(lead => new Date(lead.created_at) >= thisMonth).length
})

const isDesktop = computed(() => {
  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }
  return false
})

const quickWhatsAppLink = computed(() => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  return createWhatsAppLink('254740857767', 'Hi! I found you through Leads Manager - ' + currentUrl, 'Leads Manager', currentUrl)
})

// Methods
const fetchLeads = async () => {
  loading.value = true
  error.value = null
  
  try {
    const params = {
      page: pagination.value.current_page,
      per_page: pagination.value.per_page
    }
    
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    
    const response = await api.get('/admin/leads', { params })
    
    // Transform the data to include page title for display
    leads.value = response.data.data.leads.data.map(lead => ({
      ...lead,
      page_title: lead.page?.title || 'Unknown Page',
      formatted_date: formatDate(lead.created_at)
    }))
    
    pagination.value = {
      current_page: response.data.data.leads.current_page || 1,
      last_page: response.data.data.leads.last_page || 1,
      per_page: response.data.data.leads.per_page || 10,
      total: response.data.data.leads.total || 0
    }
    
    // Update stats from API response
    if (response.data.data.stats) {
      stats.value = response.data.data.stats
    }
  } catch (err) {
    console.error('Error fetching leads:', err)
    error.value = err.response?.data?.message || 'Failed to fetch leads'
  } finally {
    loading.value = false
  }
}

const refreshLeads = () => {
  pagination.value.current_page = 1
  fetchLeads()
}

const handlePageChange = (page) => {
  pagination.value.current_page = page
  fetchLeads()
}

const handlePerPageChange = (perPage) => {
  pagination.value.per_page = perPage
  pagination.value.current_page = 1
  fetchLeads()
}

const handleSearch = (query) => {
  searchQuery.value = query
  pagination.value.current_page = 1
  fetchLeads()
}

const handleSelectedIds = (ids) => {
  selectedLeads.value = ids
}

const clearSearch = () => {
  searchQuery.value = ''
  pagination.value.current_page = 1
  fetchLeads()
}

const viewLead = (lead) => {
  console.log('View lead:', lead)
}

const editLead = (lead) => {
  console.log('Edit lead:', lead)
}

const toggleLeadStatus = async (lead) => {
  try {
    const newStatus = lead.status === 'new' ? 'contacted' : 'new'
    await api.put(`/admin/leads/${lead.id}`, { status: newStatus })
    
    // Update local state
    lead.status = newStatus
    
    // Refresh the leads to get updated data
    await fetchLeads()
  } catch (err) {
    console.error('Error updating lead status:', err)
  }
}

const deleteLead = async (lead) => {
  if (!confirm(`Are you sure you want to delete the lead "${lead.name}"?`)) {
    return
  }
  
  try {
    await api.delete(`/admin/leads/${lead.id}`)
    
    // Remove from local state
    leads.value = leads.value.filter(l => l.id !== lead.id)
    
    // Update pagination
    pagination.value.total = Math.max(0, pagination.value.total - 1)
    
    // If current page is empty and not the first page, go to previous page
    if (leads.value.length === 0 && pagination.value.current_page > 1) {
      pagination.value.current_page--
      await fetchLeads()
    }
  } catch (err) {
    console.error('Error deleting lead:', err)
  }
}

const bulkMarkContacted = async () => {
  if (!confirm(`Mark ${selectedLeads.value.length} leads as contacted?`)) {
    return
  }
  
  try {
    await Promise.all(
      selectedLeads.value.map(id => 
        api.put(`/admin/leads/${id}`, { status: 'contacted' })
      )
    )
    
    // Refresh leads to get updated data
    await fetchLeads()
    selectedLeads.value = []
  } catch (err) {
    console.error('Error bulk updating leads:', err)
  }
}

const bulkDelete = async () => {
  if (!confirm(`Delete ${selectedLeads.value.length} selected leads? This action cannot be undone.`)) {
    return
  }
  
  try {
    await Promise.all(
      selectedLeads.value.map(id => 
        api.delete(`/admin/leads/${id}`)
      )
    )
    
    // Refresh leads to get updated data
    await fetchLeads()
    selectedLeads.value = []
  } catch (err) {
    console.error('Error bulk deleting leads:', err)
  }
}

const bulkWhatsApp = () => {
  if (selectedLeads.value.length === 0) {
    alert('Please select leads first')
    return
  }
  
  // Get the selected leads data
  const selectedLeadsData = leads.value.filter(lead => selectedLeads.value.includes(lead.id))
  
  // Pre-fill form with bulk message
  whatsAppForm.value.selectedLead = null
  whatsAppForm.value.pageUrl = ''
  whatsAppForm.value.message = `Hi everyone! 👋\n\nWe have some exciting updates for our community. Please check out our latest landing page and let us know what you think!\n\nBest regards,\nYour Team`
  
  showWhatsAppModal.value = true
}

const exportLeads = () => {
  console.log('Export leads:', leads.value)
  alert('Export functionality will be implemented soon!')
}

const launchWhatsApp = () => {
  console.log('WhatsApp button clicked!')
  showWhatsAppModal.value = true
}

const launchWhatsAppForLead = (lead) => {
  console.log('WhatsApp for lead:', lead)
  
  // Pre-fill the form with lead information
  whatsAppForm.value.selectedLead = lead
  whatsAppForm.value.pageUrl = lead.page?.full_image_url ? lead.page.full_image_url.split('/storage/')[0] + '/pages/' + lead.page.slug : ''
  whatsAppForm.value.message = `Hi ${lead.name}! 👋\n\nThank you for your interest in our landing page. We'd love to connect with you!\n\nBest regards,\nYour Team`
  
  showWhatsAppModal.value = true
}

const launchWhatsAppForAdvertisement = (lead) => {
  console.log('WhatsApp advertisement for lead:', lead)
  
  // Build advertisement URL using APP_BASE_URL, page slug, and submitter invite handle as ref
  const appBaseUrl = import.meta.env.VITE_PAGES_BASE_URL || 'http://localhost:8004'
  const pageSlug = lead.page?.slug || 'page'
  const submitterHandle = lead.submitter_invite?.handle || 'default'
  const advertisementUrl = `${appBaseUrl}/pages/${pageSlug}?ref=${encodeURIComponent(submitterHandle)}`
  
  // Pre-fill the form with advertisement information
  whatsAppForm.value.selectedLead = lead
  whatsAppForm.value.pageUrl = advertisementUrl
  whatsAppForm.value.message = `Hi ${lead.name}, thank you for registering on this page using my earlier link, here is your link to share with friends`
  
  showWhatsAppModal.value = true
}

const openWhatsAppDirectly = (lead) => {
  const message = `Hi ${lead.name}! 👋\n\nThank you for your interest in our landing page. We'd love to connect with you!\n\nBest regards,\nYour Team`
  
  // Get page information for context
  const pageTitle = lead.page?.title || 'our landing page'
  const pageUrl = lead.page?.full_image_url ? lead.page.full_image_url.split('/storage/')[0] + '/pages/' + lead.page.slug : (typeof window !== 'undefined' ? window.location.href : '')
  
  // Create WhatsApp link using utility function
  const whatsappUrl = createWhatsAppLink(lead.whatsapp_number, message, pageTitle, pageUrl)
  
  // Open WhatsApp in new tab
  window.open(whatsappUrl, '_blank')
}

const closeWhatsAppModal = () => {
  showWhatsAppModal.value = false
  // Reset form
  whatsAppForm.value = {
    pageUrl: '',
    message: '',
    submitting: false,
    selectedLead: null
  }
}

const submitWhatsAppCampaign = async () => {
  if (!whatsAppForm.value.pageUrl || !whatsAppForm.value.message) {
    alert('Please fill in all required fields')
    return
  }
  
  whatsAppForm.value.submitting = true
  
  try {
    // Get the selected lead ID
    const leadId = whatsAppForm.value.selectedLead?.id
    if (!leadId) {
      alert('No lead selected')
      return
    }
    
    // Submit to the API endpoint
    const response = await api.put(`/leads/${leadId}/status`, {
      status: 'joining_link_shared',
      notes: 'Shared joining link with lead',
      landing_page_url: whatsAppForm.value.pageUrl,
      personal_message: whatsAppForm.value.message
    })
    
    if (response.data.success) {
      // Get the lead data from response
      const leadData = response.data.data
      const whatsappNumber = leadData.user.phone_number
      const personalMessage = whatsAppForm.value.message
      const pageUrl = whatsAppForm.value.pageUrl
      
      // Create WhatsApp link based on device type
      const whatsappUrl = createWhatsAppLink(whatsappNumber, personalMessage, leadData.page?.title || 'Landing Page', pageUrl)
      
      // Launch WhatsApp based on device type
      if (isDesktop.value) {
        // For desktop, open WhatsApp Web
        window.open(whatsappUrl, '_blank')
      } else {
        // For mobile, try to open WhatsApp app
        window.location.href = whatsappUrl
      }
      
      // Show success message
      alert('WhatsApp link created and launched successfully!')
      
      // Close modal and reset form
      closeWhatsAppModal()
      
    } else {
      alert('Failed to create WhatsApp link: ' + (response.data.message || 'Unknown error'))
    }
    
  } catch (error) {
    console.error('Error creating WhatsApp link:', error)
    alert('Failed to create WhatsApp link. Please try again.')
  } finally {
    whatsAppForm.value.submitting = false
  }
}

const useTemplate = (template) => {
  // Replace {{url}} placeholder with the actual page URL if available
  let message = template
  if (whatsAppForm.value.pageUrl) {
    message = template.replace('{{url}}', whatsAppForm.value.pageUrl)
  }
  whatsAppForm.value.message = message
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

// Utility function to create WhatsApp links based on device type
const createWhatsAppLink = (phoneNumber, message, pageTitle = '', pageUrl = '') => {
  // Format phone number
  let formattedPhone = phoneNumber
  if (formattedPhone.startsWith('+')) {
    formattedPhone = formattedPhone.substring(1)
  } else if (formattedPhone.startsWith('0') && formattedPhone.length === 10) {
    // Kenyan number starting with 0, replace with 254
    formattedPhone = '254' + formattedPhone.substring(1)
  }
  
  // Create message with page context if available
  let fullMessage = message
  if (pageTitle && pageUrl) {
    fullMessage += `\n\n${pageTitle}: ${pageUrl}`
  }
  
  // Create appropriate WhatsApp URL based on device type
  if (isDesktop.value) {
    return `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(fullMessage)}`
  } else {
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(fullMessage)}`
  }
}

// Lifecycle
onMounted(() => {
  fetchLeads()
})
</script>

<style scoped>
/* Modal backdrop styling */
.modal-backdrop {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 9998;
}

/* Ensure modal is visible and stands out */
.modal-content {
  position: relative;
  z-index: 10000;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Light theme modal enhancements */
.modal-content:not(.dark) {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* Dark theme modal enhancements */
.dark .modal-content {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
}
</style> 