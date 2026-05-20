import type {
  DailySession,
  DependencyEdge,
  EntityCondition,
  EntityLink,
  InboxItem,
  OlysItem,
} from '../../../domain/entities/types'
import { buildCapacityReading, type CapacityReading } from '../../fazer/domain/capacity'
import { calculateDependencies } from '../../fazer/domain/dependencies'
import { buildDirectionReading, type DirectionReading } from '../../fazer/domain/directionReading'
import type { MemoryProjection } from '../../memoria/domain/memoryProjection'
import type { PlanningProjection } from '../../planejar/domain/planningProjection'
import { weeklyReplanningContract } from './replanningContract'

export type WeeklyProtectedEssential = {
  conditionId: string
  entityId: string
  title: string
  entityType: OlysItem['entityType']
}

export type WeeklyReviewProjection = {
  periodLabel: string
  directionReading: DirectionReading
  capacityReading: CapacityReading
  continuityReading: string
  protectedEssentials: WeeklyProtectedEssential[]
  activeGoals: number
  activeProjects: number
  rhythms: number
  completedCount: number
  archivedCount: number
  blockedCount: number
  unknownCount: number
  inboxCarryoverCount: number
  memoryRecoverableCount: number
  reviewPrompts: string[]
  missingInformation: string[]
  weeklySignals: string[]
  replanning: typeof weeklyReplanningContract
}

type BuildWeeklyReviewProjectionInput = {
  items: readonly OlysItem[]
  conditions: readonly EntityCondition[]
  dependencies: readonly DependencyEdge[]
  links: readonly EntityLink[]
  dailySessions: readonly DailySession[]
  inboxItems: readonly InboxItem[]
  memoryProjection?: MemoryProjection
  planningProjection?: PlanningProjection
}

export function buildWeeklyReviewProjection({
  items,
  conditions,
  dependencies,
  links,
  dailySessions,
  inboxItems,
  memoryProjection,
  planningProjection,
}: BuildWeeklyReviewProjectionInput): WeeklyReviewProjection {
  const activeItems = items.filter((item) => item.status === 'active')
  const directionReading = planningProjection?.readings.direction ??
    buildDirectionReading(items as OlysItem[], conditions as EntityCondition[], dependencies as DependencyEdge[])
  const capacityReading = buildCapacityReading(items as OlysItem[], conditions as EntityCondition[])
  const dependencyReading = calculateDependencies(items as OlysItem[], dependencies as DependencyEdge[])
  const protectedEssentials = buildProtectedEssentials(items, conditions)
  const unknownCount = conditions.filter(
    (condition) => condition.conditionType === 'unknown' && !condition.removedAt,
  ).length + capacityReading.unknownLoadCount
  const completedCount = items.filter((item) => item.status === 'completed').length
  const archivedCount = items.filter((item) => item.status === 'archived').length
  const memoryRecoverableCount =
    memoryProjection?.continuity.recoverable ??
    items.filter((item) => item.status === 'completed' || item.status === 'archived').length
  const inboxCarryoverCount = inboxItems.filter((item) =>
    ['new', 'error', 'kept', 'postponed'].includes(item.status),
  ).length

  return {
    periodLabel: buildPeriodLabel(),
    directionReading,
    capacityReading,
    continuityReading: buildContinuityReading({
      dailySessions,
      completedCount,
      archivedCount,
      memoryRecoverableCount,
      linksCount: links.length,
    }),
    protectedEssentials,
    activeGoals: activeItems.filter((item) => item.entityType === 'goal').length,
    activeProjects: activeItems.filter((item) => item.entityType === 'project').length,
    rhythms: activeItems.filter((item) => item.entityType === 'habit' || item.entityType === 'routine').length,
    completedCount,
    archivedCount,
    blockedCount: dependencyReading.blocked.length,
    unknownCount,
    inboxCarryoverCount,
    memoryRecoverableCount,
    reviewPrompts: buildReviewPrompts({
      protectedEssentialsCount: protectedEssentials.length,
      blockedCount: dependencyReading.blocked.length,
      unknownCount,
      inboxCarryoverCount,
    }),
    missingInformation: buildMissingInformation({
      dailySessions,
      linksCount: links.length,
      unknownCount,
      hasPlanningProjection: Boolean(planningProjection),
      hasMemoryProjection: Boolean(memoryProjection),
    }),
    weeklySignals: buildWeeklySignals({
      directionStatement: directionReading.statement,
      capacitySummary: capacityReading.qualitativeLoad,
      dependencySummary: dependencyReading.summary,
      memoryRecoverableCount,
      inboxCarryoverCount,
    }),
    replanning: weeklyReplanningContract,
  }
}

