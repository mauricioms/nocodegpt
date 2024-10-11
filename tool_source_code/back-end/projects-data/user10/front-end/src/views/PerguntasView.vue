

<template>
  <div class="container">
    <h1 class="title">Perguntas</h1>
    <form @submit.prevent="createPergunta">
      <input type="text" v-model="pergunta" placeholder="Digite sua pergunta" required>
      <button type="submit">Criar Pergunta</button>
    </form>
    <table>
      <thead>
        <tr>
          <th class="blue bold">Pergunta</th>
          <th class="blue bold">Data/Hora do Cadastro</th>
          <th class="blue bold">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pergunta in perguntas" :key="pergunta.id">
          <td>{{ pergunta.pergunta }}</td>
          <td>{{ new Date(pergunta.dataHoraCadastro).toLocaleString() }}</td>
          <td>
            <button @click="deletePergunta(pergunta.id)">Excluir</button>
            <button @click="viewRespostas(pergunta.id)">Ver Respostas</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const perguntas = ref([]);
    const pergunta = ref('');

    const fetchPerguntas = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const response = await axios.get('/api/perguntas/', { headers: { 'Authorization': `Bearer ${token}` } });
      perguntas.value = response.data;
    };

    const createPergunta = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.post('/api/perguntas/create', { pergunta: pergunta.value }, { headers: { 'Authorization': `Bearer ${token}` } });
      fetchPerguntas();
    };

    const deletePergunta = async (id: number) => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.delete(`/api/perguntas/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      fetchPerguntas();
    };

    const viewRespostas = (id: number) => {
      // Implement view responses functionality here
    };

    onMounted(fetchPerguntas);

    return { perguntas, pergunta, createPergunta, deletePergunta, viewRespostas };
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
}

form {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

input {
  margin-right: 10px;
}

table {
  width: 100%;
  text-align: left;
}

.blue {
  color: blue;
}

.bold {
  font-weight: bold;
}
</style>

