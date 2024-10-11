<script setup lang="ts">
import { spinnerStore } from '@/stores/spinnerStore'
const spinner = spinnerStore()
</script>
<template>
  <div class="absolute w-full h-full bg-white opacity-70 z-50" v-if="spinner.count > 0">
    <div class="loader-center">
      <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
    </div>
  </div>
</template>

<style scoped>
.loader-center {
  margin-left: 42%;
  margin-top: 10%;
}

.loader {
  border-top-color: #3498db;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
