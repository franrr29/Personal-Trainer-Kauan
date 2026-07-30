import { z } from 'zod';

//schema para as rotinas
export const routineSchema = z.object({
  student_id: z.number().int().positive({ message: "ID do aluno é obrigatório" }),
  day: z.enum(['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'], { message: "Dia inválido" }),
  title: z.string().min(1, { message: "Título é obrigatório" }),
  trainer_note: z.string().optional(),
});


export const routineUpdateSchema = routineSchema.partial();