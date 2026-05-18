import { PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthStatusControl } from '../../shared/auth/AuthStatusControl'
import { useOperationalStore } from '../../shared/store/operationalStore'

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
  const storeStatus = useOperationalStore((state) => state.status)
  const error = useOperationalStore((state) => state.error)

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
          <AuthStatusControl />
        </nav>
      </header>

      <main>
        {storeStatus === 'loading' ? (
          <p className="app-status" role="status">
            Sincronizando contexto operacional...
          </p>
        ) : null}

        {storeStatus === 'error' ? (
          <p className="app-status app-status--error" role="alert">
            {error ?? 'Falha ao sincronizar contexto operacional'}
          </p>
        ) : null}

        {children}
      </main>

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
