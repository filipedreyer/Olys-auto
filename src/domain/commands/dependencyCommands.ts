import {
  DependencyEdge,
  DependencySource,
  DependencyType,
  OlysItem,
} from '../entities/types'

const nowIso = () => new Date().toISOString()
const id = () => crypto.randomUUID()

type CreateDependencyInput = {
  userId: string
  predecessorId: string
  successorId: string
  type: DependencyType
  source: DependencySource
  justification: string
  impact: string
  confidence?: number
}

export type DependencyCommandResult = {
  edges: DependencyEdge[]
  error?: string
}

export function createDependency(
  items: OlysItem[],
  edges: DependencyEdge[],
  input: CreateDependencyInput,
): DependencyCommandResult {
  if (input.predecessorId === input.successorId) {
    return { edges, error: 'self_dependency' }
  }

  if (!input.justification.trim() || !input.impact.trim()) {
    return { edges, error: 'missing_justification_or_impact' }
  }

  const predecessor = items.find((item) => item.id === input.predecessorId)
  const successor = items.find((item) => item.id === input.successorId)

  if (!predecessor || !successor || predecessor.userId !== successor.userId) {
    return { edges, error: 'invalid_ownership_or_missing_item' }
  }

  const duplicate = edges.some(
    (edge) =>
      edge.predecessorId === input.predecessorId &&
      edge.successorId === input.successorId &&
      edge.status === 'active' &&
      !edge.removedAt,
  )

  if (duplicate) {
    return { edges, error: 'duplicate_dependency' }
  }

  if (createsCycle(edges, input.predecessorId, input.successorId)) {
    return { edges, error: 'cycle_dependency' }
  }

  return {
    edges: [
      {
        id: id(),
        userId: input.userId,
        predecessorId: input.predecessorId,
        successorId: input.successorId,
        type: input.type,
        status: input.source === 'ia_suggested' ? 'candidate' : 'active',
        source: input.source,
        confidence: input.confidence,
        justification: input.justification.trim(),
        impact: input.impact.trim(),
        createdAt: nowIso(),
      },
      ...edges,
    ],
  }
}

export function removeDependency(
  edges: DependencyEdge[],
  edgeId: string,
): DependencyEdge[] {
  return edges.map((edge) =>
    edge.id === edgeId
      ? {
          ...edge,
          status: 'inactive',
          removedAt: nowIso(),
        }
      : edge,
  )
}

function createsCycle(
  edges: DependencyEdge[],
  predecessorId: string,
  successorId: string,
) {
  const activeEdges = edges.filter((edge) => edge.status === 'active')
  const stack = [predecessorId]
  const seen = new Set<string>()

  while (stack.length > 0) {
    const current = stack.pop()

    if (!current || seen.has(current)) {
      continue
    }

    if (current === successorId) {
      return true
    }

    seen.add(current)

    activeEdges
      .filter((edge) => edge.successorId === current)
      .forEach((edge) => stack.push(edge.predecessorId))
  }

  return false
}
