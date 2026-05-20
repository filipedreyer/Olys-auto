import type { DailyCycleProjection } from '../domain/dailyCycleProjection'

export function getSessionLabel(status: DailyCycleProjection['sessionStatus']) {
  if (status === 'closed') {
    return 'Dia fechado'
  }

  if (status === 'open') {
    return 'Dia aberto'
  }

  return 'Dia por abrir'
}

export function getOpenDayCopy(projection: DailyCycleProjection) {
  if (!projection.canOpenDay) {
    return 'Abertura já registrada. Nada será reorganizado automaticamente.'
  }

  return 'Abrir o Dia organiza a leitura antes da execução. Nada será reorganizado automaticamente.'
}

export function getCloseDayCopy(projection: DailyCycleProjection) {
  if (projection.sessionStatus === 'closed') {
    return 'O dia já foi fechado. O contexto mínimo ficou preservado.'
  }

  return 'Registre o mínimo necessário para preservar contexto. O fechamento não mede performance.'
}

export function getBreathingCopy(projection: DailyCycleProjection) {
  if (projection.remainingTodayCount === 0) {
    return 'Há espaço para parar sem preencher o vazio.'
  }

  return 'Se não há urgência real, preservar energia também é decisão.'
}
