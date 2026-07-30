import { z } from 'zod';

//schema para as rotinas e exercicios
export const routineExerciseSchema = z.object({
  routine_id: z.number().int().positive({ message: "ID da rotina é obrigatório" }),
  exercise_id: z.number().int().positive({ message: "ID do exercício é obrigatório" }),
  sets: z.number().int().positive({ message: "Séries devem ser maior que 0" }),
  reps: z.number().int().positive({ message: "Repetições devem ser maior que 0" }),
  rest_seconds: z.number().int().positive({ message: "Descanso é obrigatório" }),
  notes: z.string().optional(),
  exercise_order: z.number().int().positive({ message: "Ordem é obrigatória" }),
});


export const routineExerciseUpdateSchema = routineExerciseSchema.partial();