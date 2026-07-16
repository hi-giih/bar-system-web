import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/TextField'
import { clienteSchema, type ClienteFormData } from '../../schemas/cliente.schema'
import type { Cliente } from '../../types/cliente'

interface ClienteFormProps {
  clienteEmEdicao?: Cliente
  isSubmitting: boolean
  onSubmit: (dado: ClienteFormData) => void
}

export function ClienteForm({ clienteEmEdicao, isSubmitting, onSubmit }: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: clienteEmEdicao?.nome ?? '',
      telefone: clienteEmEdicao?.telefone ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField id="nome" label="Nome" type="text" error={errors.nome?.message} {...register('nome')} />

      <TextField
        id="telefone"
        label="Telefone (opcional)"
        type="tel"
        placeholder="Só números, com DDD"
        error={errors.telefone?.message}
        {...register('telefone')}
      />

      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  )
}
