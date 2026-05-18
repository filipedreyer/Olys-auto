import { FormEvent, useState } from 'react'
import { useOperationalStore } from '../../../shared/store/operationalStore'
import { CaptureDestinationId } from '../domain/captureDestination'
import { CaptureGrid } from './CaptureGrid'

type CaptureSurfaceProps = {
  onCaptured?: () => void
}

export function CaptureSurface({ onCaptured }: CaptureSurfaceProps) {
  const capture = useOperationalStore((state) => state.capture)
  const status = useOperationalStore((state) => state.status)
  const error = useOperationalStore((state) => state.error)
  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState<CaptureDestinationId>('inbox')
  const [dateStart, setDateStart] = useState('')
  const [message, setMessage] = useState<string | undefined>()
  const busy = status === 'loading'

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setMessage(undefined)

    if (!title.trim()) {
      setMessage('Nada capturado')
      return
    }

    await capture({
      title,
      destination,
      dateStart: dateStart || undefined,
    })

    if (useOperationalStore.getState().error) {
      setMessage(undefined)
      return
    }

    setTitle('')
    setDateStart('')
    setDestination('inbox')
    setMessage('Capturado')
    onCaptured?.()
  }

  return (
    <form className="capture-surface" onSubmit={handleSubmit}>
      <div className="capture-surface__field">
        <label htmlFor="capture-input">Capturar</label>
        <textarea
          id="capture-input"
          aria-label="Texto para capturar"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Solte aqui o que precisa sair da cabeca"
        />
      </div>

      <CaptureGrid selected={destination} onSelect={setDestination} />

      {destination === 'reminder' ? (
        <label className="capture-date-field">
          Data do lembrete
          <input
            type="date"
            value={dateStart}
            onChange={(event) => setDateStart(event.target.value)}
          />
        </label>
      ) : null}

      <div className="capture-surface__footer">
        <span className="surface-note">
          {message ?? 'Sem tipo explicito, entra na Inbox.'}
        </span>
        {error ? <span className="auth-form__error">{error}</span> : null}
        <button className="primary-action" type="submit" disabled={busy}>
          {busy ? 'Capturando...' : 'Capturar'}
        </button>
      </div>
    </form>
  )
}
