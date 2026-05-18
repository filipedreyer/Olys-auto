import { AiSuggestion } from '../domain/aiState'

type ConfirmationSheetProps = {
  open: boolean
  suggestion: AiSuggestion
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmationSheet({
  open,
  suggestion,
  onClose,
  onConfirm,
}: ConfirmationSheetProps) {
  if (!open) {
    return null
  }

  return (
    <div
      className="confirmation-sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-sheet-title"
    >
      <div className="confirmation-sheet__panel">
        <span className="eyebrow">confirmacao necessaria</span>
        <h2 id="confirmation-sheet-title">{suggestion.proposedAction}</h2>
        <p>
          A IA pode propor estrutura e leitura, mas a acao relevante so acontece
          apos confirmacao explicita.
        </p>

        <div className="confirmation-sheet__actions">
          <button type="button" onClick={onClose}>
            Manter como leitura
          </button>
          <button type="button" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
