import type {
  DailySession,
  DependencyEdge,
  EntityCondition,
  EntityLink,
  OlysItem,
} from '../../../domain/entities/types'
import type { TodayProjection } from '../../fazer/domain/todayProjection'

export type DailyCycleProjection = {
  date: string
  sessionStatus: 'not_started' | 'open' | 'closed'
  openedAt?: string
  closedAt?: string
  openingState: string
  closingState: string
  openingReading: string
  closingReading: string
  capacitySummary: string
  directionSummary: string
  attentionSummary: string
  protectedEssentialsCount: number
  blockedCount: number
  unknownCount: number
  completedTodayCount: number
  remainingTodayCount: number
  canOpenDay: boolean
  canCloseDay: boolean
  canShowBreathingCard: boolean
  missingInformation: string[]
  suggestedReflectionPrompts: string[]
}

type BuildDailyCycleProjectionInput = {
  today: string
  items: readonly OlysItem[]
  conditions: readonly EntityCondition[]
  dependencies: readonly DependencyEdge[]
  links?: readonly EntityLink[]
  dailySessions: readonly DailySession[]
  todayProjection: TodayProjection
}

export function buildDailyCycleProjection({
  today,
  items,
  conditions,
  dependencies,
  links = [],
  dailySessions,
  todayProjection,
}: BuildDailyCycleProjectionInput): DailyCycleProjection {
  const session = dailySessions.find((candidate) => candidate.date === today)
  const sessionStatus = resolveSessionStatus(session)
  const protectedEssentialsCount = conditions.filter(
    (condition) => condition.conditionType === 'essential_protected' && !condition.removedAt,
  ).length
  const unknownCount = conditions.filter(
    (condition) => condition.conditionType === 'unknown' && !condition.removedAt,
  ).length + todayProjection.readings.capacity.unknownLoadCount
  const blockedCount = todayProjection.blocked.length + todayProjection.readings.dependencyRisk.blocked.length
  const remainingTodayCount = todayProjection.now.length + todayProjection.later.length + todayProjection.attention.length + todayProjection.blocked.length
  const completedTodayCount = todayProjection.completed.length
  const missingInformation = buildMissingInformation({
    unknownCount,
    linksCount: links.length,
    hasOpeningReading: Boolean(session?.openingReading),
    hasClosingNote: Boolean(session?.closingNote),
  })

  return {
    date: today,
    sessionStatus,
    openedAt: session?.openedAt,
    closedAt: session?.closedAt,
    openingState: resolveOpeningState(sessionStatus),
    closingState: resolveClosingState(sessionStatus, session),
    openingReading: buildOpeningReading(todayProjection, protectedEssentialsCount),
    closingReading: buildClosingReading({
      sessionStatus,
      completedTodayCount,
      remainingTodayCount,
      blockedCount,
    }),
    capacitySummary: todayProjection.readings.capacity.qualitativeLoad,
    directionSummary: todayProjection.readings.direction.statement,
    attentionSummary:
      session?.attentionSummary ??
      (todayProjection.attention.length > 0
        ? `${todayProjection.attention.length} ponto(s) pedem atenção operacional`
        : 'Sem pontos críticos de atenção'),
    protectedEssentialsCount,
    blockedCount,
    unknownCount,
    completedTodayCount,
    remainingTodayCount,
    canOpenDay: sessionStatus === 'not_started',
    canCloseDay: sessionStatus !== 'closed',
    canShowBreathingCard: remainingTodayCount === 0 || todayProjection.readings.capacity.state === 'fits',
    missingInformation,
    suggestedReflectionPrompts: buildPrompts(blockedCount, unknownCount, protectedEssentialsCount),
  }
}

function resolveSessionStatus(session?: DailySession): DailyCycleProjection['sessionStatus'] {
  if (session?.sessionStatus === 'closed' || session?.closedAt) {
    return 'closed'
  }

  if (session?.openedAt) {
    return 'open'
  }

  return 'not_started'
}

function resolveOpeningState(status: DailyCycleProjection['sessionStatus']) {
  if (status === 'closed') {
    return 'Dia já fechado'
  }

  if (status === 'open') {
    return 'Dia aberto'
  }

  return 'Dia por abrir'
}

function resolveClosingState(
  status: DailyCycleProjection['sessionStatus'],
  session?: DailySession,
) {
  if (status === 'closed') {
    return session?.closingNote ? 'Contexto preservado' : 'Fechado sem nota'
  }

  if (status === 'open') {
    return 'Pronto para fechamento mínimo'
  }

  return 'Abertura pendente'
}

function buildOpeningReading(todayProjection: TodayProjection, protectedEssentialsCount: number) {
  const parts = [
    `${todayProjection.now.length} item(ns) em foco agora`,
    `${todayProjection.later.length} cabem hoje`,
  ]

  if (protectedEssentialsCount > 0) {
    parts.push(`${protectedEssentialsCount} essencial(is) protegido(s) como condição`)
  }

  return parts.join(' · ')
}

function buildClosingReading(input: {
  sessionStatus: DailyCycleProjection['sessionStatus']
  completedTodayCount: number
  remainingTodayCount: number
  blockedCount: number
}) {
  if (input.sessionStatus === 'closed') {
    return 'O fechamento preservou a leitura do dia.'
  }

  if (input.remainingTodayCount === 0) {
    return 'Sem carga restante relevante; preserve contexto sem preencher o vazio.'
  }

  if (input.blockedCount > 0) {
    return 'Feche registrando o mínimo sobre bloqueios e continuidade.'
  }

  return 'Feche com a menor nota suficiente para retomar depois.'
}

function buildMissingInformation(input: {
  unknownCount: number
  linksCount: number
  hasOpeningReading: boolean
  hasClosingNote: boolean
}) {
  const missing: string[] = []

  if (input.unknownCount > 0) {
    missing.push('Há informação unknown no dia.')
  }

  if (!input.hasOpeningReading) {
    missing.push('Leitura de abertura ainda não foi registrada.')
  }

  if (!input.hasClosingNote) {
    missing.push('Nota mínima de fechamento ainda ausente.')
  }

  if (input.linksCount === 0) {
    missing.push('Nenhum vínculo contextual carregado para leitura do ciclo.')
  }

  return missing
}

function buildPrompts(
  blockedCount: number,
  unknownCount: number,
  protectedEssentialsCount: number,
) {
  const prompts = [
    'O que precisa ser preservado para retomar sem atrito?',
    'Qual contexto mínimo não pode se perder?',
  ]

  if (blockedCount > 0) {
    prompts.push('Qual bloqueio precisa ficar visível amanhã?')
  }

  if (unknownCount > 0) {
    prompts.push('Que dado faltante muda a decisão?')
  }

  if (protectedEssentialsCount > 0) {
    prompts.push('Algum essencial protegido precisa ser respeitado antes de aceitar mais carga?')
  }

  return prompts.slice(0, 4)
}
