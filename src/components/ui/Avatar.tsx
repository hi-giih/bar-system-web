import { corDoAvatar, iniciais } from '../../utils/avatarColor'

interface AvatarProps {
  nome: string
  size?: 'sm' | 'md' | 'lg'
}

const TAMANHOS = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-lg',
}

export function Avatar({ nome, size = 'md' }: AvatarProps) {
  const { bg, texto } = corDoAvatar(nome)

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-medium ${TAMANHOS[size]}`}
      style={{ backgroundColor: bg, color: texto }}
    >
      {iniciais(nome)}
    </div>
  )
}
