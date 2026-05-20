import { OlysIndicator } from '../../../design-system'
import type { WeeklyReviewProjection } from '../domain/weeklyReviewProjection'

type WeeklyReviewReadingsProps = {
  projection: WeeklyReviewProjection
}

export function WeeklyReviewReadings({ projection }: WeeklyReviewReadingsProps) {
  const readings = [
    { tone: 'direction' as const, label: projection.directionReading.statement },
    { tone: 'capacity' as const, label: projection.capacityReading.qualitativeLoad },
    {
      tone: projection.blockedCount > 0 ? ('attention' as const) : ('direction' as const),
      label: projection.blockedCount > 0
        ? `${projection.blockedCount} bloqueio(s) pedem sequência explícita`
        : 'Sem bloqueios ativos na leitura semanal',
    },
    { tone: 'unknown' as const, label: projection.continuityReading },
  ]

  return (
    <section className="weekly-review-readings" aria-label="Leituras da revisão semanal">
      {readings.map((reading) => (
        <OlysIndicator key={reading.label} tone={reading.tone} label={reading.label} />
      ))}
    </section>
  )
}
