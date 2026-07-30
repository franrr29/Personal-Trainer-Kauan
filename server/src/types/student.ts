import { z } from 'zod';

//schema para os alunos
export const studentSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(1, { message: "Telefone é obrigatório" }).optional(),
  plan: z.string().optional(),
});


export const studentUpdateSchema = studentSchema.partial();