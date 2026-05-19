import { FormEvent, useState } from 'react'
import { useOperationalStore } from '../../../shared/store/operationalStore'
import { CaptureDestinationId } from '../domain/captureDestination'
import { CaptureComposer } from './CaptureComposer'
import { CaptureGrid } from './CaptureGrid'
import { getCaptureDestinationPresentation } from './capturePresentation'

type CaptureSurfaceProps = {
  onCaptured?: () => void
  submitLabel?: string
}

export function CaptureSurface({ onCaptured, submitLabel = 'Enviar' }: CaptureSurfaceProps) {
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
      setMessage('Nada capturado. Escreva algo para enviar.')
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
    setMessage('Capturado.')
    onCaptured?.()
  }

  const destinationPresentation = getCaptureDestinationPresentation(destination)
  const helperMessage =
    message ??
    (destination === 'inbox'
      ? 'Sem tipo explícito, entra na Inbox.'
      : `Destino selecionado: ${destinationPresentation.label}.`)

  return (
    <form className="capture-surface" onSubmit={handleSubmit}>
      <CaptureComposer
        value={title}
        onChange={setTitle}
        busy={busy}
        message={helperMessage}
        error={error}
        submitLabel={submitLabel}
      />

      <CaptureGrid selected={destination} onSelect={setDestination} />

      {destination === 'reminder' ? (
        <label className="capture-date-field">
          <span>Data do lembrete</span>
          <input
            type="date"
            value={dateStart}
            onChange={(event) => setDateStart(event.target.value)}
          />
          <small>Lembrete precisa de data ou horário para existir fora da Inbox.</small>
        </label>
      ) : null}
    </form>
  )
}
