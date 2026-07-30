import { z } from 'zod';

//schema para os pagamentos
export const paymentSchema = z.object({
  user_id: z.number().int().positive({ message: "ID do aluno é obrigatório" }),
  plan: z.string().min(1, { message: "Plano é obrigatório" }),
  amount: z.number().positive({ message: "Valor deve ser maior que 0" }),
});