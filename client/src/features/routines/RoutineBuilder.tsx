import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudents } from '../students/students.api';
import { getRoutinesByStudentId, createRoutine } from '../routines/routines.api';

const DAYS = [
  { value: 'segunda', label: 'Segunda-feira' },
  { value: 'terca', label: 'Terça-feira' },
  { value: 'quarta', label: 'Quarta-feira' },
  { value: 'quinta', label: 'Quinta-feira' },
  { value: 'sexta', label: 'Sexta-feira' },
  { value: 'sabado', label: 'Sabado' },
  { value: 'domingo', label: 'Domingo' },
] as const;


//componente para criar rotinas para os alunos do treinador:
export default function RoutineBuilder() {

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const queryClient = useQueryClient();

  // trazer alunos do trainer
  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  // trazer rotinas do aluno selecionado
  const { data: routines } = useQuery({
    queryKey: ['routines', selectedStudentId],
    queryFn: () => getRoutinesByStudentId(selectedStudentId!),
    enabled: !!selectedStudentId,
  });

  // criar rotina nova
  const mutationCreateRoutine = useMutation({
    mutationFn: createRoutine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines', selectedStudentId] });
    },
  });

  // buscar si ya existe rotina para ese alumno + dia
  const currentRoutine = routines?.find((r: any) => r.day === selectedDay);

  return (
    <div>
      <h1>Construtor de Rotinas</h1>

      {/* selecionar aluno */}
      <div>
        <label htmlFor="student">Aluno:</label>
        <select
          id="student"
          value={selectedStudentId ?? ''}
          onChange={(e) => setSelectedStudentId(Number(e.target.value))}
        >
          <option value="" disabled>Selecione um aluno</option>
          {students?.map((student: any) => (
            <option key={student.id} value={student.id}>{student.name}</option>
          ))}
        </select>
      </div>

      {/* selecionar dia */}
      <div>
        <label htmlFor="day">Dia:</label>
        <select
          id="day"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          <option value="" disabled>Selecione um dia</option>
          {DAYS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* mostrar rotina o boton para criar */}
      {selectedStudentId && selectedDay && (
        <div>
          {currentRoutine ? (
            <p>Rotina: {currentRoutine.title}</p>
          ) : (
            <button onClick={() => mutationCreateRoutine.mutate({
              student_id: selectedStudentId,
              day: selectedDay,
              title: `Treino ${selectedDay}`,
              trainer_note: '',
            })}>
              Criar rotina
            </button>
          )}
        </div>
      )}
    </div>
  );
}