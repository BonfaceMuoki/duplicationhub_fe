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

      <!-- Root Invite Section -->
      <div v-if="referrerData.root_invite" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <i class="fas fa-crown text-yellow-500 mr-3"></i>
          Root Invite
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Handle</p>
            <p class="font-medium text-gray-900 dark:text-white text-lg">{{ referrerData.root_invite.handle }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">User</p>
            <p class="font-medium text-gray-900 dark:text-white text-lg">{{ referrerData.root_invite.user?.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-500">{{ referrerData.root_invite.user?.email }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Performance</p>
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
          <div class="md:col-span-2 lg:col-span-3">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Join URL</p>
            <div class="flex items-center gap-2">
              <p class="font-medium text-blue-600 dark:text-blue-400 break-all flex-1">{{ referrerData.root_invite.join_url }}</p>
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
      </div>

      <!-- Referrer Tree -->
      <div v-if="referrerData.tree && referrerData.tree.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <i class="fas fa-sitemap text-blue-500 mr-3"></i>
          Referrer Tree
        </h3>
        <div class="space-y-4">
          <ReferrerTreeNode
            v-for="node in referrerData.tree"
            :key="node.id"
            :node="node"
            :depth="0"
          />
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