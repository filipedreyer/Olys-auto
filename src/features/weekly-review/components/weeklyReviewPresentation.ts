import type { WeeklyReviewProjection } from '../domain/weeklyReviewProjection'

export function describeWeeklyReview(projection: WeeklyReviewProjection) {
  return `${projection.periodLabel}: direção, capacidade, continuidade e execução em leitura conjunta.`
}

export function describeProtectedEssentials(count: number) {
  if (count === 0) {
    return 'Nenhum essencial protegido carregado como condição.'
  }

  return `${count} essencial(is) protegido(s) limitam novas escolhas.`
}

export function describeReplanningContract() {
  return 'Replanejamento é operação de coerência com confirmação; não reorganiza nada automaticamente.'
}
