<template>
  <div class="container">
    <h1 class="title">Respostas</h1>
    <form @submit.prevent="submitForm">
      <label for="resposta">Resposta:</label>
      <input type="text" id="resposta" v-model="resposta" required>
      <button type="submit">Enviar</button>
    </form>
    <table class="table">
      <thead>
        <tr>
          <th class="title">Respostas</th>
          <th class="title">Data de Criação</th>
          <th class="title">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(resposta, index) in respostas" :key="index">
          <td>{{ resposta.resposta }}</td>
          <td>{{ resposta.data_hora }}</td>
          <td>
            <button @click="deleteResposta(resposta.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const resposta = ref('');
    const respostas = ref([]);
    const route = useRoute();
    const pergunta_id = route.params.id;

    const submitForm = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;

      const response = await axios.post('/api/respostas/', { pergunta_id, resposta: resposta.value }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      respostas.value.push({ id: response.data.id, resposta: resposta.value });
      resposta.value = '';
    };

    const deleteResposta = async (id: number) => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.delete(`/api/respostas/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      respostas.value = respostas.value.filter((resposta: any) => resposta.id !== id);
    };

    onMounted(async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const response = await axios.get(`/api/respostas/${pergunta_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      respostas.value = response.data;
    });

    return { resposta, respostas, submitForm, deleteResposta };
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.title {
  color: blue;
  font-weight: bold;
}

.table {
  margin-top: 20px;
  width: 100%;
  max-width: 800px;
  border-collapse: separate;
  border-spacing: 0 15px;
}

.table th, .table td {
  padding: 10px;
  text-align: left;
}

.table th {
  background-color: #f0f0f0;
}

.table td {
  background-color: #fff;
}
</style>
