import { centralAiLimits } from '../domain/centralGovernance'
import { CentralDisclosureBlock } from './CentralDisclosureBlock'

const outputTypes = ['Leitura', 'Sugestão', 'Relatório', 'Ação proposta']

export function CentralAiTransparencySection() {
  return (
    <section className="central-section central-ai-transparency-section" aria-label="CTR05 IA e Transparência">
      <header>
        <small>CTR05</small>
        <h2>IA e Transparência</h2>
        <p>Limites reais da Idea, tipos de output e confirmação antes de ação.</p>
      </header>
      <div className="central-section__grid">
        <CentralDisclosureBlock title="Tipos de output">
          <ul>
            {outputTypes.map((type) => (
              <li key={type}>{type}</li>
            ))}
          </ul>
        </CentralDisclosureBlock>
        <CentralDisclosureBlock title="Safety Gate e confirmação" tone="attention">
          <p>
            Ação proposta não é comando. Qualquer persistência exige Confirmation
            Sheet e bloqueio quando houver risco ou falta de confirmação.
          </p>
        </CentralDisclosureBlock>
      </div>
      <div className="central-section__list">
        {centralAiLimits.map((limit) => (
          <article key={limit}>
            <strong>Limite declarado</strong>
            <p>{limit}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
