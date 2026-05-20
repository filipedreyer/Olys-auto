import { OlysButton, OlysSheet } from '../../../design-system'
import type { IdeaOutput } from '../domain/ideaTypes'

type IdeaConfirmationSheetProps = {
  output?: IdeaOutput
  onClose: () => void
}

export function IdeaConfirmationSheet({ output, onClose }: IdeaConfirmationSheetProps) {
  const action = output?.action
  const blocked = output?.safety && !output.safety.allowed

  return (
    <OlysSheet
      open={Boolean(output)}
      title="Confirmação da Idea"
      eyebrow="IA05"
      description="Nenhuma ação persistente será executada nesta fase."
      onClose={onClose}
      panelClassName="idea-confirmation-sheet"
    >
      {output && action ? (
        <div className="idea-confirmation-sheet__body">
          <span>{blocked ? 'Bloqueado' : 'Revisão obrigatória'}</span>
          <h3>{action.label}</h3>
          <p>{action.confirmationCopy}</p>
          <dl>
            <div>
              <dt>Tipo</dt>
              <dd>{action.actionType}</dd>
            </div>
            <div>
              <dt>Reversível</dt>
              <dd>{action.reversible ? 'sim' : 'não informado'}</dd>
            </div>
            <div>
              <dt>Persistência</dt>
              <dd>não aplicada nesta fase</dd>
            </div>
          </dl>
          {output.missingInformation.length > 0 ? (
            <p>Faltam dados: {output.missingInformation.join('; ')}</p>
          ) : null}
          {blocked ? <p>{output.safety?.userFacingReason}</p> : null}
          <div className="idea-confirmation-sheet__actions">
            <OlysButton variant="primary" type="button" onClick={onClose}>
              {blocked ? 'Entendi' : 'Confirmar simulação'}
            </OlysButton>
            <OlysButton variant="quiet" type="button" onClick={onClose}>
              Manter como sugestão
            </OlysButton>
          </div>
        </div>
      ) : (
        <div className="idea-confirmation-sheet__body">
          <p>Sem ação revisável.</p>
          <OlysButton variant="primary" type="button" onClick={onClose}>
            Entendi
          </OlysButton>
        </div>
      )}
    </OlysSheet>
  )
}
