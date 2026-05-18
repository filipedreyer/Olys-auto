import { DependencyEdge, OlysItem } from '../../../domain/entities/types'

export type DependencyReading = {
  blocked: DependencyEdge[]
  candidates: DependencyEdge[]
  needsReview: DependencyEdge[]
  risk: Array<{
    edgeId: string
    successorId: string
    impact: string
  }>
  summary: string
}

export function calculateDependencies(
  items: OlysItem[],
  dependencies: DependencyEdge[] = [],
): DependencyReading {
  const blocked = dependencies.filter((edge) => {
    if (edge.status !== 'active' || edge.removedAt) {
      return false
    }

    const predecessor = items.find((item) => item.id === edge.predecessorId)

    return predecessor ? predecessor.status !== 'completed' : true
  })
  const candidates = dependencies.filter(
    (edge) => edge.status === 'candidate' && !edge.removedAt,
  )
  const needsReview = dependencies.filter(
    (edge) => edge.status === 'needs_review' && !edge.removedAt,
  )

  return {
    blocked,
    candidates,
    needsReview,
    risk: blocked.map((edge) => ({
      edgeId: edge.id,
      successorId: edge.successorId,
      impact: edge.impact,
    })),
    summary:
      blocked.length > 0
        ? `${blocked.length} dependencia(s) bloqueiam sequencia`
        : 'Sem dependencias bloqueantes ativas',
  }
}
