import { useState } from 'react'
import { TbPencil, TbTrash } from 'react-icons/tb'
import { toast } from 'sonner'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'
import { ProdutoIcon } from '../components/ui/ProdutoIcon'
import { SearchInput } from '../components/ui/SearchInput'
import { ProdutoForm } from '../features/produtos/ProdutoForm'
import {
  useAtualizarProdutoMutation,
  useCriarProdutoMutation,
  useDeletarProdutoMutation,
  useProdutosQuery,
} from '../features/produtos/useProdutos'
import type { ProdutoFormData } from '../schemas/produto.schema'
import type { Produto } from '../types/produto'
import { formatarMoeda } from '../utils/formatCurrency'
import { correspondeABusca } from '../utils/normalizarTexto'

export function Produtos() {
  const { data: produtos, isLoading, isError } = useProdutosQuery()
  const criarProduto = useCriarProdutoMutation()
  const atualizarProduto = useAtualizarProdutoMutation()
  const deletarProduto = useDeletarProdutoMutation()

  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [busca, setBusca] = useState('')

  const produtosFiltrados = produtos?.filter((produto) => correspondeABusca(produto.nome, busca))

  function abrirCriacao() {
    setProdutoEmEdicao(null)
    setModalAberto(true)
  }

  function abrirEdicao(produto: Produto) {
    setProdutoEmEdicao(produto)
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
  }

  function handleSubmit(dado: ProdutoFormData) {
    if (produtoEmEdicao) {
      atualizarProduto.mutate(
        { id: produtoEmEdicao.id, dado },
        {
          onSuccess: () => {
            toast.success('Produto atualizado.')
            fecharModal()
          },
          onError: () => toast.error('Não foi possível salvar. Tente novamente.'),
        },
      )
    } else {
      criarProduto.mutate(dado, {
        onSuccess: () => {
          toast.success('Produto cadastrado.')
          fecharModal()
        },
        onError: () => toast.error('Não foi possível salvar. Tente novamente.'),
      })
    }
  }

  function handleDeletar(produto: Produto) {
    if (!window.confirm(`Excluir "${produto.nome}"?`)) {
      return
    }
    deletarProduto.mutate(produto.id, {
      onSuccess: () => toast.success('Produto excluído.'),
      onError: () => toast.error('Não foi possível excluir. Tente novamente.'),
    })
  }

  const modal = modalAberto && (
    <Modal title={produtoEmEdicao ? 'Editar produto' : 'Novo produto'} onClose={fecharModal}>
      <ProdutoForm
        produtoEmEdicao={produtoEmEdicao ?? undefined}
        isSubmitting={criarProduto.isPending || atualizarProduto.isPending}
        onSubmit={handleSubmit}
      />
    </Modal>
  )

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Produtos</h1>
          <p className="text-sm text-text-secondary">
            {isLoading && 'Carregando...'}
            {isError && 'Erro ao carregar'}
            {!isLoading && !isError && (
              <>
                {produtos?.length ?? 0} item{produtos?.length === 1 ? '' : 's'} cadastrado
                {produtos?.length === 1 ? '' : 's'}
              </>
            )}
          </p>
        </div>
        <Button onClick={abrirCriacao} className="px-4 py-2 text-sm">
          + Novo
        </Button>
      </div>

      {!isLoading && !isError && produtos && produtos.length > 0 && (
        <SearchInput value={busca} onChange={setBusca} placeholder="Buscar produto..." />
      )}

      {isLoading && <EmptyState message="Carregando produtos..." />}

      {isError && (
        <EmptyState message="Não foi possível carregar os produtos. Tente novamente." />
      )}

      {!isLoading && !isError && (!produtos || produtos.length === 0) && (
        <EmptyState message="Nenhum produto cadastrado ainda." />
      )}

      {!isLoading && !isError && produtos && produtos.length > 0 && produtosFiltrados?.length === 0 && (
        <EmptyState message="Nenhum produto encontrado." />
      )}

      {!isLoading && !isError && produtosFiltrados && produtosFiltrados.length > 0 && (
        <ul className="space-y-2">
          {produtosFiltrados.map((produto) => (
            <li
              key={produto.id}
              className="flex items-center gap-3 rounded-2xl bg-surface p-3"
            >
              <ProdutoIcon nome={produto.nome} icone={produto.icone} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-text-primary">{produto.nome}</p>
                <p className="text-sm text-success">{formatarMoeda(produto.preco)}</p>
              </div>
              <button
                type="button"
                onClick={() => abrirEdicao(produto)}
                aria-label="Editar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:text-accent"
              >
                <TbPencil size={18} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => handleDeletar(produto)}
                aria-label="Excluir"
                className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:text-danger"
              >
                <TbTrash size={18} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {modal}
    </div>
  )
}
