
<template>
  <div class="container">
    <h1>Perguntas</h1>
    <form @submit.prevent="submitForm" class="form">
      <label for="titulo">Título:</label>
      <input type="text" id="titulo" v-model="titulo" required class="input">
      <label for="pergunta">Pergunta:</label>
      <input type="text" id="pergunta" v-model="pergunta" required class="input">
      <button type="submit" class="button">Cadastrar</button>
    </form>
    <table class="table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Pergunta</th>
          <th>Data/Hora</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in perguntas" :key="item.id">
          <td>{{ item.titulo }}</td>
          <td>{{ item.pergunta }}</td>
          <td>{{ new Date(item.dataHora).toLocaleString() }}</td>
          <td>
            <button @click="deletePergunta(item.id)" class="button">Excluir</button>
            <button @click="viewRespostas(item.id)" class="button">Ver Respostas</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const perguntas = ref([]);
    const titulo = ref('');
    const pergunta = ref('');
    const router = useRouter();

    const submitForm = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.post('/api/perguntas/', { titulo: titulo.value, pergunta: pergunta.value }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      titulo.value = '';
      pergunta.value = '';
      await loadPerguntas();
    };

    const loadPerguntas = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const response = await axios.get('/api/perguntas/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      perguntas.value = response.data;
    };

    const deletePergunta = async (id: number) => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.delete(`/api/perguntas/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await loadPerguntas();
    };

    const viewRespostas = (id: number) => {
      router.push({ name: 'respostas_manager', params: { id } });
    };

    onMounted(loadPerguntas);

    return { perguntas, titulo, pergunta, submitForm, deletePergunta, viewRespostas };
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

.form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

.input {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.button {
  padding: 10px;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.table {
  width: 100%;
  max-width: 600px;
  border-collapse: collapse;
}

.table th, .table td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}
</style>
