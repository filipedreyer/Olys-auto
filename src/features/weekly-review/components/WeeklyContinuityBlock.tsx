import type { WeeklyReviewProjection } from '../domain/weeklyReviewProjection'
import { describeReplanningContract } from './weeklyReviewPresentation'

type WeeklyContinuityBlockProps = {
  projection: WeeklyReviewProjection
}

export function WeeklyContinuityBlock({ projection }: WeeklyContinuityBlockProps) {
  return (
    <section className="weekly-continuity-block" aria-label="Continuidade semanal">
      <small>Continuidade</small>
      <h3>{projection.continuityReading}</h3>
      <p>{projection.memoryRecoverableCount} contexto(s) recuperável(is) e {projection.inboxCarryoverCount} entrada(s) em transição.</p>
      <span>{describeReplanningContract()}</span>
    </section>
  )
}
