<!-- src/components/Modal.vue -->
<template>
    <div  class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div class="bg-white rounded-lg w-full max-w-lg mx-4 p-4 shadow-lg relative">
        <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-red-600">
          &times;
        </button>
        <div class="border-b pb-2 mb-4">
          <slot name="header"></slot>
        </div>
        <div>
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // no logic needed, emits "close" on button click
  </script>
  