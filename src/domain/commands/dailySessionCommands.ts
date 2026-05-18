import { DailySession } from '../entities/types'

const nowIso = () => new Date().toISOString()
const id = (prefix: string) => `${prefix}-${crypto.randomUUID()}`

export function openDay(
  sessions: DailySession[],
  input: { userId: string; date: string },
) {
  const existing = sessions.find(
    (session) => session.userId === input.userId && session.date === input.date,
  )

  if (existing) {
    return sessions.map((session) =>
      session.id === existing.id
        ? {
            ...session,
            openedAt: session.openedAt ?? nowIso(),
            updatedAt: nowIso(),
          }
        : session,
    )
  }

  const createdAt = nowIso()

  return [
    {
      id: id('day'),
      userId: input.userId,
      date: input.date,
      openedAt: createdAt,
      createdAt,
      updatedAt: createdAt,
    },
    ...sessions,
  ]
}

export function closeDay(
  sessions: DailySession[],
  input: { userId: string; date: string; closingNote: string },
) {
  const withSession = openDay(sessions, input)
  const closedAt = nowIso()

  return withSession.map((session) =>
    session.userId === input.userId && session.date === input.date
      ? {
          ...session,
          closedAt,
          closingNote: input.closingNote,
          updatedAt: closedAt,
        }
      : session,
  )
}
