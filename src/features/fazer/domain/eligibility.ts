import { OlysItem } from '../../../domain/entities/types'

export function isOperationallyActive(item: OlysItem) {
  return item.state === 'active'
}

export function isBlocked(item: OlysItem) {
  return item.state === 'blocked' || item.dependency?.kind === 'blocker'
}

export function isEligibleForNow(item: OlysItem) {
  return isOperationallyActive(item) && !isBlocked(item)
}

export function isAttentionItem(item: OlysItem) {
  return isBlocked(item) || Boolean(item.dependency)
}
