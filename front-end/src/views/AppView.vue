<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as service from '@/service'
import { spinnerStore } from '@/stores/spinnerStore'
const spinner = spinnerStore()

import NavBar from '@/views/NavBar.vue'
import PreviewView from '@/views/screen/PreviewView.vue'
import PromptView from '@/views/screen/PromptView.vue'
import AddPage from '@/views/screen/AddPage.vue'
//import MainView from '@/views/screen/MainView.vue'
import SetSystemContext from '@/views/screen/SetSystemContext.vue'

const isSystemContext = ref<boolean>(false)

function validSystemContext(): void {
  spinner.show()
  service
    .GetSystemContext()
    .then((_cs: service.SystemContext | null): void => {
      if (_cs) {
        isSystemContext.value = true
      } else {
        isSystemContext.value = false
      }
      spinner.hide()
    })
    .catch((): void => {})
}

onMounted(() => {
  validSystemContext()
})

const route = useRoute()

const routes: any = {
  0: PromptView,
  1: AddPage,
  2: PreviewView
}

const currentPath = ref(window.location.pathname)
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.pathname
})

watch(
  () => route.params,
  async (): Promise<void> => {
    currentPath.value = window.location.pathname + window.location.hash
    validSystemContext()
  }
)

const componentId = computed<unknown>((): unknown => {
  if (!isSystemContext.value) {
    return SetSystemContext
  }

  let key = 0
  const path: string = (currentPath.value.split('/')[1] as string) || ''

  if (path == 'main') {
    key = 0
  }

  if (path == 'add') {
    key = 1
  }

  if (path == 'view') {
    key = 2
  }

  return routes[key]
})
</script>

<template>
  <div>
    <nav-bar v-if="isSystemContext" />
    <component :is="componentId" />
  </div>
</template>

<style scoped>
@import url('https://use.fontawesome.com/releases/v5.5.0/css/all.css');
@import url('https://fonts.googleapis.com/css?family=Abel:400,700&display=swap');

.mt-19 {
  margin-top: 4.5rem;
}

.font-family-abel {
  font-family: Abel;
}
</style>
