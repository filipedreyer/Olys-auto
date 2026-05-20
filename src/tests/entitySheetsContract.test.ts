import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type {
  DependencyEdge,
  EntityLink,
  OlysItem,
} from '../domain/entities/types'
import { buildEntitySheetProjection } from '../features/entity-sheets/domain/entitySheetProjection'
import { validateEntitySheetPatch } from '../features/entity-sheets/domain/entitySheetGuards'

const root = process.cwd()

describe('entity sheets contract', () => {
  it('creates a host inside the shell without creating a route', () => {
    const shell = readSource('src/app/shell/AppShell.tsx')
    const router = readSource('src/app/router/AppRouter.tsx')
    const host = readSource('src/features/entity-sheets/components/EntitySheetHost.tsx')

    expect(host).toContain('<OlysSheet')
    expect(shell).toContain('<EntitySheetProvider>')
    expect(shell).toContain('<EntitySheetHost')
    expect(router).not.toContain('entity-sheet')
    expect(router).not.toContain('EntitySheet')
  })

  it('keeps projection out of repositories, Supabase and command handlers', () => {
    const projection = readSource('src/features/entity-sheets/domain/entitySheetProjection.ts')

    expect(projection).not.toContain('repositories')
    expect(projection).not.toContain('Supabase')
    expect(projection).not.toContain('operationalCommandHandlers')
    expect(projection).not.toContain('useOperationalStore')
  })

  it('separates editable and derived fields while keeping derived fields read-only', () => {
    const item = makeItem({ id: 'task-1', entityType: 'task', title: 'Preparar proposta' })
    const projection = buildEntitySheetProjection({
      itemId: item.id,
      items: [item],
      conditions: [],
      links: [],
      dependencies: [],
    })

    expect(projection?.editableFields.length).toBeGreaterThan(0)
    expect(projection?.derivedFields.length).toBeGreaterThan(0)
    expect(projection?.derivedFields.every((field) => field.editable === false)).toBe(true)
    expect(projection?.derivedFields.find((field) => field.key === 'id')?.editable).toBe(false)
    expect(projection?.derivedFields.find((field) => field.key === 'userId')?.editable).toBe(false)
    expect(projection?.derivedFields.find((field) => field.key === 'createdAt')?.editable).toBe(false)
    expect(projection?.derivedFields.find((field) => field.key === 'entityType')?.editable).toBe(false)
  })

  it('keeps EntityLink and DependencyEdge as separate summaries', () => {
    const goal = makeItem({ id: 'goal-1', entityType: 'goal', title: 'Meta' })
    const task = makeItem({ id: 'task-1', entityType: 'task', title: 'Tarefa' })
    const link: EntityLink = {
      id: 'link-1',
      userId: 'user-1',
      sourceEntityId: goal.id,
      targetEntityId: task.id,
      linkType: 'supports',
      createdBy: 'user',
      createdAt: '2026-05-20T00:00:00.000Z',
    }
    const dependency: DependencyEdge = {
      id: 'dep-1',
      userId: 'user-1',
      predecessorId: goal.id,
      successorId: task.id,
      type: 'blocks',
      status: 'active',
      source: 'manual',
      justification: 'Precisa vir antes',
      impact: 'Bloqueia entrega',
      createdAt: '2026-05-20T00:00:00.000Z',
    }
    const projection = buildEntitySheetProjection({
      itemId: goal.id,
      items: [goal, task],
      conditions: [],
      links: [link],
      dependencies: [dependency],
    })

    expect(projection?.relationSummary).toHaveLength(1)
    expect(projection?.relationSummary[0].linkType).toBe('supports')
    expect(projection?.dependencySummary).toHaveLength(1)
    expect(projection?.dependencySummary[0].type).toBe('blocks')
  })

  it('blocks ontology changes and free metadata patches', () => {
    const item = makeItem({ id: 'note-1', entityType: 'note', title: 'Nota' })

    expect(validateEntitySheetPatch(item, { entityType: 'task' }).allowed).toBe(false)
    expect(validateEntitySheetPatch(item, { id: 'other' }).allowed).toBe(false)
    expect(validateEntitySheetPatch(item, { createdAt: 'x' }).allowed).toBe(false)
    expect(validateEntitySheetPatch(item, { metadata: { any: true } }).allowed).toBe(false)
    expect(validateEntitySheetPatch(item, { title: 'Nota revisada' }).allowed).toBe(true)
  })

  it('covers ENT01 to ENT09 plus template without creating derived entities', () => {
    const source = readFeatureSource()

    for (const entity of [
      'goal',
      'project',
      'task',
      'habit',
      'routine',
      'agenda',
      'event',
      'reminder',
      'note',
      'list',
      'template',
    ]) {
      expect(source).toContain(`'${entity}'`)
    }

    expect(source).toContain('Project Stages')
    expect(source).toContain('milestones')
    expect(source).toContain('Event Prep')
    expect(source).not.toContain('project_stage_entity')
    expect(source).not.toContain('milestone_entity')
    expect(source).not.toContain('risk_entity')
    expect(source).not.toContain('event_prep_entity')
  })

  it('keeps attachments as private future contract without runtime upload or public URL', () => {
    const source = readFeatureSource()

    expect(source).toContain('storage privado')
    expect(source).not.toContain('storage.from')
    expect(source).not.toContain('publicUrl')
    expect(source).not.toContain('fetch(')
  })

  it('does not structure Entity Sheets as legacy monolith or generic product tools', () => {
    const source = readFeatureSource().toLowerCase()

    expect(source).not.toContain('legacy')
    expect(source).not.toContain('orbita')
    expect(source).not.toContain('okr')
    expect(source).not.toContain('streak')
    expect(source).not.toContain('kanban')
    expect(source).not.toContain('mega-form')
    expect(source).not.toContain('universal form')
  })

  it('keeps adjacent surfaces recognizable while adding only open actions', () => {
    expect(readSource('src/features/idea/components/IdeaDrawer.tsx')).toContain('IdeaDrawer')
    expect(readSource('src/features/fazer/screens/HojeScreen.tsx')).toContain('NowStage')
    expect(readSource('src/features/fazer/screens/TimelineScreen.tsx')).toContain('TimelineSurface')
    expect(readSource('src/features/capturar/components/CaptureSurface.tsx')).toContain('CaptureComposer')
    expect(readSource('src/features/inbox/screens/InboxScreen.tsx')).toContain('InboxTriageLayer')
    expect(readSource('src/features/planejar/screens/PlanejarScreen.tsx')).toContain('PlanningReadings')
    expect(readSource('src/features/memoria/screens/MemoriaScreen.tsx')).toContain('MemoryRecoveryLayer')
  })
})

function makeItem(input: Partial<OlysItem> & Pick<OlysItem, 'id' | 'entityType' | 'title'>): OlysItem {
  return {
    userId: 'user-1',
    status: 'active',
    priority: 1,
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
    ...input,
  }
}

function readFeatureSource() {
  return listFiles(join(root, 'src/features/entity-sheets'))
    .filter((file) => /\.(ts|tsx)$/.test(file))
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n')
}

function readSource(path: string) {
  return readFileSync(join(root, path), 'utf8')
}

function listFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name)

    return entry.isDirectory() ? listFiles(fullPath) : [fullPath]
  })
}
