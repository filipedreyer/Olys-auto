import { PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'

const primaryNav = [
  { to: '/fazer/hoje', label: 'Fazer' },
  { to: '/planejar', label: 'Planejar' },
  { to: '/memoria', label: 'Memoria' },
]

const actionNav = [
  { to: '/capturar', label: 'Capturar' },
  { to: '/memoria/inbox', label: 'Inbox' },
  { to: '/fazer/timeline', label: 'Timeline' },
]

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/fazer/hoje" className="brand" aria-label="Olys Hoje">
          Olys
        </NavLink>

        <nav className="topbar__actions" aria-label="Acoes globais">
          {actionNav.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>{children}</main>

      <nav className="bottom-nav" aria-label="Territorios principais">
        {primaryNav.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
