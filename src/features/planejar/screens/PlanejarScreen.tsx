import { useOperationalStore } from '../../../shared/store/operationalStore'
import { buildMemoryProjection } from '../../memoria/domain/memoryProjection'
import { WeeklyReviewLayer } from '../../weekly-review/components/WeeklyReviewLayer'
import { buildWeeklyReviewProjection } from '../../weekly-review/domain/weeklyReviewProjection'
import { PlanningDirectionLayer } from '../components/PlanningDirectionLayer'
import { PlanningGoalsLayer } from '../components/PlanningGoalsLayer'
import { PlanningHeader } from '../components/PlanningHeader'
import { PlanningProjectsLayer } from '../components/PlanningProjectsLayer'
import { PlanningReadings } from '../components/PlanningReadings'
import { PlanningRhythmsLayer } from '../components/PlanningRhythmsLayer'
import { buildPlanningProjection } from '../domain/planningProjection'

export function PlanejarScreen() {
  const items = useOperationalStore((state) => state.items)
  const inboxItems = useOperationalStore((state) => state.inboxItems)
  const conditions = useOperationalStore((state) => state.conditions)
  const dependencies = useOperationalStore((state) => state.dependencies)
  const links = useOperationalStore((state) => state.links)
  const dailySessions = useOperationalStore((state) => state.dailySessions)
  const projection = buildPlanningProjection(items, conditions, dependencies, links)
  const memoryProjection = buildMemoryProjection(items, inboxItems, links, dependencies)
  const weeklyReviewProjection = buildWeeklyReviewProjection({
    items,
    conditions,
    dependencies,
    links,
    dailySessions,
    inboxItems,
    memoryProjection,
    planningProjection: projection,
  })

  return (
    <section className="planejar-screen">
      <PlanningHeader projection={projection} />
      <PlanningReadings projection={projection} />
      <PlanningDirectionLayer projection={projection} />
      <PlanningGoalsLayer goals={projection.goals} />
      <PlanningProjectsLayer projects={projection.projects} />
      <PlanningRhythmsLayer rhythms={projection.rhythms} />
      <WeeklyReviewLayer projection={weeklyReviewProjection} />
    </section>
  )
}
