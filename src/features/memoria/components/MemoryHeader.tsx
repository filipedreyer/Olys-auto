import type { MemoryProjection } from '../domain/memoryProjection'

type MemoryHeaderProps = {
  projection: MemoryProjection
}

export function MemoryHeader({ projection }: MemoryHeaderProps) {
  return (
    <header className="memory-header">
      <div>
        <small>Memória</small>
        <h1>Recuperação operacional</h1>
        <p>{projection.continuity.statement}</p>
      </div>
      <strong aria-label={`${projection.continuity.recoverable} itens recuperáveis`}>
        {projection.continuity.recoverable}
      </strong>
    </header>
  )
}
