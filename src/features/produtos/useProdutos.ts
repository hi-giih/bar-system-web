import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'
import type { Produto } from '../../types/produto'
import type { ProdutoFormData } from '../../schemas/produto.schema'

const PRODUTOS_QUERY_KEY = ['produtos']

export function useProdutosQuery() {
  return useQuery({
    queryKey: PRODUTOS_QUERY_KEY,
    queryFn: async () => {
      const response = await api.get<{ produtos: Produto[] }>('/produtos/')
      return response.data.produtos
    },
  })
}

export function useCriarProdutoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dado: ProdutoFormData) => {
      const response = await api.post<{ produto: Produto }>('/produtos/', dado)
      return response.data.produto
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUTOS_QUERY_KEY })
    },
  })
}

export function useAtualizarProdutoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, dado }: { id: number; dado: ProdutoFormData }) => {
      const response = await api.put<{ produto: Produto }>(`/produtos/${id}`, dado)
      return response.data.produto
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUTOS_QUERY_KEY })
    },
  })
}

export function useDeletarProdutoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/produtos/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUTOS_QUERY_KEY })
    },
  })
}
