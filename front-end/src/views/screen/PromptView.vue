<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import Split from 'split.js'
import * as service from '@/service'

import { alertStore } from '@/stores/alertStore'
const message = alertStore()

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

function addPage(): void {
  router.push('/add')
}

import { spinnerStore } from '@/stores/spinnerStore'
const spinner = spinnerStore()

//const md = ref<string>('')

function loadPage(_id: number): void {
  currentIdx.value = _id
  spinner.show()
  if (_id > 0) {
    service
      .GetPage(_id)
      .then((_us: service.Page): void => {
        page.value = _us
        spinner.hide()
      })
      .catch((err: unknown): void => {
        console.log(err)
        spinner.hide()
      })
  } else {
    spinner.hide()
  }
}

function loadPageList(): void {
  spinner.show()
  service
    .GetPageList()
    .then((_usList: service.Page[]): void => {
      _pageList.value = _usList
      spinner.hide()
    })
    .catch((): void => {
      spinner.hide()
    })
}

const _pageList = ref<service.Page[]>([])
const pageList = computed<service.Page[]>((): service.Page[] => {
  return _pageList.value
})

const _typesPromptList = ref<service.PromptType[]>([])
const typesPromptList = computed<service.PromptType[]>((): service.PromptType[] => {
  return _typesPromptList.value
})

function fnType(typeId: number): string {
  return _typesPromptList.value.filter((pt: service.PromptType): boolean => {
    return pt.id == typeId
  })[0].name
}

function loadTypesPrompt(): void {
  spinner.show()
  service
    .GetPromptTypeList()
    .then((_ptList: service.PromptType[]): void => {
      _typesPromptList.value = _ptList
      spinner.hide()
    })
    .catch((): void => {
      spinner.hide()
    })
}

onMounted(() => {
  loadTypesPrompt()

  loadPageList()

  const _id: number = (currentPath.value.split('/')[2] as unknown as number) || 0
  loadPage(_id)

  Split(['#split-0', '#split-1'], {
    sizes: [30, 70]
  })
})

const currentPath = ref(window.location.pathname)
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.pathname
})

watch(
  () => route.params.id,
  async (): Promise<void> => {
    currentPath.value = window.location.pathname + window.location.hash
    const _id: number = (currentPath.value.split('/')[2] as unknown as number) || 0
    loadPage(_id)
  }
)

const currentIdx = ref<number>(0)

function selectPage(us: service.Page): void {
  loadPage(us.id)
}

const chat = ref<string>('')
const typePrompt = ref<number>(0)
const page = ref<service.Page>({
  files: [],
  id: 0,
  requests: [],
  name: '',
  description: '',
  requestId: 0
} as service.Page)
function addPrompt(): void {
  if (typePrompt.value > 0) {
    spinner.show()
    service
      .PutPrompt(page.value.id, typePrompt.value, chat.value)
      .then((data: unknown): void => {
        const ok: boolean = (data as { ok: boolean }).ok
        if (ok) {
          loadPage(page.value.id)
          message.success('Send prompt.')
          chat.value = ''
          setTypePrompt({ id: 0, name: '' })
        }
        spinner.hide()
      })
      .catch((): void => {
        spinner.hide()
      })
  } else {
    inValidate('type-empty')
  }
}

function setTask(_requestId: number): void {
  spinner.show()
  service
    .SetTask(page.value.id, _requestId)
    .then((data: unknown): void => {
      const ok: boolean = (data as { ok: boolean }).ok
      if (ok) {
        loadPage(page.value.id)
        message.success('Set Task.')
      }
      spinner.hide()
    })
    .catch((): void => {
      spinner.hide()
    })
}

const open = ref<boolean>(false)

function toggle(): void {
  open.value = !open.value
}

const typePromptObj = ref<service.PromptType>({ id: 0, name: '' })

function setTypePrompt(pt: service.PromptType): void {
  open.value = false
  typePromptObj.value = pt
  typePrompt.value = pt.id
}

type IValid = {
  [key: string]: boolean
}

const valid = ref<IValid>({})

function inValidate(_key: string): boolean {
  valid.value[_key] = true
  setTimeout(() => {
    valid.value[_key] = false
  }, 4000)
  return false
}

const validSend = computed<boolean>((): boolean => {
  return chat.value != '' && typePrompt.value > 0
})
</script>

