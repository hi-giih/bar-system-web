import { TbPower } from 'react-icons/tb'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { useAuth } from '../../providers/AuthProvider'
import { ITENS_NAVEGACAO } from './navItems'

export function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside className="hidden w-48 shrink-0 flex-col bg-sidebar p-3 md:flex">
      <div className="mb-6 flex items-center justify-center px-2">
        <img src={logo} alt="Central Bar" className="w-32" />
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {ITENS_NAVEGACAO.map(({ rota, rotulo, Icone }) => (
          <NavLink
            key={rota}
            to={rota}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-surface-raised text-accent'
                  : 'text-text-secondary hover:text-text-primary'
              }`
            }
          >
            <Icone size={18} aria-hidden />
            {rotulo}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <TbPower size={18} aria-hidden />
        Sair
      </button>
    </aside>
  )
}
