import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePageFormStore = defineStore('pageForm', () => {
  // Form state
  const formData = ref({
    slug: '',
    title: '',
    headline: '',
    summary: '',
    video_url: '',
    image_url: '',
    cta_text: 'Get Started Now',
    cta_subtext: 'Join thousands of satisfied customers',
    body: '',
    capture_mode: 'modal',
    show_consent: true,
    consent_text: 'I agree to receive marketing communications',
    platform_base_url: 'https://platform.example.com',
    status: 'draft',
    is_active: true
  })

  // UI state
  const currentStep = ref(0)
  const isEditMode = ref(false)
  const pageId = ref(null)
  const editingPage = ref(null)
  const loading = ref(false)
  const errors = ref({})

  // Image upload state
  const imagePreview = ref(null)
  const selectedImageFile = ref(null)
  const uploadProgress = ref(0)
  const isDragOver = ref(false)

  // Computed properties
  const isFormValid = computed(() => {
    return formData.value.title && 
           formData.value.slug && 
           formData.value.headline && 
           formData.value.body
  })

  const canProceedToNextStep = computed(() => {
    switch (currentStep.value) {
      case 0: // Basic Info
        return formData.value.title && formData.value.slug && formData.value.headline
      case 1: // Media & Settings
        return true // No validation required for this step
      case 2: // Content & CTA
        return formData.value.body
      default:
        return false
    }
  })

  // Actions
  const resetForm = () => {
    formData.value = {
      slug: '',
      title: '',
      headline: '',
      summary: '',
      video_url: '',
      image_url: '',
      cta_text: 'Get Started Now',
      cta_subtext: 'Join thousands of satisfied customers',
      body: '',
      capture_mode: 'modal',
      show_consent: true,
      consent_text: 'I agree to receive marketing communications',
      platform_base_url: 'https://platform.example.com',
      status: 'draft',
      is_active: true
    }
    
    currentStep.value = 0
    errors.value = {}
    imagePreview.value = null
    selectedImageFile.value = null
    uploadProgress.value = 0
    isDragOver.value = false
    isEditMode.value = false
    pageId.value = null
  }

  const populateFormForEdit = (pageData) => {
    formData.value = {
      slug: pageData.slug || '',
      title: pageData.title || '',
      headline: pageData.headline || '',
      summary: pageData.summary || '',
      video_url: pageData.video_url || '',
      image_url: pageData.image_url || '',
      cta_text: pageData.cta_text || 'Get Started Now',
      cta_subtext: pageData.cta_subtext || 'Join thousands of satisfied customers',
      body: pageData.body || '',
      capture_mode: pageData.capture_mode || 'modal',
      show_consent: pageData.show_consent || true,
      consent_text: pageData.consent_text || 'I agree to receive marketing communications',
      platform_base_url: pageData.platform_base_url || 'https://platform.example.com',
      status: pageData.status || 'draft',
      is_active: pageData.is_active || true
    }
    
    // Set image preview if image exists
    if (pageData.image_url) {
      imagePreview.value = pageData.image_url
    }
    
    isEditMode.value = true
    pageId.value = pageData.id
    currentStep.value = 0
    errors.value = {}
  }

  const setEditMode = (edit, id = null) => {
    isEditMode.value = edit
    pageId.value = id
    if (!edit) {
      resetForm()
    }
  }

  const setEditingPage = (page) => {
    editingPage.value = page
    if (page) {
      populateFormForEdit(page)
    }
  }

  const clearEditingPage = () => {
    editingPage.value = null
    resetForm()
  }

  const nextStep = () => {
    if (currentStep.value < 2) {
      currentStep.value++
    }
  }

  const previousStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  const goToStep = (step) => {
    if (step >= 0 && step <= 2) {
      currentStep.value = step
    }
  }

  const updateFormField = (field, value) => {
    formData.value[field] = value
  }

  const updateBodyContent = (content) => {
    formData.value.body = content
  }

  const setImagePreview = (preview) => {
    imagePreview.value = preview
  }

  const setSelectedFile = (file) => {
    selectedImageFile.value = file
  }

  const setUploadProgress = (progress) => {
    uploadProgress.value = progress
  }

  const setDragOver = (over) => {
    isDragOver.value = over
  }

  const setLoading = (loadingState) => {
    loading.value = loadingState
  }

  const setErrors = (newErrors) => {
    errors.value = newErrors
  }

  const clearErrors = () => {
    errors.value = {}
  }

  const setError = (field, message) => {
    errors.value[field] = message
  }

  // Image handling functions
  const processImageFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size must be less than 10MB')
      return
    }
    
    selectedImageFile.value = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
    
    // Simulate upload
    uploadImage(file)
  }

  const removeImage = () => {
    imagePreview.value = null
    selectedImageFile.value = null
    uploadProgress.value = 0
  }

  const uploadImage = async (file) => {
    uploadProgress.value = 0
    
    // Simulate upload progress
    const interval = setInterval(() => {
      uploadProgress.value += Math.random() * 30
      if (uploadProgress.value >= 100) {
        uploadProgress.value = 100
        clearInterval(interval)
        
        // Set the image URL in form data
        formData.value.image_url = imagePreview.value
      }
    }, 200)
  }

  return {
    // State
    formData,
    currentStep,
    isEditMode,
    pageId,
    editingPage,
    loading,
    errors,
    imagePreview,
    selectedImageFile,
    uploadProgress,
    isDragOver,
    
    // Computed
    isFormValid,
    canProceedToNextStep,
    
    // Actions
    resetForm,
    populateFormForEdit,
    setEditMode,
    setEditingPage,
    clearEditingPage,
    nextStep,
    previousStep,
    goToStep,
    updateFormField,
    updateBodyContent,
    setImagePreview,
    setSelectedFile,
    setUploadProgress,
    setDragOver,
    setLoading,
    setErrors,
    clearErrors,
    setError,
    processImageFile,
    removeImage,
    uploadImage
  }
}) 