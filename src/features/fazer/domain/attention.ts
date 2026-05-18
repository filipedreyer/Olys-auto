import {
  DependencyEdge,
  EntityCondition,
  OlysItem,
} from '../../../domain/entities/types'
import { isAttentionItem } from './eligibility'

export function buildAttention(
  items: OlysItem[],
  conditions: EntityCondition[] = [],
  dependencies: DependencyEdge[] = [],
) {
  return items.filter((item) =>
    isAttentionItem(item, conditions, dependencies, items),
  )
}
