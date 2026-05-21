import { AppRouter } from './router/AppRouter'
import { AuthProvider } from '../shared/auth/AuthProvider'
import { OperationalDataProvider } from '../shared/store/OperationalDataProvider'

export function App() {
  return (
    <AuthProvider>
      <OperationalDataProvider>
        <AppRouter />
      </OperationalDataProvider>
    </AuthProvider>
  )
}
