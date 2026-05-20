import { OlysIndicator } from '../../../design-system'
import type { PlanningProjection } from '../domain/planningProjection'
import { polishPlanningText } from './planningPresentation'

type PlanningReadingsProps = {
  projection: PlanningProjection
}

export function PlanningReadings({ projection }: PlanningReadingsProps) {
  const readings = [
    {
      tone: 'direction' as const,
      label: polishPlanningText(projection.readings.direction.statement),
    },
    {
      tone: 'direction' as const,
      label: polishPlanningText(projection.readings.direction.trajectory),
    },
    {
      tone:
        projection.readings.dependencies.blocked.length > 0
          ? ('attention' as const)
          : ('direction' as const),
      label: polishPlanningText(projection.readings.dependencies.summary),
    },
    {
      tone: 'capacity' as const,
      label: `${projection.activeDirectionalItems.length} itens direcionais ativos`,
    },
  ]

  return (
    <section className="planning-readings" aria-label="Leituras de planejamento">
      {readings.map((reading) => (
        <OlysIndicator
          key={`${reading.tone}-${reading.label}`}
          tone={reading.tone}
          label={reading.label}
        />
      ))}
    </section>
  )
}
