

<template>
  <div class="container">
    <h1>Perguntas</h1>
    <form @submit.prevent="submitForm" class="form">
      <label for="title">Título:</label>
      <input type="text" id="title" v-model="title" required>

      <label for="question">Pergunta:</label>
      <textarea id="question" v-model="question" required></textarea>

      <button type="submit">Enviar</button>
    </form>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Pergunta</th>
            <th>Autor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pergunta in perguntas" :key="pergunta.id">
            <td>{{ pergunta.title }}</td>
            <td>{{ pergunta.question }}</td>
            <td>{{ pergunta.author }}</td>
            <td>
              <button @click="deletePergunta(pergunta.id)" class="delete-button">Excluir</button>
              <button @click="viewRespostas(pergunta.id)" class="view-respostas-button">Respostas</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const title = ref('');
    const question = ref('');
    const perguntas = ref([]);
    const router = useRouter();

    const fetchPerguntas = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const response = await axios.get('/api/perguntas/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      perguntas.value = response.data;
    };

    const submitForm = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.post('/api/perguntas/', { title: title.value, question: question.value }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      title.value = '';
      question.value = '';
      await fetchPerguntas();
    };

    const deletePergunta = async (id: number) => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.delete(`/api/perguntas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchPerguntas();
    };

    const viewRespostas = (id: number) => {
      router.push({ name: 'respostas_manager', params: { id } });
    };

    onMounted(fetchPerguntas);

    return { title, question, perguntas, submitForm, deletePergunta, viewRespostas };
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
  margin-bottom: 20px;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid #ddd;
  padding: 15px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.delete-button {
  color: white;
  background-color: red;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.view-respostas-button {
  color: white;
  background-color: green;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 10px;
}
</style>

