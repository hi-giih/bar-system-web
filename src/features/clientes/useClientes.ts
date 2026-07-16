import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'
import type { Cliente } from '../../types/cliente'
import type { ClienteFormData } from '../../schemas/cliente.schema'

const CLIENTES_QUERY_KEY = ['clientes']

function normalizarPayload(dado: ClienteFormData) {
  return {
    nome: dado.nome,
    telefone: dado.telefone ? dado.telefone : undefined,
  }
}

export function useClientesQuery() {
  return useQuery({
    queryKey: CLIENTES_QUERY_KEY,
    queryFn: async () => {
      const response = await api.get<{ clientes: Cliente[] }>('/clientes/')
      return response.data.clientes
    },
  })
}

export function useCriarClienteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dado: ClienteFormData) => {
      const response = await api.post<{ cliente: Cliente }>('/clientes/', normalizarPayload(dado))
      return response.data.cliente
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTES_QUERY_KEY })
    },
  })
}

export function useAtualizarClienteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, dado }: { id: number; dado: ClienteFormData }) => {
      const response = await api.put<{ cliente: Cliente }>(
        `/clientes/${id}`,
        normalizarPayload(dado),
      )
      return response.data.cliente
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTES_QUERY_KEY })
    },
  })
}

export function useDeletarClienteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/clientes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTES_QUERY_KEY })
    },
  })
}
