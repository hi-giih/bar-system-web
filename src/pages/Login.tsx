import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import logo from '../assets/logo.png'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/TextField'
import { useAuth } from '../providers/AuthProvider'
import { loginSchema, type LoginFormData } from '../schemas/auth.schema'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
    setIsSubmitting(true)
    try {
      await login(data)
      navigate('/', { replace: true })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('E-mail ou senha inválidos.')
      } else {
        toast.error('Não foi possível conectar ao servidor. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-full items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-sm"
      >
        <div className="mb-6 flex flex-col items-center">
          <img src={logo} alt="Central Bar" className="w-48" />
        </div>

        <TextField
          id="email"
          label="E-mail"
          type="text"
          autoComplete="username"
          error={errors.email?.message}
          {...register('email')}
        />

        <TextField
          id="senha"
          label="Senha"
          type="password"
          autoComplete="current-password"
          error={errors.senha?.message}
          {...register('senha')}
        />

        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  )
}
