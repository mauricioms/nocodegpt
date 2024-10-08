<script setup lang="ts">
import { ref } from 'vue'
import * as service from '@/service'

import { type Status, type SystemContext } from '@/service'

import { useRouter } from 'vue-router'
const router = useRouter()

import { alertStore } from '@/stores/alertStore'
const message = alertStore()

import { spinnerStore } from '@/stores/spinnerStore'
const spinner = spinnerStore()

const systemContext = ref<SystemContext>({ id: 0, name: '', context: '', pageId: 0 } as SystemContext)

function goto(m: string): void {
  router.push(m)
}

const isSaveDisabled = ref<boolean>(false)
function salvarSystemContext(): void {
  //isSaveDisabled.value = true
  spinner.show()
  service
    .PostSystemContext(systemContext.value)
    .then((data: { id: number }): void => {
      const _id: number = data.id
      if (_id > 0) {
        goto('/main')
      }
      spinner.hide()
    })
    .catch((err: Error | unknown) => {
      if ((err as { name: string }).name === 'SyntaxError') {
        message.error('The System Context information could not be saved.')
      } else {
        const status: Status = (err as service.Response).status
        const fieldInvalids: string[] = status ? JSON.parse(status.message) : err
        showResponseErros(fieldInvalids)
      }
      spinner.hide()
    })
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

function showResponseErros(fieldInvalids: string[]): void {
  fieldInvalids.forEach((f) => {
    inValidate(f)
  })
  message.error('The System Context could not be saved. Solve the problems with the highlighted fields and try again.')
}

//const nameUserStore = reactive<MaskaDetail>({ completed: false, unmasked: '', masked: '' })
</script>
<template>
  <section class="py-1 bg-blueGray-50">
    <div class="w-full lg:w-8/12 px-4 mx-auto mt-6">
      <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div class="rounded-t bg-white mb-0 px-6 py-6">
          <div class="text-center flex justify-between">
            <h6 class="text-blueGray-700 text-xl font-bold">Set System Context</h6>
            <button
              @click="salvarSystemContext()"
              :disabled="isSaveDisabled"
              class="disabled:bg-gray-300 bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button">
              Save
            </button>
          </div>
        </div>
        <div class="flex-auto px-2 py-5 pt-0">
          <form>
            <div class="flex flex-wrap">
              <div class="w-full lg:w-12/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block text-blueGray-600 text-sm font-bold mb-2" htmlfor="grid-password">
                    <span class="uppercase">Name</span>
                  </label>
                  <input
                    v-model="systemContext.name"
                    type="text"
                    :class="
                      valid['name-empty']
                        ? 'border-2 border-red-500'
                        : valid['name-maxlength']
                          ? 'border-2 border-red-500'
                          : ''
                    "
                    class="border-1 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                  <label class="text-xs text-red-500 mr-1" v-if="valid['name-empty']">Fill in this field</label>
                  <label class="text-xs text-red-500 mr-1" v-if="valid['name-maxlength']">
                    Maximum limit is 100 characters
                  </label>
                </div>
              </div>

              <div class="w-full lg:w-12/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-sm font-bold mb-2" htmlfor="grid-password">
                    Context
                  </label>
                  <textarea
                    v-model="systemContext.context"
                    type="text"
                    :class="valid['context-empty'] ? 'border-2 border-red-500' : ''"
                    class="border-1 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    rows="4"></textarea>
                  <label class="text-xs text-red-500 mr-1" v-if="valid['context-empty']">Fill in this field</label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped></style>
