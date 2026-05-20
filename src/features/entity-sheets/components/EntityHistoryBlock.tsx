import type { EntitySheetHistoryEntry } from '../domain/entitySheetTypes'

type EntityHistoryBlockProps = {
  events: readonly EntitySheetHistoryEntry[]
}

export function EntityHistoryBlock({ events }: EntityHistoryBlockProps) {
  return (
    <section className="entity-sheet-section entity-history-block" aria-label="Histórico">
      <header>
        <small>Histórico</small>
        <h3>Event log minimizado</h3>
      </header>

      {events.length === 0 ? (
        <p>Histórico depende de event log carregado; texto sensível bruto não será exibido aqui.</p>
      ) : null}

      {events.map((event) => (
        <article key={event.id} className="entity-sheet-mini-row">
          <strong>{event.changeType}</strong>
          <span>{event.actor} / {event.createdAt}</span>
          <small>{event.sourceContext}</small>
        </article>
      ))}
    </section>
  )
}
