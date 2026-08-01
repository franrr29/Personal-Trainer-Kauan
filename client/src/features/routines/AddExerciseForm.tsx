import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExercises } from '../exercises/exercises.api';
import { addExerciseToRoutine } from './routines.api';

// form para agregar exercicio a uma rotina
export default function AddExerciseForm({ routineId }: { routineId: number }) {

  const [exerciseId, setExerciseId] = useState<number | null>(null);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [restSeconds, setRestSeconds] = useState(60);
  const [notes, setNotes] = useState('');
  const [exerciseOrder, setExerciseOrder] = useState(1);

  const queryClient = useQueryClient();

  // trazer catalogo de exercicios do trainer
  const { data: exercises } = useQuery({
    queryKey: ['exercises'],
    queryFn: getExercises,
  });

  // agregar exercicio a rotina
  const mutation = useMutation({
    mutationFn: addExerciseToRoutine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises', routineId] });
      // reseto form
      setExerciseId(null);
      setSets(3);
      setReps(10);
      setRestSeconds(60);
      setNotes('');
      setExerciseOrder((prev) => prev + 1);
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (!exerciseId) return;
      mutation.mutate({
        routineId,
        exerciseId,
        sets,
        reps,
        rest_seconds: restSeconds,
        notes,
        exercise_order: exerciseOrder,
      });
    }}>

      {/* selecionar exercicio do catalogo */}
      <div>
        <label htmlFor="exercise">Exercicio:</label>
        <select
          id="exercise"
          value={exerciseId ?? ''}
          onChange={(e) => setExerciseId(Number(e.target.value))}
          required
        >
          <option value="" disabled>Selecione um exercicio</option>
          {exercises?.map((exercise: any) => (
            <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
          ))}
        </select>
      </div>

      {/* series */}
      <div>
        <label htmlFor="sets">Series:</label>
        <input id="sets" type="number" value={sets} min={1}
          onChange={(e) => setSets(Number(e.target.value))} />
      </div>

      {/* repeticoes */}
      <div>
        <label htmlFor="reps">Repeticoes:</label>
        <input id="reps" type="number" value={reps} min={1}
          onChange={(e) => setReps(Number(e.target.value))} />
      </div>

      {/* descanso em segundos */}
      <div>
        <label htmlFor="rest">Descanso (s):</label>
        <input id="rest" type="number" value={restSeconds} min={0}
          onChange={(e) => setRestSeconds(Number(e.target.value))} />
      </div>

      {/* observacoes */}
      <div>
        <label htmlFor="notes">Observacoes:</label>
        <input id="notes" type="text" value={notes}
          onChange={(e) => setNotes(e.target.value)} />
      </div>

      {/* ordem do exercicio */}
      <div>
        <label htmlFor="order">Ordem:</label>
        <input id="order" type="number" value={exerciseOrder} min={1}
          onChange={(e) => setExerciseOrder(Number(e.target.value))} />
      </div>

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Adicionando...' : 'Adicionar Exercicio'}
      </button>
    </form>
  );
}