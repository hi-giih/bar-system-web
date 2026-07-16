import { createContext, useContext, useState, type ReactNode } from 'react'
import { api, clearToken, getToken, setToken } from '../services/api'
import type { LoginRequest, LoginResponse } from '../types/auth'

interface AuthContextValue {
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getToken()))

  async function login(data: LoginRequest): Promise<void> {
    const response = await api.post<LoginResponse>('/auth/login', data)
    setToken(response.data.access_token)
    setIsAuthenticated(true)
  }

  function logout(): void {
    clearToken()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
