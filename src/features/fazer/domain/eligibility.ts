import {
  DependencyEdge,
  EntityCondition,
  OlysItem,
} from '../../../domain/entities/types'

export function isOperationallyActive(item: OlysItem) {
  return item.status === 'active'
}

export function hasActiveCondition(
  conditions: EntityCondition[],
  entityId: string,
  conditionType: EntityCondition['conditionType'],
) {
  return conditions.some(
    (condition) =>
      condition.entityId === entityId &&
      condition.conditionType === conditionType &&
      !condition.removedAt,
  )
}

export function isBlocked(
  item: OlysItem,
  conditions: EntityCondition[],
  dependencies: DependencyEdge[],
  items: OlysItem[],
) {
  if (hasActiveCondition(conditions, item.id, 'blocked')) {
    return true
  }

  return dependencies.some((edge) => {
    if (edge.status !== 'active' || edge.successorId !== item.id) {
      return false
    }

    const predecessor = items.find((candidate) => candidate.id === edge.predecessorId)

    return predecessor ? predecessor.status !== 'completed' : true
  })
}

export function isEligibleForNow(
  item: OlysItem,
  conditions: EntityCondition[],
  dependencies: DependencyEdge[],
  items: OlysItem[],
) {
  return (
    isOperationallyActive(item) &&
    !isBlocked(item, conditions, dependencies, items) &&
    (isInTodayUniverse(item, conditions, dependencies) || item.priority === 3)
  )
}

export function isAttentionItem(
  item: OlysItem,
  conditions: EntityCondition[],
  dependencies: DependencyEdge[],
  items: OlysItem[],
) {
  return (
    item.status === 'active' &&
    (isBlocked(item, conditions, dependencies, items) ||
      hasActiveCondition(conditions, item.id, 'overdue') ||
      hasActiveCondition(conditions, item.id, 'attention') ||
      typeof item.durationMinutes !== 'number')
  )
}

function isInTodayUniverse(
  item: OlysItem,
  conditions: EntityCondition[],
  dependencies: DependencyEdge[],
) {
  return (
    Boolean(item.dateStart) ||
    hasActiveCondition(conditions, item.id, 'essential_protected') ||
    dependencies.some(
      (edge) => edge.predecessorId === item.id && edge.status === 'active',
    ) ||
    item.entityType === 'habit' ||
    item.entityType === 'routine'
  )
}
