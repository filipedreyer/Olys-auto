import { PropsWithChildren, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  BottomNavOlys,
  FloatingActionPair,
  OlysIcon,
  TopBarOlys,
  olysAssets,
} from '../../design-system'
import { CaptureSheet } from '../../features/capturar/components/CaptureSheet'
import { EntitySheetHost } from '../../features/entity-sheets/components/EntitySheetHost'
import { EntitySheetProvider } from '../../features/entity-sheets/context/EntitySheetContext'
import { IdeaDrawer } from '../../features/idea/components/IdeaDrawer'
import { OfflineBanner } from '../../features/system-states/components/OfflineBanner'
import { useAuth } from '../../shared/auth/AuthProvider'
import { useOperationalStore } from '../../shared/store/operationalStore'

const bottomNavItems = [
  {
    key: 'fazer',
    to: '/fazer/hoje',
    label: 'Fazer',
    icon: <OlysIcon src={olysAssets.nav.fazer} decorative />,
  },
  {
    key: 'planejar',
    to: '/planejar',
    label: 'Planejar',
    icon: <OlysIcon src={olysAssets.nav.planejar} decorative />,
    end: true,
  },
  {
    key: 'memoria',
    to: '/memoria',
    label: 'Memoria',
    icon: <OlysIcon src={olysAssets.nav.memoria} decorative />,
    end: true,
  },
] as const

export function AppShell({ children }: PropsWithChildren) {
  const [captureOpen, setCaptureOpen] = useState(false)
  const [ideaOpen, setIdeaOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, status: authStatus } = useAuth()
  const storeStatus = useOperationalStore((state) => state.status)
  const error = useOperationalStore((state) => state.error)
  const inboxCount = useOperationalStore((state) => state.inboxItems.length)
  const items = useOperationalStore((state) => state.items)
  const inboxItems = useOperationalStore((state) => state.inboxItems)
  const conditions = useOperationalStore((state) => state.conditions)
  const dependencies = useOperationalStore((state) => state.dependencies)
  const links = useOperationalStore((state) => state.links)
  const completeItem = useOperationalStore((state) => state.completeItem)
  const archiveItem = useOperationalStore((state) => state.archiveItem)
  const restoreItem = useOperationalStore((state) => state.restoreItem)
  const softDeleteItem = useOperationalStore((state) => state.softDeleteItem)
  const applyEssentialProtected = useOperationalStore((state) => state.applyEssentialProtected)
  const removeEssentialProtected = useOperationalStore((state) => state.removeEssentialProtected)

  useEffect(() => {
    if (location.pathname === '/capturar') {
      setCaptureOpen(true)
      navigate('/fazer/hoje', { replace: true })
    }
  }, [location.pathname, navigate])

  const hasPendingInbox = inboxCount > 0

  return (
    <EntitySheetProvider>
      <div className="app-shell app-shell--olys">
      <OfflineBanner />
      <TopBarOlys
        menu={
          <button className="shell-icon-button shell-icon-button--menu" type="button" aria-label="Abrir menu">
            <span aria-hidden="true" />
          </button>
        }
        acesso={
          <button
            className="shell-icon-button"
            type="button"
            aria-label={authStatus === 'authenticated' ? 'Sair do acesso' : 'Acesso local ou login'}
            onClick={() => {
              if (authStatus === 'authenticated') {
                void logout()
                return
              }

              void navigate('/login')
            }}
          >
            <OlysIcon src={olysAssets.nav.acesso} decorative />
          </button>
        }
        inbox={
          <button
            className="shell-icon-button shell-icon-button--inbox"
            type="button"
            aria-label={hasPendingInbox ? `Inbox com ${inboxCount} itens pendentes` : 'Inbox sem itens pendentes'}
            onClick={() => void navigate('/memoria/inbox')}
          >
            <OlysIcon src={olysAssets.nav.inbox} decorative />
            {hasPendingInbox ? <span className="shell-inbox-dot" aria-hidden="true" /> : null}
          </button>
        }
        search={
          <button
            className="shell-icon-button shell-icon-button--search"
            type="button"
            aria-label="Busca estrutural ainda nao implementada"
            aria-disabled="true"
          >
            <span aria-hidden="true" />
          </button>
        }
      />

      <main className="app-shell__main">
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

      <BottomNavOlys items={bottomNavItems} />

      <FloatingActionPair
        idea={
          <button className="shell-floating-action shell-floating-action--idea" type="button" aria-label="Abrir Idea" onClick={() => setIdeaOpen(true)}>
            <OlysIcon src={olysAssets.nav.idea} decorative />
          </button>
        }
        capturar={
          <button
            className="shell-floating-action shell-floating-action--capture"
            type="button"
            aria-label="Abrir captura"
            onClick={() => setCaptureOpen(true)}
          >
            <OlysIcon src={olysAssets.nav.capturar} decorative />
          </button>
        }
      />

      <CaptureSheet open={captureOpen} onClose={() => setCaptureOpen(false)} />

      <IdeaDrawer
        open={ideaOpen}
        onClose={() => setIdeaOpen(false)}
        currentPath={location.pathname}
        items={items}
        inboxItems={inboxItems}
        conditions={conditions}
        dependencies={dependencies}
        links={links}
      />
        <EntitySheetHost
          items={items}
          conditions={conditions}
          links={links}
          dependencies={dependencies}
          busy={storeStatus === 'loading'}
          actions={{
            completeItem,
            archiveItem,
            restoreItem,
            softDeleteItem,
            applyEssentialProtected,
            removeEssentialProtected,
          }}
        />
      </div>
    </EntitySheetProvider>
  )
}
