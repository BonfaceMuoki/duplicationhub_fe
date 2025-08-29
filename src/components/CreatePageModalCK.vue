<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Modal backdrop -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="closeModal"
    ></div>

    <!-- Modal content -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl border">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ pageFormStore.isEditMode ? 'Edit Page' : 'Create New Page' }}
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal body -->
        <div class="p-6 max-h-[90vh] overflow-y-auto">
          <!-- Multi-step form -->
          <div class="mb-6">
            <!-- Step indicator -->
            <div class="flex items-center justify-center mb-8">
              <div class="flex items-center space-x-4">
                <div 
                  v-for="(step, index) in steps" 
                  :key="index"
                  class="flex items-center"
                >
                  <!-- Step circle -->
                  <div 
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2',
                      pageFormStore.currentStep > index + 1 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : pageFormStore.currentStep === index + 1
                        ? 'bg-blue-100 border-blue-600 text-blue-600 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-400'
                        : 'bg-gray-100 border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400'
                    ]"
                  >
                    <span v-if="pageFormStore.currentStep > index + 1">✓</span>
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  
                  <!-- Step line -->
                  <div 
                    v-if="index < steps.length - 1"
                    :class="[
                      'w-16 h-0.5 mx-2',
                      pageFormStore.currentStep > index + 1 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    ]"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Step labels -->
            <div class="flex justify-center mb-8">
              <div class="flex space-x-16">
                <div 
                  v-for="(step, index) in steps" 
                  :key="index"
                  :class="[
                    'text-sm font-medium',
                    pageFormStore.currentStep === index + 1 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : pageFormStore.currentStep > index + 1
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  ]"
                >
                  {{ step }}
                </div>
              </div>
            </div>
          </div>

          <!-- Step 1: Basic Information -->
          <div v-if="pageFormStore.currentStep === 1" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="slug" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Slug *
                </label>
                <input
                  id="slug"
                  v-model="pageFormStore.formData.slug"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="page-slug"
                  required
                />
                <div v-if="pageFormStore.errors.slug" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ pageFormStore.errors.slug }}
                </div>
              </div>

              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  v-model="pageFormStore.formData.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Page Title"
                  required
                />
                <div v-if="pageFormStore.errors.title" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ pageFormStore.errors.title }}
                </div>
              </div>

              <div>
                <label for="headline" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Headline *
                </label>
                <input
                  id="headline"
                  v-model="pageFormStore.formData.headline"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Page Headline"
                  required
                />
                <div v-if="pageFormStore.errors.headline" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ pageFormStore.errors.headline }}
                </div>
              </div>

              <div>
                <label for="summary" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Summary *
                </label>
                <textarea
                  id="summary"
                  v-model="pageFormStore.formData.summary"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Brief description of the page"
                  required
                ></textarea>
                <div v-if="pageFormStore.errors.summary" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ pageFormStore.errors.summary }}
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Media & Links -->
          <div v-if="pageFormStore.currentStep === 2" class="space-y-6">
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
                <div v-if="pageFormStore.errors.video_url" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ pageFormStore.errors.video_url }}
                </div>
              </div>

              <div>
                <label for="platform_base_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Platform Base URL *
                </label>
                <input
                  id="platform_base_url"
                  v-model="pageFormStore.formData.platform_base_url"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://platform.example.com"
                  required
                />
                <div v-if="pageFormStore.errors.platform_base_url" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ pageFormStore.errors.platform_base_url }}
                </div>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Page Image
                </label>
                <div
                  @dragover="pageFormStore.setDragOver(true)"
                  @dragleave="pageFormStore.setDragOver(false)"
                  @drop="pageFormStore.handleDrop"
                  :class="[
                    'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                    pageFormStore.isDragOver
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  ]"
                >
                  <div v-if="!pageFormStore.imagePreview" class="space-y-4">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="text-gray-600 dark:text-gray-400">
                      <label for="image-upload" class="cursor-pointer">
                        <span class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                          Click to upload
                        </span>
                        <span class="text-gray-500 dark:text-gray-400"> or drag and drop</span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="pageFormStore.handleFileChange"
                      />
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <div v-else class="space-y-4">
                    <img :src="pageFormStore.imagePreview" alt="Preview" class="mx-auto h-32 w-auto rounded-lg object-cover" />
                    <div class="flex justify-center space-x-2">
                      <button
                        type="button"
                        @click="pageFormStore.removeImage"
                        class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                </div>
                <div v-if="pageFormStore.errors.image_url" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ pageFormStore.errors.image_url }}
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Content & Settings -->
          <div v-if="pageFormStore.currentStep === 3" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="cta_text" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CTA Text *
                </label>
                <input
                  id="cta_text"
                  v-model="pageFormStore.formData.cta_text"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Get Started Now"
                  required
                />
                <div v-if="pageFormStore.errors.cta_text" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ pageFormStore.errors.cta_text }}
                </div>
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
                <div v-if="pageFormStore.errors.cta_subtext" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ pageFormStore.errors.cta_subtext }}
                </div>
              </div>

              <div>
                <label for="capture_mode" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Capture Mode *
                </label>
                <select
                  id="capture_mode"
                  v-model="pageFormStore.formData.capture_mode"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="modal">Modal</option>
                  <option value="inline">Inline</option>
                  <option value="redirect">Redirect</option>
                </select>
                <div v-if="pageFormStore.errors.capture_mode" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ pageFormStore.errors.capture_mode }}
                </div>
              </div>

              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  v-model="pageFormStore.formData.status"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                <div v-if="pageFormStore.errors.status" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ pageFormStore.errors.status }}
                </div>
              </div>
            </div>

            <div>
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
              <div v-if="pageFormStore.errors.consent_text" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ pageFormStore.errors.consent_text }}
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <input
                id="show_consent"
                v-model="pageFormStore.formData.show_consent"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="show_consent" class="text-sm text-gray-700 dark:text-gray-300">
                Show consent checkbox
              </label>
            </div>

            <div class="flex items-center space-x-3">
              <input
                id="is_active"
                v-model="pageFormStore.formData.is_active"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="is_active" class="text-sm text-gray-700 dark:text-gray-300">
                Page is active
              </label>
            </div>

            <div>
              <label for="body" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Page Body *
              </label>
              <!-- CKEditor 5 using Cloud/CDN approach -->
              <div v-if="editor" class="ckeditor-container">
                <ckeditor
                  v-model="pageFormStore.formData.body"
                  :editor="editor"
                  :config="editorConfig"
                  @ready="onEditorReady"
                  @input="onEditorInput"
                />
              </div>
              <div v-else class="p-4 text-center text-gray-500 dark:text-gray-400">
                <i class="fas fa-spinner fa-spin text-lg mb-2 text-blue-500"></i>
                <p>Loading rich text editor...</p>
              </div>
              <div v-if="pageFormStore.errors.body" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ pageFormStore.errors.body }}
              </div>
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex space-x-3">
            <button
              v-if="pageFormStore.currentStep > 1"
              @click="previousStep"
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Previous
            </button>
          </div>

          <div class="flex space-x-3">
            <button
              @click="closeModal"
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>

            <button
              v-if="pageFormStore.currentStep < steps.length"
              @click="nextStep"
              type="button"
              :disabled="!pageFormStore.canProceedToNextStep"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors',
                pageFormStore.canProceedToNextStep
                  ? 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  : 'text-gray-400 bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
              ]"
            >
              Next
            </button>

            <button
              v-else
              @click="handleSubmit"
              type="submit"
              :disabled="pageFormStore.loading"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="pageFormStore.loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ pageFormStore.isEditMode ? 'Updating...' : 'Creating...' }}
              </span>
              <span v-else>
                {{ pageFormStore.isEditMode ? 'Update Page' : 'Create Page' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Ckeditor, useCKEditorCloud } from '@ckeditor/ckeditor5-vue'
import { usePageFormStore } from '../store/pageFormStore'
import pagesService from '../services/pagesService'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'page-created', 'page-updated'])

