import { OperationalRow } from '../components/OperationalRow'

export function HojeScreen() {
  return (
    <section className="hoje-screen">
      <header className="hoje-screen__header">
        <div>
          <small>Segunda-feira</small>
          <h1>Hoje</h1>
        </div>

        <button>Abrir o Dia</button>
      </header>

      <section className="hoje-screen__group">
        <header>
          <h2>Para fazer agora</h2>
        </header>

        <OperationalRow
          title="Revisar planejamento operacional"
          meta="Projeto • Marketing Ops"
        />

        <OperationalRow
          title="Validar estrutura do release"
          meta="Essencial"
        />
      </section>

      <section className="hoje-screen__group hoje-screen__group--secondary">
        <header>
          <h2>Cabe hoje</h2>
        </header>

        <OperationalRow
          title="Consolidar projections"
          meta="Planejamento"
        />
      </section>

      <section className="hoje-screen__group hoje-screen__group--attention">
        <header>
          <h2>Atenção</h2>
        </header>

        <OperationalRow
          title="Dependência sem revisão recente"
          meta="Há 5 dias"
          state="attention"
        />
      </section>
    </section>
  )
}
