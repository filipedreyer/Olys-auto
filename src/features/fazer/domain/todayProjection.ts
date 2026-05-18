import {
  DependencyEdge,
  EntityCondition,
  OlysItem,
} from '../../../domain/entities/types'
import { buildAttention } from './attention'
import { buildCapacityReading, CapacityReading } from './capacity'
import { calculateDependencies, DependencyReading } from './dependencies'
import { buildDirectionReading, DirectionReading } from './directionReading'
import { hasActiveCondition, isEligibleForNow } from './eligibility'

const NOW_LANE_MAX_ITEMS = 5
const TODAY_LANE_MAX_ITEMS = 12
const ATTENTION_MAX_ITEMS = 12

export type TodayProjection = {
  now: OlysItem[]
  fitsToday: OlysItem[]
  attention: OlysItem[]
  completed: OlysItem[]
  readings: {
    direction: DirectionReading
    capacity: CapacityReading
    dependencyRisk: DependencyReading
  }
}

export function buildTodayProjection(
  items: OlysItem[],
  conditions: EntityCondition[] = [],
  dependencies: DependencyEdge[] = [],
): TodayProjection {
  const attention = buildAttention(items, conditions, dependencies).slice(
    0,
    ATTENTION_MAX_ITEMS,
  )
  const eligibleItems = items
    .filter((item) => isEligibleForNow(item, conditions, dependencies, items))
    .sort((first, second) => score(second, conditions) - score(first, conditions))
  const now = eligibleItems.slice(0, NOW_LANE_MAX_ITEMS)

  return {
    now,
    fitsToday: eligibleItems
      .filter((item) => !now.some((current) => current.id === item.id))
      .slice(0, TODAY_LANE_MAX_ITEMS),
    attention,
    completed: items.filter((item) => item.status === 'completed').slice(0, 3),
    readings: {
      direction: buildDirectionReading(items, conditions, dependencies),
      capacity: buildCapacityReading(items, conditions),
      dependencyRisk: calculateDependencies(items, dependencies),
    },
  }
}

function score(item: OlysItem, conditions: EntityCondition[]) {
  let total = item.priority * 20

  if (item.startAt) {
    total += 100
  }

  if (hasActiveCondition(conditions, item.id, 'essential_protected')) {
    total += 90
  }

  if (item.dateStart) {
    total += 50
  }

  if (typeof item.durationMinutes !== 'number') {
    total -= 25
  }

  return total
}
