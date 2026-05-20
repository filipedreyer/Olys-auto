import type { EntitySheetAttachmentSummary } from '../domain/entitySheetTypes'

type EntityAttachmentBlockProps = {
  attachment: EntitySheetAttachmentSummary
}

export function EntityAttachmentBlock({ attachment }: EntityAttachmentBlockProps) {
  return (
    <section className="entity-sheet-section entity-attachment-block" aria-label="Anexos">
      <header>
        <small>Anexos</small>
        <h3>Contrato futuro privado</h3>
      </header>
      <div className="entity-field entity-field--future-contract" data-role={attachment.status}>
        <span>Sem upload nesta fase</span>
        <strong>{attachment.description}</strong>
        <small>Não há storage público, URL pública ou criação de arquivo real.</small>
      </div>
    </section>
  )
}
