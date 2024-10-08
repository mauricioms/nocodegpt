
<template>
  <div class="container">
    <h1>Perguntas</h1>
    <form @submit.prevent="submitForm" class="form">
      <div class="form-group">
        <label for="title">Título:</label>
        <input type="text" id="title" v-model="title" required>
      </div>
      <div class="form-group">
        <label for="description">Descrição:</label>
        <textarea id="description" v-model="description" required></textarea>
      </div>
      <button type="submit" class="btn">Enviar</button>
    </form>
    <table class="table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Descrição</th>
          <th>Usuário</th>
          <th>Data</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pergunta in perguntas" :key="pergunta.id">
          <td>{{ pergunta.title }}</td>
          <td>{{ pergunta.description }}</td>
          <td>{{ pergunta.username }}</td>
          <td>{{ pergunta.created_at }}</td>
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
import { useRouter } from 'vue-router';

export default {
  setup() {
    const title = ref('');
    const description = ref('');
    const perguntas = ref([]);
    const router = useRouter();

    const fetchPerguntas = async () => {
      const response = await axios.get('/api/perguntas/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token-user')}` }
      });
      perguntas.value = response.data;
    };

    const submitForm = async () => {
      await axios.post('/api/perguntas/', { title: title.value, description: description.value }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token-user')}` }
      });
      title.value = '';
      description.value = '';
      await fetchPerguntas();
    };

    const deletePergunta = async (id: number) => {
      await axios.delete(`/api/perguntas/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token-user')}` }
      });
      await fetchPerguntas();
    };

    const viewRespostas = (id: number) => {
      router.push({ name: 'respostas_manager', params: { id } });
    };

    onMounted(fetchPerguntas);

    return { title, description, perguntas, submitForm, deletePergunta, viewRespostas };
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
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 10px;
}

.table {
  width: 100%;
  max-width: 800px;
}

.btn {
  margin-top: 10px;
}
</style>
