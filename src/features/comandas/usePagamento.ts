import { useMutation } from '@tanstack/react-query'
import { api } from '../../services/api'
import type { FormaPagamento, Pagamento } from '../../types/pagamento'
import { useInvalidarComandas } from './useComandas'

interface SaldoPagamento {
  total_comanda: number
  total_pago: number
  saldo_restante: number
}

interface CriarPagamentoResponse extends Partial<SaldoPagamento> {
  pagamento: Pagamento
}

export function useCriarPagamentoMutation(comandaId: number) {
  const invalidar = useInvalidarComandas()

  return useMutation({
    mutationFn: async (dado: { comanda_id: number; valor: number; forma_pagamento: FormaPagamento }) => {
      const response = await api.post<CriarPagamentoResponse>('/pagamento/', dado)
      return response.data
    },
    // Cartao/dinheiro ja nascem pagos (sem etapa de confirmacao), entao a
    // comanda precisa ser recarregada aqui tambem, nao so na confirmacao do pix.
    onSuccess: (dado) => {
      if (dado.pagamento.paid) invalidar(comandaId)
    },
  })
}

export function useConfirmarPagamentoMutation(comandaId: number) {
  const invalidar = useInvalidarComandas()

  return useMutation({
    mutationFn: async (dado: { comanda_id: number; valor: number }) => {
      const response = await api.post<SaldoPagamento>('/pagamento/confirmacao', dado)
      return response.data
    },
    onSuccess: () => invalidar(comandaId),
  })
}
