type StatusTom = 'neutro' | 'aviso' | 'sucesso' | 'perigo'

interface StatusPillProps {
  texto: string
  tom: StatusTom
}

const CLASSES_POR_TOM: Record<StatusTom, string> = {
  neutro: 'text-text-secondary',
  aviso: 'text-warning',
  sucesso: 'text-success',
  perigo: 'text-danger',
}

export function StatusPill({ texto, tom }: StatusPillProps) {
  return <span className={`text-sm font-medium ${CLASSES_POR_TOM[tom]}`}>{texto}</span>
}
