<script setup lang="ts">
import { computed } from 'vue'

const host = computed<string>((): string => {
  return localStorage.getItem('user-host') as string
})
</script>
<template>
  <iframe title="Preview App" :src="host"></iframe>
</template>
<style scoped>
iframe {
  width: calc(100%); /* takes precedence over the width set with the HTML width attribute */
  height: 950px;
}
</style>
