import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  DependencyEdge,
  EntityLink,
  OlysItem,
} from '../domain/entities/types'
import { buildCapacityReading } from '../features/fazer/domain/capacity'
import { buildDirectionReading } from '../features/fazer/domain/directionReading'
import { buildPlanningProjection } from '../features/planejar/domain/planningProjection'

const srcRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const userId = 'planning-test'

describe('P6 planning projection', () => {
  it('builds GoalProjection and ProjectProjection without artificial metrics', () => {
    const goal = item({ id: 'goal-1', entityType: 'goal', title: 'Sustentar Olys' })
    const project = item({
      id: 'project-1',
      entityType: 'project',
      title: 'Release 1',
      parentId: goal.id,
    })
    const task = item({
      id: 'task-1',
      entityType: 'task',
      title: 'Fechar P6',
      parentId: project.id,
    })
    const dependency = edge(project.id, task.id)
    const projection = buildPlanningProjection(
      [goal, project, task],
      [],
      [dependency],
    )

    expect(projection.goals[0]).toMatchObject({
      title: 'Sustentar Olys',
      qualitativeProgress: 'connected',
      relatedProjects: 1,
      relationToToday: 'Conectada a execucao atual',
    })
    expect(projection.projects[0]).toMatchObject({
      linkedGoalTitle: 'Sustentar Olys',
      activeOperationalItems: 1,
      dependencyRisk: 1,
    })
    expect(JSON.stringify(projection)).not.toContain('kpi')
    expect(JSON.stringify(projection)).not.toContain('score')
  })

  it('connects planning direction back into Fazer readings', () => {
    const reading = buildDirectionReading([
      item({ id: 'goal-1', entityType: 'goal', title: 'Meta ativa' }),
      item({ id: 'project-1', entityType: 'project', title: 'Projeto ativo' }),
    ])

    expect(reading.state).toBe('present')
    expect(reading.goals).toBe(1)
    expect(reading.projects).toBe(1)
    expect(reading.trajectory).toContain('meta')
    expect(reading.statement).toContain('Direcao presente')
  })

  it('keeps habits and routines contextual, not gamified or ornamental checklists', () => {
    const habit = item({
      id: 'habit-1',
      entityType: 'habit',
      title: 'Leitura operacional',
      recurrenceRule: 'FREQ=DAILY',
    })
    const routine = item({
      id: 'routine-1',
      entityType: 'routine',
      title: 'Rotina de abertura',
    })
    const projection = buildPlanningProjection([habit, routine])

    expect(projection.rhythms).toHaveLength(2)
    expect(projection.rhythms[0].reading).toContain('sem score ou streak')
    expect(projection.rhythms[1].reading).toContain('sem checklist ornamental')
    expect(JSON.stringify(projection)).not.toContain('medal')
    expect(JSON.stringify(projection)).not.toContain('streakCount')
  })

  it('keeps EntityLink separate from DependencyEdge while connecting goals and projects', () => {
    const goal = item({ id: 'goal-1', entityType: 'goal', title: 'Meta' })
    const project = item({
      id: 'project-1',
      entityType: 'project',
      title: 'Projeto',
    })
    const link: EntityLink = {
      id: 'link-1',
      userId,
      sourceEntityId: goal.id,
      targetEntityId: project.id,
      linkType: 'supports',
      createdBy: 'user',
      createdAt: now,
    }
    const dependency = edge(project.id, 'task-1')
    const projection = buildPlanningProjection(
      [goal, project, item({ id: 'task-1', parentId: project.id })],
      [],
      [dependency],
      [link],
    )

    expect(projection.goals[0].relatedProjects).toBe(1)
    expect(projection.projects[0].linkedGoalTitle).toBe('Meta')
    expect(projection.readings.dependencies.blocked[0].id).toBe(dependency.id)
  })

  it('keeps UI out of Supabase and planning domain decisions', () => {
    const uiSource = readSourceFiles(['features/planejar/screens'])

    expect(uiSource).not.toContain('getSupabaseClient')
    expect(uiSource).not.toContain('itemsRepository')
    expect(uiSource).not.toContain('buildGoalProjection')
    expect(uiSource).not.toContain('calculateDependencies')
  })

  it('keeps capacity qualitative while planning context grows', () => {
    const reading = buildCapacityReading([
      item({ id: 'project-1', entityType: 'project', title: 'Projeto' }),
      item({ id: 'task-1', entityType: 'task', title: 'Tarefa sem duracao' }),
    ])

    expect(reading.confidence).toBe('unknown')
    expect(reading.committedMinutes).toBe(0)
    expect(reading.qualitativeLoad).toContain('nenhuma duracao foi inventada')
  })
})

const now = '2026-05-18T12:00:00.000Z'

function item(patch: Partial<OlysItem>): OlysItem {
  return {
    id: 'item',
    userId,
    entityType: 'task',
    title: 'Item',
    status: 'active',
    priority: 0,
    durationMinutes: null,
    createdAt: now,
    updatedAt: now,
    ...patch,
  }
}

function edge(predecessorId: string, successorId: string): DependencyEdge {
  return {
    id: `dependency-${predecessorId}-${successorId}`,
    userId,
    predecessorId,
    successorId,
    type: 'blocks',
    status: 'active',
    source: 'manual',
    justification: 'Sequencia operacional',
    impact: 'Mostra risco de execucao',
    createdAt: now,
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
