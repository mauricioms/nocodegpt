

<template>
  <div>
    <h1>Respostas</h1>
    <div v-for="resposta in respostas" :key="resposta.id">
      <p>{{ resposta.question }}: {{ resposta.answer }}</p>
      <button @click="deleteResposta(resposta.id)">Excluir</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const respostas = ref([]);

    const fetchRespostas = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const response = await axios.get('/api/respostas/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      respostas.value = response.data;
    };

    const deleteResposta = async (id: number) => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.delete(`/api/respostas/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchRespostas();
    };

    onMounted(fetchRespostas);

    return { respostas, deleteResposta };
  }
};
</script>

<style scoped>
/* Add your custom styles here */
</style>

