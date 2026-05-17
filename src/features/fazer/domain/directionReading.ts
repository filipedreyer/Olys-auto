import { OlysItem } from '../../../domain/entities/types'

export type DirectionReading = {
  aligned: boolean
  protectedItems: number
}

export function buildDirectionReading(items: OlysItem[]): DirectionReading {
  const protectedItems = items.filter((item) => item.essentialProtected).length

  return {
    aligned: protectedItems > 0,
    protectedItems,
  }
}
