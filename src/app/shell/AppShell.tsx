import { PropsWithChildren, useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { CaptureSheet } from '../../features/capturar/components/CaptureSheet'
import { AuthStatusControl } from '../../shared/auth/AuthStatusControl'
import { useOperationalStore } from '../../shared/store/operationalStore'

const primaryNav = [
  { to: '/fazer/hoje', label: 'Fazer' },
  { to: '/planejar', label: 'Planejar' },
  { to: '/memoria', label: 'Memoria' },
]

const actionNav = [
  { to: '/memoria/inbox', label: 'Inbox' },
]

export function AppShell({ children }: PropsWithChildren) {
  const [captureOpen, setCaptureOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const storeStatus = useOperationalStore((state) => state.status)
  const error = useOperationalStore((state) => state.error)

  useEffect(() => {
    if (location.pathname === '/capturar') {
      setCaptureOpen(true)
      navigate('/fazer/hoje', { replace: true })
    }
  }, [location.pathname, navigate])

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/fazer/hoje" className="brand" aria-label="Olys Hoje">
          Olys
        </NavLink>

        <nav className="topbar__actions" aria-label="Acoes globais">
          <button
            className="topbar__capture"
            type="button"
            onClick={() => setCaptureOpen(true)}
          >
            Capturar
          </button>
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

      <button
        className="capture-fab"
        type="button"
        aria-label="Abrir captura"
        onClick={() => setCaptureOpen(true)}
      >
        Capturar
      </button>

      <CaptureSheet open={captureOpen} onClose={() => setCaptureOpen(false)} />
    </div>
  )
}
