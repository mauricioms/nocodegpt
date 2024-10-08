
<template>
  <div class="container">
    <h1>Perguntas</h1>
    <form @submit.prevent="submitQuestion" class="form">
      <input v-model="title" type="text" placeholder="Digite o título da sua pergunta" required />
      <input v-model="question" type="text" placeholder="Digite sua pergunta" required />
      <button type="submit">Enviar</button>
    </form>
    <table class="table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Pergunta</th>
          <th>Usuário</th>
          <th>Data</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pergunta in perguntas" :key="pergunta.id">
          <td>{{ pergunta.title }}</td>
          <td>{{ pergunta.question }}</td>
          <td>{{ pergunta.username }}</td>
          <td>{{ new Date(pergunta.date).toLocaleString() }}</td>
          <td>
            <button @click="deleteQuestion(pergunta.id)">Excluir</button>
            <button @click="viewAnswers(pergunta.id)">Ver Respostas</button>
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
    const title = ref('');
    const question = ref('');
    const perguntas = ref([]);
    const router = useRouter();

    const submitQuestion = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.post('/api/perguntas/', { title: title.value, question: question.value }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      title.value = '';
      question.value = '';
      loadQuestions();
    };

    const deleteQuestion = async (id: number) => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.delete(`/api/perguntas/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      loadQuestions();
    };

    const viewAnswers = (id: number) => {
      router.push({ name: 'respostas_manager', params: { id } });
    };

    const loadQuestions = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const response = await axios.get('/api/perguntas/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      perguntas.value = response.data;
    };

    onMounted(loadQuestions);

    return { title, question, perguntas, submitQuestion, deleteQuestion, viewAnswers };
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

.form input {
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
}

.table {
  width: 100%;
  max-width: 800px;
}

.table th, .table td {
  padding: 10px;
  text-align: left;
}
</style>
