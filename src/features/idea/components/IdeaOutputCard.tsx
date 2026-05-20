import { OlysButton } from '../../../design-system'
import type { IdeaOutput } from '../domain/ideaTypes'

type IdeaOutputCardProps = {
  output: IdeaOutput
  onReviewAction: (output: IdeaOutput) => void
}

const outputLabels: Record<IdeaOutput['type'], string> = {
  reading: 'Leitura',
  suggestion: 'Sugestão',
  report: 'Relatório',
  proposed_action: 'Ação proposta',
  unavailable: 'Indisponível',
  safety_blocked: 'Bloqueado',
}

export function IdeaOutputCard({ output, onReviewAction }: IdeaOutputCardProps) {
  const showConfidence = output.confidence === 'low' || output.confidence === 'medium'

  return (
    <article className={`idea-output-card idea-output-card--${output.type}`}>
      <header>
        <span>{outputLabels[output.type]}</span>
        {showConfidence ? <small>Confiança {output.confidence}</small> : null}
      </header>
      <h3>{output.title}</h3>
      <p>{output.description}</p>

      {output.assumptions.length > 0 ? (
        <div className="idea-output-card__meta">
          <strong>Premissas</strong>
          {output.assumptions.map((assumption) => (
            <span key={assumption}>{assumption}</span>
          ))}
        </div>
      ) : null}

      {output.missingInformation.length > 0 ? (
        <div className="idea-output-card__meta">
          <strong>Informação faltante</strong>
          {output.missingInformation.map((missing) => (
            <span key={missing}>{missing}</span>
          ))}
        </div>
      ) : null}

      {output.type === 'proposed_action' && output.action ? (
        <OlysButton
          variant="secondary"
          type="button"
          onClick={() => onReviewAction(output)}
          aria-label={`Revisar antes de aplicar: ${output.action.label}`}
        >
          Revisar antes de aplicar
        </OlysButton>
      ) : null}
    </article>
  )
}
