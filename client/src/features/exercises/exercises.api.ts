import api from "../lib/axios";
import type { Exercise } from "../types/exercises";


//trazer todos os exercicios do treinador para mostrar no dash
export async function getExercises(): Promise<Exercise[]> {
    const response = await api.get('/exercises');
    return response.data;
}


//criar um novo exercicio
export async function createExercise(exerciseInfo: { name: string, category: string, video_url: string, 
    description: string, notes: string }) {
    const response = await api.post('/exercises', exerciseInfo);
    return response.data;
}

//atualizar um exercicio existente
export async function updateExercise(exerciseId: string, exerciseInfo: { name?: string, category?: string, 
    video_url?: string, description?: string, notes?: string }) {
    const response = await api.patch(`/exercises/${exerciseId}`, exerciseInfo);
    return response.data;
}


//apagar um exercicio existente
export async function deleteExercise(exerciseId: string) {
    const response = await api.delete(`/exercises/${exerciseId}`);
    return response.data;
}

//subir video de um exercicio
export async function uploadExerciseVideo(exerciseId: number, file: File) {
    const formData = new FormData();
    formData.append('video', file);
    const response = await api.post(`uploads/exercises/${exerciseId}/video`, formData);
    return response.data;
}