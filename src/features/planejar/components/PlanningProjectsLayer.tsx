import { EmptyState } from '../../../shared/components/EmptyState'
import type { ProjectProjection } from '../domain/planningProjection'
import { PlanningEntityRow } from './PlanningEntityRow'
import {
  getProjectSignals,
  polishPlanningText,
  resolveProjectState,
} from './planningPresentation'

type PlanningProjectsLayerProps = {
  projects: ProjectProjection[]
}

export function PlanningProjectsLayer({ projects }: PlanningProjectsLayerProps) {
  return (
    <section className="planning-section planning-projects-layer" aria-label="Projetos ativos">
      <header className="planning-section__header">
        <div>
          <small>Projetos</small>
          <h2>Conexão entre direção e execução</h2>
        </div>
        <strong>{projects.length}</strong>
      </header>

      <div className="planning-section__content">
        {projects.length === 0 ? (
          <EmptyState message="Nenhum projeto ativo conectado à execução." />
        ) : null}

        {projects.map((project) => (
          <PlanningEntityRow
            key={project.id}
            entityType="project"
            title={project.title}
            context={project.linkedGoalTitle ?? 'Sem meta vinculada'}
            detail={`${project.activeOperationalItems} item(ns) operacional(is) ativo(s)`}
            relation={
              project.dependencyRisk > 0
                ? `${project.dependencyRisk} risco(s) de dependência · ${polishPlanningText(project.relationToToday)}`
                : polishPlanningText(project.relationToToday)
            }
            state={resolveProjectState(project)}
            signals={getProjectSignals(project)}
            itemId={project.id}
          />
        ))}
      </div>
    </section>
  )
}
