import { OlysItem } from '../../../domain/entities/types'

export type DirectionReading = {
  aligned: boolean
  protectedItems: number
  statement: string
}

export function buildDirectionReading(items: OlysItem[]): DirectionReading {
  const protectedItems = items.filter(
    (item) => item.essentialProtected && item.state !== 'archived',
  ).length

  return {
    aligned: protectedItems > 0,
    protectedItems,
    statement:
      protectedItems > 0
        ? 'Direcao preservada por condicao essencial'
        : 'Sem condicao essencial protegida para hoje',
  }
}
