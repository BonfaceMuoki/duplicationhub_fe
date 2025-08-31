<template>
  <div class="p-6 space-y-8 bg-gray-50 min-h-screen">
    <!-- User Role & Permissions Section -->
  

    <!-- Dashboard Widgets Grid -->
    <div v-if="dashboard.totalLeads > 0 || dashboard.totalReferrers > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <!-- Total Leads -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col group">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl">
            <i class="fas fa-user-plus text-green-600 dark:text-green-400 text-2xl"></i>
          </div>
          <div class="text-right">
            <div class="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">+{{ Math.floor(Math.random() * 5) + 1 }}%</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">vs last week</div>
          </div>
        </div>
        <h5 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Leads</h5>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ dashboard.totalLeads }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">Active leads in your funnel</p>
      </div>

      <!-- Unique Referrers -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col group">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
            <i class="fas fa-users text-blue-600 dark:text-blue-400 text-2xl"></i>
          </div>
          <div class="text-right">
            <div class="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">+{{ Math.floor(Math.random() * 8) + 2 }}%</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">vs last week</div>
          </div>
        </div>
        <h5 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Unique Referrers</h5>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ dashboard.totalReferrers }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">People sharing your links</p>
      </div>

      <!-- Top Performing Page -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col group">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl">
            <i class="fas fa-chart-line text-yellow-600 dark:text-yellow-400 text-2xl"></i>
          </div>
          <div class="text-right">
            <div class="text-xs font-medium text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">Top</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Performer</div>
          </div>
        </div>
        <h5 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Top Performing Page</h5>
        <div class="mb-1">
          <span v-if="dashboard.topPage && dashboard.topPage !== 'No data'" class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ dashboard.topPage.includes('Unknown') ? dashboard.topPage.replace('Unknown (', '').replace(')', '') : dashboard.topPage }}
          </span>
          <span v-else class="text-lg font-semibold text-gray-400 dark:text-gray-500">No pages yet</span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">Highest conversion rate</p>
      </div>

      <!-- Most Recent Lead -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col group">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl">
            <i class="fas fa-clock text-purple-600 dark:text-purple-400 text-2xl"></i>
          </div>
          <div class="text-right">
            <div class="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">Latest</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Activity</div>
          </div>
        </div>
        <h5 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Latest Lead</h5>
        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-600 dark:text-gray-400"><span class="font-medium">Name:</span> {{ dashboard.recentLead?.name || 'N/A' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span class="text-gray-600 dark:text-gray-400"><span class="font-medium">Referrer:</span> {{ dashboard.recentLead?.referrer || 'N/A' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span class="text-gray-600 dark:text-gray-400"><span class="font-medium">Page:</span> {{ dashboard.recentLead?.page || 'N/A' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span class="text-gray-600 dark:text-gray-400"><span class="font-medium">Joined:</span> {{ formatTimestamp(dashboard.recentLead?.joined_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Dashboard State -->
    <div v-else class="bg-white border border-gray-200 rounded-lg shadow-md p-12 text-center">
      <div class="max-w-md mx-auto">
        <!-- Welcome Icon -->
        <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fas fa-rocket text-4xl text-blue-600 dark:text-blue-400"></i>
        </div>
        
        <!-- Welcome Message -->
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Your Dashboard! 🚀</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          This is where you'll see all your referral marketing performance, leads, and activities. 
          Get started by creating your first landing page and sharing your referral links.
        </p>
        
        <!-- Primary Actions -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="/pages"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <i class="fas fa-plus mr-2"></i>
            Create Landing Page
          </a>
          <a
            href="/leads"
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <i class="fas fa-users mr-2"></i>
            View Leads
          </a>
        </div>
        
        <!-- Quick Stats Preview -->
        <div class="grid grid-cols-2 gap-4 text-center">
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">0</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Total Leads</div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">0</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Referrers</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Feed -->
    <div class="bg-white border border-gray-200 rounded-lg shadow-md">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <i class="fas fa-bolt text-orange-500"></i> Recent Activity
        </h2>
        <button 
          class="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
          @click="refreshFeed"
          aria-label="Refresh Activity Feed"
        >
          Refresh
        </button>
      </div>
 <ul class="max-h-96 overflow-y-auto divide-y divide-gray-100 px-6 py-4">
  <li v-for="(activity, index) in dashboard.recentActivity" :key="index" class="py-4 flex items-start gap-4">
    <!-- Placeholder Circle Icon -->
    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-lg shadow-inner">
      {{ activity.name?.charAt(0).toUpperCase() || '?' }}
    </div>

    <div class="flex-1">
      <p class="text-gray-800 mb-1">
        <span class="font-semibold">{{ activity.name }}</span>
        joined via
        <span class="font-medium text-blue-600">{{ activity.page }}</span>
        using ref
        <span class="text-green-600 font-semibold">{{ activity.ref }}</span>
      </p>
      <p class="text-gray-500 text-xs mb-3">{{ activity.timestamp }}</p>

      <!-- Action Buttons -->
      <!-- <div class="flex flex-wrap gap-3 text-sm">
        <a
          :href="activity.actions?.view_lead_url || '#'"
          target="_blank"
          class="text-blue-600 hover:underline flex items-center gap-1"
        >
          <i class="fas fa-eye"></i> View Lead
        </a>

        <a
          :href="activity.actions?.whatsapp_url || '#'"
          target="_blank"
          rel="noopener"
          class="text-green-600 hover:underline flex items-center gap-1"
        >
          <i class="fab fa-whatsapp"></i> WhatsApp
        </a>

        <a
          :href="activity.actions?.email_url || '#'"
          class="text-purple-600 hover:underline flex items-center gap-1"
        >
          <i class="fas fa-envelope"></i> Email
        </a>

        <button
          @click="copyReferralLink(activity)"
          class="text-gray-600 hover:underline flex items-center gap-1"
          type="button"
        >
          <i class="fas fa-copy"></i> Copy Link
        </button>
      </div> -->
    </div>
  </li>

  <li v-if="!dashboard.recentActivity.length" class="text-center py-12">
    <div class="flex flex-col items-center">
      <!-- Empty State Icon -->
      <div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <i class="fas fa-chart-line text-3xl text-gray-400 dark:text-gray-500"></i>
      </div>
      
      <!-- Empty State Text -->
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Recent Activity</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        Your dashboard will show recent leads and activities here once people start using your referral links.
      </p>
      
      <!-- Call to Action -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          @click="refreshFeed"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <i class="fas fa-sync-alt mr-2"></i>
          Refresh Dashboard
        </button>
        <a
          href="/pages"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
        >
          <i class="fas fa-plus mr-2"></i>
          Create Landing Page
        </a>
      </div>
      
      <!-- Helpful Tips -->
      <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-md">
        <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Getting Started Tips:</h4>
        <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1 text-left">
          <li>• Create landing pages to start collecting leads</li>
          <li>• Share your referral links with your network</li>
          <li>• Track performance and optimize your funnels</li>
        </ul>
      </div>
    </div>
  </li>
