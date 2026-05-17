import { OlysItem } from '../../../domain/entities/types'

export type DependencyReading = {
  blocked: OlysItem[]
}

export function calculateDependencies(items: OlysItem[]): DependencyReading {
  return {
    blocked: items.filter((item) => item.hasDependencyRisk),
  }
}
