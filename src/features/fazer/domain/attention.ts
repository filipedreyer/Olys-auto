import { OlysItem } from '../../../domain/entities/types'
import { isAttentionItem } from './eligibility'

export function buildAttention(items: OlysItem[]) {
  return items.filter(isAttentionItem)
}
