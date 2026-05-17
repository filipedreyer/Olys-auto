export function MemoriaScreen() {
  return (
    <section className="memoria-screen">
      <header className="memoria-screen__header">
        <small>Memória</small>
        <h1>Recuperação viva</h1>
      </header>

      <section className="memory-surface">
        <article className="memory-item">
          <strong>Itens</strong>
          <span>Entidades ativas, concluídas e recuperáveis.</span>
        </article>

        <article className="memory-item">
          <strong>Caixola</strong>
          <span>Materiais soltos aguardando sentido operacional.</span>
        </article>

        <article className="memory-item">
          <strong>Arquivados</strong>
          <span>Histórico preservado sem competir com a execução.</span>
        </article>
      </section>
    </section>
  )
}
