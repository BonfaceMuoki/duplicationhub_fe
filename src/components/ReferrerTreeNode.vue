<template>
  <div class="border-l-2 border-gray-200 dark:border-gray-600 ml-4">
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-2 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {{ node.handle }}
            </span>
            <span v-if="node.is_active" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              Active
            </span>
            <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              Inactive
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p class="text-gray-600 dark:text-gray-400">User</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ node.user?.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-500">{{ node.user?.email }}</p>
            </div>
            <div>
              <p class="text-gray-600 dark:text-gray-400">Performance</p>
              <div class="flex gap-4">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-500">Clicks</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ node.clicks }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-500">Leads</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ node.leads_count }}</p>
                </div>
              </div>
            </div>
            <div>
              <p class="text-gray-600 dark:text-gray-400">Invited by</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ node.inviter?.user?.name || 'System' }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-500">{{ node.inviter?.handle || 'Root Invite' }}</p>
            </div>
          </div>
          
          <div class="mt-2">
            <p class="text-gray-600 dark:text-gray-400 text-xs">Join URL</p>
            <p class="text-blue-600 dark:text-blue-400 text-xs break-all">
              {{ node.join_url || 'No URL available' }}
            </p>
          </div>
        </div>
        
        <div v-if="node.join_url" class="flex items-center gap-2 ml-4">
          <button
            @click="copyUrl"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            title="Copy URL"
          >
            <i class="fas fa-copy w-4 h-4"></i>
          </button>
          <button
            @click="openUrl"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            title="Open URL"
          >
            <i class="fas fa-external-link-alt w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Children - Full recursive rendering -->
    <div v-if="node.children && node.children.length > 0" class="ml-4">
      <ReferrerTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<script setup>
// Import the component itself for recursive rendering
import ReferrerTreeNode from './ReferrerTreeNode.vue'

// Props
const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  depth: {
    type: Number,
    default: 0
  }
})

// Methods
const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(props.node.join_url)
    // You could add a toast notification here
    console.log('URL copied to clipboard:', props.node.join_url)
  } catch (error) {
    console.error('Failed to copy URL:', error)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = props.node.join_url
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      console.log('URL copied to clipboard (fallback method):', props.node.join_url)
    } catch (fallbackError) {
      console.error('Fallback copy method failed:', fallbackError)
    }
    document.body.removeChild(textArea)
  }
}

const openUrl = () => {
  window.open(props.node.join_url, '_blank', 'noopener,noreferrer')
}
</script>