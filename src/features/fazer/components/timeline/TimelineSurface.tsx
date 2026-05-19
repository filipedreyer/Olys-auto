import { EmptyState } from '../../../../shared/components/EmptyState'
import type { TimelineProjection } from '../../domain/timelineProjection'
import { TimelineCalendarLens } from './TimelineCalendarLens'
import { TimelineCapacityLens } from './TimelineCapacityLens'
import { TimelineDependencyLens } from './TimelineDependencyLens'

type TimelineSurfaceProps = {
  projection: TimelineProjection
}

export function TimelineSurface({ projection }: TimelineSurfaceProps) {
  return (
    <section className="timeline-surface" aria-label="Superfície temporal operacional">
      {projection.entries.length === 0 ? (
        <EmptyState message="Nada nesta lente; a Timeline permanece como leitura operacional, não calendário vazio." />
      ) : null}

      {projection.activeLens === 'capacity' ? (
        <TimelineCapacityLens projection={projection} />
      ) : null}

      {projection.activeLens === 'dependency' ? (
        <TimelineDependencyLens projection={projection} />
      ) : null}

      {projection.activeLens === 'calendar' ? (
        <TimelineCalendarLens projection={projection} />
      ) : null}
    </section>
  )
}
