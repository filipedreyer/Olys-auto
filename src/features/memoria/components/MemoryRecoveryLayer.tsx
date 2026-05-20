import { EmptyState } from '../../../shared/components/EmptyState'
import type { MemoryProjectionItem } from '../domain/memoryProjection'
import { MemoryItemRow } from './MemoryItemRow'

type MemoryRecoveryLayerProps = {
  items: MemoryProjectionItem[]
  busy: boolean
  onRestore: (id: string) => void
}

export function MemoryRecoveryLayer({ items, busy, onRestore }: MemoryRecoveryLayerProps) {
  return (
    <section className="memory-layer memory-recovery-layer" aria-label="Recuperação">
      <header className="memory-layer__header">
        <span>Recuperação</span>
        <h2>Contexto que pode voltar ao fluxo</h2>
      </header>
      {items.length === 0 ? (
        <EmptyState message="Nada recuperável ainda; a Memória cresce pelo ciclo de vida real." />
      ) : null}
      <div className="memory-layer__content">
        {items.map((item) => (
          <MemoryItemRow
            key={item.id}
            item={item}
            mode="search"
            busy={busy}
            onRestore={onRestore}
          />
        ))}
      </div>
    </section>
  )
}
