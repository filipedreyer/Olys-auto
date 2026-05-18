import {
  DependencyEdge,
  EntityCondition,
  EntityLink,
  OlysItem,
} from '../../../domain/entities/types'
import { calculateDependencies, DependencyReading } from '../../fazer/domain/dependencies'
import {
  buildDirectionReading,
  DirectionReading,
} from '../../fazer/domain/directionReading'

export type GoalProjection = {
  id: string
  title: string
  description?: string
  status: OlysItem['status']
  qualitativeProgress: 'clear' | 'connected' | 'loose' | 'paused'
  relatedProjects: number
  relationToToday: string
}

export type ProjectProjection = {
  id: string
  title: string
  status: OlysItem['status']
  linkedGoalTitle?: string
  activeOperationalItems: number
  dependencyRisk: number
  relationToToday: string
}

export type RhythmProjection = {
  id: string
  title: string
  kind: 'habit' | 'routine'
  recurrence?: string
  reading: string
}

export type PlanningProjection = {
  goals: GoalProjection[]
  projects: ProjectProjection[]
  rhythms: RhythmProjection[]
  activeDirectionalItems: OlysItem[]
  readings: {
    direction: DirectionReading
    dependencies: DependencyReading
    statement: string
  }
}

export function buildPlanningProjection(
  items: OlysItem[],
  conditions: EntityCondition[] = [],
  dependencies: DependencyEdge[] = [],
  links: EntityLink[] = [],
): PlanningProjection {
  const activeItems = items.filter(
    (item) => item.status !== 'archived' && item.status !== 'deleted',
  )
  const goals = activeItems.filter((item) => item.entityType === 'goal')
  const projects = activeItems.filter((item) => item.entityType === 'project')
  const rhythms = activeItems.filter((item) =>
    ['habit', 'routine'].includes(item.entityType),
  )
  const activeDirectionalItems = [...goals, ...projects, ...rhythms]
  const dependencyReading = calculateDependencies(items, dependencies)
  const direction = buildDirectionReading(items, conditions, dependencies)

  return {
    goals: goals.map((goal) =>
      buildGoalProjection(goal, projects, activeItems, links),
    ),
    projects: projects.map((project) =>
      buildProjectProjection(project, goals, activeItems, dependencies, links),
    ),
    rhythms: rhythms.map(buildRhythmProjection),
    activeDirectionalItems,
    readings: {
      direction,
      dependencies: dependencyReading,
      statement:
        activeDirectionalItems.length > 0
          ? 'Planejar orienta o Fazer por direcao, projeto e ritmo'
          : 'Sem metas, projetos, habitos ou rotinas ativos',
    },
  }
}

function buildGoalProjection(
  goal: OlysItem,
  projects: OlysItem[],
  items: OlysItem[],
  links: EntityLink[],
): GoalProjection {
  const relatedProjects = projects.filter(
    (project) =>
      project.parentId === goal.id ||
      links.some(
        (link) =>
          !link.removedAt &&
          ((link.sourceEntityId === goal.id && link.targetEntityId === project.id) ||
            (link.targetEntityId === goal.id && link.sourceEntityId === project.id)),
      ),
  )
  const hasTodayContext = items.some(
    (item) =>
      item.id !== goal.id &&
      item.status === 'active' &&
      (item.parentId === goal.id ||
        relatedProjects.some((project) => project.id === item.parentId)),
  )

  return {
    id: goal.id,
    title: goal.title,
    description: goal.description,
    status: goal.status,
    qualitativeProgress: resolveGoalProgress(goal, relatedProjects.length, hasTodayContext),
    relatedProjects: relatedProjects.length,
    relationToToday: hasTodayContext
      ? 'Conectada a execucao atual'
      : 'Sem reflexo claro no Fazer de hoje',
  }
}

function buildProjectProjection(
  project: OlysItem,
  goals: OlysItem[],
  items: OlysItem[],
  dependencies: DependencyEdge[],
  links: EntityLink[],
): ProjectProjection {
  const linkedGoal = goals.find(
    (goal) =>
      project.parentId === goal.id ||
      links.some(
        (link) =>
          !link.removedAt &&
          ((link.sourceEntityId === goal.id && link.targetEntityId === project.id) ||
            (link.targetEntityId === goal.id && link.sourceEntityId === project.id)),
      ),
  )
  const relatedItems = items.filter(
    (item) => item.parentId === project.id && item.status === 'active',
  )
  const dependencyRisk = dependencies.filter(
    (edge) =>
      edge.status === 'active' &&
      !edge.removedAt &&
      (edge.predecessorId === project.id ||
        edge.successorId === project.id ||
        relatedItems.some(
          (item) =>
            edge.predecessorId === item.id || edge.successorId === item.id,
        )),
  ).length

  return {
    id: project.id,
    title: project.title,
    status: project.status,
    linkedGoalTitle: linkedGoal?.title,
    activeOperationalItems: relatedItems.length,
    dependencyRisk,
    relationToToday:
      relatedItems.length > 0
        ? `${relatedItems.length} item(ns) ativo(s) conectam projeto ao Fazer`
        : 'Projeto ainda sem item operacional ativo',
  }
}

function buildRhythmProjection(item: OlysItem): RhythmProjection {
  const kind = item.entityType === 'habit' ? 'habit' : 'routine'

  return {
    id: item.id,
    title: item.title,
    kind,
    recurrence: item.recurrenceRule,
    reading:
      kind === 'habit'
        ? 'Habito como ritmo contextual, sem score ou streak'
        : 'Rotina como agrupamento operacional, sem checklist ornamental',
  }
}

function resolveGoalProgress(
  goal: OlysItem,
  relatedProjects: number,
  hasTodayContext: boolean,
): GoalProjection['qualitativeProgress'] {
  if (goal.status === 'paused') {
    return 'paused'
  }

  if (relatedProjects > 0 && hasTodayContext) {
    return 'connected'
  }

  if (relatedProjects > 0) {
    return 'clear'
  }

  return 'loose'
}
