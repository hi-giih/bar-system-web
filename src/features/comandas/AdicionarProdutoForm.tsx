import { useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { ComboBox } from '../../components/ui/ComboBox'
import { TextField } from '../../components/ui/TextField'
import { useProdutosQuery } from '../produtos/useProdutos'

interface AdicionarProdutoFormProps {
  isSubmitting: boolean
  onSubmit: (dado: { produto_id: number; quantidade: number }) => void
}

export function AdicionarProdutoForm({ isSubmitting, onSubmit }: AdicionarProdutoFormProps) {
  const { data: produtos } = useProdutosQuery()
  const [produtoId, setProdutoId] = useState('')
  const [quantidade, setQuantidade] = useState('1')
  const [erro, setErro] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)

    const quantidadeNumero = Number(quantidade)
    if (!produtoId) {
      setErro('Selecione um produto.')
      return
    }
    if (!quantidadeNumero || quantidadeNumero <= 0) {
      setErro('Informe uma quantidade válida.')
      return
    }

    onSubmit({ produto_id: Number(produtoId), quantidade: quantidadeNumero })
  }

  return (
    <form onSubmit={handleSubmit}>
      <ComboBox
        id="produto"
        label="Produto"
        placeholder="Digite pra buscar..."
        value={produtoId}
        onChange={setProdutoId}
        options={produtos?.map((produto) => ({ valor: String(produto.id), rotulo: produto.nome })) ?? []}
      />

      <TextField
        id="quantidade"
        label="Quantidade"
        type="number"
        min={1}
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />

      {erro && <p className="mb-3 text-sm text-danger">{erro}</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? 'Adicionando...' : 'Adicionar'}
      </Button>
    </form>
  )
}
