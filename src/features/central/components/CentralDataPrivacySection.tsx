import {
  centralDataCategories,
  centralDeletionLimits,
  centralExportLimits,
  centralOfflineLimits,
} from '../domain/centralGovernance'
import { CentralDisclosureBlock } from './CentralDisclosureBlock'
import { CentralGovernedFlow } from './CentralGovernedFlow'

export function CentralDataPrivacySection() {
  return (
    <section className="central-section central-data-privacy-section" aria-label="CTR03 Dados e Privacidade">
      <header>
        <small>CTR03</small>
        <h2>Dados e Privacidade</h2>
        <p>Escopo real dos dados operacionais e limites atuais de controle.</p>
      </header>

      <div className="central-section__list">
        {centralDataCategories.map((category) => (
          <article key={category.name}>
            <strong>{category.name}</strong>
            <p>{category.description}</p>
          </article>
        ))}
      </div>

      <div className="central-section__grid">
        <CentralDisclosureBlock title="Exportação">
          <ul>
            {centralExportLimits.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </CentralDisclosureBlock>
        <CentralDisclosureBlock title="Exclusão" tone="danger">
          <ul>
            {centralDeletionLimits.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </CentralDisclosureBlock>
        <CentralDisclosureBlock title="Offline e anexos" tone="attention">
          <ul>
            {centralOfflineLimits.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </CentralDisclosureBlock>
      </div>

      <div className="central-section__grid">
        <CentralGovernedFlow
          flowType="export"
          title="Solicitar exportação"
          description="Preparar uma exportação futura exige escopo, backend seguro e declaração de limites."
          consequence="Quando existir, a exportação poderá reunir categorias de dados declaradas antes da geração."
          limitation="Nesta fase nenhum arquivo é gerado e nenhum repository é acessado."
          requiresBackend
        />
        <CentralGovernedFlow
          flowType="deletion"
          title="Solicitar exclusão"
          description="Exclusão de conta ou dados precisa confirmação forte e backend governado."
          consequence="Quando existir, a exclusão poderá remover dados conforme escopo e retenção declarados."
          limitation="Nesta fase nada é apagado e nenhum command handler é chamado."
          requiresBackend
          dangerous
        />
      </div>
    </section>
  )
}
