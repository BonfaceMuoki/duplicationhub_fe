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
      <div class="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-600 max-h-[90vh] overflow-y-auto modal-content ring-4 ring-white dark:ring-gray-800 bg-opacity-95 dark:bg-opacity-95">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ pageFormStore.isEditMode ? 'Edit Landing Page' : 'Creating New Page' }}
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i class="fas fa-times w-6 h-6"></i>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 pb-8">
          <!-- General Error Message -->
          <div v-if="pageFormStore.errors.general" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p class="text-sm text-red-600 dark:text-red-400">{{ pageFormStore.errors.general }}</p>
          </div>

          <!-- Step Indicator -->
          <div class="mb-8">
            <div class="flex items-center justify-center space-x-4">
              <div 
                v-for="(step, index) in steps" 
                :key="index"
                class="flex items-center"
              >
                <!-- Step Circle -->
                <div 
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors',
                    pageFormStore.currentStep >= index 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                  ]"
                >
                  <span v-if="pageFormStore.currentStep > index">
                    <i class="fas fa-check text-xs"></i>
                  </span>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                
                <!-- Step Label -->
                <span 
                  v-if="index < steps.length - 1"
                  class="ml-4 text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {{ step.label }}
                </span>
              </div>
            </div>
          </div>

          <!-- Step Content -->
          <div class="space-y-6">
            <!-- Step 1: Basic Info -->
            <div v-if="pageFormStore.currentStep === 0" class="step-content">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Page Title *
                  </label>
                  <input
                    id="title"
                    v-model="pageFormStore.formData.title"
                    type="text"
                    required
                    @input="generateSlugFromTitle"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter page title"
                  />
                  <p v-if="pageFormStore.errors.title" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {{ pageFormStore.errors.title }}
                  </p>
                </div>

                <div>
                  <label for="slug" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Page Slug *
                  </label>
                  <input
                    id="slug"
                    v-model="pageFormStore.formData.slug"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter page slug"
                  />
                  <p v-if="pageFormStore.errors.slug" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {{ pageFormStore.errors.slug }}
                  </p>
                </div>
              </div>

              <div class="mt-6">
                <label for="headline" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Headline *
                </label>
                <input
                  id="headline"
                  v-model="pageFormStore.formData.headline"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter compelling headline"
                />
                <p v-if="pageFormStore.errors.headline" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ pageFormStore.errors.headline }}
                </p>
              </div>

              <div class="mt-6">
                <label for="summary" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Summary
                </label>
                <textarea
                  id="summary"
                  v-model="pageFormStore.formData.summary"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Brief description of the page"
                ></textarea>
              </div>
            </div>

            <!-- Step 2: Media & Settings -->
            <div v-if="pageFormStore.currentStep === 1" class="step-content">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Media & Settings</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="video_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Video URL
                  </label>
                  <input
                    id="video_url"
                    v-model="pageFormStore.formData.video_url"
                    type="url"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label for="capture_mode" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Capture Mode
                  </label>
                  <select
                    id="capture_mode"
                    v-model="pageFormStore.formData.capture_mode"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="inline">Inline</option>
                    <!-- <option value="modal">Modal</option>                   -->
                    <!-- <option value="redirect">Redirect</option> -->
                  </select>
                </div>
              </div>

              <div class="mt-6">
                <label for="platform_base_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add The Page Url in format (https://www.example.com)
                </label>
                <input
                  id="platform_base_url"
                  v-model="pageFormStore.formData.platform_base_url"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder=""
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    v-model="pageFormStore.formData.status"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div class="flex items-center mt-6">
                  <input
                    id="is_active"
                    v-model="pageFormStore.formData.is_active"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="is_active" class="ml-2 block text-sm text-gray-900 dark:text-white">
                    Active
                  </label>
                </div>

                <div class="flex items-center mt-4">
                  <input
                    id="is_public"
                    v-model="pageFormStore.formData.is_public"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="is_public" class="ml-2 block text-sm text-gray-900 dark:text-white">
                    Public
                  </label>
                </div>
              </div>
            </div>

            <!-- Step 3: Content & CTA -->
            <div v-if="pageFormStore.currentStep === 2" class="step-content">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Content & Call to Action</h4>
              
              <div class="mb-6">
                <label for="body" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Page Body *
                </label>

                                 <!-- CKEditor 5 using self-hosted build -->
                 <div class="ckeditor-container">
                   <ckeditor
                     v-model="pageFormStore.formData.body"
                     :editor="editor"
                     :config="editorConfig"
                     @ready="onEditorReady"
                     @input="onEditorInput"
                   />
                 </div>
                
                <p v-if="pageFormStore.errors.body" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ pageFormStore.errors.body }}
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="cta_text" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CTA Button Text
                  </label>
                  <input
                    id="cta_text"
                    v-model="pageFormStore.formData.cta_text"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Get Started Now"
                  />
                </div>

                <div>
                  <label for="cta_subtext" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CTA Subtext
                  </label>
                  <input
                    id="cta_subtext"
                    v-model="pageFormStore.formData.cta_subtext"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Join thousands of satisfied customers"
                  />
                </div>
              </div>

              <div class="mt-6">
                <label for="image_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Page Image
                </label>
                <div class="space-y-4">
                  <!-- File Upload -->
                  <div class="relative">
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      @change="handleFileChange"
                      @dragover.prevent="handleDragOver"
                      @dragleave.prevent="handleDragLeave"
                      @drop.prevent="handleDrop"
                      class="hidden"
                    />
                    
                    <!-- Upload Area -->
                    <div
                      @click="$refs.fileInput.click()"
                      @dragover.prevent="handleDragOver"
                      @dragleave.prevent="handleDragLeave"
                      @drop.prevent="handleDrop"
                      :class="[
                        'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                        pageFormStore.isDragOver ? 'drag-over' : 'border-gray-300 dark:border-gray-600'
                      ]"
                    >
                      <div v-if="!pageFormStore.selectedImageFile && !pageFormStore.imagePreview">
                        <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          <span class="font-medium text-blue-600">Click to upload</span> or drag and drop
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                      
                      <!-- Image Preview -->
                      <div v-if="pageFormStore.imagePreview" class="image-preview-container">
                        <img :src="pageFormStore.imagePreview" alt="Preview" class="mx-auto max-h-32 rounded-lg shadow-sm" />
                        <button
                          type="button"
                          @click.stop="pageFormStore.removeImage"
                          class="mt-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="pageFormStore.uploadProgress > 0 && pageFormStore.uploadProgress < 100" class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div class="bg-blue-600 h-2 rounded-full upload-progress" :style="{ width: pageFormStore.uploadProgress + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6">
                <div class="flex items-center">
                  <input
                    id="show_consent"
                    v-model="pageFormStore.formData.show_consent"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="show_consent" class="ml-2 block text-sm text-gray-900 dark:text-white">
                    Show consent checkbox
                  </label>
                </div>
                
                <div v-if="pageFormStore.formData.show_consent" class="mt-4">
                  <label for="consent_text" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Consent Text
                  </label>
                  <input
                    id="consent_text"
                    v-model="pageFormStore.formData.consent_text"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="I agree to receive marketing communications"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between mt-8">
            <button
              v-if="pageFormStore.currentStep > 0"
              type="button"
              @click="previousStep"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Previous
            </button>
            <div v-else></div>

            <div class="flex space-x-3">
              <button
                v-if="pageFormStore.currentStep < steps.length - 1"
                type="button"
                @click="nextStep"
                :disabled="!canProceedToNextStep"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                  canProceedToNextStep
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                Next
              </button>
              
              <button
                v-if="pageFormStore.currentStep === steps.length - 1"
                type="submit"
                :disabled="pageFormStore.loading"
                class="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="pageFormStore.loading" class="inline-flex items-center">
                  <i class="fas fa-spinner fa-spin mr-2"></i>
                  {{ pageFormStore.isEditMode ? 'Updating...' : 'Creating...' }}
                </span>
                <span v-else>{{ pageFormStore.isEditMode ? 'Update Page' : 'Create Page' }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick, onMounted } from 'vue'
import { usePageFormStore } from '../store/pageFormStore'
import pagesService from '../services/pagesService'
import { Ckeditor } from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { useToast } from 'vue-toast-notification'



const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'page-created', 'page-updated'])

