import {
  DependencyEdge,
  DependencyStatus,
  DependencyType,
  EntityCondition,
  EntityType,
  ItemStatus,
  OlysItem,
  OperationalRowState,
} from '../../../domain/entities/types'
import { buildCapacityReading, CapacityReading } from './capacity'
import { calculateDependencies, DependencyReading } from './dependencies'
import { buildDirectionReading, DirectionReading } from './directionReading'
import { TimelineLens } from './timelineLens'

export type TimelineEntry = {
  id: string
  title: string
  label: string
  detail: string
  tone: OperationalRowState
  entryKind: 'item' | 'dependency'
  entityType?: EntityType | 'unclassified'
  status?: ItemStatus
  dateStart?: string
  dateEnd?: string
  startAt?: string
  endAt?: string
  durationMinutes?: number | null
  sourceContext?: string
  predecessorTitle?: string
  successorTitle?: string
  dependencyType?: DependencyType
  dependencyImpact?: string
  dependencyStatus?: DependencyStatus
}

export type TimelineProjection = {
  activeLens: TimelineLens
  title: string
  entries: TimelineEntry[]
  readings: {
    capacity: CapacityReading
    dependencies: DependencyReading
    direction: DirectionReading
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
  const direction = buildDirectionReading(items, conditions, dependencies)

  return {
    activeLens,
    title: buildTimelineTitle(activeLens),
    entries: buildEntries(items, dependencies, activeLens),
    readings: {
      capacity,
      dependencies: dependencyReading,
      direction,
    },
  }
}

function buildTimelineTitle(activeLens: TimelineLens) {
  if (activeLens === 'capacity') {
    return 'Sustentabilidade operacional'
  }

  if (activeLens === 'dependency') {
    return 'Bloqueios, impacto e sequência'
  }

  return 'Calendário operacional'
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
            : 'Duração unknown',
        detail:
          typeof item.durationMinutes === 'number'
            ? 'Carga declarada entra na leitura de sustentabilidade'
            : 'Permanece unknown; nenhuma duração foi inventada',
        tone: item.status === 'paused' ? 'paused' : 'default',
        entryKind: 'item',
        entityType: item.entityType,
        status: item.status,
        dateStart: item.dateStart,
        dateEnd: item.dateEnd,
        startAt: item.startAt,
        endAt: item.endAt,
        durationMinutes: item.durationMinutes,
        sourceContext: item.sourceContext,
      }))
  }

  if (activeLens === 'dependency') {
    return dependencies.map((edge) => {
      const predecessor = items.find((item) => item.id === edge.predecessorId)
      const successor = items.find((item) => item.id === edge.successorId)

      return {
        id: edge.id,
        title: predecessor?.title ?? 'Predecessor indisponível',
        label: successor ? `Antes de ${successor.title}` : edge.type,
        detail: `${edge.type}: ${edge.impact}`,
        tone: edge.status === 'active' ? 'blocked' : 'attention',
        entryKind: 'dependency',
        entityType: predecessor?.entityType ?? 'unclassified',
        predecessorTitle: predecessor?.title,
        successorTitle: successor?.title,
        dependencyType: edge.type,
        dependencyImpact: edge.impact,
        dependencyStatus: edge.status,
      }
    })
  }

  return items
    .filter((item) => item.status !== 'deleted' && isTemporalItem(item))
    .map((item) => ({
      id: item.id,
      title: item.title,
      label: item.startAt ?? item.dateStart ?? 'Sem janela fixa',
      detail: item.endAt
        ? `Janela até ${item.endAt}`
        : item.sourceContext ?? 'Contexto temporal operacional',
      tone: item.status === 'paused' ? 'paused' : 'default',
      entryKind: 'item',
      entityType: item.entityType,
      status: item.status,
      dateStart: item.dateStart,
      dateEnd: item.dateEnd,
      startAt: item.startAt,
      endAt: item.endAt,
      durationMinutes: item.durationMinutes,
      sourceContext: item.sourceContext,
    }))
}

function isTemporalItem(item: OlysItem) {
  return Boolean(
    item.dateStart ||
      item.dateEnd ||
      item.startAt ||
      item.endAt ||
      item.entityType === 'event' ||
      item.entityType === 'agenda' ||
      item.entityType === 'reminder',
  )
}
