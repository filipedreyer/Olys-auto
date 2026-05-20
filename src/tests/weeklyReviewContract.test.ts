import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { EntityCondition, OlysItem } from '../domain/entities/types'
import { buildWeeklyReviewProjection } from '../features/weekly-review/domain/weeklyReviewProjection'

const root = process.cwd()

describe('weekly review contract', () => {
  it('keeps weekly projection out of repositories and command handlers', () => {
    const source = readSource('src/features/weekly-review/domain/weeklyReviewProjection.ts')

    expect(source).not.toContain('repositories')
    expect(source).not.toContain('operationalCommandHandlers')
    expect(source).not.toContain('useOperationalStore')
  })

  it('does not create synthetic performance fields', () => {
    const source = readFeatureSource('src/features/weekly-review').toLowerCase()

    expect(source).not.toContain('score')
    expect(source).not.toContain('health')
    expect(source).not.toContain('streak')
    expect(source).not.toContain('ranking')
    expect(source).not.toContain('okr')
    expect(source).not.toContain('pm tool')
    expect(source).not.toContain('dashboard')
    expect(source).not.toContain('performance score')
  })

  it('declares missing information when projections or context are absent', () => {
    const projection = buildWeeklyReviewProjection({
      items: [],
      conditions: [],
      dependencies: [],
      links: [],
      dailySessions: [],
      inboxItems: [],
    })

    expect(projection.missingInformation.length).toBeGreaterThan(0)
    expect(projection.replanning.persistsAutomatically).toBe(false)
    expect(projection.replanning.requiresConfirmation).toBe(true)
  })

  it('keeps protected essentials as condition and not entity type', () => {
    const item = makeItem()
    const condition: EntityCondition = {
      id: 'condition-1',
      userId: 'user-1',
      entityId: item.id,
      conditionType: 'essential_protected',
      createdBy: 'user',
      createdAt: '2026-05-20T00:00:00.000Z',
    }
    const projection = buildWeeklyReviewProjection({
      items: [item],
      conditions: [condition],
      dependencies: [],
      links: [],
      dailySessions: [],
      inboxItems: [],
    })
    const block = readSource('src/features/weekly-review/components/WeeklyProtectedEssentialsBlock.tsx')
    const entityTypeBlock = readSource('src/domain/entities/types.ts').split('export type GoalItem')[0]

    expect(projection.protectedEssentials).toHaveLength(1)
    expect(block).toContain('conditionType essential_protected')
    expect(entityTypeBlock).not.toContain("'essential_protected'")
  })

  it('integrates WeeklyReviewLayer into Planejar without rewriting planning projection', () => {
    const planejar = readSource('src/features/planejar/screens/PlanejarScreen.tsx')
    const planningProjection = readSource('src/features/planejar/domain/planningProjection.ts')

    expect(planejar).toContain('<WeeklyReviewLayer')
    expect(planejar).toContain('PlanningHeader')
    expect(planejar).toContain('PlanningReadings')
    expect(planejar).toContain('PlanningDirectionLayer')
    expect(planningProjection).toContain('buildPlanningProjection')
    expect(planningProjection).not.toContain('WeeklyReview')
  })

  it('keeps adjacent systems from executing new actions', () => {
    expect(readSource('src/features/idea/components/IdeaConfirmationSheet.tsx')).toContain('Nenhuma ação persistente será executada nesta fase.')
    expect(readSource('src/features/memoria/screens/MemoriaScreen.tsx')).toContain('MemoryRecoveryLayer')
    expect(readSource('src/features/entity-sheets/components/EntitySheetHost.tsx')).toContain('EntitySheetHost')
  })
})

function makeItem(): OlysItem {
  return {
    id: 'item-1',
    userId: 'user-1',
    entityType: 'task',
    title: 'Essencial',
    status: 'active',
    priority: 2,
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  }
}

function readFeatureSource(path: string) {
  return listFiles(join(root, path))
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
