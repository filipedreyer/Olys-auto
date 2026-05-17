import { OlysItem } from '../../../domain/entities/types'
import { buildAttention } from './attention'
import { buildCapacityReading, CapacityReading } from './capacity'
import { calculateDependencies, DependencyReading } from './dependencies'
import { buildDirectionReading, DirectionReading } from './directionReading'
import { isEligibleForNow } from './eligibility'

export type TodayProjection = {
  now: OlysItem[]
  later: OlysItem[]
  attention: OlysItem[]
  readings: {
    direction: DirectionReading
    capacity: CapacityReading
    dependencyRisk: DependencyReading
  }
}

export function buildTodayProjection(items: OlysItem[]): TodayProjection {
  const attention = buildAttention(items)
  const now = items
    .filter(isEligibleForNow)
    .sort((first, second) => {
      return Number(second.essentialProtected) - Number(first.essentialProtected)
    })
    .slice(0, 3)

  return {
    now,
    later: items.filter(
      (item) =>
        item.state === 'active' &&
        !now.some((current) => current.id === item.id) &&
        !attention.some((current) => current.id === item.id),
    ),
    attention,
    readings: {
      direction: buildDirectionReading(items),
      capacity: buildCapacityReading(items),
      dependencyRisk: calculateDependencies(items),
    },
  }
}
