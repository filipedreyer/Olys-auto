import { OlysItem } from '../../../domain/entities/types'

export type DependencyReading = {
  blocked: OlysItem[]
  risks: OlysItem[]
  sequence: OlysItem[]
  summary: string
}

export function calculateDependencies(items: OlysItem[]): DependencyReading {
  const blocked = items.filter(
    (item) => item.state === 'blocked' || item.dependency?.kind === 'blocker',
  )
  const risks = items.filter((item) =>
    ['risk', 'impact'].includes(item.dependency?.kind ?? ''),
  )
  const sequence = items.filter((item) => item.dependency?.kind === 'sequence')

  return {
    blocked,
    risks,
    sequence,
    summary:
      blocked.length > 0
        ? `${blocked.length} bloqueio(s) exigem decisao`
        : 'Sem bloqueios operacionais ativos',
  }
}
