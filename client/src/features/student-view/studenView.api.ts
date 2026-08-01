import api from "../../../api";


//trazer todas as rotinas de um aluno
export async function getMyRoutines() {
    const response = await api.get('routines/my-routines');
    return response.data;
}

//trazer um os exercicio de uma rotina
export async function getExercisesByRoutineId(routineId: number) {
    const response = await api.get(`routine-exercises/${routineId}`);
    return response.data;
}