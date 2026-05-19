import { OlysIndicator } from '../../../design-system'
import type { CapacityReading } from '../domain/capacity'
import type { DependencyReading } from '../domain/dependencies'
import type { DirectionReading } from '../domain/directionReading'

type TodayIndicatorsProps = {
  capacity: CapacityReading
  dependencyRisk: DependencyReading
  direction: DirectionReading
}

export function TodayIndicators({
  capacity,
  dependencyRisk,
  direction,
}: TodayIndicatorsProps) {
  const indicators = [
    {
      tone: 'direction' as const,
      label: direction.statement,
    },
    {
      tone: capacity.confidence === 'unknown' ? ('unknown' as const) : ('capacity' as const),
      label: capacity.qualitativeLoad,
    },
    {
      tone: dependencyRisk.blocked.length > 0 ? ('attention' as const) : ('direction' as const),
      label: dependencyRisk.summary,
    },
  ]

  return (
    <section className="today-indicators" aria-label="Diagnósticos do dia">
      {indicators.map((indicator) => (
        <OlysIndicator key={indicator.label} tone={indicator.tone} label={indicator.label} />
      ))}
    </section>
  )
}
