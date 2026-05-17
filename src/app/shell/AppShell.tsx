import { PropsWithChildren } from 'react'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <span>Olys</span>
      </header>

      <main>{children}</main>

      <nav className="bottom-nav">
        <button>Fazer</button>
        <button>Planejar</button>
        <button>Memória</button>
      </nav>
    </div>
  )
}
