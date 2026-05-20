import { EmptyState } from '../../../shared/components/EmptyState'
import type { MemoryProjectionItem } from '../domain/memoryProjection'
import { MemoryItemRow } from './MemoryItemRow'

type MemoryTemplatesLayerProps = {
  items: MemoryProjectionItem[]
  busy: boolean
  onReuse: (id: string) => void
}

export function MemoryTemplatesLayer({ items, busy, onReuse }: MemoryTemplatesLayerProps) {
  return (
    <section className="memory-layer memory-templates-layer" aria-label="Templates">
      <header className="memory-layer__header">
        <span>MEM03</span>
        <h2>Templates</h2>
        <p>Modelos reutilizáveis para estrutura operacional, sem loja ou editor complexo.</p>
      </header>
      {items.length === 0 ? (
        <EmptyState message="Nenhum template reutilizável neste momento." />
      ) : null}
      <div className="memory-layer__content">
        {items.map((item) => (
          <MemoryItemRow
            key={item.id}
            item={item}
            mode="template"
            busy={busy}
            onReuse={onReuse}
          />
        ))}
      </div>
    </section>
  )
}
