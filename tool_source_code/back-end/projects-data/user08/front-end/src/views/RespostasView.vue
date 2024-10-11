
<template>
  <div class="container">
    <form @submit.prevent="submitForm" class="form">
      <label for="resposta" class="form-group">Resposta:</label>
      <input type="text" id="resposta" v-model="resposta" required>
      <button type="submit" class="btn">Submit</button>
    </form>

    <table class="table">
      <thead>
        <tr>
          <th>Resposta</th>
          <th>Usuário</th>
          <th>Data/Hora</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resposta in respostas" :key="resposta.id">
          <td>{{ resposta.resposta }}</td>
          <td>{{ resposta.username }}</td>
          <td>{{ resposta.data_hora }}</td>
          <td>
            <button @click="deleteResposta(resposta.id)">Excluir</button>
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
    const resposta = ref('');
    const respostas = ref([]);
    const router = useRouter();
    const perguntaId = router.currentRoute.value.params.id;

    const fetchRespostas = async () => {
      const response = await axios.get(`/api/respostas/${perguntaId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token-user')}` }
      });
      respostas.value = response.data;
    };

    const submitForm = async () => {
      await axios.post('/api/respostas/', { resposta: resposta.value, perguntaId }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token-user')}` }
      });
      resposta.value = '';
      await fetchRespostas();
    };

    const deleteResposta = async (id: number) => {
      await axios.delete(`/api/respostas/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token-user')}` }
      });
      await fetchRespostas();
    };

    onMounted(fetchRespostas);

    return { resposta, respostas, submitForm, deleteResposta };
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
