type CaptureComposerProps = {
  value: string
  onChange: (value: string) => void
  busy: boolean
  message: string
  error?: string
  submitLabel?: string
}

export function CaptureComposer({
  value,
  onChange,
  busy,
  message,
  error,
  submitLabel = 'Enviar',
}: CaptureComposerProps) {
  return (
    <section className="capture-composer" aria-label="Entrada de captura">
      <div className="capture-composer__field">
        <label htmlFor="capture-input">Capturar</label>
        <textarea
          id="capture-input"
          aria-label="Texto para capturar"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Solte aqui o que precisa sair da cabeça"
        />
      </div>

      <div className="capture-composer__actions" aria-label="Ações preparatórias da captura">
        <button
          type="button"
          className="capture-composer__utility"
          aria-label="Áudio ainda não implementado"
          aria-disabled="true"
          disabled
        >
          Áudio
        </button>
        <button
          type="button"
          className="capture-composer__utility"
          aria-label="Anexo ainda não implementado"
          aria-disabled="true"
          disabled
        >
          Anexo
        </button>
        <button
          type="button"
          className="capture-composer__utility"
          aria-label="Idea contextual ainda não implementada na captura"
          aria-disabled="true"
          disabled
        >
          Idea
        </button>
        <button className="primary-action capture-composer__submit" type="submit" disabled={busy}>
          {busy ? 'Enviando...' : submitLabel}
        </button>
      </div>

      <div className="capture-composer__feedback">
        <span className="surface-note capture-composer__status" role="status">
          {message}
        </span>
        {error ? (
          <span className="auth-form__error" role="alert">
            {error}
          </span>
        ) : null}
      </div>
    </section>
  )
}
