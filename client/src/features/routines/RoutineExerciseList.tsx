import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExercisesByRoutineId, deleteExerciseFromRoutine } from './routines.api';


//componente para listar os exercicios de uma rotina e apagar da rotina:
export default function RoutineExerciseList({ routineId }: { routineId: number }) {

    const { data: exercises, isLoading, error } = useQuery({
        queryKey: ['exercises', routineId],
        queryFn: () => getExercisesByRoutineId(routineId),
    });

    const queryClient = useQueryClient();

    const mutationDeleteExercise = useMutation({
        mutationFn: (exerciseId: number) => deleteExerciseFromRoutine(routineId, exerciseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exercises', routineId] });
        },
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading exercises.</p>;
    }

    return (
        <ul>
            {exercises.map((exercise: any) => (
                <li key={exercise.id}>
                 <p>{exercise.exercise_name} — {exercise.sets}x{exercise.reps} | Descanso: {exercise.rest_seconds}s</p>
                 <button onClick={() => mutationDeleteExercise.mutate(exercise.id)}>Remover</button>
                </li>
            ))}
        </ul>
    );
}