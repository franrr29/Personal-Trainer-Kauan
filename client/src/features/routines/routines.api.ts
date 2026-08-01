import api from "../lib/axios";


//traz as rotinas de um estudante especfico:
export async function getRoutinesByStudentId(studentId: number) {
    const response = await api.get(`routines/student/${studentId}`);
    return response.data;
}

//cria uma nova rotina:
export async function createRoutine(routineData: { student_id: number; day: string; title: string; trainer_note: string }) {
    const response = await api.post("routines", routineData);
    return response.data;
}

//adiciona um exerccio a uma rotina ao aluno do treinador:
export async function addExerciseToRoutine(data: { routineId: number; exerciseId: number; sets: number; reps: number; rest_seconds: number; notes?: string; exercise_order: number }) {
    const response = await api.post("routine-exercises/add", data);
    return response.data;
}


//atualiza um exercio em uma rotina:
export async function getExercisesByRoutineId(routineId: number) {
    const response = await api.get(`routine-exercises/${routineId}`);
    return response.data;
}


//apaga um exercicio de uma rotina:
export async function deleteExerciseFromRoutine(routineId: number, exerciseId: number) {
    const response = await api.delete(`routine-exercises/${routineId}/${exerciseId}`);
    return response.data;
}