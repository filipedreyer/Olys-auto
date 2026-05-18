import {
  CapacityState,
  EntityCondition,
  OlysItem,
} from '../../../domain/entities/types'
import { hasActiveCondition } from './eligibility'

const WEEKDAY_CAPACITY_MINUTES = 360

export type CapacityReading = {
  state: CapacityState
  availableMinutes: number
  committedMinutes: number
  unknownLoadCount: number
  signals: string[]
}

export function buildCapacityReading(
  items: OlysItem[],
  conditions: EntityCondition[] = [],
): CapacityReading {
  const activeItems = items.filter((item) => item.status === 'active')
  const committedMinutes = activeItems.reduce((total, item) => {
    return total + getCommittedMinutes(item)
  }, 0)
  const unknownLoadCount = activeItems.filter((item) => {
    return getCommittedMinutes(item) === 0 && typeof item.durationMinutes !== 'number'
  }).length
  const signals: string[] = []

  if (unknownLoadCount > 0) {
    signals.push(`${unknownLoadCount} item(ns) com carga unknown`)
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
    availableMinutes: WEEKDAY_CAPACITY_MINUTES,
    committedMinutes,
    unknownLoadCount,
    signals,
  }
}

function getCommittedMinutes(item: OlysItem) {
  if (typeof item.durationMinutes === 'number') {
    return item.durationMinutes
  }

  if (item.startAt && item.endAt) {
    const start = new Date(item.startAt).getTime()
    const end = new Date(item.endAt).getTime()

    if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
      return Math.round((end - start) / 60000)
    }
  }

  return 0
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
