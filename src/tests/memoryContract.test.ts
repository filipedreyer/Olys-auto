import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()

describe('memory recovery surface contract', () => {
  it('keeps MemoriaScreen driven by buildMemoryProjection without infrastructure imports', () => {
    const source = readSource('src/features/memoria/screens/MemoriaScreen.tsx')

    expect(source).toContain('buildMemoryProjection(items, inboxItems, links, dependencies)')
    expect(source).not.toContain('repositories')
    expect(source).not.toContain('operationalCommandHandlers')
    expect(source).not.toContain('InboxScreen')
  })

  it('does not create mandatory memory routes beyond the existing /memoria route', () => {
    const router = readSource('src/app/router/AppRouter.tsx')

    expect(router).toContain('path="/memoria"')
    expect(router).not.toContain('path="/memoria/caixola"')
    expect(router).not.toContain('path="/memoria/templates"')
    expect(router).not.toContain('path="/memoria/anexos"')
  })

  it('keeps MemoryProjection separated into lifecycle and recovery surfaces', () => {
    const projection = readSource('src/features/memoria/domain/memoryProjection.ts')

    expect(projection).toContain('archived: MemoryProjectionItem[]')
    expect(projection).toContain('completed: MemoryProjectionItem[]')
    expect(projection).toContain('caixola: MemoryProjectionItem[]')
    expect(projection).toContain('templates: MemoryProjectionItem[]')
    expect(projection).toContain('attachments: MemoryProjectionItem[]')
    expect(projection).toContain('search: MemoryProjectionItem[]')
    expect(projection).toContain('recovery: MemoryProjectionItem[]')
  })

  it('keeps Caixola separate from new Inbox triage', () => {
    const projection = readSource('src/features/memoria/domain/memoryProjection.ts')

    expect(projection).toContain("['kept', 'postponed'].includes(item.status)")
    expect(projection).not.toContain("['new', 'error'].includes(item.status)")
    expect(projection).toContain("item.entityType === 'note'")
    expect(projection).toContain("originKind: 'inbox'")
  })

  it('preserves restore and reuse actions through existing store handlers', () => {
    const screen = readSource('src/features/memoria/screens/MemoriaScreen.tsx')
    const itemRow = readSource('src/features/memoria/components/MemoryItemRow.tsx')

    expect(screen).toContain('const restoreItem = useOperationalStore((state) => state.restoreItem)')
    expect(screen).toContain('const reuseTemplate = useOperationalStore((state) => state.reuseTemplate)')
    expect(itemRow).toContain('item.isRecoverable')
    expect(itemRow).toContain('item.isReusable')
  })

  it('represents attachments as a future private contract without storage runtime', () => {
    const memoriaSource = readFeatureSource()

    expect(memoriaSource).toContain('Contrato futuro')
    expect(memoriaSource).toContain('storage privado')
    expect(memoriaSource).not.toContain('publicUrl')
    expect(memoriaSource).not.toContain('upload')
    expect(memoriaSource).not.toContain('storage.from')
  })

  it('keeps memory search local and out of repositories or Supabase', () => {
    const search = readSource('src/features/memoria/components/MemorySearchLayer.tsx')

    expect(search).toContain('useMemo')
    expect(search).toContain('itemSearchText(item).includes(normalized)')
    expect(search).not.toContain('Supabase')
    expect(search).not.toContain('repositories')
    expect(search).not.toContain('itemsRepository')
  })

  it('does not structure Memoria as wiki, file manager, marketplace, score or backlog', () => {
    const memoriaSource = readFeatureSource().toLowerCase()

    expect(memoriaSource).not.toContain('wiki')
    expect(memoriaSource).not.toContain('file manager')
    expect(memoriaSource).not.toContain('knowledge base')
    expect(memoriaSource).not.toContain('marketplace')
    expect(memoriaSource).not.toContain('backlog')
    expect(memoriaSource).not.toContain('score')
    expect(memoriaSource).not.toContain('streak')
    expect(memoriaSource).not.toContain('deletedat')
  })

  it('keeps adjacent recovered surfaces untouched in this phase', () => {
    expect(readSource('src/features/inbox/screens/InboxScreen.tsx')).toContain('InboxTriageLayer')
    expect(readSource('src/features/capturar/components/CaptureSurface.tsx')).toContain('CaptureComposer')
    expect(readSource('src/features/fazer/screens/HojeScreen.tsx')).toContain('NowStage')
    expect(readSource('src/features/fazer/screens/TimelineScreen.tsx')).toContain('TimelineSurface')
    expect(readSource('src/features/planejar/screens/PlanejarScreen.tsx')).toContain('PlanningReadings')
    expect(readSource('src/app/shell/AppShell.tsx')).toContain('FloatingActionPair')
  })
})

function readFeatureSource() {
  return listFiles(join(root, 'src/features/memoria'))
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
