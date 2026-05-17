import { OlysItem } from '../../../domain/entities/types'
import { buildCapacityReading, CapacityReading } from './capacity'
import { calculateDependencies, DependencyReading } from './dependencies'
import { TimelineLens } from './timelineLens'

export type TimelineEntry = {
  id: string
  title: string
  label: string
  detail: string
  tone: 'default' | 'attention' | 'blocked' | 'paused'
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
  activeLens: TimelineLens,
): TimelineProjection {
  const capacity = buildCapacityReading(items)
  const dependencies = calculateDependencies(items)

  return {
    activeLens,
    title: buildTimelineTitle(activeLens),
    entries: buildEntries(items, activeLens),
    readings: {
      capacity,
      dependencies,
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

function buildEntries(items: OlysItem[], activeLens: TimelineLens): TimelineEntry[] {
  if (activeLens === 'capacity') {
    return items
      .filter((item) => item.state !== 'archived')
      .map((item) => ({
        id: item.id,
        title: item.title,
        label:
          typeof item.durationMinutes === 'number'
            ? `${item.durationMinutes} min declarados`
            : 'Duracao desconhecida',
        detail: capacityDetail(item),
        tone: item.state === 'blocked' ? 'blocked' : 'default',
      }))
  }

  if (activeLens === 'dependency') {
    return items
      .filter((item) => item.dependency || item.state === 'blocked')
      .map((item) => ({
        id: item.id,
        title: item.title,
        label: item.dependency?.reason ?? 'Bloqueio operacional',
        detail: item.dependency?.impact ?? 'Impacto exige triagem contextual',
        tone: item.state === 'blocked' ? 'blocked' : 'attention',
      }))
  }

  return items
    .filter((item) => item.state !== 'archived')
    .map((item) => ({
      id: item.id,
      title: item.title,
      label: item.scheduledLabel ?? 'Sem janela fixa',
      detail: item.contextLabel ?? 'Contexto operacional',
      tone: item.state === 'paused' ? 'paused' : 'default',
    }))
}

function capacityDetail(item: OlysItem) {
  if (typeof item.durationMinutes !== 'number') {
    return 'Leitura qualitativa; o sistema nao estima duracao artificialmente'
  }

  return `Carga conhecida, demanda ${item.capacityDemand ?? 'unknown'}`
}
