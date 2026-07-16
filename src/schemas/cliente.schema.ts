import { z } from 'zod'

export const clienteSchema = z.object({
  nome: z.string().min(1, 'Informe o nome').max(80, 'Nome muito longo'),
  telefone: z
    .string()
    .regex(/^\d{10,11}$/, 'Telefone deve ter DDD + número (10 ou 11 dígitos, só números)')
    .or(z.literal(''))
    .optional(),
})

export type ClienteFormData = z.infer<typeof clienteSchema>
