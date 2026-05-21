import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()

describe('central contract', () => {
  it('adds /central as a private route without using AccessShell', () => {
    const router = readSource('src/app/router/AppRouter.tsx')
    const central = readFeatureSource('src/features/central')

    expect(router).toContain('path="/central"')
    expect(router).toContain('<PrivateRoute><CentralScreen /></PrivateRoute>')
    expect(central).toContain('CentralScreen')
    expect(central).not.toContain('AccessShell')
  })

  it('keeps Central out of BottomNav and Admin territory', () => {
    const shell = readSource('src/app/shell/AppShell.tsx')
    const central = readFeatureSource('src/features/central')
    const bottomNavDefinition = shell.slice(shell.indexOf('const bottomNavItems'), shell.indexOf('export function AppShell'))

    expect(shell).toContain("navigate('/central')")
    expect(bottomNavDefinition).not.toMatch(/central/i)
    expect(central).not.toContain('AdminScreen')
    expect(central).not.toContain('AdminGate')
    expect(central).not.toContain('ADM00')
  })

  it('keeps Central out of repositories, command handlers, Supabase and external APIs', () => {
    const central = readFeatureSource('src/features/central')

    expect(central).not.toMatch(/from ['"].*repositories/)
    expect(central).not.toMatch(/from ['"].*operationalCommandHandlers/)
    expect(central).not.toContain('getSupabaseClient')
    expect(central).not.toContain('requireSupabaseClient')
    expect(central).not.toContain('fetch(')
    expect(central).not.toContain('OpenAI')
  })

  it('represents CTR00 to CTR07', () => {
    const central = readFeatureSource('src/features/central')

    for (const code of ['CTR00', 'CTR01', 'CTR02', 'CTR03', 'CTR04', 'CTR05', 'CTR06', 'CTR07']) {
      expect(central).toContain(code)
    }
  })

  it('treats export and deletion as governed flows without real file or deletion effects', () => {
    const central = readFeatureSource('src/features/central')

    expect(central).toContain('Solicitar exportação')
    expect(central).toContain('Solicitar exclusão')
    expect(central).toContain('Fluxo governado futuro')
    expect(central).not.toContain('Blob(')
    expect(central).not.toContain('URL.createObjectURL')
    expect(central).not.toContain('download =')
    expect(central).not.toContain('removeItem(')
    expect(central).not.toContain('softDeleteItem')
    expect(central).not.toContain('deleteItem')
  })

  it('explains Idea transparency without changing Idea into execution', () => {
    const central = readFeatureSource('src/features/central')
    const idea = readFeatureSource('src/features/idea')

    expect(central).toContain('Leitura')
    expect(central).toContain('Sugestão')
    expect(central).toContain('Relatório')
    expect(central).toContain('Ação proposta')
    expect(central).toContain('Safety Gate')
    expect(central).toContain('Confirmation Sheet')
    expect(idea).not.toContain('operationalCommandHandlers')
  })

  it('keeps preferences, support and messages honest and preparatory', () => {
    const central = readFeatureSource('src/features/central')

    expect(central).toContain('Preparatório')
    expect(central).toContain('não há salvamento de preferência')
    expect(central).toContain('nenhum ticket é criado')
    expect(central).toContain('Recados administrados dependem do Admin seguro')
    expect(central).not.toContain('localStorage')
    expect(central).not.toContain('createTicket')
    expect(central).not.toContain('chatbot')
  })

  it('does not modify operational architecture files for Central behavior', () => {
    expect(readSource('src/shared/commands/operationalCommandHandlers.ts')).not.toContain('Central')
    expect(readSource('src/shared/store/operationalStore.ts')).not.toContain('Central')
    expect(readSource('src/domain/entities/types.ts')).not.toContain('Central')
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
