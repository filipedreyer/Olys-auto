import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createDependency } from '../domain/commands/dependencyCommands'
import { createLink } from '../domain/commands/linkCommands'
import {
  DEPENDENCY_TYPES,
  ENTITY_TYPES,
  LINK_TYPES,
  OlysItem,
} from '../domain/entities/types'
import { buildCapacityReading } from '../features/fazer/domain/capacity'
import { timelineLenses } from '../features/fazer/domain/timelineLens'
import { buildTodayProjection } from '../features/fazer/domain/todayProjection'
import {
  applyInboxTriage,
  buildInboxProjection,
  createInboxItem,
} from '../features/inbox/domain/inboxTriage'
import { contextualIdeaSuggestion } from '../features/ia/domain/aiState'

const srcRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const userId = 'user-test'

describe('canonical anti-regression guards', () => {
  it('keeps Essencial Protegido as condition, not entity', () => {
    expect(ENTITY_TYPES).not.toContain('essential_protected')
  })

  it('keeps Inbox as triage, not backlog', () => {
    const inboxItems = createInboxItem([], {
      userId,
      text: 'Decidir escopo de hoje',
    })
    const result = applyInboxTriage(inboxItems, [], inboxItems[0].id, {
      action: 'convert',
      targetType: 'task',
    })
    const projection = buildInboxProjection(result.inboxItems)

    expect(result.items).toHaveLength(1)
    expect(projection.triageItems).toHaveLength(0)
  })

  it('keeps Timeline as operational lenses, not a simple calendar', () => {
    expect(timelineLenses.map((lens) => lens.id)).toEqual([
      'calendar',
      'capacity',
      'dependency',
    ])
  })

  it('does not invent capacity duration', () => {
    const reading = buildCapacityReading([
      item({
        id: 'unknown-load',
        title: 'Trabalho sem duracao declarada',
        durationMinutes: null,
      }),
    ])

    expect(reading.state).toBe('unknown')
    expect(reading.confidence).toBe('unknown')
    expect(reading.committedMinutes).toBe(0)
    expect(reading.unknownLoadCount).toBe(1)
  })

  it('keeps DependencyEdge distinct from EntityLink', () => {
    const predecessor = item({ id: 'predecessor', title: 'Preparar insumo' })
    const successor = item({ id: 'successor', title: 'Executar decisao' })
    const dependency = createDependency([predecessor, successor], [], {
      userId,
      predecessorId: predecessor.id,
      successorId: successor.id,
      type: 'blocks',
      source: 'manual',
      justification: 'A decisao depende do insumo',
      impact: 'Sem insumo, a sequencia operacional bloqueia',
    })
    const links = createLink([], {
      userId,
      sourceEntityId: predecessor.id,
      targetEntityId: successor.id,
      linkType: 'relates_to',
    })

    expect(DEPENDENCY_TYPES).toContain('blocks')
    expect(LINK_TYPES).toContain('relates_to')
    expect(dependency.edges[0]).toMatchObject({
      predecessorId: predecessor.id,
      successorId: successor.id,
      type: 'blocks',
      impact: 'Sem insumo, a sequencia operacional bloqueia',
    })
    expect(links[0]).toMatchObject({
      sourceEntityId: predecessor.id,
      targetEntityId: successor.id,
      linkType: 'relates_to',
    })
  })

  it('lets TodayProjection control Hoje rendering lanes', () => {
    const active = item({
      id: 'active-now',
      title: 'Foco de hoje',
      priority: 3,
      durationMinutes: 30,
    })
    const blocked = item({ id: 'blocked', title: 'Bloqueado' })
    const projection = buildTodayProjection(
      [active, blocked],
      [],
      [
        {
          id: 'dependency-1',
          userId,
          predecessorId: active.id,
          successorId: blocked.id,
          type: 'blocks',
          status: 'active',
          source: 'manual',
          justification: 'Sequencia operacional',
          impact: 'Evita puxar trabalho bloqueado para agora',
          createdAt: '2026-05-17T12:00:00.000Z',
        },
      ],
    )

    expect(projection.now.map((entry) => entry.id)).toContain(active.id)
    expect(projection.blocked.map((entry) => entry.id)).toContain(blocked.id)
    expect(projection).toHaveProperty('later')
    expect(projection).toHaveProperty('paused')
  })

  it('keeps Supabase behind shared repositories and auth', () => {
    const uiSource = readSourceFiles(['app', 'features'])

    expect(uiSource).not.toContain('getSupabaseClient')
    expect(uiSource).not.toContain("from('@supabase")
    expect(uiSource).not.toContain('from("@supabase')
  })

  it('keeps UI from recalculating core operational rules', () => {
    const screenSource = readSourceFiles([
      'features/fazer/components',
      'features/fazer/screens',
    ])

    expect(screenSource).not.toContain('hasActiveCondition(')
    expect(screenSource).not.toContain('isEligibleForNow(')
    expect(screenSource).not.toContain('isBlocked(')
  })

  it('keeps IA suggestions pending confirmation before relevant action', () => {
    const iaSource = readSourceFiles(['features/ia'])

    expect(contextualIdeaSuggestion.state).toBe('pending_suggestion')
    expect(iaSource).not.toContain('repositories/')
    expect(iaSource).not.toContain('operationalCommandHandlers')
  })
})

function item(patch: Partial<OlysItem>): OlysItem {
  return {
    id: 'item',
    userId,
    entityType: 'task',
    title: 'Item',
    status: 'active',
    priority: 0,
    durationMinutes: null,
    createdAt: '2026-05-17T12:00:00.000Z',
    updatedAt: '2026-05-17T12:00:00.000Z',
    ...patch,
  }
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
