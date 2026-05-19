import type { TimelineProjection } from '../../domain/timelineProjection'
import { TimelineEntryRow } from './TimelineEntryRow'
import { describeCapacityLoad } from './timelinePresentation'

type TimelineCapacityLensProps = {
  projection: TimelineProjection
}

export function TimelineCapacityLens({ projection }: TimelineCapacityLensProps) {
  const { capacity } = projection.readings

  return (
    <section className="timeline-capacity-lens" aria-label="Lente de capacidade">
      <header>
        <div>
          <small>Capacidade</small>
          <h2>Sustentabilidade, pressão e unknown</h2>
        </div>
        <p>{capacity.qualitativeLoad}</p>
      </header>

      <div className="timeline-capacity-lens__summary" aria-label="Resumo de capacidade">
        <span>{capacity.confidence}</span>
        <span>{capacity.committedMinutes} min declarados</span>
        <span>{capacity.unknownLoadCount} unknown</span>
        <span>{capacity.inferredLoadCount} inferidos</span>
      </div>

      <div className="timeline-capacity-lens__entries">
        {projection.entries.map((entry) => (
          <article
            key={entry.id}
            className="timeline-capacity-entry"
            data-load={typeof entry.durationMinutes === 'number' ? 'declared' : 'unknown'}
          >
            <span>{describeCapacityLoad(entry)}</span>
            <TimelineEntryRow entry={entry} detail={entry.detail} />
          </article>
        ))}
      </div>
    </section>
  )
}
