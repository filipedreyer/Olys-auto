import { FormEvent, useState } from 'react'
import { useOperationalStore } from '../../../shared/store/operationalStore'
import { CaptureGrid } from '../components/CaptureGrid'
import { CaptureDestinationId } from '../domain/captureDestination'

export function CapturarScreen() {
  const capture = useOperationalStore((state) => state.capture)
  const status = useOperationalStore((state) => state.status)
  const error = useOperationalStore((state) => state.error)
  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState<CaptureDestinationId>('inbox')
  const [dateStart, setDateStart] = useState('')
  const [message, setMessage] = useState<string | undefined>()

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
  }

  return (
    <form className="capturar-screen" onSubmit={handleSubmit}>
      <header className="screen-header">
        <div>
          <small>Capturar</small>
          <h1>Entrada transversal</h1>
        </div>
      </header>

      <CaptureGrid selected={destination} onSelect={setDestination} />

      <textarea
        aria-label="Texto para capturar"
        className="capturar-screen__input"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Capturar pensamento, ideia ou acao"
      />

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

      {message ? <p className="surface-note">{message}</p> : null}
      {error ? <p className="auth-form__error">{error}</p> : null}

      <button className="primary-action" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Capturando...' : 'Capturar'}
      </button>
    </form>
  )
}
