import { OlysItem } from '../../../domain/entities/types'

export function buildAttention(items: OlysItem[]) {
  return items.filter((item) => item.hasDependencyRisk)
}
