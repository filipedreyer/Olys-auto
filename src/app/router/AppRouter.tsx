import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { CapturarScreen } from '../../features/capturar/screens/CapturarScreen'
import { CentralScreen } from '../../features/central/screens/CentralScreen'
import { SplashScreen } from '../../features/access/screens/SplashScreen'
import { LoginScreen } from '../../features/access/screens/LoginScreen'
import { SignupScreen } from '../../features/access/screens/SignupScreen'
import { PasswordRecoveryScreen } from '../../features/access/screens/PasswordRecoveryScreen'
import { OnboardingScreen } from '../../features/access/screens/OnboardingScreen'
import { SessionExpiredScreen } from '../../features/access/screens/SessionExpiredScreen'
import { HojeScreen } from '../../features/fazer/screens/HojeScreen'
import { TimelineScreen } from '../../features/fazer/screens/TimelineScreen'
import { InboxScreen } from '../../features/inbox/screens/InboxScreen'
import { MemoriaScreen } from '../../features/memoria/screens/MemoriaScreen'
import { PlanejarScreen } from '../../features/planejar/screens/PlanejarScreen'
import { PwaInstallScreen } from '../../features/pwa/screens/PwaInstallScreen'
import { AppLoadingState } from '../../features/system-states/components/AppLoadingState'
import { ConfigurationErrorScreen } from '../../features/system-states/components/ConfigurationErrorScreen'
import { AppShell } from '../shell/AppShell'
import { useAuth } from '../../shared/auth/AuthProvider'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AuthEntry />} />
      <Route path="/splash" element={<SplashScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/recover" element={<PasswordRecoveryScreen />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />
      <Route path="/session-expired" element={<SessionExpiredScreen />} />
      <Route path="/install" element={<PwaInstallScreen />} />
      <Route path="/configuration-error" element={<ConfigurationErrorScreen />} />

      <Route path="/fazer" element={<Navigate to="/fazer/hoje" replace />} />
      <Route path="/fazer/hoje" element={<PrivateRoute><HojeScreen /></PrivateRoute>} />
      <Route path="/fazer/timeline" element={<PrivateRoute><TimelineScreen /></PrivateRoute>} />
      <Route path="/capturar" element={<PrivateRoute><CapturarScreen /></PrivateRoute>} />
      <Route path="/memoria/inbox" element={<PrivateRoute><InboxScreen /></PrivateRoute>} />
      <Route path="/planejar" element={<PrivateRoute><PlanejarScreen /></PrivateRoute>} />
      <Route path="/memoria" element={<PrivateRoute><MemoriaScreen /></PrivateRoute>} />
      <Route path="/central" element={<PrivateRoute><CentralScreen /></PrivateRoute>} />

      <Route path="/hoje" element={<Navigate to="/fazer/hoje" replace />} />
      <Route path="/timeline" element={<Navigate to="/fazer/timeline" replace />} />
      <Route path="/inbox" element={<Navigate to="/memoria/inbox" replace />} />
      <Route path="*" element={<Navigate to="/splash" replace />} />
    </Routes>
  )
}

function AuthEntry() {
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

  if (status === 'configurationError' || status === 'recoverableError') {
    return <Navigate to="/configuration-error" replace />
  }

  return <Navigate to="/login" replace />
}

function PrivateRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth()

  if (status === 'loading') {
    return <AppLoadingState />
  }

  if (status === 'expired') {
    return <Navigate to="/session-expired" replace />
  }

  if (status === 'configurationError' || status === 'recoverableError') {
    return <ConfigurationErrorScreen />
  }

  if (status !== 'authenticated' && status !== 'degraded') {
    return <Navigate to="/login" replace />
  }

  return <AppShell>{children}</AppShell>
}
