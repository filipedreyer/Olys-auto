import { DependencyEdge, OlysItem } from '../../../domain/entities/types'

export type DependencyReading = {
  blocked: DependencyEdge[]
  candidates: DependencyEdge[]
  needsReview: DependencyEdge[]
  summary: string
}

export function calculateDependencies(
  items: OlysItem[],
  dependencies: DependencyEdge[] = [],
): DependencyReading {
  const blocked = dependencies.filter((edge) => {
    if (edge.status !== 'active') {
      return false
    }

    const predecessor = items.find((item) => item.id === edge.predecessorId)

    return predecessor ? predecessor.status !== 'completed' : true
  })
  const candidates = dependencies.filter((edge) => edge.status === 'candidate')
  const needsReview = dependencies.filter((edge) => edge.status === 'needs_review')

  return {
    blocked,
    candidates,
    needsReview,
    summary:
      blocked.length > 0
        ? `${blocked.length} dependencia(s) bloqueiam sequencia`
        : 'Sem dependencias bloqueantes ativas',
  }
}
