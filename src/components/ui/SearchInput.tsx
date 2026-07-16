import { TbSearch } from 'react-icons/tb'

interface SearchInputProps {
  value: string
  onChange: (valor: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = 'Buscar...' }: SearchInputProps) {
  return (
    <div className="relative mb-4">
      <TbSearch
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        aria-hidden
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-xl border border-border bg-surface-raised py-3 pl-10 pr-3 text-base text-text-primary placeholder-text-muted outline-none focus:border-accent"
      />
    </div>
  )
}
