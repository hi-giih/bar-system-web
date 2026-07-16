import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Clientes } from './pages/Clientes'
import { ComandaDetalhe } from './pages/ComandaDetalhe'
import { Comandas } from './pages/Comandas'
import { Login } from './pages/Login'
import { NovaComanda } from './pages/NovaComanda'
import { Produtos } from './pages/Produtos'
import { AuthProvider } from './providers/AuthProvider'
import { AppLayout } from './routes/AppLayout'
import { RedirectIfAuthenticated } from './routes/RedirectIfAuthenticated'
import { RequireAuth } from './routes/RequireAuth'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<RedirectIfAuthenticated />}>
              <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route path="/comandas" element={<Comandas />} />
                <Route path="/comandas/nova" element={<NovaComanda />} />
                <Route path="/comandas/:id" element={<ComandaDetalhe />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/" element={<Navigate to="/comandas" replace />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors theme="dark" />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
