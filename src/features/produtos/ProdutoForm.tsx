import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/TextField'
import { produtoSchema, type ProdutoFormData } from '../../schemas/produto.schema'
import type { Produto } from '../../types/produto'
import { OPCOES_ICONE_PRODUTO } from '../../utils/iconeProduto'

interface ProdutoFormProps {
  produtoEmEdicao?: Produto
  isSubmitting: boolean
  onSubmit: (dado: ProdutoFormData) => void
}

export function ProdutoForm({ produtoEmEdicao, isSubmitting, onSubmit }: ProdutoFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: produtoEmEdicao?.nome ?? '',
      preco: produtoEmEdicao?.preco,
      icone: produtoEmEdicao?.icone ?? 'bebida',
    },
  })

  const iconeSelecionado = watch('icone')

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        id="nome"
        label="Nome do produto"
        type="text"
        placeholder="Ex.: Chopp Pilsen 300ml"
        error={errors.nome?.message}
        {...register('nome')}
      />

      <TextField
        id="preco"
        label="Preço"
        type="number"
        step="0.01"
        min={0.01}
        placeholder="0,00"
        error={errors.preco?.message}
        {...register('preco', { valueAsNumber: true })}
      />

      <div className="mb-3">
        <p className="mb-1 text-sm text-text-secondary">Tipo</p>
        <div className="flex gap-2">
          {OPCOES_ICONE_PRODUTO.map(({ valor, rotulo, Icone }) => {
            const selecionado = iconeSelecionado === valor
            return (
              <button
                key={valor}
                type="button"
                onClick={() => setValue('icone', valor, { shouldValidate: true })}
                aria-pressed={selecionado}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl border p-3 transition-colors ${
                  selecionado
                    ? 'border-accent bg-surface-raised text-accent'
                    : 'border-border text-text-secondary'
                }`}
              >
                <Icone size={22} aria-hidden />
                <span className="text-xs">{rotulo}</span>
              </button>
            )
          })}
        </div>
        {errors.icone && <p className="mt-1 text-sm text-danger">{errors.icone.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  )
}
