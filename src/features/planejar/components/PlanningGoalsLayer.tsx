import { EmptyState } from '../../../shared/components/EmptyState'
import type { GoalProjection } from '../domain/planningProjection'
import { PlanningEntityRow } from './PlanningEntityRow'
import {
  describeGoalProgress,
  getGoalSignals,
  polishPlanningText,
  resolveGoalState,
} from './planningPresentation'

type PlanningGoalsLayerProps = {
  goals: GoalProjection[]
}

export function PlanningGoalsLayer({ goals }: PlanningGoalsLayerProps) {
  return (
    <section className="planning-section planning-goals-layer" aria-label="Metas relevantes">
      <header className="planning-section__header">
        <div>
          <small>Metas</small>
          <h2>Direção com reflexo no Fazer</h2>
        </div>
        <strong>{goals.length}</strong>
      </header>

      <div className="planning-section__content">
        {goals.length === 0 ? (
          <EmptyState message="Nenhuma meta ativa orientando o Fazer agora." />
        ) : null}

        {goals.map((goal) => (
          <PlanningEntityRow
            key={goal.id}
            entityType="goal"
            title={goal.title}
            context={describeGoalProgress(goal.qualitativeProgress)}
            detail={`${goal.relatedProjects} projeto(s) relacionado(s)`}
            relation={polishPlanningText(goal.relationToToday)}
            state={resolveGoalState(goal.qualitativeProgress)}
            signals={getGoalSignals(goal)}
            itemId={goal.id}
          />
        ))}
      </div>
    </section>
  )
}
