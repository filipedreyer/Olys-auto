import {
  DependencyEdge,
  EntityCondition,
  OlysItem,
  OperationalRowState,
} from '../../../domain/entities/types'
import { buildCapacityReading, CapacityReading } from './capacity'
import { calculateDependencies, DependencyReading } from './dependencies'
import { TimelineLens } from './timelineLens'

export type TimelineEntry = {
  id: string
  title: string
  label: string
  detail: string
  tone: OperationalRowState
}

export type TimelineProjection = {
  activeLens: TimelineLens
  title: string
  entries: TimelineEntry[]
  readings: {
    capacity: CapacityReading
    dependencies: DependencyReading
  }
}

export function buildTimelineProjection(
  items: OlysItem[],
  conditions: EntityCondition[],
  dependencies: DependencyEdge[],
  activeLens: TimelineLens,
): TimelineProjection {
  const capacity = buildCapacityReading(items, conditions)
  const dependencyReading = calculateDependencies(items, dependencies)

  return {
    activeLens,
    title: buildTimelineTitle(activeLens),
    entries: buildEntries(items, dependencies, activeLens),
    readings: {
      capacity,
      dependencies: dependencyReading,
    },
  }
}

function buildTimelineTitle(activeLens: TimelineLens) {
  if (activeLens === 'capacity') {
    return 'Sustentabilidade operacional'
  }

  if (activeLens === 'dependency') {
    return 'Bloqueios, impacto e sequencia'
  }

  return 'Continuidade contextual'
}

function buildEntries(
  items: OlysItem[],
  dependencies: DependencyEdge[],
  activeLens: TimelineLens,
): TimelineEntry[] {
  if (activeLens === 'capacity') {
    return items
      .filter((item) => item.status !== 'deleted')
      .map((item) => ({
        id: item.id,
        title: item.title,
        label:
          typeof item.durationMinutes === 'number'
            ? `${item.durationMinutes} min declarados`
            : 'Duracao unknown',
        detail:
          typeof item.durationMinutes === 'number'
            ? 'Ocupa capacidade comprometida'
            : 'Nao ocupa capacidade sem duracao ou regra explicita',
        tone: item.status === 'paused' ? 'paused' : 'default',
      }))
  }

  if (activeLens === 'dependency') {
    return dependencies.map((edge) => {
      const predecessor = items.find((item) => item.id === edge.predecessorId)
      const successor = items.find((item) => item.id === edge.successorId)

      return {
        id: edge.id,
        title: predecessor?.title ?? 'Predecessor indisponivel',
        label: successor ? `Antes de ${successor.title}` : edge.type,
        detail: edge.impact,
        tone: edge.status === 'active' ? 'blocked' : 'attention',
      }
    })
  }

  return items
    .filter((item) => item.status !== 'deleted')
    .map((item) => ({
      id: item.id,
      title: item.title,
      label: item.startAt ?? item.dateStart ?? 'Sem janela fixa',
      detail: item.sourceContext ?? 'Contexto operacional',
      tone: item.status === 'paused' ? 'paused' : 'default',
    }))
}
