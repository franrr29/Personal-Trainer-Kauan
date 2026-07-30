import { z } from 'zod';


//schema para os exercicios
export const exerciseSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  video_url: z.string().url({ message: "URL inválida" }).optional(),
  category: z.string().min(1, { message: "Categoria é obrigatória" }),
  description: z.string().optional(),
  notes: z.string().optional(),
});

export const exerciseUpdateSchema = exerciseSchema.partial();