// Use Pinia store
const pageFormStore = usePageFormStore()

// Initialize toaster
const toast = useToast()

// CKEditor setup using self-hosted build
const editor = ClassicEditor

const editorConfig = {
  toolbar: [
    'heading',
    '|',
    'bold', 'italic',
    '|',
    'link',
    '|',
    'bulletedList', 'numberedList',
    '|',
    'blockQuote',
    '|',
    'undo', 'redo'
  ],
  // The self-hosted build already includes only free features
  // No need to specify plugins or removePlugins
}

// Local refs for DOM elements
const fileInput = ref(null)

// Step definitions
const steps = [
  { label: 'Basic Info', key: 'basic' },
  { label: 'Media & Settings', key: 'media' },
  { label: 'Content & CTA', key: 'content' }
]

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  console.log('Modal open state changed:', isOpen)
  if (isOpen) {
    console.log('Modal opened, preparing...')
    // Ensure capture_mode defaults to 'inline' when creating new pages
    if (!pageFormStore.isEditMode) {
      console.log('Setting capture_mode to inline for new page')
      pageFormStore.updateFormField('capture_mode', 'inline')
      console.log('capture_mode after setting:', pageFormStore.formData.capture_mode)
    }
    // If editing and we have body content, go to step 3 to show the editor
    if (pageFormStore.isEditMode && pageFormStore.formData.body) {
      console.log('Edit mode with body content, going to step 3...')
      pageFormStore.goToStep(2)
    }
  } else {
    console.log('Modal closed, cleaning up...')
  }
})

