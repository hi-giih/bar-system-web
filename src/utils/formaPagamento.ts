import type { FormaPagamento } from '../types/pagamento'

export const NOMES_FORMA_PAGAMENTO: Record<FormaPagamento, string> = {
  pix: 'Pix',
  cartao: 'Cartão',
  dinheiro: 'Dinheiro',
}
