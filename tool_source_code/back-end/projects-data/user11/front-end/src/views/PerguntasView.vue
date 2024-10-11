

<template>
  <div>
    <h1>Perguntas</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="titulo">Título da Pergunta:</label>
        <input type="text" id="titulo" v-model="titulo" required>
      </div>
      <div>
        <label for="texto">Texto da Pergunta:</label>
        <textarea id="texto" v-model="texto" required></textarea>
      </div>
      <button type="submit">Enviar</button>
    </form>
    <table>
      <thead>
        <tr>
          <th>Título</th>
          <th>Texto</th>
          <th>Usuário</th>
          <th>Data/Hora</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pergunta in perguntas" :key="pergunta.id">
          <td>{{ pergunta.titulo }}</td>
          <td>{{ pergunta.texto }}</td>
          <td>{{ pergunta.username }}</td>
          <td>{{ pergunta.data_hora }}</td>
          <td>
            <button @click="deletePergunta(pergunta.id)">Excluir</button>
            <button @click="verResposta(pergunta.id)">Ver resposta</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import router from '../router';

export default {
  setup() {
    const titulo = ref('');
    const texto = ref('');
    const perguntas = ref([]);

    const fetchPerguntas = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      const response = await axios.get('/api/perguntas/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      perguntas.value = response.data;
    };

    const submitForm = async () => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      try {
        await axios.post('/api/perguntas/', { titulo: titulo.value, texto: texto.value }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        titulo.value = '';
        texto.value = '';
        await fetchPerguntas();
      } catch (err) {
        console.error(err);
      }
    };

    const deletePergunta = async (id: number) => {
      const token: string = localStorage.getItem('auth-token-user') as string;
      try {
        await axios.delete(`/api/perguntas/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        await fetchPerguntas();
      } catch (err) {
        console.error(err);
      }
    };

    const verResposta = (id: number) => {
      router.push(`/respostas/${id}`);
    };

    onMounted(fetchPerguntas);

    return { titulo, texto, perguntas, submitForm, deletePergunta, verResposta };
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid black;
}

th, td {
  padding: 15px;
  text-align: left;
}
</style>

