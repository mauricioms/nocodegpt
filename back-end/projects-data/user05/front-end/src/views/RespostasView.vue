
<template>
  <div class="container">
    <h1>Respostas</h1>
    <form @submit.prevent="submitForm" class="form">
      <label for="resposta">Resposta:</label>
      <textarea id="resposta" v-model="resposta" required></textarea>
      <button type="submit">Submit</button>
    </form>
    <div v-for="resposta in respostas" :key="resposta.id" class="resposta">
      <p>{{ resposta.resposta }}</p>
      <button @click="deleteAnswer(resposta.id)">Excluir</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const resposta = ref('');
    const respostas = ref([]);
    const route = useRoute();

    const submitForm = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const pergunta_id = route.params.id;

      try {
        const response = await axios.post('/api/respostas/', { pergunta_id, resposta: resposta.value }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log(response.data);
        loadAnswers();
      } catch (err) {
        console.error(err);
      }
    };

    const deleteAnswer = async (id: number) => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.delete(`/api/respostas/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      loadAnswers();
    };

    const loadAnswers = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const pergunta_id = route.params.id;

      const response = await axios.get(`/api/respostas/${pergunta_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      respostas.value = response.data;
    };

    onMounted(loadAnswers);

    return { resposta, submitForm, deleteAnswer, respostas };
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

.form textarea {
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
}

.resposta {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
