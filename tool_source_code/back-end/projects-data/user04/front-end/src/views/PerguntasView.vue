

<template>
  <div class="container">
    <h1 class="title">Perguntas</h1>
    <form @submit.prevent="addQuestion">
      <input type="text" v-model="newQuestion" placeholder="Digite sua pergunta" required>
      <button type="submit">Adicionar Pergunta</button>
    </form>
    <table class="table">
      <thead>
        <tr>
          <th class="title">Perguntas</th>
          <th class="title">Data de Criação</th>
          <th class="title">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(question, index) in questions" :key="index">
          <td>{{ question.question }}</td>
          <td>{{ question.created_at }}</td>
          <td>
            <button @click="deleteQuestion(question.id)">Excluir</button>
            <button @click="viewAnswers(question.id)">Ver Respostas</button>
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
    const newQuestion = ref('');
    const questions = ref([]);
    const router = useRouter();

    const addQuestion = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const response = await axios.post('/api/perguntas/', { question: newQuestion.value }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      questions.value.push({ id: response.data.id, question: newQuestion.value });
      newQuestion.value = '';
    };

    const deleteQuestion = async (id: number) => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.delete(`/api/perguntas/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      questions.value = questions.value.filter((question: any) => question.id !== id);
    };

    const viewAnswers = (id: number) => {
      router.push({ name: 'respostas_manager', params: { id } });
    };

    onMounted(async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const response = await axios.get('/api/perguntas/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      questions.value = response.data;
    });

    return { newQuestion, questions, addQuestion, deleteQuestion, viewAnswers };
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

