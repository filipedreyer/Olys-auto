import { useOperationalStore } from '../../../shared/store/operationalStore'
import { OperationalRow } from '../../fazer/components/OperationalRow'
import { buildPlanningProjection } from '../domain/planningProjection'

export function PlanejarScreen() {
  const items = useOperationalStore((state) => state.items)
  const conditions = useOperationalStore((state) => state.conditions)
  const dependencies = useOperationalStore((state) => state.dependencies)
  const projection = buildPlanningProjection(items, conditions, dependencies)

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
        <span>{projection.readings.dependencies.summary}</span>
      </section>

      <section className="surface-section">
        <header className="surface-section__header">
          <h2>Projetos ativos</h2>
        </header>

        <div className="surface-section__content">
          {projection.activeDirectionalItems.map((item) => (
            <OperationalRow
              key={item.id}
              title={item.title}
              meta={item.entityType}
              detail={projection.readings.statement}
            />
          ))}
        </div>
      </section>
    </section>
  )
}
