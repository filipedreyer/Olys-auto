import { describe, expect, it } from 'vitest'
import { getSupabaseClient } from '../lib/supabase/client'
import { EntityChangeEvent, OlysItem } from '../domain/entities/types'
import { entityChangeEventsRepository } from '../shared/repositories/entityChangeEventsRepository'
import { itemsRepository } from '../shared/repositories/itemsRepository'
import { getTestEnv, hasSupabaseEnv } from './testEnv'

const canRun =
  hasSupabaseEnv() &&
  Boolean(
    getTestEnv('RLS_TEST_USER_A_EMAIL') &&
      getTestEnv('RLS_TEST_USER_A_PASSWORD'),
  )

const runIfConfigured = canRun ? it : it.skip

describe('repository Supabase mode', () => {
  runIfConfigured(
    'creates, updates and reads rows through repositories with an authenticated session',
    async () => {
      const supabase = getSupabaseClient()

      expect(supabase).toBeTruthy()

      const { data, error } = await supabase!.auth.signInWithPassword({
        email: getTestEnv('RLS_TEST_USER_A_EMAIL')!,
        password: getTestEnv('RLS_TEST_USER_A_PASSWORD')!,
      })

      expect(error).toBeNull()
      expect(data.user?.id).toBeTruthy()

      const userId = data.user!.id
      const item = buildItem(userId)
      const event = buildEvent(userId, item.id)

      try {
        await itemsRepository.create(item)
        let items = await itemsRepository.list(userId)
        expect(items.some((candidate) => candidate.id === item.id)).toBe(true)

        await itemsRepository.update({
          ...item,
          title: 'Repository Supabase update',
          status: 'completed',
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        items = await itemsRepository.list(userId)
        expect(items.find((candidate) => candidate.id === item.id)?.status).toBe(
          'completed',
        )

        await entityChangeEventsRepository.create(event)
        const events = await entityChangeEventsRepository.list(userId)
        expect(events.some((candidate) => candidate.id === event.id)).toBe(true)
      } finally {
        await supabase!.from('entity_change_events').delete().eq('id', event.id)
        await supabase!.from('items').delete().eq('id', item.id)
        await supabase!.auth.signOut()
      }
    },
  )

  it.skipIf(canRun)(
    'skips Supabase repository validation until env and test credentials exist',
    () => {
      expect(hasSupabaseEnv()).toBeTypeOf('boolean')
    },
  )
})

function buildItem(userId: string): OlysItem {
  const now = new Date().toISOString()

  return {
    id: crypto.randomUUID(),
    userId,
    entityType: 'task',
    title: 'Repository Supabase create',
    status: 'active',
    priority: 1,
    durationMinutes: null,
    createdAt: now,
    updatedAt: now,
  }
}

function buildEvent(userId: string, entityId: string): EntityChangeEvent {
  return {
    id: crypto.randomUUID(),
    userId,
    entityId,
    changeType: 'repository_supabase_test',
    sourceContext: 'test:repository',
    actor: 'system',
    createdAt: new Date().toISOString(),
    metadata: {
      validation: 'supabase_mode',
    },
  }
}
