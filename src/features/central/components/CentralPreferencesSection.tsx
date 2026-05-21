import { centralPreferenceContracts } from '../domain/centralPresentation'
import { CentralGovernedFlow } from './CentralGovernedFlow'

export function CentralPreferencesSection() {
  return (
    <section className="central-section central-preferences-section" aria-label="CTR04 Preferências">
      <header>
        <small>CTR04</small>
        <h2>Preferências</h2>
        <p>Preferências aparecem como contratos honestos até existir persistência governada.</p>
      </header>
      <div className="central-section__list">
        {centralPreferenceContracts.map((preference) => (
          <article key={preference.title}>
            <strong>{preference.title}</strong>
            <p>{preference.description}</p>
            <span>Preparatório: ainda não salvo como preferência persistida.</span>
          </article>
        ))}
      </div>
      <CentralGovernedFlow
        flowType="preference"
        title="Preferências futuras"
        description="Preferências só devem ser aplicadas quando houver armazenamento e efeito reais."
        consequence="A aplicação futura poderá ajustar experiência sem mudar regras operacionais."
        limitation="Nesta fase não há salvamento de preferência."
        requiresBackend
      />
    </section>
  )
}
