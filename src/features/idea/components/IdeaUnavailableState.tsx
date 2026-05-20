type IdeaUnavailableStateProps = {
  onGenerateLocal: () => void
}

export function IdeaUnavailableState({ onGenerateLocal }: IdeaUnavailableStateProps) {
  return (
    <section className="idea-output-card idea-output-card--unavailable" role="status">
      <span>IA indisponível</span>
      <h3>Leitura local disponível</h3>
      <p>
        Nenhum serviço externo foi chamado. O Olys continua funcionando com uma leitura
        determinística do contexto carregado.
      </p>
      <button className="olys-button" type="button" onClick={onGenerateLocal}>
        Gerar leitura local
      </button>
    </section>
  )
}
