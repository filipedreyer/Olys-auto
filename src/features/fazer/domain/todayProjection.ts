import {
  DependencyEdge,
  EntityCondition,
  OlysItem,
} from '../../../domain/entities/types'
import { buildAttention } from './attention'
import { buildCapacityReading, CapacityReading } from './capacity'
import { calculateDependencies, DependencyReading } from './dependencies'
import { buildDirectionReading, DirectionReading } from './directionReading'
import {
  hasActiveCondition,
  isBlocked,
  isCompleted,
  isEligibleForLater,
  isEligibleForNow,
  isPaused,
} from './eligibility'
import { orderForToday } from './ordering'

const NOW_LANE_MAX_ITEMS = 5
const TODAY_LANE_MAX_ITEMS = 12
const ATTENTION_MAX_ITEMS = 12

export type TodayProjection = {
  now: OlysItem[]
  later: OlysItem[]
  attention: OlysItem[]
  blocked: OlysItem[]
  paused: OlysItem[]
  completed: OlysItem[]
  itemDetails: Record<string, string | undefined>
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
  const eligibleItems = orderForToday(
    items.filter((item) =>
      isEligibleForNow(item, conditions, dependencies, items),
    ),
    conditions,
    dependencies,
  )
  const now = eligibleItems.slice(0, NOW_LANE_MAX_ITEMS)
  const nowIds = new Set(now.map((item) => item.id))
  const blocked = orderForToday(
    items.filter((item) => isBlocked(item, conditions, dependencies, items)),
    conditions,
    dependencies,
  )

  return {
    now,
    later: orderForToday(
      items.filter(
        (item) =>
          isEligibleForLater(item, conditions, dependencies, items) &&
          !nowIds.has(item.id),
      ),
      conditions,
      dependencies,
    )
      .slice(0, TODAY_LANE_MAX_ITEMS),
    attention,
    blocked,
    paused: items.filter(isPaused),
    completed: items.filter((item) => item.status === 'completed').slice(0, 3),
    itemDetails: buildItemDetails(items, conditions, dependencies),
    readings: {
      direction: buildDirectionReading(items, conditions, dependencies),
      capacity: buildCapacityReading(items, conditions),
      dependencyRisk: calculateDependencies(items, dependencies),
    },
  }
}

function buildItemDetails(
  items: OlysItem[],
  conditions: EntityCondition[],
  dependencies: DependencyEdge[],
) {
  return items.reduce<Record<string, string | undefined>>((details, item) => {
    if (isCompleted(item)) {
      details[item.id] = item.completedAt
        ? `Concluido em ${item.completedAt}`
        : 'Concluido'
      return details
    }

    if (isBlocked(item, conditions, dependencies, items)) {
      details[item.id] = 'Bloqueio ou sequencia pendente'
      return details
    }

    if (hasActiveCondition(conditions, item.id, 'essential_protected')) {
      details[item.id] = 'Essencial Protegido como condicao'
      return details
    }

    if (typeof item.durationMinutes === 'number') {
      details[item.id] = `${item.durationMinutes} min declarados`
      return details
    }

    details[item.id] = item.dateStart ?? 'Duracao unknown'
    return details
  }, {})
}
