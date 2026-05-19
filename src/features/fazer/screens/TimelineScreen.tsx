import { useState } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'
import { EmptyState } from '../../../shared/components/EmptyState'
import { useOperationalStore } from '../../../shared/store/operationalStore'
import { OperationalRow } from '../components/OperationalRow'
import { TimelineLensSwitcher } from '../components/TimelineLensSwitcher'
import { TimelineEntry } from '../domain/timelineProjection'
import { TimelineLens } from '../domain/timelineLens'
import { buildTimelineProjection } from '../domain/timelineProjection'

export function TimelineScreen() {
  const items = useOperationalStore((state) => state.items)
  const conditions = useOperationalStore((state) => state.conditions)
  const dependencies = useOperationalStore((state) => state.dependencies)
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeLens, setActiveLens] = useState<TimelineLens>(
    resolveLens(searchParams.get('lens')),
  )
  const projection = buildTimelineProjection(
    items,
    conditions,
    dependencies,
    activeLens,
  )

  return (
    <section className="timeline-screen timeline-field">
      <header className="fazer-header">
        <div className="fazer-header__topline">
          <nav className="fazer-tabs" aria-label="Fazer">
            <NavLink to="/fazer/hoje">Hoje</NavLink>
            <NavLink to="/fazer/timeline">Timeline</NavLink>
          </nav>
          <TimelineLensSwitcher
            activeLens={activeLens}
            onChange={(lens) => {
              setActiveLens(lens)
              setSearchParams({ lens })
            }}
          />
        </div>

        <div className="fazer-header__body">
          <div>
            <small>Timeline</small>
            <h1>{projection.title}</h1>
            <p>{projection.readings.direction.statement}</p>
          </div>
        </div>

        <section className="timeline-readings" aria-label="Leitura da timeline">
          <span>{projection.readings.capacity.unknownLoadCount} unknown</span>
          <span>{projection.readings.capacity.qualitativeLoad}</span>
          <span>{projection.readings.dependencies.summary}</span>
        </section>
      </header>

      {projection.entries.length === 0 ? (
        <EmptyState message="Nada nesta lens; a Timeline permanece como leitura operacional, nao calendario vazio." />
      ) : null}

      {activeLens === 'capacity' ? (
        <CapacityField entries={projection.entries} />
      ) : null}

      {activeLens === 'dependency' ? (
        <DependencyChain entries={projection.entries} />
      ) : null}

      {activeLens === 'calendar' ? (
        <CalendarField entries={projection.entries} />
      ) : null}
    </section>
  )
}

function CapacityField({ entries }: { entries: TimelineEntry[] }) {
  return (
    <section className="capacity-field" aria-label="Campo de capacidade">
      {entries.map((entry, index) => (
        <article
          key={entry.id}
          className={`capacity-node capacity-node--${resolvePressure(index, entry)}`}
        >
          <span>{entry.label}</span>
          <strong>{entry.title}</strong>
          <small>{entry.detail}</small>
        </article>
      ))}
    </section>
  )
}

function DependencyChain({ entries }: { entries: TimelineEntry[] }) {
  return (
    <section className="dependency-chain" aria-label="Cadeia de dependencias">
      {entries.map((entry, index) => (
        <article
          key={entry.id}
          className={`dependency-chain__node dependency-chain__node--depth-${Math.min(
            index,
            3,
          )}`}
        >
          <span>Sequencia {index + 1}</span>
          <strong>{entry.title}</strong>
          <small>{entry.label}</small>
          <p>{entry.detail}</p>
        </article>
      ))}
    </section>
  )
}

function CalendarField({ entries }: { entries: TimelineEntry[] }) {
  return (
    <section className="calendar-field" aria-label="Campo temporal operacional">
      {entries.map((entry) => (
        <OperationalRow
          key={entry.id}
          title={entry.title}
          meta={entry.label}
          detail={entry.detail}
          state={entry.tone}
          entityType="unclassified"
          size="compact"
        />
      ))}
    </section>
  )
}

function resolvePressure(index: number, entry: TimelineEntry) {
  if (entry.label.includes('unknown')) {
    return 'unknown'
  }

  if (index === 0) {
    return 'focus'
  }

  return 'distributed'
}

function resolveLens(value: string | null): TimelineLens {
  if (value === 'calendar' || value === 'capacity' || value === 'dependency') {
    return value
  }

  return 'capacity'
}
