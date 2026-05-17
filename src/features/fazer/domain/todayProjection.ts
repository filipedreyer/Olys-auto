import { OlysItem } from '../../../domain/entities/types'

export type TodayProjection = {
  now: OlysItem[]
  later: OlysItem[]
  attention: OlysItem[]
}

export function buildTodayProjection(items: OlysItem[]): TodayProjection {
  return {
    now: items.filter((item) => item.state === 'active').slice(0, 2),
    later: items.filter((item) => item.state === 'active').slice(2),
    attention: items.filter((item) => item.hasDependencyRisk),
  }
}
