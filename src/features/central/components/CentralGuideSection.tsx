import { CentralDisclosureBlock } from './CentralDisclosureBlock'

export function CentralGuideSection() {
  return (
    <section className="central-section central-guide-section" aria-label="CTR01 Guia">
      <header>
        <small>CTR01</small>
        <h2>Guia</h2>
        <p>Um mapa curto para entender o Olys sem virar tutorial longo.</p>
      </header>
      <div className="central-section__grid">
        <CentralDisclosureBlock title="Execução, direção e memória">
          <p>
            Capturar tira da cabeça, Inbox decide destino, Fazer executa, Planejar
            orienta direção e Memória recupera contexto longitudinal.
          </p>
        </CentralDisclosureBlock>
        <CentralDisclosureBlock title="Inbox e Caixola não são a mesma coisa">
          <p>
            Inbox é triagem transitória. Caixola é incubação e recuperação em Memória,
            sem virar fila de trabalho.
          </p>
        </CentralDisclosureBlock>
        <CentralDisclosureBlock title="Vínculo não é dependência">
          <p>
            Vínculo aproxima contexto. Dependência declara consequência operacional
            entre predecessor e sucessor.
          </p>
        </CentralDisclosureBlock>
        <CentralDisclosureBlock title="Idea sugere, você decide">
          <p>
            Idea pode ler contexto, sugerir, relatar ou propor ação. Ação persistente
            exige confirmação e Safety Gate.
          </p>
        </CentralDisclosureBlock>
      </div>
    </section>
  )
}
