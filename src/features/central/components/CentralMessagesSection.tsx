import { CentralDisclosureBlock } from './CentralDisclosureBlock'

export function CentralMessagesSection() {
  return (
    <section className="central-section central-messages-section" aria-label="CTR02 Recados">
      <header>
        <small>CTR02</small>
        <h2>Recados</h2>
        <p>Recados do produto ficam separados de Admin e de marketing.</p>
      </header>
      <CentralDisclosureBlock title="Sem recados administrados nesta fase" tone="attention">
        <p>
          A área existe como espaço preparado. Publicação, edição e auditoria de recados
          dependem do Admin seguro da Fase 14.
        </p>
      </CentralDisclosureBlock>
    </section>
  )
}
