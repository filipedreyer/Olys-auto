import { useMemo, useState } from 'react'
import { EmptyState } from '../../../shared/components/EmptyState'
import type { MemoryProjectionItem } from '../domain/memoryProjection'
import { itemSearchText } from './memoryPresentation'
import { MemoryItemRow } from './MemoryItemRow'

type MemorySearchLayerProps = {
  items: MemoryProjectionItem[]
  busy: boolean
  onRestore: (id: string) => void
  onReuse: (id: string) => void
}

export function MemorySearchLayer({
  items,
  busy,
  onRestore,
  onReuse,
}: MemorySearchLayerProps) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (!normalized) {
      return items.slice(0, 6)
    }

    return items.filter((item) => itemSearchText(item).includes(normalized)).slice(0, 8)
  }, [items, query])

  return (
    <section className="memory-layer memory-search-layer" aria-label="Busca em Memória">
      <header className="memory-layer__header">
        <span>MEM07</span>
        <h2>Busca em Memória</h2>
        <p>Filtro local sobre contexto já carregado: texto, origem, status, entidade e ação.</p>
      </header>
      <label className="memory-search-control">
        <span>Buscar contexto</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Origem, status, entidade ou título"
          type="search"
        />
      </label>
      {results.length === 0 ? (
        <EmptyState message="Nada encontrado nesta memória local." />
      ) : null}
      <div className="memory-layer__content">
        {results.map((item) => (
          <MemoryItemRow
            key={`${item.recoveryKind}-${item.id}`}
            item={item}
            mode="search"
            busy={busy}
            onRestore={onRestore}
            onReuse={onReuse}
          />
        ))}
      </div>
    </section>
  )
}