// Auto-generate slug from title
watch(() => pageFormStore.formData.title, (newTitle, oldTitle) => {
  console.log('Title watch triggered:', { newTitle, oldTitle })
  
  if (newTitle && newTitle !== oldTitle) {
    // Always generate slug from title, regardless of existing slug
    const generatedSlug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    console.log('Title changed:', newTitle)
    console.log('Generated slug:', generatedSlug)
    console.log('Current slug before update:', pageFormStore.formData.slug)
    
    // Use nextTick to ensure reactivity
    nextTick(() => {
      pageFormStore.updateFormField('slug', generatedSlug)
      console.log('Slug after update:', pageFormStore.formData.slug)
    })
  }
}, { immediate: true })

// Populate form with existing page data for editing
const populateFormForEdit = (pageData) => {
  pageFormStore.populateFormForEdit(pageData)
}

// Reset form
const resetForm = () => {
  // Reset form data
  pageFormStore.resetForm()
  
  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  
  // Reset image preview
  pageFormStore.setImagePreview(null)
  pageFormStore.setSelectedFile(null)
  pageFormStore.setUploadProgress(0)
  pageFormStore.setDragOver(false)
  
  // Reset errors
  pageFormStore.clearErrors()
  
  // Reset step
  pageFormStore.goToStep(0)
}

// CKEditor events
const onEditorReady = (editorInstance) => {
  console.log('CKEditor is ready', editorInstance)
}

const onEditorInput = (event, editorInstance) => {
  console.log('CKEditor input event', event, editorInstance)
}

// Save Quill content to store
const saveQuillContent = () => {
  // No need to save Quill content since we're using a simple textarea
  // The v-model binding handles this automatically
}

// Close modal
const closeModal = () => {
  emit('close')
}

const nextStep = () => {
  if (pageFormStore.currentStep < 2) {
    pageFormStore.nextStep()
  }
}

const previousStep = () => {
  if (pageFormStore.currentStep > 0) {
    pageFormStore.previousStep()
  }
}

// Check if user can proceed to next step
const canProceedToNextStep = computed(() => {
  return pageFormStore.canProceedToNextStep
})

// Image upload functions
const triggerImageUpload = () => {
  fileInput.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    pageFormStore.processImageFile(file)
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  pageFormStore.isDragOver = true
}

const handleDragLeave = (event) => {
  event.preventDefault()
  pageFormStore.isDragOver = false
}

const handleDrop = (event) => {
  event.preventDefault()
  pageFormStore.isDragOver = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    pageFormStore.processImageFile(files[0])
  }
}

