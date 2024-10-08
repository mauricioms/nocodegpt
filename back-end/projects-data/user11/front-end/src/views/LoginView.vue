<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// eslint-disable-next-line
function logger(obj: unknown): void {}

const router = useRouter()

const username = ref<string>('')
const password = ref<string>('')
const isLoading = ref<boolean>(false)

const isShowMessage = ref<boolean>(false)
const messageLogin = ref<string>('')

async function isAuthenticated(): Promise<boolean> {
  try {
    const data: any = await axios.get('/auth/valid', {
      headers: { Authorization: ('Bearer ' + localStorage.getItem('auth-token-user')) as string }
    })
    return true
  } catch (err: unknown) {
    return false
  }
}

onMounted((): void => {
  isAuthenticated()
    .then((_ok: boolean): void => {
      if (_ok) {
        router.push('/home')
      } else {
        router.push('/login')
      }
    })
    .catch((): void => {})
})

function login() {
  isLoading.value = true
  axios
    .post('/auth/login', { username: username.value, password: password.value })
    .then((response: any): any => {
      return response.data
    })
    .then((data: any) => {
      const token: string = data.token

      if (token) {
        localStorage.setItem('auth-token-user', token)
        router.push('/home')
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
  <div class="container">
    <h1 class="app-title">Application Name</h1>
    <div class="login-box">
      <form @submit.prevent="login">
        <div class="input-group">
          <input v-model="username" type="text" placeholder="Username" required />
        </div>
        <div class="input-group">
          <input v-model="password" type="password" placeholder="Password" required />
        </div>
        <div class="input-group">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
    <div class="message-login">
      {{ messageLogin }}
    </div>
  </div>
</template>

<style scoped>
.message-login {
  margin: auto;
  text-align: center;
  font-size: 2em;
  background-color: red;
  border-radius: 5px;
  margin-top: 5px;
  width: 25%;
}

.container {
  margin: auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 20px;
}

.app-title {
  margin-bottom: 20px;
  text-align: center;
  font-size: 2em;
}

.login-box {
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  max-width: 400px;
}

.input-group {
  width: 100%;
}

.input-group input {
  width: 92%;
  margin: auto;
  margin-bottom: 7px;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1.5em;
}

.input-group button {
  width: 100%;
  margin: auto;
  padding: 15px;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 1.5em;
}
</style>
