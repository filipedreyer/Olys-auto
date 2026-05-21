import { SkeletonBlock } from './SkeletonBlock'

export function AppLoadingState() {
  return (
    <main className="app-loading-state" role="status" aria-live="polite">
      <small>Olys</small>
      <h1>Retomando contexto</h1>
      <p>Carregando sessão e dados disponíveis. Nada será reorganizado automaticamente.</p>
      <SkeletonBlock />
    </main>
  )
}
