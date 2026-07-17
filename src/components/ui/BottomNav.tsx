import { TbPower } from 'react-icons/tb'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider'
import { ITENS_NAVEGACAO } from './navItems'

export function BottomNav() {
  const { logout } = useAuth()

  return (
    <nav className="flex border-t border-border bg-sidebar md:hidden">
      {ITENS_NAVEGACAO.map(({ rota, rotulo, Icone }) => (
        <NavLink
          key={rota}
          to={rota}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium ${
              isActive ? 'text-accent' : 'text-text-secondary'
            }`
          }
        >
          <Icone size={20} aria-hidden />
          {rotulo}
        </NavLink>
      ))}
      <button
        type="button"
        onClick={logout}
        className="flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium text-text-secondary"
      >
        <TbPower size={20} aria-hidden />
        Sair
      </button>
    </nav>
  )
}