// Store
const pageFormStore = usePageFormStore()

// CKEditor setup using Cloud/CDN approach
const cloud = useCKEditorCloud({
  version: '46.0.1'
})

const editor = computed(() => {
  if (!cloud.data.value) {
    return null
  }
  return cloud.data.value.CKEditor.ClassicEditor
})

const editorConfig = computed(() => {
  if (!cloud.data.value) {
    return null
  }
  
  const { Essentials, Paragraph, Bold, Italic, Heading, Link, List, BlockQuote, Image, Table, TableToolbar } = cloud.data.value.CKEditor
  
  return {
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
      'insertTable',
      '|',
      'undo', 'redo'
    ],
    plugins: [
      Essentials,
      Paragraph,
      Bold,
      Italic,
      Heading,
      Link,
      List,
      BlockQuote,
      Image,
      Table,
      TableToolbar
    ],
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    }
  }
})

// CKEditor events
const onEditorReady = (editorInstance) => {
  console.log('CKEditor is ready', editorInstance)
}

const onEditorInput = (event, editorInstance) => {
  console.log('CKEditor input event', event, editorInstance)
}

// Form steps
const steps = ['Basic Information', 'Media & Links', 'Content & Settings']

// Methods
const closeModal = () => {
  pageFormStore.resetForm()
  emit('close')
}

const nextStep = () => {
  pageFormStore.nextStep()
}

const previousStep = () => {
  pageFormStore.previousStep()
}

const handleSubmit = async () => {
  try {
    pageFormStore.setLoading(true)
    pageFormStore.clearErrors()

    if (pageFormStore.isEditMode) {
      const response = await pagesService.updatePage(pageFormStore.pageId, pageFormStore.formData)
      emit('page-updated', response.data)
    } else {
      const response = await pagesService.createPage(pageFormStore.formData)
      emit('page-created', response.data)
    }

    closeModal()
  } catch (error) {
    if (error.response?.data?.errors) {
      pageFormStore.setErrors(error.response.data.errors)
    } else {
      pageFormStore.setError('general', 'An error occurred. Please try again.')
    }
  } finally {
    pageFormStore.setLoading(false)
  }
}

// Watch for modal open/close
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    pageFormStore.resetForm()
  }
})
</script>

<style scoped>
.ckeditor-container {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}

.ckeditor-container :deep(.ck-editor__editable) {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}

.ckeditor-container :deep(.ck-editor__editable_inline) {
  border: none;
}

.ckeditor-container :deep(.ck-toolbar) {
  border: none;
  border-bottom: 1px solid #d1d5db;
  border-radius: 0.375rem 0.375rem 0 0;
}

/* Dark mode support */
.dark .ckeditor-container {
  border-color: #4b5563;
}

.dark .ckeditor-container :deep(.ck-toolbar) {
  border-bottom-color: #4b5563;
  background-color: #374151;
}

.dark .ckeditor-container :deep(.ck-editor__editable) {
  background-color: #1f2937;
  color: #f9fafb;
}
</style> 