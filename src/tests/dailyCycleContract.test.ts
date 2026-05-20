import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { DailySession, OlysItem } from '../domain/entities/types'
import { buildDailyCycleProjection } from '../features/daily-cycle/domain/dailyCycleProjection'
import type { TodayProjection } from '../features/fazer/domain/todayProjection'

const root = process.cwd()

describe('daily cycle contract', () => {
  it('builds daily cycle from dailySessions and an existing today projection', () => {
    const item = makeItem()
    const session: DailySession = {
      id: 'session-1',
      userId: 'user-1',
      date: '2026-05-20',
      openedAt: '2026-05-20T08:00:00.000Z',
      sessionStatus: 'open',
      createdAt: '2026-05-20T08:00:00.000Z',
      updatedAt: '2026-05-20T08:00:00.000Z',
    }
    const projection = buildDailyCycleProjection({
      today: '2026-05-20',
      items: [item],
      conditions: [],
      dependencies: [],
      dailySessions: [session],
      todayProjection: makeTodayProjection(item),
    })

    expect(projection.sessionStatus).toBe('open')
    expect(projection.canCloseDay).toBe(true)
    expect(projection.openingReading).toContain('item(ns) em foco')
  })

  it('keeps the projection out of repositories, command handlers and parallel today calculation', () => {
    const source = readSource('src/features/daily-cycle/domain/dailyCycleProjection.ts')

    expect(source).not.toContain('repositories')
    expect(source).not.toContain('operationalCommandHandlers')
    expect(source).not.toContain('buildTodayProjection')
  })

  it('keeps open and close panels driven by props', () => {
    const open = readSource('src/features/daily-cycle/components/OpenDayPanel.tsx')
    const close = readSource('src/features/daily-cycle/components/CloseDayPanel.tsx')

    expect(open).toContain('onOpenDay')
    expect(open).toContain('onClick={onOpenDay}')
    expect(close).toContain('onCloseDay')
    expect(close).toContain('onClick={onCloseDay}')
  })

  it('keeps diary field and breathing card non-persistent', () => {
    const diary = readSource('src/features/daily-cycle/components/DiaryClosingField.tsx')
    const breathing = readSource('src/features/daily-cycle/components/BreathingCard.tsx')

    expect(diary).not.toContain('useOperationalStore')
    expect(diary).not.toContain('localStorage')
    expect(breathing).not.toContain('onClick')
    expect(breathing).not.toContain('OlysButton')
  })

  it('does not introduce gamified wording into daily cycle UI', () => {
    const source = readFeatureSource('src/features/daily-cycle').toLowerCase()

    expect(source).not.toContain('score')
    expect(source).not.toContain('streak')
    expect(source).not.toContain('ranking')
    expect(source).not.toContain('produtividade gamificada')
    expect(source).not.toContain('parabens')
    expect(source).not.toContain('venceu o dia')
  })

  it('keeps Hoje structure intact while replacing the cycle panel internals', () => {
    const screen = readSource('src/features/fazer/screens/HojeScreen.tsx')

    expect(screen).toContain('NowStage')
    expect(screen).toContain('TodayIndicators')
    expect(screen).toContain('TodaySecondaryLayer')
    expect(screen).toContain('AttentionLayer')
    expect(screen).toContain('CompletedLayer')
    expect(screen).toContain('cycleProjection={cycleProjection}')
  })
})

function makeItem(): OlysItem {
  return {
    id: 'item-1',
    userId: 'user-1',
    entityType: 'task',
    title: 'Revisar ciclo',
    status: 'active',
    priority: 1,
    durationMinutes: 30,
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  }
}

function makeTodayProjection(item: OlysItem): TodayProjection {
  return {
    now: [item],
    later: [],
    attention: [],
    blocked: [],
    paused: [],
    completed: [],
    itemDetails: {},
    readings: {
      direction: {
        state: 'present',
        protectedItems: 0,
        goals: 0,
        projects: 0,
        habits: 0,
        routines: 0,
        recentCompletions: 0,
        trajectory: 'Direção presente',
        statement: 'Direção presente',
      },
      capacity: {
        state: 'fits',
        confidence: 'known',
        qualitativeLoad: 'Capacidade declarada sustentável',
        availableMinutes: 360,
        committedMinutes: 30,
        unknownLoadCount: 0,
        inferredLoadCount: 0,
        signals: [],
      },
      dependencyRisk: {
        blocked: [],
        candidates: [],
        needsReview: [],
        risk: [],
        summary: 'Sem dependências bloqueantes ativas',
      },
    },
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
