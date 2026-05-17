export function TimelineScreen() {
  return (
    <section className="timeline-screen">
      <header className="timeline-screen__header">
        <div>
          <small>Timeline</small>
          <h1>Capacidade</h1>
        </div>
      </header>

      <section className="timeline-screen__surface">
        <article className="timeline-card">
          <strong>Hoje</strong>
          <span>Capacidade operacional estável</span>
        </article>

        <article className="timeline-card timeline-card--warning">
          <strong>Dependências</strong>
          <span>2 itens exigem revisão contextual</span>
        </article>
      </section>
    </section>
  )
}
