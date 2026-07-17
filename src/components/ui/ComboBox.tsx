import { useEffect, useRef, useState } from 'react'
import { correspondeABusca } from '../../utils/normalizarTexto'

export interface ComboBoxOption {
  valor: string
  rotulo: string
}

interface ComboBoxProps {
  id: string
  label: string
  options: ComboBoxOption[]
  value: string
  onChange: (valor: string) => void
  placeholder?: string
  error?: string
}

/** Campo de busca com sugestões: filtra a lista conforme digita, em vez de
 * exigir rolar um <select> nativo inteiro (essencial quando ha muitas opcoes). */
export function ComboBox({ id, label, options, value, onChange, placeholder, error }: ComboBoxProps) {
  const [busca, setBusca] = useState('')
  const [aberto, setAberto] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selecionada = options.find((o) => o.valor === value)
  const filtradas = busca.trim() ? options.filter((o) => correspondeABusca(o.rotulo, busca)) : options

  useEffect(() => {
    function aoClicarFora(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAberto(false)
      }
    }
    document.addEventListener('mousedown', aoClicarFora)
    return () => document.removeEventListener('mousedown', aoClicarFora)
  }, [])

  function selecionar(opcao: ComboBoxOption) {
    onChange(opcao.valor)
    setBusca('')
    setAberto(false)
  }

  return (
    <div className="relative mb-3" ref={containerRef}>
      <label className="mb-1 block text-sm text-text-secondary" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        value={aberto ? busca : (selecionada?.rotulo ?? '')}
        onChange={(e) => {
          setBusca(e.target.value)
          if (value) onChange('')
          setAberto(true)
        }}
        onFocus={() => {
          setBusca('')
          setAberto(true)
        }}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surface-raised px-3 py-3 text-base text-text-primary placeholder-text-muted outline-none focus:border-accent"
      />

      {aberto && (
        <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-border bg-surface-raised shadow-lg">
          {filtradas.length === 0 ? (
            <li className="px-3 py-2 text-sm text-text-muted">Nenhum resultado</li>
          ) : (
            filtradas.map((opcao) => (
              <li key={opcao.valor}>
                <button
                  type="button"
                  onClick={() => selecionar(opcao)}
                  className="block w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-surface"
                >
                  {opcao.rotulo}
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  )
}
