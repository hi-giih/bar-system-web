import { useState } from 'react'
import { TbPencil, TbTrash } from 'react-icons/tb'
import { toast } from 'sonner'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'
import { SearchInput } from '../components/ui/SearchInput'
import { ClienteForm } from '../features/clientes/ClienteForm'
import {
  useAtualizarClienteMutation,
  useClientesQuery,
  useCriarClienteMutation,
  useDeletarClienteMutation,
} from '../features/clientes/useClientes'
import type { ClienteFormData } from '../schemas/cliente.schema'
import type { Cliente } from '../types/cliente'
import { correspondeABusca } from '../utils/normalizarTexto'

export function Clientes() {
  const { data: clientes, isLoading, isError } = useClientesQuery()
  const criarCliente = useCriarClienteMutation()
  const atualizarCliente = useAtualizarClienteMutation()
  const deletarCliente = useDeletarClienteMutation()

  const [clienteEmEdicao, setClienteEmEdicao] = useState<Cliente | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [busca, setBusca] = useState('')

  const clientesFiltrados = clientes?.filter((cliente) => correspondeABusca(cliente.nome, busca))

  function abrirCriacao() {
    setClienteEmEdicao(null)
    setModalAberto(true)
  }

  function abrirEdicao(cliente: Cliente) {
    setClienteEmEdicao(cliente)
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
  }

  function handleSubmit(dado: ClienteFormData) {
    if (clienteEmEdicao) {
      atualizarCliente.mutate(
        { id: clienteEmEdicao.id, dado },
        {
          onSuccess: () => {
            toast.success('Cliente atualizado.')
            fecharModal()
          },
          onError: () => toast.error('Não foi possível salvar. Tente novamente.'),
        },
      )
    } else {
      criarCliente.mutate(dado, {
        onSuccess: () => {
          toast.success('Cliente cadastrado.')
          fecharModal()
        },
        onError: () => toast.error('Não foi possível salvar. Tente novamente.'),
      })
    }
  }

  function handleDeletar(cliente: Cliente) {
    if (!window.confirm(`Excluir "${cliente.nome}"?`)) {
      return
    }
    deletarCliente.mutate(cliente.id, {
      onSuccess: () => toast.success('Cliente excluído.'),
      onError: () => toast.error('Não foi possível excluir. Tente novamente.'),
    })
  }

  const modal = modalAberto && (
    <Modal title={clienteEmEdicao ? 'Editar cliente' : 'Novo cliente'} onClose={fecharModal}>
      <ClienteForm
        clienteEmEdicao={clienteEmEdicao ?? undefined}
        isSubmitting={criarCliente.isPending || atualizarCliente.isPending}
        onSubmit={handleSubmit}
      />
    </Modal>
  )

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Clientes</h1>
          <p className="text-sm text-text-secondary">
            {isLoading && 'Carregando...'}
            {isError && 'Erro ao carregar'}
            {!isLoading && !isError && (
              <>
                {clientes?.length ?? 0} cliente{clientes?.length === 1 ? '' : 's'} cadastrado
                {clientes?.length === 1 ? '' : 's'}
              </>
            )}
          </p>
        </div>
        <Button onClick={abrirCriacao} className="px-4 py-2 text-sm">
          + Novo
        </Button>
      </div>

      {!isLoading && !isError && clientes && clientes.length > 0 && (
        <SearchInput value={busca} onChange={setBusca} placeholder="Buscar cliente..." />
      )}

      {isLoading && <EmptyState message="Carregando clientes..." />}

      {isError && (
        <EmptyState message="Não foi possível carregar os clientes. Tente novamente." />
      )}

      {!isLoading && !isError && (!clientes || clientes.length === 0) && (
        <EmptyState message="Nenhum cliente cadastrado ainda." />
      )}

      {!isLoading && !isError && clientes && clientes.length > 0 && clientesFiltrados?.length === 0 && (
        <EmptyState message="Nenhum cliente encontrado." />
      )}

      {!isLoading && !isError && clientesFiltrados && clientesFiltrados.length > 0 && (
        <ul className="space-y-2">
          {clientesFiltrados.map((cliente) => (
            <li
              key={cliente.id}
              className="flex items-center gap-3 rounded-2xl bg-surface p-3"
            >
              <Avatar nome={cliente.nome} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-text-primary">{cliente.nome}</p>
                {cliente.telefone && (
                  <p className="text-sm text-text-secondary">{cliente.telefone}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => abrirEdicao(cliente)}
                aria-label="Editar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:text-accent"
              >
                <TbPencil size={18} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => handleDeletar(cliente)}
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