<template>
  <div class="split h-full z-0">
    <div id="split-0" class="h-full">
      <div class="w-full text-center mb-2">
        <div class="w-full">
          <button
            type="button"
            class="bg-blue-500 hover:bg-blue-300 h-10 leading-10 px-4 rounded cursor-pointer no-underline hover:no-underline transition-colors duration-100 text-white"
            @click="addPage()">
            <span>Add Page</span>
          </button>
        </div>
      </div>
      <div class="bg-gray-200 flex flex-col items-center pl-4 pr-4 h-100 overflow-y-auto">
        <!-- Card 1 -->
        <a
          class="w-full m-2 rounded-sm grid grid-cols-12 bg-white shadow p-1 gap-2 items-center transition delay-150 duration-300 ease-in-out hover:shadow-lg hover:scale-105 transform"
          :class="currentIdx == us.id ? 'shadow-lg scale-105' : ''"
          @click="selectPage(us)"
          href="#"
          v-for="(us, idx) in pageList"
          :key="us.id">
          <!-- Icon -->
          <div class="col-span-1 text-center text-2xl font-bold">{{ idx + 1 }}</div>

          <!-- Title -->
          <div class="col-span-11">
            <p class="text-blue-600 font-semibold">{{ us.name }}</p>
          </div>

          <!-- Description -->
          <div class="col-start-2 col-span-11">
            <p class="text-sm text-gray-800 font-light">
              {{ us.description }}
            </p>
          </div>
        </a>
      </div>
    </div>

    <div id="split-1" class="h-full">
      <div v-if="page.id > 0">
        <div class="mt-4 mb-2">
          <div class="flex flex-row items-center rounded-xl bg-white w-full px-4">
            <div class="ml-4">
              <div class="relative w-[8rem]">
                <button
                  type="button"
                  @click="toggle"
                  :class="valid['type-empty'] ? 'border-2 border-red-500' : open && 'ring-blue-600'"
                  class="flex w-full items-center justify-between rounded bg-white p-2 ring-1 ring-gray-300">
                  <span>{{ typePromptObj.name }}</span>
                  <i class="fas fa-chevron-down text-xl"></i>
                </button>
                <ul class="z-2 absolute mt-1 w-full rounded bg-gray-50 ring-1 ring-gray-300" v-if="open">
                  <li
                    v-for="tp in typesPromptList"
                    :key="tp.id"
                    class="cursor-pointer select-none p-2 hover:bg-gray-200"
                    @click="setTypePrompt(tp)">
                    {{ tp.name }}
                  </li>
                </ul>
                <div class="h-4">
                  <label class="text-xs text-red-500 mr-1" v-if="valid['type-empty']">Fill in this field</label>
                </div>
              </div>
            </div>
            <div class="flex-grow ml-4">
              <div class="relative w-full">
                <textarea
                  v-model="chat"
                  type="text"
                  class="border rounded-xl px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  rows="2"></textarea>
              </div>
            </div>
            <div class="ml-4">
              <button
                type="button"
                :disabled="!validSend"
                @click="addPrompt()"
                class="disabled:bg-gray-500 flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
                <span>Send</span>
                <span class="ml-2">
                  <svg
                    class="w-4 h-4 transform rotate-45 -mt-px"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>

        <hr />
        <div>
          <div class="bg-gray-400 p-1">
            <h1><b class="ml-1 text-lg uppercase">Prompts:</b></h1>
          </div>
          <div class="overflow-auto h-99">
            <ul>
              <li
                class="flex items-center justify-between p-3 bg-gray-100 border-b-2"
                v-for="(t, i) in page.requests"
                :key="t.id">
                <span class="flex">
                  <span class="flex flex-col border-r-2 mr-2">
                    <span class="font-bold mr-2 text-sm w-full text-center">{{ fnType(t.typeId) }}</span>
                    <span class="mr-2 text-xs w-full text-center">Version {{ i + 1 }}</span>
                  </span>
                  <span>
                    {{ t.content }}
                  </span>
                </span>
                <span class="flex">
                  <button
                    v-if="page.requestId != t.id"
                    @click="setTask(t.id)"
                    type="button"
                    class="bg-blue-500 hover:bg-blue-300 px-2 rounded cursor-pointer no-underline hover:no-underline transition-colors duration-100 text-white">
                    rollback
                  </button>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="w-full text-center p-12 text-xl font-bold">
          <span class="bg-gray-400 p-3 rounded-lg shadow-lg">None user description selected.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.split {
  display: flex;
  flex-direction: row;
}

.gutter {
  background-color: #eee;
  background-repeat: no-repeat;
  background-position: 50%;
}

div.gutter.gutter-horizontal {
}

.h-99 {
  height: 45rem;
}

.h-100 {
  height: 56rem;
}
</style>
