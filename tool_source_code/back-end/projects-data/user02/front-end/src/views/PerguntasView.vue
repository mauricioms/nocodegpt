

<template>
  <div>
    <h1>Perguntas</h1>
    <form @submit.prevent="submitForm" class="form">
      <div class="form-group">
        <label for="title">Título</label>
        <input type="text" id="title" v-model="title" required>
      </div>
      <div class="form-group">
        <label for="question">Pergunta</label>
        <textarea id="question" v-model="question" required></textarea>
      </div>
      <button type="submit" class="btn">Enviar</button>
    </form>
    <table class="table">
      <thead>
        <tr>
          <th class="table-title">Título</th>
          <th class="table-title">Pergunta</th>
          <th class="table-title">Data/Hora</th>
          <th class="table-title">Usuário</th>
          <th class="table-title">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pergunta in perguntas" :key="pergunta.id">
          <td>{{ pergunta.title }}</td>
          <td>{{ pergunta.question }}</td>
          <td>{{ pergunta.created_at }}</td>
          <td>{{ pergunta.username }}</td>
          <td>
            <button @click="deletePergunta(pergunta.id)" class="btn">Excluir</button>
            <button @click="viewRespostas(pergunta.id)" class="btn">Ver Respostas</button>
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

    const getPerguntas = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const response = await axios.get('/api/perguntas/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      perguntas.value = response.data;
    };

    const submitForm = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.post('/api/perguntas/', { title: title.value, question: question.value }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      title.value = '';
      question.value = '';
      await getPerguntas();
    };

    const deletePergunta = async (id: number) => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.delete(`/api/perguntas/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await getPerguntas();
    };

    const viewRespostas = (id: number) => {
      router.push(`/respostas/${id}`);
    };

    onMounted(getPerguntas);

    return { title, question, submitForm, perguntas, deletePergunta, viewRespostas };
  }
};
</script>

<style scoped>
.form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.btn {
  margin-top: 1rem;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 1rem;
}

.table-title {
  color: green;
}
</style>

