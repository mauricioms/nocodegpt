<script setup lang="ts">
import { RouterView } from 'vue-router'
import SpinnerLoader from '@/components/SpinnerLoader.vue'
</script>

<template>
  <spinner-loader />
  <RouterView />
</template>

<style scoped></style>
