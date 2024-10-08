
<template>
  <div class="container">
    <h1 class="title">Respostas</h1>
    <div class="resposta" v-for="resposta in respostas" :key="resposta.id">
      <p>{{ resposta.resposta }}</p>
      <button class="button" @click="deleteResposta(resposta.id)">Excluir</button>
    </div>
    <form @submit.prevent="submitResposta" class="form">
      <textarea v-model="novaResposta" placeholder="Digite sua resposta" class="textarea"></textarea>
      <button type="submit" class="button">Responder</button>
    </form>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const respostas = ref([]);
    const novaResposta = ref('');
    const router = useRouter();
    const route = useRoute();
    const pergunta_id = route.params.id;

    const fetchRespostas = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const response = await axios.get(`/api/respostas/${pergunta_id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      respostas.value = response.data;
    };

    const submitResposta = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.post('/api/respostas/', { pergunta_id, resposta: novaResposta.value }, { headers: { 'Authorization': `Bearer ${token}` } });
      novaResposta.value = '';
      await fetchRespostas();
    };

    const deleteResposta = async (id: number) => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.delete(`/api/respostas/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      await fetchRespostas();
    };

    onMounted(fetchRespostas);

    return { respostas, novaResposta, submitResposta, deleteResposta };
  }
};
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.title {
    text-align: center;
    margin-bottom: 20px;
}

.form {
    margin-top: 20px;
}

.resposta {
    background-color: #f8f8f8;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
}

.textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #007BFF;
    color: white;
    cursor: pointer;
}

.button:hover {
    background-color: #0056b3;
}
</style>
