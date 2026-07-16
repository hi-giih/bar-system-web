import { z } from 'zod'

export const produtoSchema = z.object({
  nome: z.string().min(1, 'Informe o nome').max(80, 'Nome muito longo'),
  preco: z.number({ message: 'Informe um valor válido' }).min(0.01, 'Preço deve ser maior que zero'),
  icone: z.enum(['drink', 'bebida', 'comida']),
})

export type ProdutoFormData = z.infer<typeof produtoSchema>
