import type { WeeklyReviewProjection } from '../domain/weeklyReviewProjection'

type WeeklyDirectionBlockProps = {
  projection: WeeklyReviewProjection
}

export function WeeklyDirectionBlock({ projection }: WeeklyDirectionBlockProps) {
  return (
    <section className="weekly-direction-block" aria-label="Direção semanal">
      <small>Direção</small>
      <h3>{projection.directionReading.trajectory}</h3>
      <p>{projection.directionReading.statement}</p>
      <span>{projection.activeGoals} meta(s), {projection.activeProjects} projeto(s), {projection.rhythms} ritmo(s)</span>
    </section>
  )
}
