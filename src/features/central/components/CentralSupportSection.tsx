import { centralSupportPaths } from '../domain/centralGovernance'
import { CentralDisclosureBlock } from './CentralDisclosureBlock'
import { CentralGovernedFlow } from './CentralGovernedFlow'

export function CentralSupportSection() {
  return (
    <section className="central-section central-support-section" aria-label="CTR06 Suporte">
      <header>
        <small>CTR06</small>
        <h2>Suporte</h2>
        <p>Orientação de suporte sem ticket real, chat ou FAQ extensa nesta fase.</p>
      </header>
      <CentralDisclosureBlock title="Caminhos de suporte">
        <ul>
          {centralSupportPaths.map((path) => (
            <li key={path}>{path}</li>
          ))}
        </ul>
      </CentralDisclosureBlock>
      <CentralGovernedFlow
        flowType="support"
        title="Reportar erro"
        description="Um relato futuro deve usar contexto mínimo e evitar texto livre sensível por padrão."
        consequence="Quando existir, o suporte poderá receber estado técnico e descrição controlada."
        limitation="Nesta fase nenhum ticket é criado e nenhum chat é aberto."
        requiresBackend
      />
    </section>
  )
}
