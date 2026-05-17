import { OlysItem } from '../../../domain/entities/types'

export type CapacityPosture = 'clear' | 'stable' | 'strained' | 'unknown'

export type CapacityReading = {
  posture: CapacityPosture
  knownDurationMinutes: number
  unknownDurationCount: number
  signals: string[]
}

export function buildCapacityReading(items: OlysItem[]): CapacityReading {
  const activeItems = items.filter(
    (item) => item.state === 'active' || item.state === 'blocked',
  )
  const knownDurationMinutes = activeItems.reduce((total, item) => {
    return typeof item.durationMinutes === 'number'
      ? total + item.durationMinutes
      : total
  }, 0)
  const unknownDurationCount = activeItems.filter(
    (item) => typeof item.durationMinutes !== 'number',
  ).length
  const signals: string[] = []

  if (unknownDurationCount > 0) {
    signals.push(`${unknownDurationCount} item(ns) sem duracao declarada`)
  }

  if (knownDurationMinutes > 300) {
    signals.push('Carga conhecida acima de uma janela sustentavel')
  }

  if (activeItems.some((item) => item.essentialProtected)) {
    signals.push('Essencial Protegido presente como condicao')
  }

  let posture: CapacityPosture = 'stable'

  if (activeItems.length === 0) {
    posture = 'clear'
  } else if (unknownDurationCount > knownDurationMinutes / 90) {
    posture = 'unknown'
  } else if (knownDurationMinutes > 300) {
    posture = 'strained'
  }

  return {
    posture,
    knownDurationMinutes,
    unknownDurationCount,
    signals,
  }
}
