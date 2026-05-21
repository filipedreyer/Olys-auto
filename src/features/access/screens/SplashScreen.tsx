import { Navigate } from 'react-router-dom'
import { AccessCard } from '../components/AccessCard'
import { AccessShell } from '../components/AccessShell'
import { AccessTrustBlock } from '../components/AccessTrustBlock'
import { useAuth } from '../../../shared/auth/AuthProvider'
import { AppLoadingState } from '../../system-states/components/AppLoadingState'

export function SplashScreen() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <AppLoadingState />
  }

  if (status === 'authenticated' || status === 'degraded') {
    return <Navigate to="/fazer/hoje" replace />
  }

  if (status === 'expired') {
    return <Navigate to="/session-expired" replace />
  }

  return (
    <AccessShell>
      <AccessCard
        eyebrow="AC01"
        title="Olys"
        description="Entre para retomar seu contexto sem reorganizar nada automaticamente."
        aside={<AccessTrustBlock />}
      >
        <Navigate to="/login" replace />
      </AccessCard>
    </AccessShell>
  )
}
