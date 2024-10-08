<script setup lang="ts">
import { computed } from 'vue'
import * as service from '@/service'

export type CallRemoveFileId = (_f: service.FilePage) => void

export interface Props {
  files: service.FilePage[]
  callRemoveFile?: CallRemoveFileId
}

const isEdit = computed<boolean>((): boolean => {
  return !(props.callRemoveFile == undefined)
})

const props = withDefaults(defineProps<Props>(), {
  files: () => [],
  callRemoveFile: function (_f: service.FilePage): void {
    console.log(_f)
  }
})

function removeFilte(_f: service.FilePage): void {
  props.callRemoveFile(_f)
}
</script>
<template>
  <section class="py-1">
    <div class="w-full px-4 mx-auto">
      <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div class="rounded-t mb-0 px-4 py-3 border-0 bg-gray-800 text-white">
          <div class="flex flex-wrap items-center">
            <div class="relative w-full max-w-full flex-grow flex-1">
              <h3 class="font-semibold text-base text-blueGray-700">Files</h3>
            </div>
            <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right"></div>
          </div>
        </div>

        <div class="block w-full overflow-x-auto">
          <table class="items-center bg-transparent w-full border-collapse">
            <thead>
              <tr>
                <th
                  class="w-9/12 px-6 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Path
                </th>
                <th
                  class="w-2/12 px-6 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Module
                </th>
                <th
                  v-if="isEdit"
                  class="w-1/12 px-6 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  &nbsp;
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="f in props.files" :key="f.path">
                <th
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700">
                  {{ f.path }}
                </th>
                <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {{ f.moduleFile == 'F' ? 'FRONT-END' : f.moduleFile == 'B' ? 'BACK-END' : 'DATABASE' }}
                </td>
                <td v-if="isEdit">
                  <button
                    @click="removeFilte(f)"
                    class="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button">
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped></style>
