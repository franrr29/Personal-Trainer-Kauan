import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyRoutines, getExercisesByRoutineId } from "./studenView.api";

const DAYS = [
  { value: 'segunda', label: 'Segunda-feira' },
  { value: 'terca', label: 'Terça-feira' },
  { value: 'quarta', label: 'Quarta-feira' },
  { value: 'quinta', label: 'Quinta-feira' },
  { value: 'sexta', label: 'Sexta-feira' },
  { value: 'sabado', label: 'Sabado' },
  { value: 'domingo', label: 'Domingo' },
] as const;


//mostrar rotina do aluno logado, com os exercicios do dia selecionado
export default function StudentDashboard() {

  const [selectedDay, setSelectedDay] = useState<string>('');

  // trazer rotinas do aluno logado
  const { data: routines } = useQuery({
    queryKey: ['myRoutines'],
    queryFn: getMyRoutines,
  });

  // buscar rotina del dia seleccionado
  const currentRoutine = routines?.find((r: any) => r.day === selectedDay);

  // trazer exercicios da rotina selecionada
  const { data: exercises } = useQuery({
    queryKey: ['routineExercises', currentRoutine?.id],
    queryFn: () => getExercisesByRoutineId(currentRoutine!.id),
    enabled: !!currentRoutine,
  });

  return (
    <div>
      <h1>Minha Rotina</h1>

      {/* botoes dos dias */}
      <div>
        {DAYS.map(({ value, label }) => (
          <button key={value} onClick={() => setSelectedDay(value)}>
            {label}
          </button>
        ))}
      </div>

      {/* exercicios do dia */}
      {selectedDay && !currentRoutine && (
        <p>Sem rotina para este dia.</p>
      )}

      {exercises && exercises.length > 0 && (
        <ul>
          {exercises.map((ex: any) => (
            <li key={ex.id}>
              <p>{ex.exercise_name} — {ex.sets}x{ex.reps} | Descanso: {ex.rest_seconds}s</p>
              {ex.notes && <p>Obs: {ex.notes}</p>}
              {ex.video_url && <video src={ex.video_url} controls width={300} />}

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}