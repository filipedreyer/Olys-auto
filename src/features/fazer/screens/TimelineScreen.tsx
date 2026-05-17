import { useState } from 'react'
import { useOperationalStore } from '../../../shared/store/operationalStore'
import { OperationalRow } from '../components/OperationalRow'
import { TimelineLensSwitcher } from '../components/TimelineLensSwitcher'
import { TimelineLens } from '../domain/timelineLens'
import { buildTimelineProjection } from '../domain/timelineProjection'

export function TimelineScreen() {
  const items = useOperationalStore((state) => state.items)
  const [activeLens, setActiveLens] = useState<TimelineLens>('capacity')
  const projection = buildTimelineProjection(items, activeLens)

  return (
    <section className="timeline-screen">
      <header className="screen-header">
        <div>
          <small>Timeline</small>
          <h1>{projection.title}</h1>
        </div>
      </header>

      <TimelineLensSwitcher
        activeLens={activeLens}
        onChange={(lens) => setActiveLens(lens)}
      />

      <section className="reading-band" aria-label="Leitura da timeline">
        <span>{projection.readings.capacity.unknownDurationCount} unknown</span>
        <span>{projection.readings.dependencies.summary}</span>
      </section>

      <section className="surface-section">
        <div className="surface-section__content">
          {projection.entries.map((entry) => (
            <OperationalRow
              key={entry.id}
              title={entry.title}
              meta={entry.label}
              detail={entry.detail}
              state={entry.tone}
            />
          ))}
        </div>
      </section>
    </section>
  )
}
