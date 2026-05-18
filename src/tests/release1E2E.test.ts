import { describe, expect, it, vi } from 'vitest'

vi.mock('../lib/supabase/client', () => ({
  getSupabaseClient: () => null,
  requireSupabaseClient: () => {
    throw new Error('Supabase environment is not configured')
  },
}))

import {
  archiveItem,
  captureInput,
  completeItem,
  convertInboxItem,
  createItem,
  openDay,
  restoreItem,
  updateItem,
} from '../shared/commands/operationalCommandHandlers'
import { entityChangeEventsRepository } from '../shared/repositories/entityChangeEventsRepository'
import { buildTodayProjection } from '../features/fazer/domain/todayProjection'
import { buildTimelineProjection } from '../features/fazer/domain/timelineProjection'
import { buildPlanningProjection } from '../features/planejar/domain/planningProjection'
import { buildMemoryProjection } from '../features/memoria/domain/memoryProjection'
import { buildInboxProjection } from '../features/inbox/domain/inboxProjection'

describe('Release 1 end-to-end operational coherence', () => {
  it('keeps continuity from capture to recovery without bypassing projections', async () => {
    const userId = `r1-e2e-${crypto.randomUUID()}`
    let snapshot = await captureInput({
      userId,
      title: 'Decidir proximo passo da release',
    })
    const inboxId = snapshot.inboxItems[0].id

    expect(buildInboxProjection(snapshot.inboxItems).readings.pending).toBe(1)

    snapshot = await convertInboxItem(userId, inboxId, 'task')
    const task = snapshot.items.find((item) => item.sourceContext === `inbox:${inboxId}`)!

    snapshot = await updateItem(userId, task.id, {
      dateStart: '2026-05-18',
      priority: 3,
    })
    snapshot = await createItem({
      userId,
      entityType: 'goal',
      title: 'Fechar Release 1 com coerencia',
      durationMinutes: null,
    })
    snapshot = await createItem({
      userId,
      entityType: 'project',
      title: 'Consolidacao operacional',
      durationMinutes: null,
    })

    snapshot = await openDay(userId, '2026-05-18')
    const today = buildTodayProjection(
      snapshot.items,
      snapshot.conditions,
      snapshot.dependencies,
    )
    const timeline = buildTimelineProjection(
      snapshot.items,
      snapshot.conditions,
      snapshot.dependencies,
      'capacity',
    )
    const planning = buildPlanningProjection(
      snapshot.items,
      snapshot.conditions,
      snapshot.dependencies,
      snapshot.links,
    )

    expect(today.now.map((item) => item.id)).toContain(task.id)
    expect(today.readings.capacity.qualitativeLoad).toContain('unknown')
    expect(timeline.readings.capacity.confidence).toBe('unknown')
    expect(planning.goals).toHaveLength(1)
    expect(planning.projects).toHaveLength(1)
    expect(planning.readings.direction.trajectory).toContain('meta')
    expect(planning.readings.direction.trajectory).toContain('projeto')

    snapshot = await completeItem(userId, task.id)
    snapshot = await archiveItem(userId, task.id)
    let memory = buildMemoryProjection(
      snapshot.items,
      snapshot.inboxItems,
      snapshot.links,
      snapshot.dependencies,
    )

    expect(memory.recovery.map((item) => item.id)).toContain(task.id)

    snapshot = await restoreItem(userId, task.id)
    memory = buildMemoryProjection(
      snapshot.items,
      snapshot.inboxItems,
      snapshot.links,
      snapshot.dependencies,
    )
    const restored = snapshot.items.find((item) => item.id === task.id)

    expect(restored).toMatchObject({ status: 'active' })
    expect(restored?.completedAt).toBeUndefined()
    expect(buildInboxProjection(snapshot.inboxItems).readings.pending).toBe(0)
    expect(memory.recovery.map((item) => item.id)).not.toContain(task.id)

    const events = await entityChangeEventsRepository.list(userId)
    expect(events.map((event) => event.changeType)).toEqual(
      expect.arrayContaining([
        'inbox_captured',
        'inbox_converted',
        'item_updated',
        'day_opened',
        'item_completed',
        'item_archived',
        'item_restored',
      ]),
    )
  })
})
