import {
  DIRECTIONAL_ENTITY_TYPES,
  DependencyEdge,
  DirectionState,
  EntityCondition,
  OlysItem,
} from '../../../domain/entities/types'
import { hasActiveCondition } from './eligibility'

export type DirectionReading = {
  state: DirectionState
  protectedItems: number
  goals: number
  projects: number
  habits: number
  routines: number
  recentCompletions: number
  trajectory: string
  statement: string
}

export function buildDirectionReading(
  items: OlysItem[],
  conditions: EntityCondition[] = [],
  dependencies: DependencyEdge[] = [],
): DirectionReading {
  const activeItems = items.filter((item) => item.status === 'active')
  const protectedItems = activeItems.filter((item) =>
    hasActiveCondition(conditions, item.id, 'essential_protected'),
  ).length
  const goals = activeItems.filter((item) => item.entityType === 'goal').length
  const projects = activeItems.filter((item) => item.entityType === 'project').length
  const habits = activeItems.filter((item) => item.entityType === 'habit').length
  const routines = activeItems.filter((item) => item.entityType === 'routine').length
  const recentCompletions = items.filter(
    (item) => item.status === 'completed' && item.completedAt,
  ).length
  const hasDirectionalEntity = activeItems.some((item) =>
    DIRECTIONAL_ENTITY_TYPES.includes(
      item.entityType as (typeof DIRECTIONAL_ENTITY_TYPES)[number],
    ),
  )
  const blocksFuture = dependencies.some((edge) => edge.status === 'active')
  const trajectory = buildTrajectory({ goals, projects, habits, routines })

  if (protectedItems > 0 && (hasDirectionalEntity || blocksFuture)) {
    return {
      state: 'aligned',
      protectedItems,
      goals,
      projects,
      habits,
      routines,
      recentCompletions,
      trajectory,
      statement: 'Direcao preservada por condicao, trajetoria e sequencia',
    }
  }

  if (hasDirectionalEntity || protectedItems > 0) {
    return {
      state: 'present',
      protectedItems,
      goals,
      projects,
      habits,
      routines,
      recentCompletions,
      trajectory,
      statement: 'Direcao presente, ainda com lacunas de conexao com o hoje',
    }
  }

  return {
    state: 'absent',
    protectedItems,
    goals,
    projects,
    habits,
    routines,
    recentCompletions,
    trajectory,
    statement: 'Sem direcao operacional conectada ao hoje',
  }
}

function buildTrajectory(input: {
  goals: number
  projects: number
  habits: number
  routines: number
}) {
  const parts: string[] = []

  if (input.goals > 0) {
    parts.push(`${input.goals} meta(s) ativa(s)`)
  }

  if (input.projects > 0) {
    parts.push(`${input.projects} projeto(s) ativo(s)`)
  }

  if (input.habits + input.routines > 0) {
    parts.push(`${input.habits + input.routines} ritmo(s) operacional(is)`)
  }

  return parts.length > 0
    ? parts.join(' · ')
    : 'Sem horizonte medio conectado'
}
