<template>
  <div v-if="isOpen" class="fixed inset-0 z-[9999] overflow-y-auto">
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 transition-opacity modal-backdrop" 
      style="background-color: rgba(0, 0, 0, 0.3);"
      @click="closeModal"
    ></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-start justify-center p-4 pt-8">
      <div class="relative w-full max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-600 max-h-[90vh] overflow-y-auto modal-content ring-4 ring-white dark:ring-gray-800 bg-opacity-95 dark:bg-opacity-95">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Page Referrers
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ pageData?.title || 'Loading...' }}
            </p>
          </div>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i class="fas fa-times w-6 h-6"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Loading referrer data...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-8">
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
          <div v-else-if="referrerData" class="space-y-6">
            <!-- Statistics Overview -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div class="flex items-center">
                  <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <i class="fas fa-users text-blue-600 dark:text-blue-400 w-5 h-5"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-blue-600 dark:text-blue-400">Total Invites</p>
                    <p class="text-2xl font-semibold text-blue-900 dark:text-blue-100">
                      {{ referrerData.statistics?.total_invites || 0 }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div class="flex items-center">
                  <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <i class="fas fa-mouse-pointer text-green-600 dark:text-green-400 w-5 h-5"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-green-600 dark:text-green-400">Total Clicks</p>
                    <p class="text-2xl font-semibold text-green-900 dark:text-green-100">
                      {{ referrerData.statistics?.total_clicks || 0 }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div class="flex items-center">
                  <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <i class="fas fa-user-plus text-purple-600 dark:text-purple-400 w-5 h-5"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-purple-600 dark:text-purple-400">Total Leads</p>
                    <p class="text-2xl font-semibold text-purple-900 dark:text-purple-100">
                      {{ referrerData.statistics?.total_leads || 0 }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <div class="flex items-center">
                  <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <i class="fas fa-percentage text-orange-600 dark:text-orange-400 w-5 h-5"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-orange-600 dark:text-orange-400">Conversion Rate</p>
                    <p class="text-2xl font-semibold text-orange-900 dark:text-orange-100">
                      {{ (referrerData.statistics?.conversion_rate || 0).toFixed(1) }}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Root Invite Section -->
            <div v-if="referrerData.root_invite" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <i class="fas fa-crown text-yellow-500 mr-2"></i>
                Root Invite
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Handle</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ referrerData.root_invite.handle }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">User</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ referrerData.root_invite.user?.name }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Clicks</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ referrerData.root_invite.clicks }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Leads</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ referrerData.root_invite.leads_count }}</p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-gray-600 dark:text-gray-400">Join URL</p>
                  <p class="font-medium text-blue-600 dark:text-blue-400 break-all">{{ referrerData.root_invite.join_url }}</p>
                </div>
              </div>
            </div>

            <!-- Referrer Tree -->
            <div v-if="referrerData.tree && referrerData.tree.length > 0">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <i class="fas fa-sitemap text-blue-500 mr-2"></i>
                Referrer Tree
              </h4>
              <div class="space-y-2">
                <ReferrerTreeNode
                  v-for="node in referrerData.tree"
                  :key="node.id"
                  :node="node"
                  :depth="0"
                />
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8">
              <div class="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                <i class="fas fa-sitemap text-2xl text-gray-400 dark:text-gray-500"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Referrers Found</h3>
              <p class="text-gray-600 dark:text-gray-400">This page doesn't have any referrers yet.</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import pagesService from '../services/pagesService'
import ReferrerTreeNode from './ReferrerTreeNode.vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  pageData: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close'])

// Reactive data
const loading = ref(false)
const error = ref(null)
const referrerData = ref(null)

// Methods
const closeModal = () => {
  emit('close')
}

