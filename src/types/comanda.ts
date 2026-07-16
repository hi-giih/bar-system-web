import type { FormaPagamento } from './pagamento'

export interface ComandaProdutoItem {
  produto_id: number | null
  nome: string
  preco: number
  quantidade: number
  subtotal: number
}

export interface Comanda {
  id: number
  data: string
  cliente_id: number
  cliente_nome: string | null
  fechada: boolean
  colapsada: boolean
  produtos: ComandaProdutoItem[]
  total: number
  valor_original: number
  forma_pagamento: FormaPagamento | null
}