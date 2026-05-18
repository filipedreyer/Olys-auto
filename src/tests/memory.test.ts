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
  archiveItem,
  captureInput,
  completeItem,
  createDependency,
  createItem,
  createLink,
  restoreItem,
  reuseTemplate,
  triageInboxItem,
  updateItem,
} from '../shared/commands/operationalCommandHandlers'
import { entityChangeEventsRepository } from '../shared/repositories/entityChangeEventsRepository'
import { buildDirectionReading } from '../features/fazer/domain/directionReading'
import { buildMemoryProjection } from '../features/memoria/domain/memoryProjection'

const srcRoot = dirname(dirname(fileURLToPath(import.meta.url)))

describe('P7 operational memory', () => {
  it('archives without deleting traceability or relations', async () => {
    const userId = scopedUser()
    let snapshot = await createItem({
      userId,
      entityType: 'task',
      title: 'Item arquivavel',
      durationMinutes: null,
    })
    const archivedTarget = snapshot.items[0]
    snapshot = await createItem({
      userId,
      entityType: 'task',
      title: 'Item relacionado',
      durationMinutes: null,
    })
    const related = snapshot.items.find((item) => item.title === 'Item relacionado')!
    snapshot = await createLink({
      userId,
      sourceEntityId: archivedTarget.id,
      targetEntityId: related.id,
    })
    snapshot = await createDependency({
      userId,
      predecessorId: archivedTarget.id,
      successorId: related.id,
      justification: 'Rastreio de dependencia',
      impact: 'Arquivar nao pode apagar sequencia',
    })
    snapshot = await archiveItem(userId, archivedTarget.id)
    const projection = buildMemoryProjection(
      snapshot.items,
      snapshot.inboxItems,
      snapshot.links,
      snapshot.dependencies,
    )

    expect(snapshot.items.find((item) => item.id === archivedTarget.id)).toMatchObject({
      status: 'archived',
    })
    expect(projection.archived[0].detail).toContain('vinculo')
    expect(projection.archived[0].detail).toContain('dependencia')

    const events = await entityChangeEventsRepository.list(userId)
    expect(events.map((event) => event.changeType)).toContain('item_archived')
  })

  it('keeps completed items recoverable and visible as continuity', async () => {
    const userId = scopedUser()
    let snapshot = await createItem({
      userId,
      entityType: 'task',
      title: 'Concluido recuperavel',
      durationMinutes: 20,
    })
    const item = snapshot.items[0]
    snapshot = await completeItem(userId, item.id)
    const projection = buildMemoryProjection(snapshot.items, snapshot.inboxItems)
    const direction = buildDirectionReading(snapshot.items)

    expect(projection.completed[0].title).toBe('Concluido recuperavel')
    expect(projection.recovery[0].id).toBe(item.id)
    expect(direction.recentCompletions).toBe(1)
  })

  it('keeps Caixola as fragments, not hidden backlog', async () => {
    const userId = scopedUser()
    let snapshot = await captureInput({
      userId,
      title: 'Entrada nova nao e caixola',
    })
    snapshot = await captureInput({
      userId,
      title: 'Nota solta para caixola',
      destination: 'note',
    })
    const keptId = snapshot.inboxItems.find(
      (item) => item.text === 'Entrada nova nao e caixola',
    )!.id
    snapshot = await triageInboxItem(userId, keptId, 'keep')
    const projection = buildMemoryProjection(snapshot.items, snapshot.inboxItems)

    expect(projection.caixola.map((item) => item.title)).toEqual(
      expect.arrayContaining([
        'Nota solta para caixola',
        'Entrada nova nao e caixola',
      ]),
    )
    expect(projection.groups.find((group) => group.id === 'caixola')?.description).toContain(
      'sem virar backlog oculto',
    )
  })

  it('reuses templates as operational structure without marketplace/editor scope', async () => {
    const userId = scopedUser()
    let snapshot = await createItem({
      userId,
      entityType: 'template',
      title: 'Rotina base',
      description: 'Estrutura de rotina',
      durationMinutes: null,
    })
    const template = snapshot.items[0]
    snapshot = await updateItem(userId, template.id, {
      metadata: {
        template_entity_type: 'routine',
      },
    })
    snapshot = await reuseTemplate(userId, template.id)
    const reused = snapshot.items.find(
      (item) => item.sourceContext === `template:${template.id}`,
    )

    expect(reused).toMatchObject({
      entityType: 'routine',
      title: 'Rotina base reutilizado',
    })
    const events = await entityChangeEventsRepository.list(userId)
    expect(events.map((event) => event.changeType)).toContain('template_reused')
  })

  it('restores archived context back into the active flow', async () => {
    const userId = scopedUser()
    let snapshot = await createItem({
      userId,
      entityType: 'task',
      title: 'Contexto restauravel',
      durationMinutes: null,
    })
    const item = snapshot.items[0]
    snapshot = await archiveItem(userId, item.id)
    expect(snapshot.items.find((candidate) => candidate.id === item.id)?.status).toBe(
      'archived',
    )

    snapshot = await restoreItem(userId, item.id)
    expect(snapshot.items.find((candidate) => candidate.id === item.id)?.status).toBe(
      'active',
    )
  })

  it('keeps UI out of Supabase and memory domain decisions', () => {
    const uiSource = readSourceFiles(['features/memoria/screens'])

    expect(uiSource).not.toContain('getSupabaseClient')
    expect(uiSource).not.toContain('itemsRepository')
    expect(uiSource).not.toContain("status === 'archived'")
    expect(uiSource).not.toContain('DependencyEdge')
  })
})

function scopedUser() {
  return `memory-${crypto.randomUUID()}`
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
