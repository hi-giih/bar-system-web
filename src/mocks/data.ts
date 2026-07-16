import type { Cliente } from '../types/cliente'
import type { Comanda } from '../types/comanda'
import type { Pagamento } from '../types/pagamento'
import type { Produto } from '../types/produto'

export const clientesMock: Cliente[] = [
  { id: 1, nome: 'Bruno Almeida', telefone: '11987654321' },
  { id: 2, nome: 'Ana e Rafa', telefone: null },
  { id: 3, nome: 'Carlos', telefone: '11912345678' },
  { id: 4, nome: 'Juliana', telefone: null },
]

export const produtosMock: Produto[] = [
  { id: 1, nome: 'Chopp Pilsen 300ml', preco: 12, icone: 'drink' },
  { id: 2, nome: 'Heineken Long Neck', preco: 14, icone: 'drink' },
  { id: 3, nome: 'Caipirinha', preco: 18, icone: 'drink' },
  { id: 4, nome: 'Refrigerante', preco: 8, icone: 'bebida' },
  { id: 5, nome: 'Água', preco: 6, icone: 'bebida' },
  { id: 6, nome: 'Porção de Batata', preco: 28, icone: 'comida' },
]

const hoje = new Date().toISOString().slice(0, 10)

export const comandasMock: Comanda[] = [
  {
    id: 1,
    data: hoje,
    cliente_id: 1,
    cliente_nome: 'Bruno Almeida',
    fechada: false,
    colapsada: false,
    produtos: [
      { produto_id: 1, nome: 'Chopp Pilsen 300ml', preco: 12, quantidade: 6, subtotal: 72 },
      { produto_id: 6, nome: 'Porção de Batata', preco: 28, quantidade: 1, subtotal: 28 },
    ],
    total: 100,
    valor_original: 100,
    forma_pagamento: null,
  },
  {
    id: 2,
    data: hoje,
    cliente_id: 2,
    cliente_nome: 'Ana e Rafa',
    fechada: false,
    colapsada: false,
    produtos: [
      { produto_id: 3, nome: 'Caipirinha', preco: 18, quantidade: 2, subtotal: 36 },
      { produto_id: 4, nome: 'Refrigerante', preco: 8, quantidade: 4, subtotal: 32 },
    ],
    total: 68,
    valor_original: 68,
    forma_pagamento: null,
  },
  {
    id: 3,
    data: hoje,
    cliente_id: 3,
    cliente_nome: 'Carlos',
    fechada: false,
    colapsada: true,
    produtos: [{ produto_id: null, nome: 'Saldo restante', preco: 0, quantidade: 1, subtotal: 0 }],
    total: 0,
    valor_original: 0,
    forma_pagamento: 'pix',
  },
  {
    id: 4,
    data: hoje,
    cliente_id: 4,
    cliente_nome: 'Juliana',
    fechada: true,
    colapsada: true,
    produtos: [
      { produto_id: 5, nome: 'Água', preco: 6, quantidade: 2, subtotal: 12 },
    ],
    total: 12,
    valor_original: 12,
    forma_pagamento: 'dinheiro',
  },
]

export const pagamentosMock: Pagamento[] = []

let proximoIdCliente = clientesMock.length + 1
let proximoIdProduto = produtosMock.length + 1
let proximoIdComanda = comandasMock.length + 1
let proximoIdPagamento = 1

export function proximoId(entidade: 'cliente' | 'produto' | 'comanda' | 'pagamento'): number {
  if (entidade === 'cliente') return proximoIdCliente++
  if (entidade === 'produto') return proximoIdProduto++
  if (entidade === 'comanda') return proximoIdComanda++
  return proximoIdPagamento++
}
