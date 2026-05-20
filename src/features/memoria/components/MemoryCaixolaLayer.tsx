import { EmptyState } from '../../../shared/components/EmptyState'
import type { MemoryProjectionItem } from '../domain/memoryProjection'
import { MemoryItemRow } from './MemoryItemRow'

type MemoryCaixolaLayerProps = {
  items: MemoryProjectionItem[]
  busy: boolean
}

export function MemoryCaixolaLayer({ items, busy }: MemoryCaixolaLayerProps) {
  return (
    <section className="memory-layer memory-caixola-layer" aria-label="Caixola">
      <header className="memory-layer__header">
        <span>MEM02</span>
        <h2>Caixola</h2>
        <p>Fragmentos, notas soltas e revisitas controladas, sem triagem nova aqui.</p>
      </header>
      {items.length === 0 ? (
        <EmptyState message="Nenhum fragmento ou nota solta em espera." />
      ) : null}
      <div className="memory-layer__content">
        {items.map((item) => (
          <MemoryItemRow key={item.id} item={item} mode="caixola" busy={busy} />
        ))}
      </div>
    </section>
  )
}
