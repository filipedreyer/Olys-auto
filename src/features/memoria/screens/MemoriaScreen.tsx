import { useOperationalStore } from '../../../shared/store/operationalStore'
import { EmptyState } from '../../../shared/components/EmptyState'
import { OperationalRow } from '../../fazer/components/OperationalRow'
import { buildMemoryProjection } from '../domain/memoryProjection'

export function MemoriaScreen() {
  const items = useOperationalStore((state) => state.items)
  const inboxItems = useOperationalStore((state) => state.inboxItems)
  const links = useOperationalStore((state) => state.links)
  const dependencies = useOperationalStore((state) => state.dependencies)
  const status = useOperationalStore((state) => state.status)
  const restoreItem = useOperationalStore((state) => state.restoreItem)
  const reuseTemplate = useOperationalStore((state) => state.reuseTemplate)
  const projection = buildMemoryProjection(items, inboxItems, links, dependencies)
  const busy = status === 'loading'

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

      <p className="surface-note">{projection.continuity.statement}</p>

      <section className="surface-section">
        <header className="surface-section__header">
          <h2>Recuperacao</h2>
        </header>

        <div className="surface-section__content">
          {projection.recovery.length === 0 ? (
            <EmptyState message="Nada recuperavel ainda; a Memoria cresce pelo ciclo de vida real." />
          ) : null}

          {projection.recovery.map((item) => (
            <article key={item.id} className="triage-row">
              <OperationalRow
                title={item.title}
                meta={item.meta}
                detail={item.detail}
              />
              <div className="triage-row__actions">
                <button
                  disabled={busy}
                  type="button"
                  onClick={() => void restoreItem(item.id)}
                >
                  Restaurar contexto
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-section">
        <header className="surface-section__header">
          <h2>Caixola</h2>
        </header>

        <div className="surface-section__content">
          {projection.caixola.length === 0 ? (
            <EmptyState message="Nenhum fragmento ou nota solta em espera." />
          ) : null}

          {projection.caixola.map((item) => (
            <OperationalRow
              key={item.id}
              title={item.title}
              meta={item.meta}
              detail={item.detail}
            />
          ))}
        </div>
      </section>

      <section className="surface-section">
        <header className="surface-section__header">
          <h2>Templates</h2>
        </header>

        <div className="surface-section__content">
          {projection.templates.length === 0 ? (
            <EmptyState message="Nenhum template reutilizavel neste momento." />
          ) : null}

          {projection.templates.map((item) => (
            <article key={item.id} className="triage-row">
              <OperationalRow
                title={item.title}
                meta={item.meta}
                detail={item.detail}
              />
              <div className="triage-row__actions">
                <button
                  disabled={busy}
                  type="button"
                  onClick={() => void reuseTemplate(item.id)}
                >
                  Reutilizar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
