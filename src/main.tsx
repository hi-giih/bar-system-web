import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { USE_MOCKS } from './config/env'

if (USE_MOCKS) {
  const { iniciarMocks } = await import('./mocks/server')
  iniciarMocks()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
