import { AiSuggestion } from '../domain/aiState'

type SuggestionCardProps = {
  suggestion: AiSuggestion
  onReview: () => void
}

export function SuggestionCard({ suggestion, onReview }: SuggestionCardProps) {
  return (
    <aside className="suggestion-card" aria-label="Idea contextual">
      <div>
        <span className="eyebrow">{suggestion.state}</span>
        <h2>{suggestion.title}</h2>
        <p>{suggestion.body}</p>
      </div>

      <button type="button" onClick={onReview}>
        Revisar
      </button>
    </aside>
  )
}
