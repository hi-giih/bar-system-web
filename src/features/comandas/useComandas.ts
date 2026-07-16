import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'
import type { Comanda } from '../../types/comanda'

const COMANDAS_QUERY_KEY = ['comandas']
const comandaQueryKey = (id: number) => ['comandas', id]

export function useComandasQuery() {
  return useQuery({
    queryKey: COMANDAS_QUERY_KEY,
    queryFn: async () => {
      const response = await api.get<{ comandas: Comanda[] }>('/comanda/')
      return response.data.comandas
    },
  })
}

export function useComandaQuery(id: number) {
  return useQuery({
    queryKey: comandaQueryKey(id),
    queryFn: async () => {
      const response = await api.get<Comanda>(`/comanda/${id}`)
      return response.data
    },
  })
}

export function useInvalidarComandas() {
  const queryClient = useQueryClient()
  return (id?: number) => {
    queryClient.invalidateQueries({ queryKey: COMANDAS_QUERY_KEY })
    if (id !== undefined) {
      queryClient.invalidateQueries({ queryKey: comandaQueryKey(id) })
    }
  }
}

export function useCriarComandaMutation() {
  const invalidar = useInvalidarComandas()

  return useMutation({
    mutationFn: async (dado: { data: string; cliente_id: number }) => {
      const response = await api.post<Comanda>('/comanda/', dado)
      return response.data
    },
    onSuccess: () => invalidar(),
  })
}

export function useAdicionarProdutoMutation(comandaId: number) {
  const invalidar = useInvalidarComandas()

  return useMutation({
    mutationFn: async (dado: { produto_id: number; quantidade: number }) => {
      const response = await api.post<{ comanda: Comanda }>(
        `/comanda/${comandaId}/produtos`,
        dado,
      )
      return response.data.comanda
    },
    onSuccess: () => invalidar(comandaId),
  })
}

export function useIncrementarQuantidadeMutation(comandaId: number) {
  const invalidar = useInvalidarComandas()

  return useMutation({
    mutationFn: async ({ produtoId, quantidade }: { produtoId: number; quantidade: number }) => {
      const response = await api.patch<{ comanda: Comanda }>(
        `/comanda/${comandaId}/produtos/${produtoId}`,
        { quantidade },
      )
      return response.data.comanda
    },
    onSuccess: () => invalidar(comandaId),
  })
}

export function useRemoverProdutoMutation(comandaId: number) {
  const invalidar = useInvalidarComandas()

  return useMutation({
    mutationFn: async ({ produtoId, quantidade }: { produtoId: number; quantidade: number }) => {
      const response = await api.delete<{ comanda: Comanda }>(
        `/comanda/${comandaId}/produtos/${produtoId}`,
        { data: { quantidade } },
      )
      return response.data.comanda
    },
    onSuccess: () => invalidar(comandaId),
  })
}

export function useFecharComandaMutation(comandaId: number) {
  const invalidar = useInvalidarComandas()

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<{ comanda: Comanda }>(`/comanda/${comandaId}/fechar`)
      return response.data.comanda
    },
    onSuccess: () => invalidar(comandaId),
  })
}

export function useDeletarComandaMutation() {
  const invalidar = useInvalidarComandas()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/comanda/${id}`)
    },
    onSuccess: () => invalidar(),
  })
}
