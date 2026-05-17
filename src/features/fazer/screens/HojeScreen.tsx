import { OperationalRow } from '../components/OperationalRow'
import { mockTodayItems } from '../domain/mockTodayItems'
import { buildTodayProjection } from '../domain/todayProjection'

const projection = buildTodayProjection(mockTodayItems)

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

        {projection.now.map((item) => (
          <OperationalRow
            key={item.id}
            title={item.title}
            meta={item.contextLabel}
          />
        ))}
      </section>

      <section className="hoje-screen__group hoje-screen__group--secondary">
        <header>
          <h2>Cabe hoje</h2>
        </header>

        {projection.later.map((item) => (
          <OperationalRow
            key={item.id}
            title={item.title}
            meta={item.contextLabel}
          />
        ))}
      </section>

      <section className="hoje-screen__group hoje-screen__group--attention">
        <header>
          <h2>Atenção</h2>
        </header>

        {projection.attention.map((item) => (
          <OperationalRow
            key={item.id}
            title={item.title}
            meta={item.dueLabel}
            state="attention"
          />
        ))}
      </section>
    </section>
  )
}
