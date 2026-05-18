import { PropsWithChildren, useEffect } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { useOperationalStore } from './operationalStore'

export function OperationalDataProvider({ children }: PropsWithChildren) {
  const { status, user } = useAuth()
  const hydrate = useOperationalStore((state) => state.hydrate)
  const clearForUnauthenticated = useOperationalStore(
    (state) => state.clearForUnauthenticated,
  )

  useEffect(() => {
    if ((status === 'authenticated' || status === 'degraded') && user) {
      void hydrate(user.id)
      return
    }

    if (status === 'unauthenticated') {
      clearForUnauthenticated()
    }
  }, [clearForUnauthenticated, hydrate, status, user])

  return <>{children}</>
}
