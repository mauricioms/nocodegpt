


<template>
  <div>
    <h1>Respostas</h1>
    <form @submit.prevent="submitForm" class="form">
      <div class="form-group">
        <label for="answer">Resposta</label>
        <textarea id="answer" v-model="answer" required></textarea>
      </div>
      <button type="submit" class="btn">Responder</button>
    </form>
    <table class="table">
      <thead>
        <tr>
          <th class="table-title">Resposta</th>
          <th class="table-title">Data/Hora</th>
          <th class="table-title">Usuário</th>
          <th class="table-title">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resposta in respostas" :key="resposta.id">
          <td>{{ resposta.answer }}</td>
          <td>{{ resposta.created_at }}</td>
          <td>{{ resposta.username }}</td>
          <td>
            <button @click="deleteResposta(resposta.id)" class="btn">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const answer = ref('');
    const respostas = ref([]);
    const router = useRouter();
    const route = useRoute();

    const getRespostas = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const response = await axios.get(`/api/respostas/${route.params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      respostas.value = response.data;
    };

    const submitForm = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.post('/api/respostas/', { answer: answer.value, questionId: route.params.id }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      answer.value = '';
      await getRespostas();
    };

    const deleteResposta = async (id: number) => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.delete(`/api/respostas/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await getRespostas();
    };

    onMounted(getRespostas);

    return { answer, submitForm, respostas, deleteResposta };
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


