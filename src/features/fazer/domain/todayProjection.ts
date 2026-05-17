import { OlysItem } from '../../../domain/entities/types'
import { isAttentionItem, isEligibleForNow } from './elegibility'

export type TodayProjection = {
  now: OlysItem[]
  later: OlysItem[]
  attention: OlysItem[]
}

export function buildTodayProjection(items: OlysItem[]): TodayProjection {
  return {
    now: items.filter(isEligibleForNow).slice(0, 2),
    later: items.filter((item) => item.state === 'active' && !isEligibleForNow(item)),
    attention: items.filter(isAttentionItem),
  }
}
