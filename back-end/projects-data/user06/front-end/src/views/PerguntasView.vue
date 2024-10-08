

<template>
  <div class="container">
    <h1>Perguntas</h1>
    <form @submit.prevent="submitForm" class="form-box">
      <div class="form-group">
        <label for="title">Título:</label>
        <input type="text" id="title" v-model="title" required>
      </div>
      <div class="form-group">
        <label for="question">Pergunta:</label>
        <textarea id="question" v-model="question" required></textarea>
      </div>
      <div class="form-group">
        <button type="submit">Enviar</button>
      </div>
    </form>
    <div class="questions-box">
      <div v-for="pergunta in perguntas" :key="pergunta.id" class="question-box">
        <h2>{{ pergunta.title }}</h2>
        <p>{{ pergunta.question }}</p>
        <p>Feito por: {{ pergunta.username }}</p>
        <p>Data: {{ pergunta.created_at }}</p>
        <button @click="deletePergunta(pergunta.id)">Excluir</button>
        <button @click="viewRespostas(pergunta.id)">Respostas</button>
      </div>
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
        headers: { 'Authorization': `Bearer ${token}` }
      });
      perguntas.value = response.data;
    };

    const deletePergunta = async (id: number) => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.delete(`/api/perguntas/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchPerguntas();
    };

    const viewRespostas = (id: number) => {
      router.push({ name: 'respostas_manager', params: { id } });
    };

    const submitForm = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.post('/api/perguntas/', { title: title.value, question: question.value }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      title.value = '';
      question.value = '';
      await fetchPerguntas();
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

.form-box {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.questions-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.question-box {
  width: 100%;
  max-width: 600px;
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.question-box h2 {
  font-weight: bold;
}
</style>

