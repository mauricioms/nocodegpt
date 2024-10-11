<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import AlertComponent from '@/components/AlertComponent.vue'

import * as service from '@/service'

import { spinnerStore } from '@/stores/spinnerStore'
const spinner = spinnerStore()

import { alertStore } from '@/stores/alertStore'
const message = alertStore()

const systemContext = ref<service.SystemContext>({ pageId: 0, name: '', context: '', id: 0 })

function onLoadSystemContext(): void {
  spinner.show()
  service
    .GetSystemContext()
    .then((_cs: service.SystemContext | null): void => {
      if (_cs) {
        systemContext.value = _cs
      }
      spinner.hide()
    })
    .catch((): void => {})
}

onMounted(() => {
  onLoadSystemContext()
})

interface Menu {
  name: string
  link: string
  key: number
}
const menus = computed<Menu[]>((): Menu[] => {
  return [
    { link: '/main', name: 'Prompt', key: 0 },
    { link: '/view', name: 'View', key: 1 },
    { link: '/logout', name: 'Logout', key: 2 }
  ]
})

import { useRouter } from 'vue-router'
const route = useRouter()

function goto(m: Menu): void {
  route.push(m.link)
  currentLink.value = m.link
}

const currentLink = ref<string>('/')

function getLinkId(_link: string): number {
  for (const m of menus.value) {
    if (m.link == _link) {
      return m.key
    }
  }
  return 0
}
</script>
<template>
  <div class="flex justify-between py-3 px-5 bg-white rounded border-b-2 shadow-lg mb-2 h-20">
    <div class="flex w-1/12 text-center m-auto">
      <span class="font-bold text-xl">
        {{ systemContext.name.substring(0, 20) }}
      </span>
    </div>
    <div class="flex w-9/12 text-justify">
      <span class="text-xs my-auto" v-if="message.type == 0">{{ systemContext.context }}</span>
      <alert-component v-else />
    </div>
    <div class="flex w-2/12">
      <ul class="flex m-auto">
        <li class="flex flex-col" v-for="m in menus" :key="m.link">
          <button
            :class="
              getLinkId(currentLink) == getLinkId(m.link)
                ? 'bg-blue-500 hover:bg-blue-300'
                : 'bg-gray-500 hover:bg-gray-300'
            "
            class="flex items-center h-8 px-2 leading-10 rounded cursor-pointer no-underline hover:no-underline transition-colors duration-100 mx-1 text-white"
            @click="goto(m)">
            <span>{{ m.name }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
@import url(https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css);
</style>
