<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <button
          @click="goBack"
          class="mb-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
        >
          <i class="fas fa-arrow-left w-4 h-4"></i>
          Back to Pages
        </button>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Page Referrers</h1>
        <p class="text-gray-600 dark:text-gray-400">{{ pageData?.title || 'Loading...' }}</p>
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
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading referrer data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
        <i class="fas fa-exclamation-triangle text-2xl text-red-600 dark:text-red-400"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to Load Referrer Data</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
      <button
        @click="fetchReferrerData"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <i class="fas fa-redo mr-2"></i>
        Try Again
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="referrerData" class="space-y-8">
      <!-- Statistics Overview -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <i class="fas fa-users text-blue-600 dark:text-blue-400 w-6 h-6"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-blue-600 dark:text-blue-400">Total Invites</p>
              <p class="text-3xl font-semibold text-blue-900 dark:text-blue-100">
                {{ referrerData.statistics?.total_invites || 0 }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <i class="fas fa-mouse-pointer text-green-600 dark:text-green-400 w-6 h-6"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-green-600 dark:text-green-400">Total Clicks</p>
              <p class="text-3xl font-semibold text-green-900 dark:text-green-100">
                {{ referrerData.statistics?.total_clicks || 0 }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <i class="fas fa-user-plus text-purple-600 dark:text-purple-400 w-6 h-6"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-purple-600 dark:text-purple-400">Total Leads</p>
              <p class="text-3xl font-semibold text-purple-900 dark:text-purple-100">
                {{ referrerData.statistics?.total_leads || 0 }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <i class="fas fa-percentage text-orange-600 dark:text-orange-400 w-6 h-6"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-orange-600 dark:text-orange-400">Conversion Rate</p>
              <p class="text-3xl font-semibold text-orange-900 dark:text-orange-100">
                {{ (referrerData.statistics?.conversion_rate || 0).toFixed(1) }}%
              </p>
            </div>
          </div>
        </div>
      </div>



      <!-- Debug Information (temporary) -->
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Debug Info:</h4>
        <p class="text-xs text-yellow-700 dark:text-yellow-300">
          Tree length: {{ referrerData.tree?.length || 0 }} | 
          Has tree: {{ !!referrerData.tree }} | 
          First node: {{ referrerData.tree?.[0]?.user?.name || 'None' }}
        </p>
      </div>

      <!-- Referrer Tree -->
      <div v-if="referrerData.tree && referrerData.tree.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <i class="fas fa-sitemap text-blue-500 mr-3"></i>
          Referrer Tree ({{ referrerData.tree.length }} {{ referrerData.tree.length === 1 ? 'referrer' : 'referrers' }})
        </h3>
        <div class="space-y-4">
          <!-- Root invite as the starting point of the tree -->
          <div class="border-l-2 border-gray-200 dark:border-gray-600">
            <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-2 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      {{ referrerData.root_invite.handle }}
                    </span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      <i class="fas fa-crown mr-1"></i>
                      Root
                    </span>
                    <span v-if="referrerData.root_invite.is_active" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Active
                    </span>
                    <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      Inactive
                    </span>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p class="text-gray-600 dark:text-gray-400">User</p>
                      <p class="font-medium text-gray-900 dark:text-white">{{ referrerData.root_invite.user?.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-500">{{ referrerData.root_invite.user?.email }}</p>
                    </div>
                    <div>
                      <p class="text-gray-600 dark:text-gray-400">Performance</p>
                      <div class="flex gap-4">
                        <div>
                          <p class="text-xs text-gray-500 dark:text-gray-500">Clicks</p>
                          <p class="font-medium text-gray-900 dark:text-white">{{ referrerData.root_invite.clicks }}</p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 dark:text-gray-500">Leads</p>
                          <p class="font-medium text-gray-900 dark:text-white">{{ referrerData.root_invite.leads_count }}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p class="text-gray-600 dark:text-gray-400">Invited by</p>
                      <p class="font-medium text-gray-900 dark:text-white">System</p>
                      <p class="text-xs text-gray-500 dark:text-gray-500">Root Invite</p>
                    </div>
                  </div>
                  
                  <div class="mt-2">
                    <p class="text-gray-600 dark:text-gray-400 text-xs">Join URL</p>
                    <p class="text-blue-600 dark:text-blue-400 text-xs break-all">
                      {{ referrerData.root_invite.join_url || 'No URL available' }}
                    </p>
                  </div>
                </div>
                
                <div v-if="referrerData.root_invite.join_url" class="flex items-center gap-2 ml-4">
                  <button
                    @click="copyUrl(referrerData.root_invite.join_url)"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                    title="Copy URL"
                  >
                    <i class="fas fa-copy w-4 h-4"></i>
                  </button>
                  <button
                    @click="openUrl(referrerData.root_invite.join_url)"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                    title="Open URL"
                  >
                    <i class="fas fa-external-link-alt w-4 h-4"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Children of the root invite -->
            <div v-if="referrerData.tree && referrerData.tree.length > 0" class="ml-4">
              <ReferrerTreeNode
                v-for="node in referrerData.tree"
                :key="node.id"
                :node="node"
                :depth="1"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="inline-flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full">
          <i class="fas fa-sitemap text-3xl text-gray-400 dark:text-gray-500"></i>
        </div>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">No Referrers Found</h3>
        <p class="text-gray-600 dark:text-gray-400">This page doesn't have any referrers yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import pagesService from '../services/pagesService'
import ReferrerTreeNode from '../components/ReferrerTreeNode.vue'

const router = useRouter()
const route = useRoute()

// Reactive data
const loading = ref(false)
const error = ref(null)
const referrerData = ref(null)
const pageData = ref(null)

// Methods
const goBack = () => {
  router.push('/pages')
}

const refreshData = () => {
  fetchReferrerData()
}

const copyUrl = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    console.log('URL copied to clipboard:', url)
  } catch (error) {
    console.error('Failed to copy URL:', error)
  }
}

const openUrl = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const fetchReferrerData = async () => {
  const pageId = route.params.id
  if (!pageId) {
    error.value = 'No page ID provided'
    return
  }

  loading.value = true
  error.value = null

  try {
    // Use the actual API endpoint
    const response = await pagesService.getPageReferrers(pageId)
    if (response.success) {
      referrerData.value = response.data
      pageData.value = response.data.page
    } else {
      error.value = response.message || 'Failed to fetch referrer data'
    }
  } catch (err) {
    console.error('Error fetching referrer data:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to fetch referrer data'
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchReferrerData()
})
</script>