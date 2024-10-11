<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/fetch-api'
// eslint-disable-next-line
function logger(obj: unknown): void {}

const router = useRouter()

const username = ref<string>('')
const password = ref<string>('')
const remember = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const isShowMessage = ref<boolean>(false)
const messageLogin = ref<string>('')
const showPassword = ref<boolean>(false)

async function isAuthenticated(): Promise<boolean> {
  const data: any = await http.GET('/auth/valid')
  return data.status?.code === 202
}

onMounted((): void => {
  isAuthenticated()
    .then((_ok: boolean): void => {
      if (_ok) {
        router.push('/')
      } else {
        router.push('/login')
      }
    })
    .catch((): void => {})
})

function login() {
  isLoading.value = true
  http
    .POST('/auth/login', { username: username.value, password: password.value })
    .then((data: any) => {
      const token: string = data.token
      const host: string = data.content.host
      const name: string = data.content.name

      if (remember.value) {
        localStorage.setItem('auth-remember', 'true')
      }

      if (token) {
        localStorage.setItem('user-host', host)
        localStorage.setItem('user-name', name)
        localStorage.setItem('auth-token', token)
        router.push('/')
      } else {
        messageLogin.value = 'Invalid Username and password.'
        isShowMessage.value = true

        setTimeout(() => {
          messageLogin.value = ''
          isShowMessage.value = false
        }, 4000)

        isLoading.value = false
      }
    })
    .catch((err: any) => {
      logger(err)
      messageLogin.value = 'Invalid Username and password.'
      isShowMessage.value = true

      setTimeout(() => {
        messageLogin.value = ''
        isShowMessage.value = false
      }, 4000)

      isLoading.value = false
    })
}
</script>

<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center"></div>
      <div class="flex items-center justify-center text-2xl"><b>NoCodeGPT</b></div>
      <form class="mt-4" @submit.prevent="login">
        <label class="block">
          <span class="text-sm text-gray-700">Username</span>
          <input
            v-model="username"
            :disabled="isLoading"
            type="text"
            name="username"
            autocomplete="username"
            class="text-center disabled:bg-gray-200 block w-full mt-1 border-gray-200 rounded-md focus:border-blue-600 focus:ring focus:ring-opacity-40 focus:ring-blue-500" />
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Password</span>
          <div class="w-full inline-flex border">
            <input
              v-model="password"
              :disabled="isLoading"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              autocomplete="current-password"
              class="text-center disabled:bg-gray-200 focus:border-blue-600 focus:ring focus:ring-opacity-40 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded-md text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150" />

            <div class="px-2 py-2 bg-gray-100 bg-opacity-50 cursor-pointer" @click="showPassword = !showPassword">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="w-6 text-gray-400 mx-auto"
                v-if="!showPassword">
                <path
                  d="M23.271,9.419C21.72,6.893,18.192,2.655,12,2.655S2.28,6.893.729,9.419a4.908,4.908,0,0,0,0,5.162C2.28,17.107,5.808,21.345,12,21.345s9.72-4.238,11.271-6.764A4.908,4.908,0,0,0,23.271,9.419Zm-1.705,4.115C20.234,15.7,17.219,19.345,12,19.345S3.766,15.7,2.434,13.534a2.918,2.918,0,0,1,0-3.068C3.766,8.3,6.781,4.655,12,4.655s8.234,3.641,9.566,5.811A2.918,2.918,0,0,1,21.566,13.534Z" />
                <path d="M12,7a5,5,0,1,0,5,5A5.006,5.006,0,0,0,12,7Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 text-gray-400 mx-auto" v-else>
                <g data-name="01 align center">
                  <path
                    d="M23.821,11.181v0a15.736,15.736,0,0,0-4.145-5.44l3.032-3.032L21.293,1.293,18,4.583A11.783,11.783,0,0,0,12,3C4.5,3,1.057,9.261.179,11.181a1.969,1.969,0,0,0,0,1.64,15.736,15.736,0,0,0,4.145,5.44L1.293,21.293l1.414,1.414L6,19.417A11.783,11.783,0,0,0,12,21c7.5,0,10.943-6.261,11.821-8.181A1.968,1.968,0,0,0,23.821,11.181ZM2,12.011C2.75,10.366,5.693,5,12,5a9.847,9.847,0,0,1,4.518,1.068L14.753,7.833a4.992,4.992,0,0,0-6.92,6.92L5.754,16.832A13.647,13.647,0,0,1,2,12.011ZM15,12a3,3,0,0,1-3,3,2.951,2.951,0,0,1-1.285-.3L14.7,10.715A2.951,2.951,0,0,1,15,12ZM9,12a3,3,0,0,1,3-3,2.951,2.951,0,0,1,1.285.3L9.3,13.285A2.951,2.951,0,0,1,9,12Zm3,7a9.847,9.847,0,0,1-4.518-1.068l1.765-1.765a4.992,4.992,0,0,0,6.92-6.92l2.078-2.078A13.584,13.584,0,0,1,22,12C21.236,13.657,18.292,19,12,19Z" />
                </g>
              </svg>
            </div>
          </div>
        </label>

        <div class="mt-6 text-center">
          <button
            class="disabled:opacity-50 transition inline-flex items-center justify-center space-x-1.5 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10 shrink-0 saturate-[110%] border-blue-700/75 focus:ring-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 px-3 py-1.5 text-sm font-medium rounded-md"
            :class="{ 'cursor-not-allowed': isLoading }"
            :disabled="isLoading">
            <div aria-label="Loading..." role="status" v-if="isLoading">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                xmlns="http://www.w3.org/2000/svg"
                class="animate-spin w-6 h-6 stroke-white">
                <path
                  d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"></path>
              </svg>
            </div>
            <span v-if="isLoading">Loading...</span>
            <span v-else>Log in</span>
          </button>
        </div>
        <div class="w-full text-center mt-3 py-2 bg-red-400 animate-bounce rounded-lg" v-show="isShowMessage">
          {{ messageLogin }}
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
