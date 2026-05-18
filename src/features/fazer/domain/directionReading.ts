import {
  DependencyEdge,
  DirectionState,
  EntityCondition,
  OlysItem,
} from '../../../domain/entities/types'
import { hasActiveCondition } from './eligibility'

export type DirectionReading = {
  state: DirectionState
  protectedItems: number
  statement: string
}

export function buildDirectionReading(
  items: OlysItem[],
  conditions: EntityCondition[] = [],
  dependencies: DependencyEdge[] = [],
): DirectionReading {
  const activeItems = items.filter((item) => item.status === 'active')
  const protectedItems = activeItems.filter((item) =>
    hasActiveCondition(conditions, item.id, 'essential_protected'),
  ).length
  const hasDirectionalEntity = activeItems.some((item) =>
    ['goal', 'project', 'habit', 'routine'].includes(item.entityType),
  )
  const blocksFuture = dependencies.some((edge) => edge.status === 'active')

  if (protectedItems > 0 && (hasDirectionalEntity || blocksFuture)) {
    return {
      state: 'aligned',
      protectedItems,
      statement: 'Direcao preservada por condicao e sequencia',
    }
  }

  if (hasDirectionalEntity || protectedItems > 0) {
    return {
      state: 'present',
      protectedItems,
      statement: 'Direcao presente, ainda com lacunas de conexao',
    }
  }

  return {
    state: 'absent',
    protectedItems,
    statement: 'Sem direcao operacional conectada ao hoje',
  }
}
