import { describe, expect, it, vi } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

vi.mock('../lib/supabase/client', () => ({
  getSupabaseClient: () => null,
  requireSupabaseClient: () => {
    throw new Error('Supabase environment is not configured')
  },
}))

import {
  closeDay,
  createDependency,
  createItem,
  openDay,
} from '../shared/commands/operationalCommandHandlers'
import { entityChangeEventsRepository } from '../shared/repositories/entityChangeEventsRepository'
import { buildTodayProjection } from '../features/fazer/domain/todayProjection'
import { buildTimelineProjection } from '../features/fazer/domain/timelineProjection'

const srcRoot = dirname(dirname(fileURLToPath(import.meta.url)))

describe('P5 daily cycle and timeline', () => {
  it('opens and closes a daily session with contextual readings and events', async () => {
    const userId = scopedUser()
    let snapshot = await createItem({
      userId,
      entityType: 'task',
      title: 'Abrir ciclo diario',
      priority: 3,
      durationMinutes: null,
    })

    snapshot = await openDay(userId, '2026-05-18')
    const opened = snapshot.dailySessions.find(
      (session) => session.date === '2026-05-18',
    )

    expect(opened).toMatchObject({
      sessionStatus: 'open',
      date: '2026-05-18',
    })
    expect(opened?.openedAt).toBeTruthy()
    expect(opened?.openingReading).toMatchObject({
      attention: expect.any(Number),
      blocked: expect.any(Number),
    })
    expect(opened?.capacityReading).toMatchObject({
      state: expect.any(String),
      confidence: expect.any(String),
    })
    expect(opened?.directionReading).toMatchObject({
      state: expect.any(String),
    })

    snapshot = await closeDay(userId, '2026-05-18', 'Fechamento enxuto')
    const closed = snapshot.dailySessions.find(
      (session) => session.date === '2026-05-18',
    )

    expect(closed).toMatchObject({
      sessionStatus: 'closed',
      closingNote: 'Fechamento enxuto',
    })
    expect(closed?.closedAt).toBeTruthy()

    const events = await entityChangeEventsRepository.list(userId)
    expect(events.map((event) => event.changeType)).toEqual(
      expect.arrayContaining(['day_opened', 'day_closed']),
    )
  })

  it('does not reopen or emit a new opening event for an already closed day', async () => {
    const userId = scopedUser()
    let snapshot = await openDay(userId, '2026-05-19')
    snapshot = await closeDay(userId, '2026-05-19', 'Fechado')
    const closed = snapshot.dailySessions.find(
      (session) => session.date === '2026-05-19',
    )!

    snapshot = await openDay(userId, '2026-05-19')
    const afterReopenAttempt = snapshot.dailySessions.find(
      (session) => session.date === '2026-05-19',
    )!
    const events = await entityChangeEventsRepository.list(userId)

    expect(afterReopenAttempt).toEqual(closed)
    expect(events.filter((event) => event.changeType === 'day_opened')).toHaveLength(1)
  })

  it('keeps TodayProjection as the source of Hoje lanes and readings', async () => {
    const userId = scopedUser()
    let snapshot = await createItem({
      userId,
      entityType: 'task',
      title: 'Predecessor do dia',
      priority: 3,
      durationMinutes: 30,
    })
    const predecessor = snapshot.items.find(
      (item) => item.title === 'Predecessor do dia',
    )!
    snapshot = await createItem({
      userId,
      entityType: 'task',
      title: 'Bloqueado pela sequencia',
      priority: 2,
      durationMinutes: null,
    })
    const successor = snapshot.items.find(
      (item) => item.title === 'Bloqueado pela sequencia',
    )!
    snapshot = await createDependency({
      userId,
      predecessorId: predecessor.id,
      successorId: successor.id,
      justification: 'Sequencia do dia',
      impact: 'Evita puxar trabalho bloqueado',
    })

    const projection = buildTodayProjection(
      snapshot.items,
      snapshot.conditions,
      snapshot.dependencies,
    )

    expect(projection.now).toBeDefined()
    expect(projection.later).toBeDefined()
    expect(projection.attention).toBeDefined()
    expect(projection.blocked.map((item) => item.id)).toContain(successor.id)
    expect(projection.paused).toBeDefined()
    expect(projection.completed).toBeDefined()
    expect(projection.readings.direction).toBeTruthy()
    expect(projection.readings.capacity).toBeTruthy()
    expect(projection.readings.dependencyRisk).toBeTruthy()
  })

  it('keeps Timeline lenses operational and capacity qualitative', async () => {
    const userId = scopedUser()
    let snapshot = await createItem({
      userId,
      entityType: 'reminder',
      title: 'Temporal com data',
      dateStart: '2026-05-18',
      durationMinutes: null,
    })
    const first = snapshot.items[0]
    snapshot = await createItem({
      userId,
      entityType: 'task',
      title: 'Sem duracao declarada',
      durationMinutes: null,
    })
    const second = snapshot.items.find(
      (item) => item.title === 'Sem duracao declarada',
    )!
    snapshot = await createDependency({
      userId,
      predecessorId: first.id,
      successorId: second.id,
      justification: 'Cadeia minima',
      impact: 'Mostra bloqueio e impacto operacional',
    })

    const calendar = buildTimelineProjection(
      snapshot.items,
      snapshot.conditions,
      snapshot.dependencies,
      'calendar',
    )
    const capacity = buildTimelineProjection(
      snapshot.items,
      snapshot.conditions,
      snapshot.dependencies,
      'capacity',
    )
    const dependency = buildTimelineProjection(
      snapshot.items,
      snapshot.conditions,
      snapshot.dependencies,
      'dependency',
    )

    expect(calendar.entries.every((entry) => entry.label !== 'Sem janela fixa')).toBe(
      true,
    )
    expect(capacity.readings.capacity.confidence).toBe('unknown')
    expect(capacity.entries[0].detail).toContain('nenhuma duração foi inventada')
    expect(dependency.entries[0].detail).toContain('Mostra bloqueio')
    expect(dependency.readings.dependencies.blocked).toHaveLength(1)
  })

  it('keeps UI away from Supabase and core domain decisions', () => {
    const uiSource = readSourceFiles([
      'features/fazer/components',
      'features/fazer/screens',
    ])

    expect(uiSource).not.toContain('getSupabaseClient')
    expect(uiSource).not.toContain('itemsRepository')
    expect(uiSource).not.toContain('isEligibleForNow(')
    expect(uiSource).not.toContain('calculateDependencies(')
  })
})

function scopedUser() {
  return `daily-timeline-${crypto.randomUUID()}`
}

function readSourceFiles(paths: string[]) {
  return paths
    .flatMap((path) => readFilesRecursively(join(srcRoot, path)))
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n')
}

function readFilesRecursively(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(path, entry.name)

    if (entry.isDirectory()) {
      return readFilesRecursively(entryPath)
    }

    return /\.(ts|tsx)$/.test(entry.name) ? [entryPath] : []
  })
}
