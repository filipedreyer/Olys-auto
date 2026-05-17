export function CapturarScreen() {
  return (
    <section className="capturar-screen">
      <header className="capturar-screen__header">
        <small>Capturar</small>
        <h1>Entrada rápida</h1>
      </header>

      <section className="capturar-screen__surface">
        <button className="capture-chip">Inbox</button>
        <button className="capture-chip">Tarefa</button>
        <button className="capture-chip">Nota</button>
        <button className="capture-chip">Projeto</button>
      </section>

      <textarea
        className="capturar-screen__input"
        placeholder="Capturar pensamento, ideia ou ação"
      />
    </section>
  )
}
