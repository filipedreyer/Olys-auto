import { OlysIndicator } from '../../../../design-system'
import type { TimelineProjection } from '../../domain/timelineProjection'

type TimelineReadingsProps = {
  readings: TimelineProjection['readings']
}

export function TimelineReadings({ readings }: TimelineReadingsProps) {
  const indicators = [
    {
      tone: 'capacity' as const,
      label: readings.capacity.qualitativeLoad,
    },
    {
      tone: readings.capacity.unknownLoadCount > 0 ? ('unknown' as const) : ('capacity' as const),
      label: `${readings.capacity.unknownLoadCount} carga(s) unknown`,
    },
    {
      tone: readings.dependencies.blocked.length > 0 ? ('attention' as const) : ('direction' as const),
      label: readings.dependencies.summary,
    },
    {
      tone: 'direction' as const,
      label: readings.direction.trajectory,
    },
  ]

  return (
    <section className="timeline-readings" aria-label="Leituras da Timeline">
      {indicators.map((indicator) => (
        <OlysIndicator
          key={`${indicator.tone}-${indicator.label}`}
          tone={indicator.tone}
          label={indicator.label}
        />
      ))}
    </section>
  )
}
