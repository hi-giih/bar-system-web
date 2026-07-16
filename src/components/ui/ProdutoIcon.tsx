import { corDoAvatar } from '../../utils/avatarColor'
import { componenteIconeProduto } from '../../utils/iconeProduto'
import type { IconeProduto } from '../../types/produto'

interface ProdutoIconProps {
  nome: string
  icone: IconeProduto
}

export function ProdutoIcon({ nome, icone }: ProdutoIconProps) {
  const { bg, texto } = corDoAvatar(nome)
  const Icone = componenteIconeProduto(icone)

  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: bg, color: texto }}
    >
      <Icone size={20} aria-hidden />
    </div>
  )
}
