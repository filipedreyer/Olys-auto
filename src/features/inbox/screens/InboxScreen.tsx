import { useOperationalStore } from '../../../shared/store/operationalStore'
import { OperationalRow } from '../../fazer/components/OperationalRow'
import { buildInboxProjection } from '../domain/inboxTriage'

export function InboxScreen() {
  const inboxItems = useOperationalStore((state) => state.inboxItems)
  const triageInboxItem = useOperationalStore((state) => state.triageInboxItem)
  const projection = buildInboxProjection(inboxItems)

  return (
    <section className="inbox-screen">
      <header className="screen-header">
        <div>
          <small>Inbox</small>
          <h1>Triagem</h1>
        </div>
        <span className="quiet-status">{projection.readings.pending} entrada(s)</span>
      </header>

      <p className="surface-note">{projection.readings.statement}</p>

      <section className="surface-section">
        <div className="surface-section__content">
          {projection.triageItems.map((item) => (
            <article key={item.id} className="triage-row">
              <OperationalRow
                title={item.text}
                meta={item.createdAt ?? item.sourceContext}
                detail="Decidir destino antes de virar trabalho"
              />

              <div className="triage-row__actions">
                <button type="button" onClick={() => triageInboxItem(item.id, 'keep')}>
                  Manter
                </button>
                <button
                  type="button"
                  onClick={() => triageInboxItem(item.id, 'convert', 'task')}
                >
                  Converter
                </button>
                <button
                  type="button"
                  onClick={() => triageInboxItem(item.id, 'complete')}
                >
                  Concluir
                </button>
                <button
                  type="button"
                  onClick={() => triageInboxItem(item.id, 'postpone')}
                >
                  Adiar
                </button>
                <button
                  type="button"
                  onClick={() => triageInboxItem(item.id, 'discard')}
                >
                  Descartar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
