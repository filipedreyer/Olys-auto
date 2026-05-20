import type { IdeaContextSummary as IdeaContextSummaryModel } from '../domain/ideaTypes'

type IdeaContextSummaryProps = {
  context: IdeaContextSummaryModel
}

export function IdeaContextSummary({ context }: IdeaContextSummaryProps) {
  return (
    <section className="idea-context-summary" aria-label="Contexto usado pela Idea">
      <header>
        <span>Contexto mínimo</span>
        <strong>{context.surface}</strong>
      </header>
      <p>{context.selectedContextSummary}</p>
      <div className="idea-context-summary__signals">
        {context.relevantSignals.map((signal) => (
          <span key={signal}>{signal}</span>
        ))}
      </div>
    </section>
  )
}