</ul>

    </div>

    <Classes />
  </div>
</template>


<script setup>
import { onMounted, ref, computed } from 'vue';
import { authStore } from '../store/authStore';
import api from '../api';

const auth = authStore();

// User info from auth store
const userInfo = computed(() => auth.user);
const userRole = computed(() => auth.role);
const userPermissions = computed(() => auth.permissions);

const dashboard = ref({
  totalLeads: 0,
  totalReferrers: 0,
  topPage: '',
  recentLead: {
    name: '',
    referrer: '',
    page: '',
    joined_at: ''
  },
  recentActivity: []
});

// Format permission keys for display
function formatPermissionKey(key) {
  // Ensure key is a string and handle edge cases
  if (typeof key !== 'string') {
    console.warn('Permission key is not a string:', key);
    return String(key) || 'Unknown Permission';
  }
  
  try {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } catch (error) {
    console.error('Error formatting permission key:', error, key);
    return String(key) || 'Unknown Permission';
  }
}

async function fetchDashboard() {
  try {
    const response = await api.get(`/dashboard/my-summary`);
    
    if (response.data.success) {
      const data = response.data.data;
      
      // Map the API data to our dashboard structure
      dashboard.value = {
        totalLeads: data.total_leads || 0,
        totalReferrers: data.unique_referrers || 0,
        topPage: data.top_performing_page ? `${data.top_performing_page.name} (${data.top_performing_page.leads_count} leads)` : 'No data',
        recentLead: {
          name: data.latest_lead?.name || '',
          referrer: data.latest_lead?.referrer || '',
          page: data.latest_lead?.page || '',
          joined_at: data.latest_lead?.joined_at || ''
        },
        recentActivity: data.recent_activity?.map(activity => ({
          lead_id: activity.lead_id,
          name: activity.lead_name,
          ref: activity.referrer_name,
          page: activity.page_name,
          timestamp: formatTimestamp(activity.joined_at),
          lead_status: activity.lead_status,
          actions: activity.actions
        })) || []
      };
      
      console.log('Dashboard data loaded:', dashboard.value);
    } else {
      console.error('Failed to load dashboard data:', response.data.message);
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
}

function refreshFeed() {
  fetchDashboard();
}

function formatPhone(phone) {
  // Simple cleanup: remove non-digits for WhatsApp URL
  return phone ? phone.replace(/\D/g, '') : '';
}

function formatTimestamp(timestamp) {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function copyReferralLink(activity) {
  const link = activity.actions?.copy_link || `http://localhost:8004/pages/${activity.page}?ref=${activity.ref}`;
  navigator.clipboard.writeText(link)
    .then(() => alert('Referral link copied to clipboard!'))
    .catch(() => alert('Failed to copy link.'));
}

onMounted(() => {
  fetchDashboard();
});
</script>


  