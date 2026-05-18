import {
  DependencyEdge,
  EntityCondition,
  OlysItem,
} from '../../../domain/entities/types'
import { hasActiveCondition, isBlocked } from './eligibility'

export function orderForToday(
  items: OlysItem[],
  conditions: EntityCondition[],
  dependencies: DependencyEdge[],
) {
  return [...items].sort(
    (first, second) =>
      scoreTodayItem(second, conditions, dependencies, items) -
      scoreTodayItem(first, conditions, dependencies, items),
  )
}

export function scoreTodayItem(
  item: OlysItem,
  conditions: EntityCondition[],
  dependencies: DependencyEdge[],
  allItems: OlysItem[],
) {
  if (isBlocked(item, conditions, dependencies, allItems)) {
    return -999
  }

  let total = item.priority * 20

  if (item.startAt) {
    total += 100
  }

  if (hasActiveCondition(conditions, item.id, 'essential_protected')) {
    total += 90
  }

  if (
    dependencies.some(
      (edge) =>
        edge.predecessorId === item.id &&
        edge.status === 'active' &&
        !edge.removedAt,
    )
  ) {
    total += 80
  }

  if (hasActiveCondition(conditions, item.id, 'overdue')) {
    total += 70
  }

  if (item.dateStart) {
    total += 50
  }

  if (item.recurrenceRule) {
    total += 30
  }

  if (['goal', 'project', 'habit', 'routine'].includes(item.entityType)) {
    total += 15
  }

  if (typeof item.durationMinutes !== 'number') {
    total -= 25
  }

  return total
}
