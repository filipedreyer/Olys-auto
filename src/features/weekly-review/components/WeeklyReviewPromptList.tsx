import type { WeeklyReviewProjection } from '../domain/weeklyReviewProjection'

type WeeklyReviewPromptListProps = {
  projection: WeeklyReviewProjection
}

export function WeeklyReviewPromptList({ projection }: WeeklyReviewPromptListProps) {
  return (
    <section className="weekly-review-prompts" aria-label="Perguntas de revisão semanal">
      <small>Revisão</small>
      <h3>Perguntas de coerência</h3>
      <ul>
        {projection.reviewPrompts.map((prompt) => (
          <li key={prompt}>{prompt}</li>
        ))}
      </ul>
      {projection.missingInformation.length > 0 ? (
        <div className="weekly-review-prompts__missing">
          {projection.missingInformation.map((missing) => (
            <p key={missing}>{missing}</p>
          ))}
        </div>
      ) : null}
    </section>
  )
}
