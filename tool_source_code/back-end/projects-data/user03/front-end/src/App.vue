<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref, watch, computed } from 'vue'
const currentPath = ref(window.location.pathname)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.pathname
})

const route = useRoute()

watch(
  () => route.params,
  async (): Promise<void> => {
    currentPath.value = window.location.pathname + window.location.hash
  }
)

const isLoginView = computed<boolean>((): boolean => {
  const path: string = currentPath.value.split('/')[1] as string
  if (path == 'login') {
    return false
  }
  return true
})
</script>

<template>
  <header v-if="isLoginView">
    <nav class="menu">
      <div class="item-menu system-menu">
        <RouterLink to="/home">Home</RouterLink>
        <RouterLink to="/perguntas">Perguntas</RouterLink>
        <RouterLink to="/respostas">Respostas</RouterLink>
        <!--##router-link##-->
      </div>
      <div class="item-menu logout-menu">
        <RouterLink to="/logout">Logout</RouterLink>
      </div>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.menu {
  justify-content: space-between;
}

.system-menu {
  width: 95%;
}

.system-menu a {
  margin-right: 5px;
  font-size: 1.5em;
}

.logout-menu {
  width: 5%;
  text-align: right;
}

.logout-menu a {
  margin-right: 5px;
  font-size: 1.5em;
}

.item-menu {
  display: inline-block;
}
</style>
