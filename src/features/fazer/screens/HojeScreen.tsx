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
  const projection = buildTodayProjection(items)
  const [confirmationOpen, setConfirmationOpen] = useState(false)

  return (
    <section className="hoje-screen">
      <header className="screen-header">
        <div>
          <small>Hoje</small>
          <h1>Direcao operacional</h1>
        </div>

        <span className="quiet-status">Release 1</span>
      </header>

      <section className="focus-strip" aria-label="Leituras">
        <FocusIndicator label={projection.readings.direction.statement} />
        <FocusIndicator
          label={`Capacidade ${projection.readings.capacity.posture}`}
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
              meta={item.contextLabel}
              detail={
                item.essentialProtected
                  ? 'Essencial Protegido como condicao'
                  : item.scheduledLabel
              }
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
              meta={item.contextLabel}
              detail={
                typeof item.durationMinutes === 'number'
                  ? `${item.durationMinutes} min declarados`
                  : 'Duracao desconhecida'
              }
              state={item.state === 'paused' ? 'paused' : 'default'}
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
              meta={item.dueLabel ?? item.contextLabel}
              detail={item.dependency?.impact}
              state={item.state === 'blocked' ? 'blocked' : 'attention'}
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
