import { TbBottle, TbGlassCocktail, TbToolsKitchen2 } from 'react-icons/tb'
import type { IconeProduto } from '../types/produto'

export const OPCOES_ICONE_PRODUTO: { valor: IconeProduto; rotulo: string; Icone: typeof TbBottle }[] = [
  { valor: 'drink', rotulo: 'Drinks', Icone: TbGlassCocktail },
  { valor: 'bebida', rotulo: 'Bebidas', Icone: TbBottle },
  { valor: 'comida', rotulo: 'Comida', Icone: TbToolsKitchen2 },
]

export function componenteIconeProduto(icone: IconeProduto) {
  return OPCOES_ICONE_PRODUTO.find((opcao) => opcao.valor === icone)?.Icone ?? TbGlassCocktail
}
