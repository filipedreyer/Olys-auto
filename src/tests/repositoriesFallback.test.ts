import { describe, expect, it, vi } from 'vitest'

vi.mock('../lib/supabase/client', () => ({
  getSupabaseClient: () => null,
  requireSupabaseClient: () => {
    throw new Error('Supabase environment is not configured')
  },
}))

import {
  archiveItem,
  applyEssentialProtected,
  captureInput,
  closeDay,
  completeItem,
  convertInboxItem,
  createDependency,
  createItem,
  createLink,
  openDay,
  postponeInboxItem,
  updateItem,
} from '../shared/commands/operationalCommandHandlers'
import { entityChangeEventsRepository } from '../shared/repositories/entityChangeEventsRepository'

const userId = `local-repository-${crypto.randomUUID()}`

describe('repository fallback mode', () => {
  it('routes operational commands through local repositories and emits events', async () => {
    let snapshot = await createItem({
      userId,
      entityType: 'task',
      title: 'Criar item local',
      durationMinutes: null,
      sourceContext: 'test',
    })
    const created = snapshot.items.find((item) => item.title === 'Criar item local')

    expect(created?.id).toMatch(uuidPattern)

    snapshot = await updateItem(userId, created!.id, {
      title: 'Item local atualizado',
      priority: 2,
    })
    expect(snapshot.items.find((item) => item.id === created!.id)?.priority).toBe(2)

    snapshot = await completeItem(userId, created!.id)
    expect(snapshot.items.find((item) => item.id === created!.id)?.status).toBe(
      'completed',
    )

    snapshot = await archiveItem(userId, created!.id)
    expect(snapshot.items.find((item) => item.id === created!.id)?.status).toBe(
      'archived',
    )

    snapshot = await captureInput({
      userId,
      title: 'Entrada solta para converter',
    })
    const inboxToConvert = snapshot.inboxItems.find(
      (item) => item.text === 'Entrada solta para converter',
    )

    snapshot = await convertInboxItem(userId, inboxToConvert!.id, 'task')
    expect(
      snapshot.inboxItems.find((item) => item.id === inboxToConvert!.id)?.status,
    ).toBe('converted')
    expect(
      snapshot.items.some((item) => item.sourceContext === `inbox:${inboxToConvert!.id}`),
    ).toBe(true)

    snapshot = await captureInput({
      userId,
      title: 'Entrada solta para adiar',
    })
    const inboxToPostpone = snapshot.inboxItems.find(
      (item) => item.text === 'Entrada solta para adiar',
    )

    snapshot = await postponeInboxItem(userId, inboxToPostpone!.id)
    expect(
      snapshot.inboxItems.find((item) => item.id === inboxToPostpone!.id)?.status,
    ).toBe('postponed')

    snapshot = await createItem({
      userId,
      entityType: 'task',
      title: 'Predecessor operacional',
      durationMinutes: 20,
    })
    const predecessor = snapshot.items.find(
      (item) => item.title === 'Predecessor operacional',
    )
    snapshot = await createItem({
      userId,
      entityType: 'task',
      title: 'Sucessor operacional',
      durationMinutes: 20,
    })
    const successor = snapshot.items.find(
      (item) => item.title === 'Sucessor operacional',
    )

    snapshot = await createDependency({
      userId,
      predecessorId: predecessor!.id,
      successorId: successor!.id,
      justification: 'Sequencia operacional explicita',
      impact: 'Sem predecessor, o sucessor fica bloqueado',
    })
    expect(snapshot.dependencies).toHaveLength(1)

    snapshot = await createLink({
      userId,
      sourceEntityId: predecessor!.id,
      targetEntityId: successor!.id,
    })
    expect(snapshot.links).toHaveLength(1)

    snapshot = await applyEssentialProtected(userId, successor!.id)
    expect(
      snapshot.conditions.some(
        (condition) =>
          condition.entityId === successor!.id &&
          condition.conditionType === 'essential_protected',
      ),
    ).toBe(true)

    snapshot = await openDay(userId, '2026-05-17')
    expect(snapshot.dailySessions[0]?.openedAt).toBeTruthy()

    snapshot = await closeDay(userId, '2026-05-17', 'Dia fechado em teste')
    expect(snapshot.dailySessions[0]?.closedAt).toBeTruthy()

    const events = await entityChangeEventsRepository.list(userId)
    const eventTypes = events.map((event) => event.changeType)

    expect(eventTypes).toEqual(
      expect.arrayContaining([
        'item_created',
        'item_updated',
        'item_completed',
        'item_archived',
        'inbox_converted',
        'inbox_postponed',
        'dependency_created',
        'essential_protected_applied',
        'day_opened',
        'day_closed',
      ]),
    )
  })
})

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
