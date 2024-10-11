
<template>
    <div class="container">
        <h1 class="title">Cadastrar Pergunta</h1>
        <form @submit.prevent="submitForm" class="form">
            <label for="title" class="label">Título:</label>
            <input id="title" v-model="title" required class="input">
            <label for="question" class="label">Pergunta:</label>
            <textarea id="question" v-model="question" required class="textarea"></textarea>
            <button type="submit" class="button">Enviar</button>
        </form>
        <table class="table">
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Pergunta</th>
                    <th>Data/Hora</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="pergunta in perguntas" :key="pergunta.id">
                    <td>{{ pergunta.title }}</td>
                    <td>{{ pergunta.question }}</td>
                    <td>{{ pergunta.created_at }}</td>
                    <td>
                        <button @click="deletePergunta(pergunta.id)" class="button">Excluir</button>
                        <button @click="viewRespostas(pergunta.id)" class="button">Ver Respostas</button>
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

        const fetchPerguntas = async () => {
            const token: string = localStorage.getItem('auth-token-user') as string;
            const response = await axios.get('/api/perguntas/', { headers: { 'Authorization': `Bearer ${token}` } });
            perguntas.value = response.data;
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

        const deletePergunta = async (id: number) => {
            const token: string = localStorage.getItem('auth-token-user') as string;
            await axios.delete(`/api/perguntas/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            await fetchPerguntas();
        };

        const viewRespostas = (id: number) => {
            router.push({ name: 'respostas', params: { id } });
        };

        onMounted(fetchPerguntas);

        return { title, question, perguntas, submitForm, deletePergunta, viewRespostas };
    }
}
</script>


<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.title {
    text-align: center;
    margin-bottom: 20px;
}

.form {
    margin-bottom: 20px;
}

.label {
    display: block;
    margin-bottom: 5px;
}

.input, .textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #007BFF;
    color: white;
    cursor: pointer;
}

.button:hover {
    background-color: #0056b3;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th, .table td {
    padding: 10px;
    border: 1px solid #ccc;
}

.table th {
    background-color: #f8f8f8;
}
</style>
