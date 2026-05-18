import { useOperationalStore } from '../../../shared/store/operationalStore'
import { OperationalRow } from '../../fazer/components/OperationalRow'
import { buildPlanningProjection } from '../domain/planningProjection'

export function PlanejarScreen() {
  const items = useOperationalStore((state) => state.items)
  const conditions = useOperationalStore((state) => state.conditions)
  const dependencies = useOperationalStore((state) => state.dependencies)
  const links = useOperationalStore((state) => state.links)
  const projection = buildPlanningProjection(items, conditions, dependencies, links)

  return (
    <section className="planejar-screen">
      <header className="screen-header">
        <div>
          <small>Planejar</small>
          <h1>Direcao e sequencia</h1>
        </div>
      </header>

      <section className="reading-band" aria-label="Leitura de planejamento">
        <span>{projection.readings.direction.statement}</span>
        <span>{projection.readings.direction.trajectory}</span>
        <span>{projection.readings.dependencies.summary}</span>
      </section>

      <section className="surface-section">
        <header className="surface-section__header">
          <h2>Metas relevantes</h2>
        </header>

        <div className="surface-section__content">
          {projection.goals.map((goal) => (
            <OperationalRow
              key={goal.id}
              title={goal.title}
              meta={goal.qualitativeProgress}
              detail={goal.relationToToday}
            />
          ))}
        </div>
      </section>

      <section className="surface-section">
        <header className="surface-section__header">
          <h2>Projetos ativos</h2>
        </header>

        <div className="surface-section__content">
          {projection.projects.map((project) => (
            <OperationalRow
              key={project.id}
              title={project.title}
              meta={project.linkedGoalTitle ?? 'projeto'}
              detail={project.relationToToday}
              state={project.dependencyRisk > 0 ? 'attention' : 'default'}
            />
          ))}
        </div>
      </section>

      <section className="surface-section">
        <header className="surface-section__header">
          <h2>Habitos e rotinas</h2>
        </header>

        <div className="surface-section__content">
          {projection.rhythms.map((rhythm) => (
            <OperationalRow
              key={rhythm.id}
              title={rhythm.title}
              meta={rhythm.kind}
              detail={rhythm.reading}
            />
          ))}
        </div>
      </section>
    </section>
  )
}
