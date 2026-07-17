import { useState } from 'react'
import { TbDownload } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { SearchInput } from '../components/ui/SearchInput'
import { StatusPill } from '../components/ui/StatusPill'
import { useComandasQuery } from '../features/comandas/useComandas'
import { api } from '../services/api'
import { formatarData } from '../utils/formatDate'
import { formatarMoeda } from '../utils/formatCurrency'
import { NOMES_FORMA_PAGAMENTO } from '../utils/formaPagamento'
import { correspondeABusca } from '../utils/normalizarTexto'
import { statusDaComanda } from '../utils/statusComanda'

type Aba = 'abertas' | 'fechadas'

export function Comandas() {
  const { data: comandas, isLoading, isError } = useComandasQuery()
  const navigate = useNavigate()
  const [aba, setAba] = useState<Aba>('abertas')
  const [busca, setBusca] = useState('')
  const [baixandoRelatorio, setBaixandoRelatorio] = useState(false)

  async function baixarRelatorio() {
    setBaixandoRelatorio(true)
    try {
      const resposta = await api.get('/relatorios/comandas', { responseType: 'blob' })
      const url = URL.createObjectURL(resposta.data)
      const link = document.createElement('a')
      link.href = url
      link.download = `comandas_${new Date().toISOString().slice(0, 10)}.xlsx`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Não foi possível baixar o relatório.')
    } finally {
      setBaixandoRelatorio(false)
    }
  }

  const abertas = comandas?.filter((c) => !c.fechada) ?? []
  const fechadas = comandas?.filter((c) => c.fechada) ?? []
  const listaBaseDaAba = aba === 'abertas' ? abertas : fechadas
  const listaDaAba = listaBaseDaAba.filter((c) => correspondeABusca(c.cliente_nome ?? '', busca))

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Comandas</h1>
          <p className="text-sm text-text-secondary">
            {isLoading && 'Carregando...'}
            {isError && 'Erro ao carregar'}
            {!isLoading && !isError && (
              <>
                {listaDaAba.length} comanda{listaDaAba.length === 1 ? '' : 's'}{' '}
                {aba === 'abertas' ? 'aberta' : 'fechada'}
                {listaDaAba.length === 1 ? '' : 's'}
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={baixarRelatorio}
            disabled={baixandoRelatorio}
            className="px-3 py-2 text-sm"
            title="Baixar relatório de comandas (.xlsx)"
          >
            <TbDownload className="text-lg" />
          </Button>
          <Button onClick={() => navigate('/comandas/nova')} className="px-4 py-2 text-sm">
            + Nova
          </Button>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setAba('abertas')}
          className={`flex-1 rounded-xl py-2 text-sm font-medium transition-colors ${
            aba === 'abertas'
              ? 'bg-accent text-accent-contrast'
              : 'bg-surface text-text-secondary'
          }`}
        >
          Abertas
        </button>
        <button
          type="button"
          onClick={() => setAba('fechadas')}
          className={`flex-1 rounded-xl py-2 text-sm font-medium transition-colors ${
            aba === 'fechadas'
              ? 'bg-accent text-accent-contrast'
              : 'bg-surface text-text-secondary'
          }`}
        >
          Fechadas
        </button>
      </div>

      {!isLoading && !isError && listaBaseDaAba.length > 0 && (
        <SearchInput value={busca} onChange={setBusca} placeholder="Buscar por cliente..." />
      )}

      {isLoading && <EmptyState message="Carregando comandas..." />}

      {isError && (
        <EmptyState message="Não foi possível carregar as comandas. Tente novamente." />
      )}

      {!isLoading && !isError && listaBaseDaAba.length === 0 && (
        <EmptyState
          message={
            aba === 'abertas' ? 'Nenhuma comanda aberta no momento.' : 'Nenhuma comanda fechada ainda.'
          }
        />
      )}

      {!isLoading && !isError && listaBaseDaAba.length > 0 && listaDaAba.length === 0 && (
        <EmptyState message="Nenhuma comanda encontrada." />
      )}

      {!isLoading && !isError && listaDaAba.length > 0 && (
        <ul className="space-y-2">
          {listaDaAba.map((comanda) => {
            const status = statusDaComanda(comanda)
            const nomeCliente = comanda.cliente_nome ?? 'Cliente removido'
            return (
              <li key={comanda.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/comandas/${comanda.id}`)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-surface p-3 text-left"
                >
                  <Avatar nome={nomeCliente} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-text-primary">{nomeCliente}</p>
                    <p className="text-sm text-text-secondary">
                      {aba === 'abertas'
                        ? `${comanda.produtos.length} item${comanda.produtos.length === 1 ? '' : 's'}`
                        : [
                            comanda.forma_pagamento
                              ? NOMES_FORMA_PAGAMENTO[comanda.forma_pagamento]
                              : null,
                            formatarData(comanda.data),
                          ]
                            .filter(Boolean)
                            .join(' • ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-text-primary">
                      {formatarMoeda(aba === 'abertas' ? comanda.total : comanda.valor_original)}
                    </p>
                    <StatusPill texto={status.texto} tom={status.tom} />
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
