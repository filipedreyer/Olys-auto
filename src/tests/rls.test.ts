import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'
import { getTestEnv, hasRlsEnv } from './testEnv'

const runIfConfigured = hasRlsEnv() ? it : it.skip

describe('Supabase RLS validation', () => {
  runIfConfigured(
    'prevents user B from reading user A release 1 operational rows',
    async () => {
      const clientA = buildClient()
      const clientB = buildClient()

      const userA = await signIn(
        clientA,
        getTestEnv('RLS_TEST_USER_A_EMAIL')!,
        getTestEnv('RLS_TEST_USER_A_PASSWORD')!,
      )
      await signIn(
        clientB,
        getTestEnv('RLS_TEST_USER_B_EMAIL')!,
        getTestEnv('RLS_TEST_USER_B_PASSWORD')!,
      )

      const created = buildRows(userA.id)

      try {
        await insertRows(clientA, created)

        await expectInvisible(clientB, 'items', created.item.id)
        await expectInvisible(clientB, 'inbox_items', created.inbox.id)
        await expectInvisible(
          clientB,
          'entity_conditions',
          created.condition.id,
        )
        await expectInvisible(clientB, 'entity_links', created.link.id)
        await expectInvisible(
          clientB,
          'dependency_edges',
          created.dependency.id,
        )
        await expectInvisible(
          clientB,
          'daily_sessions',
          created.dailySession.id,
        )
        await expectInvisible(
          clientB,
          'entity_change_events',
          created.event.id,
        )
      } finally {
        await cleanupRows(clientA, created)
        await clientA.auth.signOut()
        await clientB.auth.signOut()
      }
    },
  )

  it.skipIf(hasRlsEnv())(
    'skips RLS validation until Supabase env and two test users are configured',
    () => {
      expect(hasRlsEnv()).toBe(false)
    },
  )
})

function buildClient() {
  return createClient(
    getTestEnv('VITE_SUPABASE_URL')!,
    getTestEnv('VITE_SUPABASE_ANON_KEY')!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}

async function signIn(
  client: SupabaseClient,
  email: string,
  password: string,
) {
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  })

  expect(error).toBeNull()
  expect(data.user).toBeTruthy()

  return data.user!
}

async function insertRows(
  client: SupabaseClient,
  rows: ReturnType<typeof buildRows>,
) {
  await expectInsert(client, 'items', rows.item)
  await expectInsert(client, 'items', rows.secondItem)
  await expectInsert(client, 'inbox_items', rows.inbox)
  await expectInsert(client, 'entity_conditions', rows.condition)
  await expectInsert(client, 'entity_links', rows.link)
  await expectInsert(client, 'dependency_edges', rows.dependency)
  await expectInsert(client, 'daily_sessions', rows.dailySession)
  await expectInsert(client, 'entity_change_events', rows.event)
}

async function expectInsert(
  client: SupabaseClient,
  table: string,
  row: Record<string, unknown>,
) {
  const { error } = await client.from(table).insert(row)

  expect(error).toBeNull()
}

async function expectInvisible(
  client: SupabaseClient,
  table: string,
  id: string,
) {
  const { data, error } = await client.from(table).select('id').eq('id', id)

  expect(error).toBeNull()
  expect(data).toEqual([])
}

async function cleanupRows(
  client: SupabaseClient,
  rows: ReturnType<typeof buildRows>,
) {
  await client.from('entity_change_events').delete().eq('id', rows.event.id)
  await client.from('dependency_edges').delete().eq('id', rows.dependency.id)
  await client.from('entity_links').delete().eq('id', rows.link.id)
  await client.from('entity_conditions').delete().eq('id', rows.condition.id)
  await client.from('daily_sessions').delete().eq('id', rows.dailySession.id)
  await client.from('inbox_items').delete().eq('id', rows.inbox.id)
  await client.from('items').delete().in('id', [rows.item.id, rows.secondItem.id])
}

function buildRows(userId: string) {
  const now = new Date().toISOString()
  const itemId = crypto.randomUUID()
  const secondItemId = crypto.randomUUID()

  return {
    item: {
      id: itemId,
      user_id: userId,
      entity_type: 'task',
      title: 'RLS item A',
      status: 'active',
      priority: 1,
      duration_minutes: null,
      created_at: now,
      updated_at: now,
    },
    secondItem: {
      id: secondItemId,
      user_id: userId,
      entity_type: 'task',
      title: 'RLS item A second',
      status: 'active',
      priority: 1,
      duration_minutes: null,
      created_at: now,
      updated_at: now,
    },
    inbox: {
      id: crypto.randomUUID(),
      user_id: userId,
      text: 'RLS inbox A',
      status: 'new',
      source_context: 'test:rls',
      created_at: now,
      updated_at: now,
    },
    condition: {
      id: crypto.randomUUID(),
      user_id: userId,
      entity_id: itemId,
      condition_type: 'essential_protected',
      created_by: 'user',
      created_at: now,
    },
    link: {
      id: crypto.randomUUID(),
      user_id: userId,
      source_entity_id: itemId,
      target_entity_id: secondItemId,
      link_type: 'relates_to',
      created_by: 'user',
      created_at: now,
    },
    dependency: {
      id: crypto.randomUUID(),
      user_id: userId,
      predecessor_id: itemId,
      successor_id: secondItemId,
      type: 'blocks',
      status: 'active',
      source: 'manual',
      justification: 'RLS precisa preservar isolamento operacional',
      impact: 'Usuario B nao pode observar dependencia do usuario A',
      created_at: now,
    },
    dailySession: {
      id: crypto.randomUUID(),
      user_id: userId,
      date: randomFutureDate(),
      opened_at: now,
      created_at: now,
      updated_at: now,
    },
    event: {
      id: crypto.randomUUID(),
      user_id: userId,
      entity_id: itemId,
      change_type: 'rls_validation',
      source_context: 'test:rls',
      actor: 'system',
      metadata: {
        validation: 'user_b_cannot_read_user_a',
      },
      created_at: now,
    },
  }
}

function randomFutureDate() {
  const offset = Math.floor(Math.random() * 10000)
  return new Date(Date.UTC(2099, 0, 1 + offset)).toISOString().slice(0, 10)
}
