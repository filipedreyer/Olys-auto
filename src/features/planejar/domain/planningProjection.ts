import {
  DependencyEdge,
  EntityCondition,
  OlysItem,
} from '../../../domain/entities/types'
import { calculateDependencies } from '../../fazer/domain/dependencies'
import { buildDirectionReading } from '../../fazer/domain/directionReading'

export function buildPlanningProjection(
  items: OlysItem[],
  conditions: EntityCondition[] = [],
  dependencies: DependencyEdge[] = [],
) {
  const activeDirectionalItems = items.filter(
    (item) =>
      ['goal', 'project', 'habit', 'routine'].includes(item.entityType) &&
      item.status !== 'archived' &&
      item.status !== 'deleted',
  )
  const dependencyReading = calculateDependencies(items, dependencies)
  const direction = buildDirectionReading(items, conditions, dependencies)

  return {
    activeDirectionalItems,
    readings: {
      direction,
      dependencies: dependencyReading,
      statement:
        activeDirectionalItems.length > 0
          ? 'Planejamento orientado por direcao e risco operacional'
          : 'Sem metas, projetos, habitos ou rotinas ativos',
    },
  }
}
