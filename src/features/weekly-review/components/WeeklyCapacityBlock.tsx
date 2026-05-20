import type { WeeklyReviewProjection } from '../domain/weeklyReviewProjection'

type WeeklyCapacityBlockProps = {
  projection: WeeklyReviewProjection
}

export function WeeklyCapacityBlock({ projection }: WeeklyCapacityBlockProps) {
  return (
    <section className="weekly-capacity-block" aria-label="Capacidade semanal">
      <small>Capacidade</small>
      <h3>{projection.capacityReading.qualitativeLoad}</h3>
      <p>{projection.capacityReading.signals.join(' · ') || 'Leitura sem sinal adicional carregado.'}</p>
      <span>{projection.unknownCount} dado(s) unknown preservado(s) sem inventar carga.</span>
    </section>
  )
}
