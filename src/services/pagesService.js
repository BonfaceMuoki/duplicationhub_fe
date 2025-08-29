import api from '../api.js'

// Pages API service
const API_BASE_URL = '/admin/pages'

// Get all pages with pagination
async function getPages(page = 1, perPage = 15, search = '') {
  try {
    console.log(`Fetching pages from: ${API_BASE_URL}`, { page, perPage, search })
    
    // Build params object, excluding empty values
    const params = {
      page,
      per_page: perPage
    }
    
    // Only include search parameter if it's not empty
    if (search && search.trim() !== '') {
      params.search = search.trim()
      console.log('Including search parameter:', params.search)
    } else {
      console.log('Search parameter is empty, excluding from API call')
    }
    
    console.log('Final API params:', params)
    
    const response = await api.get(API_BASE_URL, { params })
    
    console.log('API Response:', response)
    return response.data
  } catch (error) {
    console.error('Error fetching pages:', error)
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    })
    throw error
  }
}

// Get a single page by ID
async function getPage(id) {
  try {
    const response = await api.get(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching page:', error)
    throw error
  }
}

// Create a new page
async function createPage(pageData) {
  try {
    const response = await api.post(API_BASE_URL, pageData)
    return response.data
  } catch (error) {
    console.error('Error creating page:', error)
    throw error
  }
}

// Update an existing page
async function updatePage(id, pageData) {
  try {
    const response = await api.put(`${API_BASE_URL}/${id}`, pageData)
    return response.data
  } catch (error) {
    console.error('Error updating page:', error)
    throw error
  }
}

// Delete a page
async function deletePage(id) {
  try {
    const response = await api.delete(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting page:', error)
    throw error
  }
}

// Toggle page status (active/inactive)
async function togglePageStatus(id) {
  try {
    const response = await api.patch(`${API_BASE_URL}/${id}/toggle-status`)
    return response.data
  } catch (error) {
    console.error('Error toggling page status:', error)
    throw error
  }
}

// Bulk update pages
async function bulkUpdatePages(pageIds, updates) {
  try {
    const response = await api.patch(`${API_BASE_URL}/bulk-update`, {
      page_ids: pageIds,
      updates
    })
    return response.data
  } catch (error) {
    console.error('Error bulk updating pages:', error)
    throw error
  }
}

// Bulk delete pages
async function bulkDeletePages(pageIds) {
  try {
    const response = await api.delete(`${API_BASE_URL}/bulk-delete`, {
      data: { page_ids: pageIds }
    })
    return response.data
  } catch (error) {
    console.error('Error bulk deleting pages:', error)
    throw error
  }
}

export default {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  togglePageStatus,
  bulkUpdatePages,
  bulkDeletePages
} 