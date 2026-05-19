import { useState } from 'react'
import { ConfirmationSheet } from '../../ia/components/ConfirmationSheet'
import { SuggestionCard } from '../../ia/components/SuggestionCard'
import { contextualIdeaSuggestion } from '../../ia/domain/aiState'
import { useOperationalStore } from '../../../shared/store/operationalStore'
import { AttentionLayer } from '../components/AttentionLayer'
import { CompletedLayer } from '../components/CompletedLayer'
import { NowStage } from '../components/NowStage'
import { TodayCyclePanel } from '../components/TodayCyclePanel'
import { TodayHeader } from '../components/TodayHeader'
import { TodayIndicators } from '../components/TodayIndicators'
import { TodaySecondaryLayer } from '../components/TodaySecondaryLayer'
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
  const dayState = resolveDayState(currentSession)

  return (
    <section className="hoje-screen fazer-territory">
      <TodayHeader
        dayState={dayState}
        attentionSummary={currentSession?.attentionSummary}
      />

      <TodayIndicators
        capacity={projection.readings.capacity}
        dependencyRisk={projection.readings.dependencyRisk}
        direction={projection.readings.direction}
      />

      <TodayCyclePanel
        dayState={dayState}
        closingNote={closingNote}
        busy={busy}
        onClosingNoteChange={setClosingNote}
        onOpening={() => void openDay(today)}
        onClosing={() => {
          void closeDay(today, closingNote)
          setClosingNote('')
        }}
      />

      <NowStage items={projection.now} details={projection.itemDetails} />

      <TodaySecondaryLayer
        items={projection.later}
        details={projection.itemDetails}
      />

      <AttentionLayer
        attention={projection.attention}
        blocked={projection.blocked}
        details={projection.itemDetails}
      />

      <CompletedLayer
        items={projection.completed}
        details={projection.itemDetails}
      />

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

function resolveDayState(session?: { openedAt?: string; sessionStatus?: string }) {
  if (session?.sessionStatus === 'closed') {
    return 'Dia fechado'
  }

  if (session?.openedAt) {
    return 'Dia aberto'
  }

  return 'Dia por abrir'
}
