import { NavLink } from 'react-router-dom'
import { ITENS_NAVEGACAO } from './navItems'

export function BottomNav() {
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
    </nav>
  )
}
