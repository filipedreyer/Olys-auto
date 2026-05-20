import type { WeeklyReviewProjection } from '../domain/weeklyReviewProjection'
import { describeProtectedEssentials } from './weeklyReviewPresentation'

type WeeklyProtectedEssentialsBlockProps = {
  projection: WeeklyReviewProjection
}

export function WeeklyProtectedEssentialsBlock({
  projection,
}: WeeklyProtectedEssentialsBlockProps) {
  return (
    <section className="weekly-protected-essentials-block" aria-label="Essenciais protegidos">
      <small>PL05</small>
      <h3>Essenciais protegidos como condição</h3>
      <p>{describeProtectedEssentials(projection.protectedEssentials.length)}</p>
      <div className="weekly-protected-essentials-block__list">
        {projection.protectedEssentials.length === 0 ? <span>Sem condição essential_protected ativa.</span> : null}
        {projection.protectedEssentials.map((essential) => (
          <article key={essential.conditionId}>
            <strong>{essential.title}</strong>
            <span>{essential.entityType} · conditionType essential_protected</span>
          </article>
        ))}
      </div>
    </section>
  )
}
