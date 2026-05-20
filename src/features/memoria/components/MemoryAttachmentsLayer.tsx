import type { MemoryProjectionItem } from '../domain/memoryProjection'
import { MemoryItemRow } from './MemoryItemRow'

type MemoryAttachmentsLayerProps = {
  items: MemoryProjectionItem[]
}

export function MemoryAttachmentsLayer({ items }: MemoryAttachmentsLayerProps) {
  return (
    <section className="memory-layer memory-attachments-layer" aria-label="Anexos">
      <header className="memory-layer__header">
        <span>MEM06</span>
        <h2>Anexos</h2>
        <p>Contrato futuro: privado, com metadata, permissão e rastreabilidade.</p>
      </header>
      <div className="memory-layer__content">
        {items.map((item) => (
          <MemoryItemRow key={item.id} item={item} mode="attachment" />
        ))}
      </div>
    </section>
  )
}
