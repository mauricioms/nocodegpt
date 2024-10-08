

<template>
  <div class="container">
    <h1>Respostas</h1>
    <div class="box" v-for="resposta in respostas" :key="resposta.id">
      <p>{{ resposta.resposta }}</p>
      <button @click="deleteResposta(resposta.id)">Excluir</button>
    </div>
    <form @submit.prevent="submitResposta" class="form">
      <input v-model="novaResposta" type="text" placeholder="Digite sua resposta" required>
      <button type="submit">Enviar</button>
    </form>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const respostas = ref([]);
    const novaResposta = ref('');
    const route = useRoute();

    const fetchRespostas = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const response = await axios.get(`/api/respostas/${route.params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      respostas.value = response.data;
    };

    const submitResposta = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.post('/api/respostas/', {
        resposta: novaResposta.value,
        pergunta_id: route.params.id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      novaResposta.value = '';
      await fetchRespostas();
    };

    const deleteResposta = async (id: number) => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      await axios.delete(`/api/respostas/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchRespostas();
    };

    onMounted(fetchRespostas);

    return {
      respostas,
      novaResposta,
      submitResposta,
      deleteResposta
    };
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

.box {
  width: 80%;
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
}

.form {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.form button {
  padding: 10px 20px;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.form button:hover {
  background-color: #0056b3;
}
</style>

