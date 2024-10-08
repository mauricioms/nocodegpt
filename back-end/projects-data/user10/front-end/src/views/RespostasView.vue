
<template>
  <div class="container">
    <div class="box" v-for="(answer, index) in answers" :key="index">
      <p>{{ answer.answer }}</p>
      <button @click="deleteAnswer(answer.id)">Excluir</button>
    </div>
    <form @submit.prevent="submitAnswer">
      <input type="text" v-model="newAnswer" placeholder="Digite sua resposta" required>
      <button type="submit">Enviar</button>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const answers = ref([]);
    const newAnswer = ref('');

    const fetchAnswers = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const response = await axios.get('/api/respostas/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      answers.value = response.data;
    };

    const submitAnswer = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.post('/api/respostas/', { answer: newAnswer.value }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      newAnswer.value = '';
      await fetchAnswers();
    };

    const deleteAnswer = async (id: number) => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.delete(`/api/respostas/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchAnswers();
    };

    fetchAnswers();

    return { answers, newAnswer, submitAnswer, deleteAnswer };
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.box {
  border: 1px solid #000;
  padding: 20px;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input, button {
  margin-top: 20px;
}
</style>
