export type IconeProduto = 'drink' | 'bebida' | 'comida'

export interface Produto {
  id: number
  nome: string
  preco: number
  icone: IconeProduto
}
