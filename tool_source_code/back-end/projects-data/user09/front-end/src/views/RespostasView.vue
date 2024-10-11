
<template>
  <div class="container">
    <h1>Respostas</h1>
    <form @submit.prevent="submitForm" class="form">
      <label>Resposta:</label>
      <input type="text" v-model="texto_resposta" required />
      <button type="submit">Enviar</button>
    </form>
    <div v-for="resposta in respostas" :key="resposta.id" class="resposta-card">
      <p>{{ resposta.texto_resposta }}</p>
      <p>{{ resposta.autor }}</p>
      <p>{{ resposta.data_hora }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const texto_resposta = ref('');
    const respostas = ref([]);

    const fetchRespostas = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const response = await axios.get('/api/respostas/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      respostas.value = response.data;
    };

    const submitForm = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.post('/api/respostas/', { texto_resposta: texto_resposta.value }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      texto_resposta.value = '';
      await fetchRespostas();
    };

    onMounted(fetchRespostas);

    return { texto_resposta, respostas, submitForm };
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
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.form {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
}

.form input, .form button {
  margin-bottom: 10px;
}

.resposta-card {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
</style>
