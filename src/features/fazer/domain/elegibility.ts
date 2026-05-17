import { OlysItem } from '../../../domain/entities/types'

export function isEligibleForNow(item: OlysItem) {
  return item.state === 'active' && !item.hasDependencyRisk
}

export function isAttentionItem(item: OlysItem) {
  return Boolean(item.hasDependencyRisk)
}
