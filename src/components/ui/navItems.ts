import { TbClipboardList, TbGlassCocktail, TbUsers } from 'react-icons/tb'
import type { IconType } from 'react-icons'

export interface NavItem {
  rota: string
  rotulo: string
  Icone: IconType
}

export const ITENS_NAVEGACAO: NavItem[] = [
  { rota: '/comandas', rotulo: 'Comandas', Icone: TbClipboardList },
  { rota: '/clientes', rotulo: 'Clientes', Icone: TbUsers },
  { rota: '/produtos', rotulo: 'Produtos', Icone: TbGlassCocktail },
]
