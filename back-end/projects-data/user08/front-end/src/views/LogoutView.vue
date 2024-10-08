<script setup lang="ts">
import { onMounted } from 'vue'

import { useRouter } from 'vue-router'
const router = useRouter()

function fnLogout() {
  localStorage.removeItem('auth-token-user')
  router.push('/login')
}

onMounted(() => {
  fnLogout()
})
</script>
<template>
  <div class="p-8 text-center text-3xl font-bold">Logout</div>
</template>
<style scoped></style>
