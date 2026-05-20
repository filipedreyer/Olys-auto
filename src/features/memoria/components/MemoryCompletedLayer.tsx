import { EmptyState } from '../../../shared/components/EmptyState'
import type { MemoryProjectionItem } from '../domain/memoryProjection'
import { MemoryItemRow } from './MemoryItemRow'

type MemoryCompletedLayerProps = {
  items: MemoryProjectionItem[]
  busy: boolean
  onRestore: (id: string) => void
}

export function MemoryCompletedLayer({ items, busy, onRestore }: MemoryCompletedLayerProps) {
  return (
    <section className="memory-layer memory-completed-layer" aria-label="Concluídos">
      <header className="memory-layer__header">
        <span>MEM05</span>
        <h2>Concluídos</h2>
        <p>Histórico operacional recuperável, sem placar ou celebração de desempenho.</p>
      </header>
      {items.length === 0 ? <EmptyState message="Nenhum concluído recuperável ainda." /> : null}
      <div className="memory-layer__content">
        {items.map((item) => (
          <MemoryItemRow
            key={item.id}
            item={item}
            mode="completed"
            busy={busy}
            onRestore={onRestore}
          />
        ))}
      </div>
    </section>
  )
}
