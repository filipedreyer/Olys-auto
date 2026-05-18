import { AppRouter } from './router/AppRouter'
import { AppShell } from './shell/AppShell'
import { AuthProvider } from '../shared/auth/AuthProvider'
import { OperationalDataProvider } from '../shared/store/OperationalDataProvider'

export function App() {
  return (
    <AuthProvider>
      <OperationalDataProvider>
        <AppShell>
          <AppRouter />
        </AppShell>
      </OperationalDataProvider>
    </AuthProvider>
  )
}
