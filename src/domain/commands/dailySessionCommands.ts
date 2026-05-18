import { DailySession } from '../entities/types'

const nowIso = () => new Date().toISOString()
const id = () => crypto.randomUUID()

export function openDay(
  sessions: DailySession[],
  input: {
    userId: string
    date: string
    openingReading?: Record<string, unknown>
    capacityReading?: Record<string, unknown>
    directionReading?: Record<string, unknown>
    attentionSummary?: string
  },
): DailySession[] {
  const existing = sessions.find(
    (session) => session.userId === input.userId && session.date === input.date,
  )

  if (existing) {
    return sessions.map((session) =>
      session.id === existing.id
        ? {
            ...session,
            openedAt: session.openedAt ?? nowIso(),
            openingReading: input.openingReading ?? session.openingReading,
            capacityReading: input.capacityReading ?? session.capacityReading,
            directionReading: input.directionReading ?? session.directionReading,
            attentionSummary: input.attentionSummary ?? session.attentionSummary,
            sessionStatus: session.closedAt ? 'closed' : 'open',
            updatedAt: nowIso(),
          }
        : session,
    )
  }

  const createdAt = nowIso()

  return [
    {
      id: id(),
      userId: input.userId,
      date: input.date,
      openedAt: createdAt,
      openingReading: input.openingReading,
      capacityReading: input.capacityReading,
      directionReading: input.directionReading,
      attentionSummary: input.attentionSummary,
      sessionStatus: 'open',
      createdAt,
      updatedAt: createdAt,
    },
    ...sessions,
  ]
}

export function closeDay(
  sessions: DailySession[],
  input: {
    userId: string
    date: string
    closingNote: string
    openingReading?: Record<string, unknown>
    capacityReading?: Record<string, unknown>
    directionReading?: Record<string, unknown>
    attentionSummary?: string
  },
): DailySession[] {
  const withSession = openDay(sessions, input)
  const closedAt = nowIso()

  return withSession.map((session) =>
    session.userId === input.userId && session.date === input.date
      ? {
          ...session,
          closedAt,
          openingReading: input.openingReading ?? session.openingReading,
          capacityReading: input.capacityReading ?? session.capacityReading,
          directionReading: input.directionReading ?? session.directionReading,
          attentionSummary: input.attentionSummary ?? session.attentionSummary,
          sessionStatus: 'closed',
          closingNote: input.closingNote,
          updatedAt: closedAt,
        }
      : session,
  )
}
