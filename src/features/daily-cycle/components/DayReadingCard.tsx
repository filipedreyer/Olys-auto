import type { DailyCycleProjection } from '../domain/dailyCycleProjection'

type DayReadingCardProps = {
  projection: DailyCycleProjection
}

export function DayReadingCard({ projection }: DayReadingCardProps) {
  return (
    <section className="day-reading-card" aria-label="Leitura curta do dia">
      <small>Leitura do dia</small>
      <p>{projection.openingReading}</p>
      <dl>
        <div>
          <dt>Capacidade</dt>
          <dd>{projection.capacitySummary}</dd>
        </div>
        <div>
          <dt>Direção</dt>
          <dd>{projection.directionSummary}</dd>
        </div>
        <div>
          <dt>Atenção</dt>
          <dd>{projection.attentionSummary}</dd>
        </div>
      </dl>
    </section>
  )
}
