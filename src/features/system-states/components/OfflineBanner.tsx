import { getOfflineCopy } from '../domain/systemStatePresentation'
import { useOnlineStatus } from './useOnlineStatus'

export function OfflineBanner() {
  const online = useOnlineStatus()

  if (online) {
    return null
  }

  return (
    <div className="offline-banner" role="status" aria-live="polite">
      {getOfflineCopy()}
    </div>
  )
}
