import type { TimelineProjection } from '../../domain/timelineProjection'
import { TimelineEntryRow, getTimelineTemporalLabel } from './TimelineEntryRow'

type TimelineCalendarLensProps = {
  projection: TimelineProjection
}

export function TimelineCalendarLens({ projection }: TimelineCalendarLensProps) {
  return (
    <section className="timeline-calendar-lens" aria-label="Lente de calendário operacional">
      <header>
        <div>
          <small>Calendário operacional</small>
          <h2>Janelas, datas e presença temporal</h2>
        </div>
        <p>Campo temporal sem grade genérica; só informação já declarada.</p>
      </header>

      <div className="timeline-calendar-lens__entries">
        {projection.entries.map((entry) => (
          <article key={entry.id} className="timeline-entry-row">
            <span>{getTimelineTemporalLabel(entry)}</span>
            <TimelineEntryRow entry={entry} detail={entry.detail} />
          </article>
        ))}
      </div>
    </section>
  )
}
