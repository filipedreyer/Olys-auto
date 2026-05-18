import { FormEvent, useState } from 'react'
import { EntityType } from '../../../domain/entities/types'
import { useOperationalStore } from '../../../shared/store/operationalStore'

const captureTypes: Array<{ label: string; value?: EntityType }> = [
  { label: 'Meta', value: 'goal' },
  { label: 'Projeto', value: 'project' },
  { label: 'Tarefa', value: 'task' },
  { label: 'Habito', value: 'habit' },
  { label: 'Rotina', value: 'routine' },
  { label: 'Agenda', value: 'agenda' },
  { label: 'Evento', value: 'event' },
  { label: 'Lembrete', value: 'reminder' },
  { label: 'Nota', value: 'note' },
  { label: 'Lista', value: 'list' },
  { label: 'Template', value: 'template' },
  { label: 'Inbox' },
]

export function CapturarScreen() {
  const capture = useOperationalStore((state) => state.capture)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<EntityType | undefined>()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    capture({ title, type })
    setTitle('')
    setType(undefined)
  }

  return (
    <form className="capturar-screen" onSubmit={handleSubmit}>
      <header className="screen-header">
        <div>
          <small>Capturar</small>
          <h1>Entrada transversal</h1>
        </div>
      </header>

      <section className="capture-type-list" aria-label="Destino contextual">
        {captureTypes.map((captureType) => (
          <button
            key={captureType.label}
            type="button"
            className="capture-chip"
            aria-pressed={type === captureType.value}
            onClick={() => setType(captureType.value)}
          >
            {captureType.label}
          </button>
        ))}
      </section>

      <textarea
        className="capturar-screen__input"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Capturar pensamento, ideia ou acao"
      />

      <button className="primary-action" type="submit">
        Capturar
      </button>
    </form>
  )
}
