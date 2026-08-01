import api from "../lib/axios";


//get aos alunos do treinador:
export async function getStudents() {
    const response = await api.get('/students');
    return response.data;
}

