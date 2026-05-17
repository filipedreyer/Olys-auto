import { useOperationalStore } from '../../../shared/store/operationalStore'
import { buildMemoryProjection } from '../domain/memoryProjection'

export function MemoriaScreen() {
  const items = useOperationalStore((state) => state.items)
  const projection = buildMemoryProjection(items)

  return (
    <section className="memoria-screen">
      <header className="screen-header">
        <div>
          <small>Memoria</small>
          <h1>Continuidade contextual</h1>
        </div>
      </header>

      <section className="memory-surface">
        {projection.groups.map((group) => (
          <article key={group.id} className="memory-item">
            <strong>
              {group.label} <span>{group.count}</span>
            </strong>
            <p>{group.description}</p>
          </article>
        ))}
      </section>
    </section>
  )
}
