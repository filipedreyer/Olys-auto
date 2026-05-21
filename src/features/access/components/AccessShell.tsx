import type { PropsWithChildren } from 'react'
import { OlysIcon, olysAssets } from '../../../design-system'
import { OfflineBanner } from '../../system-states/components/OfflineBanner'

export function AccessShell({ children }: PropsWithChildren) {
  return (
    <main className="access-shell">
      <OfflineBanner />
      <div className="access-shell__brand" aria-label="Olys">
        <OlysIcon src={olysAssets.logo.primary} label="Olys" />
      </div>
      <div className="access-shell__content">{children}</div>
    </main>
  )
}
