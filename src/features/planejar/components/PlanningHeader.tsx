import type { PlanningProjection } from '../domain/planningProjection'
import { polishPlanningText } from './planningPresentation'

type PlanningHeaderProps = {
  projection: PlanningProjection
}

export function PlanningHeader({ projection }: PlanningHeaderProps) {
  return (
    <header className="planning-header">
      <div>
        <small>Planejar</small>
        <h1>Direção e continuidade</h1>
        <p>{polishPlanningText(projection.readings.statement)}</p>
      </div>
      <span aria-label={`${projection.activeDirectionalItems.length} itens direcionais ativos`}>
        {projection.activeDirectionalItems.length} direção(ões)
      </span>
    </header>
  )
}
