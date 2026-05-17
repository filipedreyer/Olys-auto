import { AppRouter } from './router/AppRouter'
import { AppShell } from './shell/AppShell'

export function App() {
  return (
    <AppShell>
      <AppRouter />
    </AppShell>
  )
}
