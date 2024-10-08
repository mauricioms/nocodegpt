<script setup lang="ts">
import { computed } from 'vue'
import { alertStore } from '@/stores/alertStore'
const alertMessage = alertStore()
const typeMessage = computed(() => alertMessage.type)
const message = computed(() => alertMessage.message)
</script>
<template>
  <!-- Info -->
  <div
    class="bg-blue-50 border border-blue-400 rounded text-blue-800 text-sm p-4 flex justify-between w-full mr-4"
    v-if="typeMessage === 1">
    <div>
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd" />
        </svg>
        <p>
          {{ message }}
        </p>
      </div>
    </div>
    <div @click="typeMessage = 0" class="cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  </div>
  <!-- Error -->
  <div
    class="bg-red-50 border border-red-400 rounded text-red-800 text-sm p-4 flex justify-between w-full mr-4"
    v-if="typeMessage === 2">
    <div>
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd" />
        </svg>
        <p>
          {{ message }}
        </p>
      </div>
    </div>
    <div @click="typeMessage = 0" class="cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  </div>
  <!-- Success -->
  <div
    class="bg-green-50 border border-green-400 rounded text-green-800 text-sm p-4 flex justify-between w-full mr-4"
    v-if="typeMessage === 3">
    <div>
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd" />
        </svg>
        <p>
          {{ message }}
        </p>
      </div>
    </div>
    <div @click="typeMessage = 0" class="cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  </div>
  <!-- Warning -->
  <div
    class="bg-yellow-50 border border-yellow-400 rounded text-yellow-800 text-sm p-4 flex justify-between w-full mr-4"
    v-if="typeMessage === 4">
    <div>
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd" />
        </svg>
        <p>
          {{ message }}
        </p>
      </div>
    </div>
    <div @click="typeMessage = 0" class="cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  </div>
</template>
<style scoped></style>
