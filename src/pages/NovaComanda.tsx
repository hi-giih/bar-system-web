import { useState, type FormEvent } from 'react'
import { TbArrowLeft } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { TextField } from '../components/ui/TextField'
import { useClientesQuery, useCriarClienteMutation } from '../features/clientes/useClientes'
import { useCriarComandaMutation } from '../features/comandas/useComandas'

const CADASTRAR_NOVO = 'novo'

export function NovaComanda() {
  const navigate = useNavigate()
  const { data: clientes } = useClientesQuery()
  const criarCliente = useCriarClienteMutation()
  const criarComanda = useCriarComandaMutation()

  const [clienteId, setClienteId] = useState('')
  const [novoNome, setNovoNome] = useState('')
  const [novoTelefone, setNovoTelefone] = useState('')
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10))
  const [erro, setErro] = useState<string | null>(null)

  const isSubmitting = criarCliente.isPending || criarComanda.isPending
  const cadastrandoNovo = clienteId === CADASTRAR_NOVO

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!clienteId) {
      setErro('Selecione um cliente ou cadastre um novo.')
      return
    }
    if (cadastrandoNovo && !novoNome.trim()) {
      setErro('Informe o nome do novo cliente.')
      return
    }

    try {
      const idDoCliente = cadastrandoNovo
        ? (await criarCliente.mutateAsync({ nome: novoNome, telefone: novoTelefone || undefined })).id
        : Number(clienteId)

      const comanda = await criarComanda.mutateAsync({ data, cliente_id: idDoCliente })
      toast.success('Comanda criada.')
      navigate(`/comandas/${comanda.id}`, { replace: true })
    } catch {
      toast.error('Não foi possível criar a comanda. Tente novamente.')
    }
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/comandas')}
          aria-label="Voltar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-text-primary"
        >
          <TbArrowLeft size={18} aria-hidden />
        </button>
        <h1 className="text-xl font-semibold text-text-primary">Nova comanda</h1>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-sm">
        <Select
          id="cliente"
          label="Cliente"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        >
          <option value="">Selecione...</option>
          {clientes?.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
          <option value={CADASTRAR_NOVO}>+ Cadastrar novo cliente</option>
        </Select>

        {cadastrandoNovo && (
          <>
            <TextField
              id="novoNome"
              label="Nome do novo cliente"
              type="text"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
            />
            <TextField
              id="novoTelefone"
              label="Telefone (opcional)"
              type="tel"
              placeholder="Só números, com DDD"
              value={novoTelefone}
              onChange={(e) => setNovoTelefone(e.target.value)}
            />
          </>
        )}

        <TextField
          id="data"
          label="Data"
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />

        {erro && <p className="mb-3 text-sm text-danger">{erro}</p>}

        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? 'Abrindo...' : 'Abrir comanda'}
        </Button>
      </form>
    </div>
  )
}
