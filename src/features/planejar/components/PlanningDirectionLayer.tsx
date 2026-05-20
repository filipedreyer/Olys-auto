import type { PlanningProjection } from '../domain/planningProjection'
import { polishPlanningText } from './planningPresentation'

type PlanningDirectionLayerProps = {
  projection: PlanningProjection
}

export function PlanningDirectionLayer({ projection }: PlanningDirectionLayerProps) {
  return (
    <section className="planning-direction-layer" aria-label="Continuidade operacional">
      <span>{polishPlanningText(projection.readings.direction.trajectory)}</span>
      <strong>{projection.activeDirectionalItems.length}</strong>
      <p>{polishPlanningText(projection.readings.statement)}</p>
    </section>
  )
}
