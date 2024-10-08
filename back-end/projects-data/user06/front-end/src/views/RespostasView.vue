

<template>
    <div>
        <h1>Respostas</h1>
        <form @submit.prevent="submitForm">
            <textarea v-model="resposta" placeholder="Digite sua resposta"></textarea>
            <button type="submit">Enviar</button>
        </form>
        <table class="table">
            <thead>
                <tr>
                    <th>Usuário</th>
                    <th>Resposta</th>
                    <th>Data/Hora</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="resposta in respostas" :key="resposta.id">
                    <td>{{ resposta.username }}</td>
                    <td>{{ resposta.resposta }}</td>
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

export default {
    setup() {
        const resposta = ref('');
        const respostas = ref([]);

        const fetchRespostas = async () => {
            const token: string = localStorage.getItem('auth-token-user') as string;
            const response = await axios.get('/api/respostas/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            respostas.value = response.data;
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

        const submitForm = async () => {
            const token: string = localStorage.getItem('auth-token-user') as string;
            await axios.post('/api/respostas/', { resposta: resposta.value }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            resposta.value = '';
            await fetchRespostas();
        };

        onMounted(fetchRespostas);

        return { resposta, respostas, submitForm, deleteResposta };
    }
};
</script>

<style scoped>
.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.table th, .table td {
    border: 1px solid #ddd;
    padding: 8px;
}

.table th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #4CAF50;
    color: white;
}
</style>

