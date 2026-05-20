import type { WeeklyReviewProjection } from '../domain/weeklyReviewProjection'
import { WeeklyCapacityBlock } from './WeeklyCapacityBlock'
import { WeeklyContinuityBlock } from './WeeklyContinuityBlock'
import { WeeklyDirectionBlock } from './WeeklyDirectionBlock'
import { WeeklyProtectedEssentialsBlock } from './WeeklyProtectedEssentialsBlock'
import { WeeklyReviewPromptList } from './WeeklyReviewPromptList'
import { WeeklyReviewReadings } from './WeeklyReviewReadings'
import { describeWeeklyReview } from './weeklyReviewPresentation'

type WeeklyReviewLayerProps = {
  projection: WeeklyReviewProjection
}

export function WeeklyReviewLayer({ projection }: WeeklyReviewLayerProps) {
  return (
    <section className="weekly-review-layer" aria-label="Revisão Semanal">
      <header className="weekly-review-layer__header">
        <div>
          <small>PL06</small>
          <h2>Revisão Semanal</h2>
          <p>{describeWeeklyReview(projection)}</p>
        </div>
        <strong>{projection.periodLabel}</strong>
      </header>
      <WeeklyReviewReadings projection={projection} />
      <div className="weekly-review-layer__grid">
        <WeeklyDirectionBlock projection={projection} />
        <WeeklyCapacityBlock projection={projection} />
        <WeeklyContinuityBlock projection={projection} />
        <WeeklyProtectedEssentialsBlock projection={projection} />
      </div>
      <WeeklyReviewPromptList projection={projection} />
    </section>
  )
}
