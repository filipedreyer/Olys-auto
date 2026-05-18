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
  captureInput,
  convertInboxItem,
  postponeInboxItem,
  triageInboxItem,
} from '../shared/commands/operationalCommandHandlers'
import { entityChangeEventsRepository } from '../shared/repositories/entityChangeEventsRepository'
import { buildInboxProjection } from '../features/inbox/domain/inboxProjection'

const srcRoot = dirname(dirname(fileURLToPath(import.meta.url)))

describe('P4 capture and inbox flow', () => {
  it('sends untyped capture to Inbox', async () => {
    const userId = scopedUser()
    const snapshot = await captureInput({
      userId,
      title: 'Entrada transversal sem tipo',
    })

    expect(snapshot.inboxItems).toHaveLength(1)
    expect(snapshot.inboxItems[0]).toMatchObject({
      text: 'Entrada transversal sem tipo',
      status: 'new',
      sourceContext: 'capture',
    })
    expect(snapshot.items).toHaveLength(0)
  })

  it('creates typed entities or falls back to Inbox when reminder is insufficient', async () => {
    const typedUser = scopedUser()
    const typed = await captureInput({
      userId: typedUser,
      title: 'Criar nota operacional',
      destination: 'note',
    })

    expect(typed.items[0]).toMatchObject({
      entityType: 'note',
      title: 'Criar nota operacional',
      sourceContext: 'capture',
    })
    expect(typed.inboxItems).toHaveLength(0)

    const insufficientUser = scopedUser()
    const insufficient = await captureInput({
      userId: insufficientUser,
      title: 'Lembrar sem data',
      destination: 'reminder',
    })

    expect(insufficient.items).toHaveLength(0)
    expect(insufficient.inboxItems[0]).toMatchObject({
      suggestedType: 'reminder',
      status: 'new',
    })
    expect(insufficient.inboxItems[0].metadata).toMatchObject({
      capture_resolution: 'reminder_requires_date_or_time',
    })

    const reminderUser = scopedUser()
    const reminder = await captureInput({
      userId: reminderUser,
      title: 'Lembrar com data',
      destination: 'reminder',
      dateStart: '2026-05-18',
    })

    expect(reminder.items[0]).toMatchObject({
      entityType: 'reminder',
      dateStart: '2026-05-18',
    })
  })

  it('converts, completes, postpones and discards InboxItems with traceability', async () => {
    const userId = scopedUser()
    let snapshot = await captureInput({ userId, title: 'Converter para tarefa' })
    const convertId = snapshot.inboxItems[0].id

    snapshot = await convertInboxItem(userId, convertId, 'task')
    expect(snapshot.items[0]).toMatchObject({
      entityType: 'task',
      title: 'Converter para tarefa',
      sourceContext: `inbox:${convertId}`,
    })
    expect(snapshot.items[0].metadata).toMatchObject({
      inbox_source_id: convertId,
    })
    expect(snapshot.inboxItems.find((item) => item.id === convertId)?.status).toBe(
      'converted',
    )

    snapshot = await captureInput({ userId, title: 'Concluir sem entidade' })
    const completeId = snapshot.inboxItems.find(
      (item) => item.text === 'Concluir sem entidade',
    )!.id
    snapshot = await triageInboxItem(userId, completeId, 'complete')
    expect(snapshot.inboxItems.find((item) => item.id === completeId)?.status).toBe(
      'completed',
    )

    snapshot = await captureInput({ userId, title: 'Adiar com metadata' })
    const postponeId = snapshot.inboxItems.find(
      (item) => item.text === 'Adiar com metadata',
    )!.id
    snapshot = await postponeInboxItem(userId, postponeId)
    const postponed = snapshot.inboxItems.find((item) => item.id === postponeId)!

    expect(postponed).toMatchObject({
      status: 'postponed',
      needsRevisit: true,
    })
    expect(postponed.metadata).toMatchObject({
      inbox_postponed: true,
      inbox_needs_revisit: true,
      inbox_source_id: postponeId,
    })
    expect(postponed.metadata?.inbox_postponed_at).toBeTruthy()

    snapshot = await captureInput({ userId, title: 'Descartar com evento' })
    const discardId = snapshot.inboxItems.find(
      (item) => item.text === 'Descartar com evento',
    )!.id
    snapshot = await triageInboxItem(userId, discardId, 'discard')
    expect(snapshot.inboxItems.find((item) => item.id === discardId)?.status).toBe(
      'discarded',
    )

    const events = await entityChangeEventsRepository.list(userId)
    expect(events.map((event) => event.changeType)).toEqual(
      expect.arrayContaining([
        'inbox_captured',
        'inbox_converted',
        'inbox_completed',
        'inbox_postponed',
        'inbox_discarded',
      ]),
    )
  })

  it('keeps Inbox as a triage projection, not backlog', async () => {
    const userId = scopedUser()
    let snapshot = await captureInput({ userId, title: 'Converter e sair da fila' })
    const convertedId = snapshot.inboxItems[0].id

    snapshot = await convertInboxItem(userId, convertedId, 'task')
    const projection = buildInboxProjection(snapshot.inboxItems)

    expect(projection.triageItems.some((item) => item.id === convertedId)).toBe(false)
    expect(projection.readings.pending).toBe(0)
  })

  it('keeps UI away from Supabase and domain decisions', () => {
    const uiSource = readSourceFiles([
      'features/capturar/components',
      'features/capturar/screens',
      'features/inbox/screens',
    ])

    expect(uiSource).not.toContain('getSupabaseClient')
    expect(uiSource).not.toContain('itemsRepository')
    expect(uiSource).not.toContain('inboxRepository')
    expect(uiSource).not.toContain('resolveCaptureTarget(')
    expect(uiSource).not.toContain('applyInboxTriage(')
  })
})

function scopedUser() {
  return `capture-inbox-${crypto.randomUUID()}`
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
