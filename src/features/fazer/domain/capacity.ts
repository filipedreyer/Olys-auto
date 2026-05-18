import {
  CapacityState,
  EntityCondition,
  OlysItem,
} from '../../../domain/entities/types'
import { hasActiveCondition } from './eligibility'

const WEEKDAY_CAPACITY_MINUTES = 360

export type CapacityConfidence =
  | 'known'
  | 'partial'
  | 'unknown'
  | 'inferred_low_confidence'

export type CapacityReading = {
  state: CapacityState
  confidence: CapacityConfidence
  qualitativeLoad: string
  availableMinutes: number
  committedMinutes: number
  unknownLoadCount: number
  inferredLoadCount: number
  signals: string[]
}

export function buildCapacityReading(
  items: OlysItem[],
  conditions: EntityCondition[] = [],
): CapacityReading {
  const activeItems = items.filter((item) => item.status === 'active')
  const loadEntries = activeItems.map(getCommittedLoad)
  const committedMinutes = loadEntries.reduce((total, entry) => {
    return total + entry.minutes
  }, 0)
  const unknownLoadCount = loadEntries.filter(
    (entry) => entry.source === 'unknown',
  ).length
  const inferredLoadCount = loadEntries.filter(
    (entry) => entry.source === 'inferred_low_confidence',
  ).length
  const signals: string[] = []

  if (unknownLoadCount > 0) {
    signals.push(`${unknownLoadCount} item(ns) com carga unknown`)
  }

  if (inferredLoadCount > 0) {
    signals.push(`${inferredLoadCount} item(ns) com carga inferida de janela`)
  }

  if (
    activeItems.some((item) =>
      hasActiveCondition(conditions, item.id, 'essential_protected'),
    )
  ) {
    signals.push('Essencial Protegido presente como condicao')
  }

  return {
    state: resolveCapacityState(committedMinutes, unknownLoadCount),
    confidence: resolveCapacityConfidence(unknownLoadCount, inferredLoadCount),
    qualitativeLoad: describeQualitativeLoad(
      committedMinutes,
      unknownLoadCount,
      inferredLoadCount,
    ),
    availableMinutes: WEEKDAY_CAPACITY_MINUTES,
    committedMinutes,
    unknownLoadCount,
    inferredLoadCount,
    signals,
  }
}

function getCommittedLoad(item: OlysItem): {
  minutes: number
  source: 'declared' | 'inferred_low_confidence' | 'unknown'
} {
  if (typeof item.durationMinutes === 'number') {
    return {
      minutes: item.durationMinutes,
      source: 'declared',
    }
  }

  if (item.startAt && item.endAt) {
    const start = new Date(item.startAt).getTime()
    const end = new Date(item.endAt).getTime()

    if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
      return {
        minutes: Math.round((end - start) / 60000),
        source: 'inferred_low_confidence',
      }
    }
  }

  return {
    minutes: 0,
    source: 'unknown',
  }
}

function resolveCapacityState(
  committedMinutes: number,
  unknownLoadCount: number,
): CapacityState {
  if (unknownLoadCount > 0 && committedMinutes === 0) {
    return 'unknown'
  }

  if (committedMinutes > WEEKDAY_CAPACITY_MINUTES) {
    return 'exceeded'
  }

  if (committedMinutes > WEEKDAY_CAPACITY_MINUTES * 0.85) {
    return 'near_limit'
  }

  if (unknownLoadCount > 0) {
    return 'partial'
  }

  if (committedMinutes > WEEKDAY_CAPACITY_MINUTES * 0.55) {
    return 'balanced'
  }

  return 'fits'
}

function resolveCapacityConfidence(
  unknownLoadCount: number,
  inferredLoadCount: number,
): CapacityConfidence {
  if (unknownLoadCount > 0 && inferredLoadCount === 0) {
    return 'unknown'
  }

  if (unknownLoadCount > 0) {
    return 'partial'
  }

  if (inferredLoadCount > 0) {
    return 'inferred_low_confidence'
  }

  return 'known'
}

function describeQualitativeLoad(
  committedMinutes: number,
  unknownLoadCount: number,
  inferredLoadCount: number,
) {
  if (unknownLoadCount > 0 && committedMinutes === 0) {
    return 'Carga qualitativa unknown; nenhuma duracao foi inventada'
  }

  if (unknownLoadCount > 0 || inferredLoadCount > 0) {
    return 'Leitura parcial; itens sem duracao permanecem unknown'
  }

  if (committedMinutes > WEEKDAY_CAPACITY_MINUTES) {
    return 'Capacidade declarada excedida'
  }

  if (committedMinutes > WEEKDAY_CAPACITY_MINUTES * 0.85) {
    return 'Capacidade declarada perto do limite'
  }

  return 'Capacidade declarada sustentavel'
}