const fetchReferrerData = async () => {
  if (!props.pageData?.id) return

  loading.value = true
  error.value = null

  try {
    // For now, use mock data to demonstrate the UI
    // TODO: Replace with actual API call when backend is ready
    const mockData = {
      "success": true,
      "data": {
        "page": {
          "id": 1,
          "title": props.pageData?.title || "Sample Page",
          "slug": props.pageData?.slug || "sample-page",
          "owner": {
            "id": 1,
            "name": "Page Owner",
            "email": "owner@example.com"
          }
        },
        "root_invite": {
          "id": 1,
          "handle": "root123",
          "join_url": "https://example.com/join/root123",
          "clicks": 500,
          "leads_count": 100,
          "is_active": true,
          "created_at": "2024-01-01T00:00:00.000000Z",
          "updated_at": "2024-01-01T00:00:00.000000Z",
          "user": {
            "id": 1,
            "name": "Root User",
            "first_name": "Root",
            "middle_name": null,
            "last_name": "User",
            "email": "root@example.com",
            "phone_number": "+1234567890",
            "date_of_birth": "1990-01-01",
            "gender": "male",
            "account_status": "active"
          },
          "page": {
            "id": 1,
            "title": props.pageData?.title || "Sample Page",
            "slug": props.pageData?.slug || "sample-page",
            "is_public": true
          },
          "inviter": null
        },
        "tree": [
          {
            "id": 2,
            "handle": "depth1_1",
            "join_url": "https://example.com/join/depth1_1",
            "clicks": 100,
            "leads_count": 20,
            "is_active": true,
            "created_at": "2024-01-02T00:00:00.000000Z",
            "updated_at": "2024-01-02T00:00:00.000000Z",
            "user": {
              "id": 2,
              "name": "Depth 1 User 1",
              "first_name": "Depth1",
              "middle_name": null,
              "last_name": "User1",
              "email": "depth1_1@example.com",
              "phone_number": "+1234567891",
              "date_of_birth": "1992-05-15",
              "gender": "female",
              "account_status": "active"
            },
            "page": {
              "id": 1,
              "title": props.pageData?.title || "Sample Page",
              "slug": props.pageData?.slug || "sample-page",
              "is_public": true
            },
            "inviter": {
              "id": 1,
              "handle": "root123",
              "user": {
                "id": 1,
                "name": "Root User",
                "email": "root@example.com"
              }
            },
            "children": [
              {
                "id": 3,
                "handle": "depth2_1",
                "join_url": "https://example.com/join/depth2_1",
                "clicks": 50,
                "leads_count": 10,
                "is_active": true,
                "created_at": "2024-01-03T00:00:00.000000Z",
                "updated_at": "2024-01-03T00:00:00.000000Z",
                "user": {
                  "id": 3,
                  "name": "Depth 2 User 1",
                  "first_name": "Depth2",
                  "middle_name": null,
                  "last_name": "User1",
                  "email": "depth2_1@example.com",
                  "phone_number": "+1234567892",
                  "date_of_birth": "1988-12-10",
                  "gender": "male",
                  "account_status": "active"
                },
                "page": {
                  "id": 1,
                  "title": props.pageData?.title || "Sample Page",
                  "slug": props.pageData?.slug || "sample-page",
                  "is_public": true
                },
                "inviter": {
                  "id": 2,
                  "handle": "depth1_1",
                  "user": {
                    "id": 2,
                    "name": "Depth 1 User 1",
                    "email": "depth1_1@example.com"
                  }
                },
                "children": [
                  {
                    "id": 4,
                    "handle": "depth3_1",
                    "join_url": "https://example.com/join/depth3_1",
                    "clicks": 25,
                    "leads_count": 5,
                    "is_active": true,
                    "created_at": "2024-01-04T00:00:00.000000Z",
                    "updated_at": "2024-01-04T00:00:00.000000Z",
                    "user": {
                      "id": 4,
                      "name": "Depth 3 User 1",
                      "first_name": "Depth3",
                      "middle_name": null,
                      "last_name": "User1",
                      "email": "depth3_1@example.com",
                      "phone_number": "+1234567893",
                      "date_of_birth": "1995-03-20",
                      "gender": "female",
                      "account_status": "active"
                    },
                    "page": {
                      "id": 1,
                      "title": props.pageData?.title || "Sample Page",
                      "slug": props.pageData?.slug || "sample-page",
                      "is_public": true
                    },
                    "inviter": {
                      "id": 3,
                      "handle": "depth2_1",
                      "user": {
                        "id": 3,
                        "name": "Depth 2 User 1",
                        "email": "depth2_1@example.com"
                      }
                    },
                    "children": [
                      {
                        "id": 5,
                        "handle": "depth4_1",
                        "join_url": "https://example.com/join/depth4_1",
                        "clicks": 15,
                        "leads_count": 3,
                        "is_active": true,
                        "created_at": "2024-01-05T00:00:00.000000Z",
                        "updated_at": "2024-01-05T00:00:00.000000Z",
                        "user": {
                          "id": 5,
                          "name": "Depth 4 User 1",
                          "first_name": "Depth4",
                          "middle_name": null,
                          "last_name": "User1",
                          "email": "depth4_1@example.com",
                          "phone_number": "+1234567894",
                          "date_of_birth": "1993-07-08",
                          "gender": "male",
                          "account_status": "active"
                        },
                        "page": {
                          "id": 1,
                          "title": props.pageData?.title || "Sample Page",
                          "slug": props.pageData?.slug || "sample-page",
                          "is_public": true
                        },
                        "inviter": {
                          "id": 4,
                          "handle": "depth3_1",
                          "user": {
                            "id": 4,
                            "name": "Depth 3 User 1",
                            "email": "depth3_1@example.com"
                          }
                        },
                        "children": [
                          {
                            "id": 6,
                            "handle": "depth5_1",
                            "join_url": "https://example.com/join/depth5_1",
                            "clicks": 8,
                            "leads_count": 2,
                            "is_active": true,
                            "created_at": "2024-01-06T00:00:00.000000Z",
                            "updated_at": "2024-01-06T00:00:00.000000Z",
                            "user": {
                              "id": 6,
                              "name": "Depth 5 User 1",
                              "first_name": "Depth5",
                              "middle_name": null,
                              "last_name": "User1",
                              "email": "depth5_1@example.com",
                              "phone_number": "+1234567895",
                              "date_of_birth": "1997-11-12",
                              "gender": "female",
                              "account_status": "active"
                            },
                            "page": {
                              "id": 1,
                              "title": props.pageData?.title || "Sample Page",
                              "slug": props.pageData?.slug || "sample-page",
                              "is_public": true
                            },
                            "inviter": {
                              "id": 5,
                              "handle": "depth4_1",
                              "user": {
                                "id": 5,
                                "name": "Depth 4 User 1",
                                "email": "depth4_1@example.com"
                              }
                            },
                            "children": []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "statistics": {
          "total_invites": 6,
          "total_clicks": 698,
          "total_leads": 140,
          "active_invites": 6,
          "unique_users": 6,
          "conversion_rate": 20.06,
          "depth_distribution": {
            "1": 1,
            "2": 1,
            "3": 1,
            "4": 1,
            "5": 1
          },
          "max_depth": 5
        },
        "filters_applied": {
          "page_id": props.pageData?.id || 1,
          "user_id": null,
          "include_inactive": false
        }
      }
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    referrerData.value = mockData.data

    // Uncomment this when you want to use the real API:
    // const response = await pagesService.getPageReferrers(props.pageData.id)
    // if (response.success) {
    //   referrerData.value = response.data
    // } else {
    //   error.value = response.message || 'Failed to fetch referrer data'
    // }
  } catch (err) {
    console.error('Error fetching referrer data:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to fetch referrer data'
  } finally {
    loading.value = false
  }
}

// Watch for modal opening
watch(() => props.isOpen, (newValue) => {
  if (newValue && props.pageData?.id) {
    fetchReferrerData()
  } else if (!newValue) {
    // Reset data when modal closes
    referrerData.value = null
    error.value = null
  }
})
</script>