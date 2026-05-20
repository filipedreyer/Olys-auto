import { useOperationalStore } from '../../../shared/store/operationalStore'
import { PlanningDirectionLayer } from '../components/PlanningDirectionLayer'
import { PlanningGoalsLayer } from '../components/PlanningGoalsLayer'
import { PlanningHeader } from '../components/PlanningHeader'
import { PlanningProjectsLayer } from '../components/PlanningProjectsLayer'
import { PlanningReadings } from '../components/PlanningReadings'
import { PlanningRhythmsLayer } from '../components/PlanningRhythmsLayer'
import { buildPlanningProjection } from '../domain/planningProjection'

export function PlanejarScreen() {
  const items = useOperationalStore((state) => state.items)
  const conditions = useOperationalStore((state) => state.conditions)
  const dependencies = useOperationalStore((state) => state.dependencies)
  const links = useOperationalStore((state) => state.links)
  const projection = buildPlanningProjection(items, conditions, dependencies, links)

  return (
    <section className="planejar-screen">
      <PlanningHeader projection={projection} />
      <PlanningReadings projection={projection} />
      <PlanningDirectionLayer projection={projection} />
      <PlanningGoalsLayer goals={projection.goals} />
      <PlanningProjectsLayer projects={projection.projects} />
      <PlanningRhythmsLayer rhythms={projection.rhythms} />
    </section>
  )
}