function buildProtectedEssentials(
  items: readonly OlysItem[],
  conditions: readonly EntityCondition[],
): WeeklyProtectedEssential[] {
  return conditions
    .filter((condition) => condition.conditionType === 'essential_protected' && !condition.removedAt)
    .map((condition) => {
      const item = items.find((candidate) => candidate.id === condition.entityId)

      return {
        conditionId: condition.id,
        entityId: condition.entityId,
        title: item?.title ?? 'Entidade não carregada',
        entityType: item?.entityType ?? 'task',
      }
    })
}

function buildPeriodLabel() {
  return 'Semana em revisão'
}

function buildContinuityReading(input: {
  dailySessions: readonly DailySession[]
  completedCount: number
  archivedCount: number
  memoryRecoverableCount: number
  linksCount: number
}) {
  const closedSessions = input.dailySessions.filter((session) => session.sessionStatus === 'closed').length

  if (closedSessions > 0 || input.memoryRecoverableCount > 0) {
    return `${closedSessions} fechamento(s) e ${input.memoryRecoverableCount} contexto(s) recuperável(is)`
  }

  if (input.completedCount + input.archivedCount > 0) {
    return 'Há histórico operacional, ainda sem fechamento semanal explícito.'
  }

  if (input.linksCount > 0) {
    return 'Há vínculos carregados para reconectar continuidade.'
  }

  return 'Continuidade ainda depende de mais contexto registrado.'
}

function buildReviewPrompts(input: {
  protectedEssentialsCount: number
  blockedCount: number
  unknownCount: number
  inboxCarryoverCount: number
}) {
  const prompts = [
    'O que precisa continuar sem virar urgência artificial?',
    'Que direção ainda conversa com a execução real?',
  ]

  if (input.protectedEssentialsCount > 0) {
    prompts.push('Qual essencial protegido precisa limitar novas escolhas?')
  }

  if (input.blockedCount > 0) {
    prompts.push('Qual bloqueio muda a sequência da próxima semana?')
  }

  if (input.unknownCount > 0) {
    prompts.push('Que informação faltante merece ser esclarecida antes de replanejar?')
  }

  if (input.inboxCarryoverCount > 0) {
    prompts.push('O que ainda está em transição e não deve virar trabalho automaticamente?')
  }

  return prompts.slice(0, 5)
}

function buildMissingInformation(input: {
  dailySessions: readonly DailySession[]
  linksCount: number
  unknownCount: number
  hasPlanningProjection: boolean
  hasMemoryProjection: boolean
}) {
  const missing: string[] = []

  if (input.dailySessions.length === 0) {
    missing.push('Sem sessões diárias carregadas para leitura longitudinal.')
  }

  if (input.linksCount === 0) {
    missing.push('Sem vínculos carregados para sustentar relações entre direção e execução.')
  }

  if (input.unknownCount > 0) {
    missing.push('Há dados unknown que impedem falsa precisão.')
  }

  if (!input.hasPlanningProjection) {
    missing.push('Planejar não foi passado como projection externa.')
  }

  if (!input.hasMemoryProjection) {
    missing.push('Memória não foi passada como projection externa.')
  }

  return missing
}

function buildWeeklySignals(input: {
  directionStatement: string
  capacitySummary: string
  dependencySummary: string
  memoryRecoverableCount: number
  inboxCarryoverCount: number
}) {
  return [
    input.directionStatement,
    input.capacitySummary,
    input.dependencySummary,
    `${input.memoryRecoverableCount} contexto(s) recuperável(is)`,
    `${input.inboxCarryoverCount} entrada(s) em transição`,
  ]
}
