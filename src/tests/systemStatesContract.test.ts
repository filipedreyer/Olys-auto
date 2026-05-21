import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()

describe('system states contract', () => {
  it('creates loading, skeleton, configuration, partial error and offline states', () => {
    expect(readSource('src/features/system-states/components/AppLoadingState.tsx')).toContain('AppLoadingState')
    expect(readSource('src/features/system-states/components/SkeletonBlock.tsx')).toContain('SkeletonBlock')
    expect(readSource('src/features/system-states/components/ConfigurationErrorScreen.tsx')).toContain('ConfigurationErrorScreen')
    expect(readSource('src/features/system-states/components/PartialErrorState.tsx')).toContain('PartialErrorState')
    expect(readSource('src/features/system-states/components/OfflineBanner.tsx')).toContain('OfflineBanner')
  })

  it('detects offline through navigator.onLine and does not promise full sync', () => {
    const hook = readSource('src/features/system-states/components/useOnlineStatus.ts')
    const copy = readSource('src/features/system-states/domain/systemStatePresentation.ts')

    expect(hook).toContain('navigator.onLine')
    expect(hook).toContain("window.addEventListener('online'")
    expect(hook).toContain("window.addEventListener('offline'")
    expect(copy).toContain('não promete sincronização completa')
  })

  it('keeps system states out of repositories and operational store mutation', () => {
    const source = readFeatureSource('src/features/system-states')

    expect(source).not.toContain('repositories')
    expect(source).not.toContain('operationalCommandHandlers')
    expect(source).not.toContain('useOperationalStore')
    expect(source).not.toContain('hydrate(')
    expect(source).not.toContain('clearForUnauthenticated')
  })

  it('uses system states in router and shell without replacing logged shell', () => {
    const router = readSource('src/app/router/AppRouter.tsx')
    const shell = readSource('src/app/shell/AppShell.tsx')

    expect(router).toContain('<AppLoadingState />')
    expect(router).toContain('<ConfigurationErrorScreen />')
    expect(shell).toContain('<OfflineBanner />')
    expect(shell).toContain('TopBarOlys')
  })

  it('preserves operational implementation files', () => {
    expect(readSource('src/shared/commands/operationalCommandHandlers.ts')).toContain('export async function openDay')
    expect(readSource('src/features/fazer/domain/todayProjection.ts')).toContain('buildTodayProjection')
    expect(readSource('src/features/planejar/domain/planningProjection.ts')).toContain('buildPlanningProjection')
    expect(readSource('src/features/memoria/domain/memoryProjection.ts')).toContain('buildMemoryProjection')
  })
})

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
