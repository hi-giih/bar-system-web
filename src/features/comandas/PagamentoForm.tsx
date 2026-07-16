import { useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { TextField } from '../../components/ui/TextField'
import { formatarMoeda } from '../../utils/formatCurrency'
import { NOMES_FORMA_PAGAMENTO } from '../../utils/formaPagamento'
import type { FormaPagamento, Pagamento } from '../../types/pagamento'
import { useConfirmarPagamentoMutation, useCriarPagamentoMutation } from './usePagamento'

interface PagamentoFormProps {
  comandaId: number
  total: number
  onConcluido: () => void
}

export function PagamentoForm({ comandaId, total, onConcluido }: PagamentoFormProps) {
  const [valor, setValor] = useState(total.toFixed(2))
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('pix')
  const [erro, setErro] = useState<string | null>(null)
  const [pagamento, setPagamento] = useState<Pagamento | null>(null)

  const criarPagamento = useCriarPagamentoMutation(comandaId)
  const confirmarPagamento = useConfirmarPagamentoMutation(comandaId)

  function handleRegistrarPagamento(e: FormEvent) {
    e.preventDefault()
    setErro(null)

    const valorNumero = Number(valor)
    if (!valorNumero || valorNumero <= 0) {
      setErro('Informe um valor válido.')
      return
    }
    if (valorNumero > total) {
      setErro(`O valor não pode ser maior que o total da comanda (${formatarMoeda(total)}).`)
      return
    }

    criarPagamento.mutate(
      { comanda_id: comandaId, valor: valorNumero, forma_pagamento: formaPagamento },
      {
        onSuccess: (dado) => {
          // Cartao/dinheiro sao pagos fora do app: ja nascem confirmados, sem QR code.
          if (dado.pagamento.paid) {
            onConcluido()
            return
          }
          setPagamento(dado.pagamento)
        },
        onError: () => setErro('Não foi possível registrar o pagamento. Tente novamente.'),
      },
    )
  }

  function handleConfirmar() {
    if (!pagamento) return
    confirmarPagamento.mutate(
      { comanda_id: comandaId, valor: pagamento.value },
      {
        onSuccess: onConcluido,
        onError: () => setErro('Não foi possível confirmar o pagamento. Tente novamente.'),
      },
    )
  }

  if (pagamento) {
    return (
      <div>
        <div className="mb-4 flex flex-col items-center gap-3 rounded-xl bg-surface-raised p-4">
          <p className="text-sm text-text-secondary">Escaneie o QR Code para pagar</p>
          {pagamento.qr_code ? (
            <img src={pagamento.qr_code} alt="QR Code Pix" className="h-48 w-48 rounded-lg bg-white p-2" />
          ) : (
            <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-surface text-center text-sm text-text-muted">
              QR Code indisponível
            </div>
          )}
          <p className="text-lg font-semibold text-text-primary">{formatarMoeda(pagamento.value)}</p>
        </div>

        {erro && <p className="mb-3 text-sm text-danger">{erro}</p>}

        <Button
          type="button"
          className="w-full"
          onClick={handleConfirmar}
          disabled={confirmarPagamento.isPending}
        >
          {confirmarPagamento.isPending ? 'Confirmando...' : 'Já paguei / Confirmar pagamento'}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleRegistrarPagamento}>
      <div className="mb-4 flex items-center justify-between rounded-xl bg-surface-raised p-3 text-sm">
        <span className="text-text-secondary">Total da comanda</span>
        <span className="font-medium text-text-primary">{formatarMoeda(total)}</span>
      </div>

      <Select
        id="formaPagamento"
        label="Forma de pagamento"
        value={formaPagamento}
        onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
      >
        {(Object.keys(NOMES_FORMA_PAGAMENTO) as FormaPagamento[]).map((forma) => (
          <option key={forma} value={forma}>
            {NOMES_FORMA_PAGAMENTO[forma]}
          </option>
        ))}
      </Select>

      <TextField
        id="valor"
        label="Valor a ser pago"
        type="number"
        step="0.01"
        min={0.01}
        max={total}
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />

      {erro && <p className="mb-3 text-sm text-danger">{erro}</p>}

      <Button type="submit" disabled={criarPagamento.isPending} className="mt-2 w-full">
        {criarPagamento.isPending
          ? 'Registrando...'
          : formaPagamento === 'pix'
            ? 'Gerar Pix'
            : 'Registrar pagamento'}
      </Button>
    </form>
  )
}
