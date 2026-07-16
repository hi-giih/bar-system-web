import { z } from 'zod'
 
export const novaComandaSchema = z.object({
  clienteId: z.number({ message: 'Selecione um cliente' }).min(1, 'Selecione um cliente'),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
})
 
export type NovaComandaFormData = z.infer<typeof novaComandaSchema>
 
export const novoClienteInlineSchema = z.object({
  nome: z.string().min(1, 'Informe o nome').max(80, 'Nome muito longo'),
  telefone: z
    .string()
    .regex(/^\d{10,11}$/, 'Telefone deve ter DDD + número (10 ou 11 dígitos)')
    .or(z.literal(''))
    .optional(),
})
 
export type NovoClienteInlineFormData = z.infer<typeof novoClienteInlineSchema>
 
export const adicionarProdutoSchema = z.object({
  produtoId: z.number({ message: 'Selecione um produto' }).min(1, 'Selecione um produto'),
  quantidade: z.number({ message: 'Informe a quantidade' }).min(1, 'Quantidade deve ser maior que zero'),
})
 
export type AdicionarProdutoFormData = z.infer<typeof adicionarProdutoSchema>
 
export const pagamentoComandaSchema = z.object({
  valor: z
    .number({ message: 'Informe o valor a ser pago' })
    .positive('Informe um valor maior que zero'),
})
 
export type PagamentoComandaFormData = z.infer<typeof pagamentoComandaSchema>