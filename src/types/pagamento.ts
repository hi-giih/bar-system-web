export type FormaPagamento = 'pix' | 'cartao' | 'dinheiro'

export interface Pagamento {
  id: number
  comanda: number
  value: number
  paid: boolean
  forma_pagamento: FormaPagamento
  bank_payment_id: string | null
  qr_code: string | null
  expiration_date: string | null
}
