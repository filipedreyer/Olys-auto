import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ConfirmationSheet } from '../../ia/components/ConfirmationSheet'
import { SuggestionCard } from '../../ia/components/SuggestionCard'
import { contextualIdeaSuggestion } from '../../ia/domain/aiState'
import { EmptyState } from '../../../shared/components/EmptyState'
import { useOperationalStore } from '../../../shared/store/operationalStore'
import { FocusIndicator } from '../components/FocusIndicator'
import { OperationalCarousel } from '../components/OperationalCarousel'
import { OperationalRow } from '../components/OperationalRow'
import { buildTodayProjection } from '../domain/todayProjection'

export function HojeScreen() {
  const items = useOperationalStore((state) => state.items)
  const conditions = useOperationalStore((state) => state.conditions)
  const dependencies = useOperationalStore((state) => state.dependencies)
  const dailySessions = useOperationalStore((state) => state.dailySessions)
  const status = useOperationalStore((state) => state.status)
  const openDay = useOperationalStore((state) => state.openDay)
  const closeDay = useOperationalStore((state) => state.closeDay)
  const projection = buildTodayProjection(items, conditions, dependencies)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [closingNote, setClosingNote] = useState('')
  const today = new Date().toISOString().slice(0, 10)
  const currentSession = dailySessions.find((session) => session.date === today)
  const busy = status === 'loading'

  return (
    <section className="hoje-screen fazer-territory">
      <header className="fazer-header">
        <div className="fazer-header__topline">
          <nav className="fazer-tabs" aria-label="Fazer">
            <NavLink to="/fazer/hoje">Hoje</NavLink>
            <NavLink to="/fazer/timeline">Timeline</NavLink>
          </nav>
          <span className="day-state">
            {currentSession?.sessionStatus === 'closed'
              ? 'Dia fechado'
              : currentSession?.openedAt
                ? 'Dia aberto'
                : 'Dia por abrir'}
          </span>
        </div>

        <div className="fazer-header__body">
          <div>
            <small>Fazer</small>
            <h1>Pressao, direcao e proximo movimento</h1>
            <p>{currentSession?.attentionSummary ?? 'Sem leitura registrada'}</p>
          </div>

          <div className="day-cycle-compact" aria-label="Ciclo do dia">
            <button type="button" disabled={busy} onClick={() => void openDay(today)}>
              Abrir o Dia
            </button>
            <input
              aria-label="Nota de fechamento"
              placeholder="Nota de fechamento"
              value={closingNote}
              onChange={(event) => setClosingNote(event.target.value)}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                void closeDay(today, closingNote)
                setClosingNote('')
              }}
            >
              Fechar
            </button>
          </div>
        </div>

        <section className="operational-indicators" aria-label="Indicadores">
          <FocusIndicator label={projection.readings.direction.statement} />
          <FocusIndicator label={projection.readings.direction.trajectory} />
          <FocusIndicator
            label={`Capacidade ${projection.readings.capacity.state}`}
          />
          <FocusIndicator label={projection.readings.dependencyRisk.summary} />
        </section>
      </header>

      <section className="now-stage" aria-label="Para fazer agora">
        <div className="now-stage__header">
          <span>Para fazer agora</span>
          <strong>{projection.now.length}</strong>
        </div>

        {projection.now.length === 0 ? (
          <EmptyState message="Nada puxado para agora; capture ou abra o dia quando houver contexto." />
        ) : (
          <OperationalCarousel
            items={projection.now}
            details={projection.itemDetails}
          />
        )}
      </section>

      <details className="today-secondary" open>
        <summary>
          <span>Cabe hoje</span>
          <strong>{projection.later.length}</strong>
        </summary>
        <div className="today-secondary__grid">
          {projection.later.length === 0 ? (
            <EmptyState message="Nenhum item qualificado para depois hoje." />
          ) : null}

          {projection.later.map((item) => (
            <OperationalRow
              key={item.id}
              title={item.title}
              meta={item.sourceContext}
              detail={projection.itemDetails[item.id]}
              state={item.status === 'paused' ? 'paused' : 'default'}
              size="compact"
            />
          ))}
        </div>
      </details>

      <section className="attention-layer" aria-label="Atenção">
        <div className="attention-layer__header">
          <span>Atencao</span>
          <strong>{projection.attention.length}</strong>
        </div>

        <div className="attention-layer__content">
          {projection.attention.length === 0 ? (
            <EmptyState message="Sem riscos ou informacoes incompletas pedindo atencao." />
          ) : null}

          {projection.attention.map((item) => (
            <OperationalRow
              key={item.id}
              title={item.title}
              meta={item.dateStart ?? item.sourceContext}
              detail="Risco operacional, dependencia ou informacao incompleta"
              state="attention"
              size="compact"
            />
          ))}

          {projection.blocked.map((item) => (
            <OperationalRow
              key={item.id}
              title={item.title}
              meta={item.sourceContext}
              detail={projection.itemDetails[item.id]}
              state="blocked"
              size="compact"
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
