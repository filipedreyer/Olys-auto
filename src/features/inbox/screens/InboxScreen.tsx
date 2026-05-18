import { EmptyState } from '../../../shared/components/EmptyState'
import { useOperationalStore } from '../../../shared/store/operationalStore'
import { OperationalRow } from '../../fazer/components/OperationalRow'
import { buildInboxProjection } from '../domain/inboxProjection'

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
        <header className="surface-section__header">
          <h2>Em triagem</h2>
        </header>

        <div className="surface-section__content">
          {projection.triageItems.length === 0 ? (
            <EmptyState message="Nenhuma entrada nova aguardando decisao." />
          ) : null}

          {projection.triageItems.map((item) => (
            <article key={item.id} className="triage-row">
              <OperationalRow
                title={item.text}
                meta={`${item.origin} - ${item.capturedAt}`}
                detail={item.detail}
              />

              <div className="triage-row__actions">
                <button type="button" onClick={() => triageInboxItem(item.id, 'keep')}>
                  Manter
                </button>
                <button
                  type="button"
                  onClick={() =>
                    triageInboxItem(item.id, 'convert', item.suggestedType ?? 'task')
                  }
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

      <section className="surface-section">
        <header className="surface-section__header">
          <h2>Revisita controlada</h2>
        </header>

        <div className="surface-section__content">
          {projection.revisitItems.length === 0 ? (
            <EmptyState message="Nada mantido ou adiado competindo por atencao." />
          ) : null}

          {projection.revisitItems.map((item) => (
            <article key={item.id} className="triage-row">
              <OperationalRow
                title={item.text}
                meta={`${item.status} - ${item.capturedAt}`}
                detail={item.detail}
                state={item.status === 'postponed' ? 'paused' : 'default'}
              />

              <div className="triage-row__actions">
                <button
                  type="button"
                  onClick={() =>
                    triageInboxItem(item.id, 'convert', item.suggestedType ?? 'task')
                  }
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
