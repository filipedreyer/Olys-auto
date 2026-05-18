import { useState } from 'react'
import { ConfirmationSheet } from '../../ia/components/ConfirmationSheet'
import { SuggestionCard } from '../../ia/components/SuggestionCard'
import { contextualIdeaSuggestion } from '../../ia/domain/aiState'
import { useOperationalStore } from '../../../shared/store/operationalStore'
import { FocusIndicator } from '../components/FocusIndicator'
import { OperationalRow } from '../components/OperationalRow'
import { buildTodayProjection } from '../domain/todayProjection'

export function HojeScreen() {
  const items = useOperationalStore((state) => state.items)
  const conditions = useOperationalStore((state) => state.conditions)
  const dependencies = useOperationalStore((state) => state.dependencies)
  const dailySessions = useOperationalStore((state) => state.dailySessions)
  const openDay = useOperationalStore((state) => state.openDay)
  const closeDay = useOperationalStore((state) => state.closeDay)
  const projection = buildTodayProjection(items, conditions, dependencies)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [closingNote, setClosingNote] = useState('')
  const today = new Date().toISOString().slice(0, 10)
  const currentSession = dailySessions.find((session) => session.date === today)

  return (
    <section className="hoje-screen">
      <header className="screen-header">
        <div>
          <small>Hoje</small>
          <h1>Direcao operacional</h1>
        </div>

        <span className="quiet-status">Release 1</span>
      </header>

      <section className="day-cycle" aria-label="Ciclo do dia">
        <div>
          <strong>
            {currentSession?.sessionStatus === 'closed'
              ? 'Dia fechado'
              : currentSession?.openedAt
                ? 'Dia aberto'
                : 'Dia ainda nao aberto'}
          </strong>
          <span>{currentSession?.attentionSummary ?? 'Sem leitura registrada'}</span>
        </div>

        <div className="day-cycle__actions">
          <button type="button" onClick={() => void openDay(today)}>
            Abrir o Dia
          </button>
          <input
            aria-label="Nota de fechamento"
            placeholder="Nota curta de fechamento"
            value={closingNote}
            onChange={(event) => setClosingNote(event.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              void closeDay(today, closingNote)
              setClosingNote('')
            }}
          >
            Fechar o Dia
          </button>
        </div>
      </section>

      <section className="focus-strip" aria-label="Leituras">
        <FocusIndicator label={projection.readings.direction.statement} />
        <FocusIndicator label={projection.readings.direction.trajectory} />
        <FocusIndicator
          label={`Capacidade ${projection.readings.capacity.state}`}
        />
        <FocusIndicator label={projection.readings.dependencyRisk.summary} />
      </section>

      <section className="surface-section">
        <header className="surface-section__header">
          <h2>Para fazer agora</h2>
        </header>

        <div className="surface-section__content">
          {projection.now.map((item) => (
            <OperationalRow
              key={item.id}
              title={item.title}
              meta={item.sourceContext}
              detail={projection.itemDetails[item.id]}
            />
          ))}
        </div>
      </section>

      <section className="surface-section">
        <header className="surface-section__header">
          <h2>Cabe hoje</h2>
        </header>

        <div className="surface-section__content">
          {projection.later.map((item) => (
            <OperationalRow
              key={item.id}
              title={item.title}
              meta={item.sourceContext}
              detail={projection.itemDetails[item.id]}
              state={item.status === 'paused' ? 'paused' : 'default'}
            />
          ))}
        </div>
      </section>

      <section className="surface-section">
        <header className="surface-section__header">
          <h2>Atencao</h2>
        </header>

        <div className="surface-section__content">
          {projection.attention.map((item) => (
            <OperationalRow
              key={item.id}
              title={item.title}
              meta={item.dateStart ?? item.sourceContext}
              detail="Risco operacional, dependencia ou informacao incompleta"
              state="attention"
            />
          ))}
        </div>
      </section>

      <SuggestionCard
        suggestion={contextualIdeaSuggestion}
        onReview={() => setConfirmationOpen(true)}
      />

      <ConfirmationSheet
        open={confirmationOpen}
        suggestion={{
          ...contextualIdeaSuggestion,
          state: 'needs_confirmation',
        }}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={() => setConfirmationOpen(false)}
      />
    </section>
  )
}