// Handle form submission
const handleSubmit = async () => {
  try {
    pageFormStore.setLoading(true)
    pageFormStore.clearErrors()
    
    // Validate required fields
    if (!pageFormStore.formData.title) {
      pageFormStore.setError('title', 'Title is required')
    }
    if (!pageFormStore.formData.slug) {
      pageFormStore.setError('slug', 'Slug is required')
    }
    if (!pageFormStore.formData.headline) {
      pageFormStore.setError('headline', 'Headline is required')
    }
    if (!pageFormStore.formData.body) {
      pageFormStore.setError('body', 'Page body is required')
    }
    
    if (Object.keys(pageFormStore.errors).length > 0) {
      return
    }
    
    let response
    
    if (pageFormStore.isEditMode) {
      // Update existing page
      response = await pagesService.updatePage(pageFormStore.pageId, pageFormStore.formData)
      
      if (response.success) {
        toast.success('Page updated successfully!')
        emit('page-updated', response.data)
        closeModal()
        resetForm()
      } else {
        toast.error(response.message || 'Failed to update page')
        pageFormStore.setError('general', response.message || 'Failed to update page')
      }
    } else {
      // Create new page
      response = await pagesService.createPage(pageFormStore.formData)
      
      if (response.success) {
        toast.success('Page created successfully!')
        emit('page-created', response.data)
        closeModal()
        resetForm()
      } else {
        toast.error(response.message || 'Failed to create page')
        pageFormStore.setError('general', response.message || 'Failed to create page')
      }
    }
  } catch (error) {
    console.error('Error saving page:', error)
    toast.error('An error occurred while saving the page')
    pageFormStore.setError('general', 'An error occurred while saving the page')
  } finally {
    pageFormStore.setLoading(false)
  }
}

// Manual slug generation method as backup
const generateSlugFromTitle = () => {
  const title = pageFormStore.formData.title
  if (title) {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    console.log('Manual slug generation:', { title, generatedSlug })
    pageFormStore.updateFormField('slug', generatedSlug)
  }
}

// Component lifecycle
onMounted(() => {
  // Ensure capture_mode defaults to 'inline' when component mounts
  if (!pageFormStore.isEditMode) {
    pageFormStore.updateFormField('capture_mode', 'inline')
  }
})
</script>

<style scoped>
/* Ensure modal content is scrollable */
.modal-content {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

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

/* Add subtle background pattern for better visibility */
.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.03) 0%, transparent 50%);
  pointer-events: none;
  border-radius: 0.5rem;
  z-index: -1;
}

/* Step transitions */
.step-content {
  transition: all 0.3s ease-in-out;
}

.step-content-enter-active,
.step-content-leave-active {
  transition: all 0.3s ease-in-out;
}

.step-content-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.step-content-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Custom scrollbar styling */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Dark mode scrollbar */
.dark .modal-content::-webkit-scrollbar-track {
  background: #374151;
}

.dark .modal-content::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .modal-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Image upload styling */
.drag-over {
  border-color: #3b82f6 !important;
  background-color: #eff6ff !important;
}

.dark .drag-over {
  border-color: #60a5fa !important;
  background-color: #1e3a8a !important;
}

.image-preview-container {
  transition: all 0.3s ease;
}

.image-preview-container img {
  transition: transform 0.2s ease;
}

.image-preview-container img:hover {
  transform: scale(1.02);
}

.upload-progress {
  transition: width 0.3s ease;
}

/* CKEditor 5 Styling */
.ckeditor-container {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  min-height: 400px;
  position: relative;
}

.ckeditor-container :deep(.ck-editor__editable) {
  min-height: 350px;
  max-height: 500px;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
}

.ckeditor-container :deep(.ck-editor__editable_inline) {
  border: none;
}

.ckeditor-container :deep(.ck-toolbar) {
  border: none;
  border-bottom: 1px solid #d1d5db;
  border-radius: 0.375rem 0.375rem 0 0;
  background: #f9fafb;
}

/* Dark mode support */
.dark .ckeditor-container {
  background: #374151;
  border-color: #6b7280;
}

.dark .ckeditor-container :deep(.ck-toolbar) {
  background: #4b5563;
  border-bottom-color: #6b7280;
}

.dark .ckeditor-container :deep(.ck-editor__editable) {
  background-color: #1f2937;
  color: #f9fafb;
}

/* CKEditor loading state */
.ckeditor-loading {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: #f9fafb;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dark .ckeditor-loading {
  background: #374151;
  border-color: #6b7280;
}

/* Ensure modal is properly positioned and scrollable */
@media (max-height: 768px) {
  .modal-content {
    max-height: 85vh;
  }
}

@media (max-height: 600px) {
  .modal-content {
    max-height: 80vh;
  }
}
</style> 