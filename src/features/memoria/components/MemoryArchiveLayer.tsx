import { EmptyState } from '../../../shared/components/EmptyState'
import type { MemoryProjectionItem } from '../domain/memoryProjection'
import { MemoryItemRow } from './MemoryItemRow'

type MemoryArchiveLayerProps = {
  items: MemoryProjectionItem[]
  busy: boolean
  onRestore: (id: string) => void
}

export function MemoryArchiveLayer({ items, busy, onRestore }: MemoryArchiveLayerProps) {
  return (
    <section className="memory-layer memory-archive-layer" aria-label="Arquivados">
      <header className="memory-layer__header">
        <span>MEM04</span>
        <h2>Arquivados</h2>
        <p>Fora do fluxo ativo, ainda com rastro e possibilidade de recuperação.</p>
      </header>
      {items.length === 0 ? <EmptyState message="Nada arquivado neste momento." /> : null}
      <div className="memory-layer__content">
        {items.map((item) => (
          <MemoryItemRow
            key={item.id}
            item={item}
            mode="archived"
            busy={busy}
            onRestore={onRestore}
          />
        ))}
      </div>
    </section>
  )
}
