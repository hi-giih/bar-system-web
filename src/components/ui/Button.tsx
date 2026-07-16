import type { ButtonHTMLAttributes } from 'react'

type Variante = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variante
}

const CLASSES_POR_VARIANTE: Record<Variante, string> = {
  primary:
    'bg-gradient-to-br from-accent-light to-accent-dark text-accent-contrast disabled:opacity-60',
  secondary:
    'bg-surface-raised text-text-primary border border-border disabled:opacity-60',
  danger: 'bg-danger text-danger-contrast disabled:opacity-60',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-xl px-4 py-3 text-base font-medium transition-opacity active:opacity-80 ${CLASSES_POR_VARIANTE[variant]} ${className}`}
      {...props}
    />
  )
}
