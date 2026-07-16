import axios from 'axios'
import { useState } from 'react'
import { TbArrowLeft, TbMinus, TbPlus, TbTrash } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'
import { StatusPill } from '../components/ui/StatusPill'
import { AdicionarProdutoForm } from '../features/comandas/AdicionarProdutoForm'
import { PagamentoForm } from '../features/comandas/PagamentoForm'
import {
  useAdicionarProdutoMutation,
  useComandaQuery,
  useDeletarComandaMutation,
  useFecharComandaMutation,
  useIncrementarQuantidadeMutation,
  useRemoverProdutoMutation,
} from '../features/comandas/useComandas'
import { formatarData } from '../utils/formatDate'
import { formatarMoeda } from '../utils/formatCurrency'
import { statusDaComanda } from '../utils/statusComanda'

function mensagemDeErro(erro: unknown, padrao: string): string {
  if (axios.isAxiosError(erro) && typeof erro.response?.data?.message === 'string') {
    return erro.response.data.message
  }
  return padrao
}

export function ComandaDetalhe() {
  const { id } = useParams()
  const comandaId = Number(id)
  const navigate = useNavigate()

  const { data: comanda, isLoading, isError } = useComandaQuery(comandaId)
  const adicionarProduto = useAdicionarProdutoMutation(comandaId)
  const incrementar = useIncrementarQuantidadeMutation(comandaId)
  const remover = useRemoverProdutoMutation(comandaId)
  const fechar = useFecharComandaMutation(comandaId)
  const deletar = useDeletarComandaMutation()

  const [modalAberto, setModalAberto] = useState(false)
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false)

  if (isLoading) {
    return <EmptyState message="Carregando comanda..." />
  }

  if (isError || !comanda) {
    return <EmptyState message="Não foi possível carregar essa comanda." />
  }

  const bloqueada = comanda.fechada
  const podePagar = !comanda.fechada && comanda.total > 0
  const podeFechar = !comanda.fechada && comanda.total === 0
  const status = statusDaComanda(comanda)

  function handleIncrementar(produtoId: number) {
    incrementar.mutate(
      { produtoId, quantidade: 1 },
      { onError: (erro) => toast.error(mensagemDeErro(erro, 'Não foi possível atualizar.')) },
    )
  }

  function handleRemover(produtoId: number) {
    remover.mutate(
      { produtoId, quantidade: 1 },
      { onError: (erro) => toast.error(mensagemDeErro(erro, 'Não foi possível atualizar.')) },
    )
  }

  function handleAdicionar(dado: { produto_id: number; quantidade: number }) {
    adicionarProduto.mutate(dado, {
      onSuccess: () => {
        toast.success('Produto adicionado.')
        setModalAberto(false)
      },
      onError: (erro) => toast.error(mensagemDeErro(erro, 'Não foi possível adicionar.')),
    })
  }

  function handleFechar() {
    fechar.mutate(undefined, {
      onSuccess: () => toast.success('Comanda fechada.'),
      onError: (erro) => toast.error(mensagemDeErro(erro, 'Não foi possível fechar a comanda.')),
    })
  }

  function handlePagamentoConcluido() {
    setModalPagamentoAberto(false)
    toast.success('Pagamento confirmado.')
  }

  function handleExcluir() {
    if (!comanda || !window.confirm('Excluir esta comanda?')) {
      return
    }
    deletar.mutate(comanda.id, {
      onSuccess: () => {
        toast.success('Comanda excluída.')
        navigate('/comandas', { replace: true })
      },
      onError: () => toast.error('Não foi possível excluir. Tente novamente.'),
    })
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/comandas')}
          aria-label="Voltar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-text-primary"
        >
          <TbArrowLeft size={18} aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-semibold text-text-primary">
            {comanda.cliente_nome ?? 'Cliente removido'}
          </h1>
          <p className="text-sm text-text-secondary">{formatarData(comanda.data)}</p>
        </div>
        <StatusPill texto={status.texto} tom={status.tom} />
      </div>

      <ul className="mb-4 space-y-2">
        {comanda.produtos.map((item, indice) => (
          <li
            key={item.produto_id ?? indice}
            className="flex items-center gap-3 rounded-2xl bg-surface p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-text-primary">{item.nome}</p>
              <p className="text-sm text-success">{formatarMoeda(item.subtotal)}</p>
            </div>
            {!bloqueada && item.produto_id !== null ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRemover(item.produto_id as number)}
                  aria-label="Diminuir quantidade"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-raised text-text-primary"
                >
                  <TbMinus size={16} aria-hidden />
                </button>
                <span className="w-6 text-center text-text-primary">{item.quantidade}</span>
                <button
                  type="button"
                  onClick={() => handleIncrementar(item.produto_id as number)}
                  aria-label="Aumentar quantidade"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-raised text-text-primary"
                >
                  <TbPlus size={16} aria-hidden />
                </button>
              </div>
            ) : (
              <span className="text-text-secondary">{item.quantidade}x</span>
            )}
          </li>
        ))}

        {comanda.produtos.length === 0 && (
          <li className="rounded-2xl bg-surface p-4 text-center text-text-secondary">
            Nenhum produto adicionado ainda.
          </li>
        )}
      </ul>

      {comanda.valor_original !== comanda.total ? (
        <div className="mb-6 space-y-1 rounded-2xl bg-surface p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Valor original</span>
            <span className="text-text-primary">{formatarMoeda(comanda.valor_original)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Valor aberto</span>
            <span className="text-xl font-semibold text-text-primary">
              {formatarMoeda(comanda.total)}
            </span>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-surface p-4">
          <span className="text-text-secondary">Total</span>
          <span className="text-xl font-semibold text-text-primary">
            {formatarMoeda(comanda.total)}
          </span>
        </div>
      )}

      <div className="space-y-2">
        {!bloqueada && (
          <Button variant="secondary" className="w-full" onClick={() => setModalAberto(true)}>
            + Adicionar produto
          </Button>
        )}

        {podePagar && (
          <Button className="w-full" onClick={() => setModalPagamentoAberto(true)}>
            Pagamento
          </Button>
        )}

        {podeFechar && (
          <Button className="w-full" onClick={handleFechar} disabled={fechar.isPending}>
            {fechar.isPending ? 'Fechando...' : 'Fechar comanda'}
          </Button>
        )}

        <button
          type="button"
          onClick={handleExcluir}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-danger"
        >
          <TbTrash size={16} aria-hidden />
          Excluir comanda
        </button>
      </div>

      {modalAberto && (
        <Modal title="Adicionar produto" onClose={() => setModalAberto(false)}>
          <AdicionarProdutoForm
            isSubmitting={adicionarProduto.isPending}
            onSubmit={handleAdicionar}
          />
        </Modal>
      )}

      {modalPagamentoAberto && (
        <Modal title="Pagamento" onClose={() => setModalPagamentoAberto(false)}>
          <PagamentoForm
            comandaId={comanda.id}
            total={comanda.total}
            onConcluido={handlePagamentoConcluido}
          />
        </Modal>
      )}
    </div>
  )
}