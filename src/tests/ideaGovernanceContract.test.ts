import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildIdeaContext } from '../features/idea/domain/ideaContextBuilder'
import { buildDeterministicIdeaOutputs } from '../features/idea/domain/ideaDeterministicResponder'
import { runIdeaSafetyGate } from '../features/idea/domain/ideaSafetyGate'
import type { IdeaOutput } from '../features/idea/domain/ideaTypes'

const root = process.cwd()

describe('idea governance contract', () => {
  it('replaces the AppShell placeholder with IdeaDrawer without creating a route', () => {
    const shell = readSource('src/app/shell/AppShell.tsx')
    const router = readSource('src/app/router/AppRouter.tsx')

    expect(shell).toContain('<IdeaDrawer')
    expect(shell).not.toContain('Apoio contextual preparado para a proxima fase de IA')
    expect(shell).not.toContain('idea-placeholder')
    expect(router).not.toContain('/idea')
    expect(router).not.toContain('/intelligence')
    expect(router).not.toContain('IntelligencePage')
  })

  it('keeps IdeaDrawer inside OlysSheet and out of route/page architecture', () => {
    const drawer = readSource('src/features/idea/components/IdeaDrawer.tsx')
    const featureSource = readFeatureSource()

    expect(drawer).toContain('<OlysSheet')
    expect(featureSource).not.toContain('Route')
    expect(featureSource).not.toContain('Navigate')
    expect(featureSource).not.toContain('IntelligencePage')
  })

  it('defines distinct output and action types', () => {
    const types = readSource('src/features/idea/domain/ideaTypes.ts')

    expect(types).toContain("'reading'")
    expect(types).toContain("'suggestion'")
    expect(types).toContain("'report'")
    expect(types).toContain("'proposed_action'")
    expect(types).toContain("'unavailable'")
    expect(types).toContain("'safety_blocked'")
    expect(types).toContain('requiresConfirmation: boolean')
  })

  it('requires confirmation for proposed persistent actions and keeps readings/reports non-persistent', () => {
    const context = buildIdeaContext({
      currentPath: '/memoria/inbox',
      items: [],
      inboxItems: [
        {
          id: 'inbox-1',
          userId: 'user-1',
          text: 'Entrada pendente',
          status: 'new',
          sourceContext: 'capture',
          createdAt: '2026-05-20T00:00:00.000Z',
          updatedAt: '2026-05-20T00:00:00.000Z',
        },
      ],
      conditions: [],
      dependencies: [],
      links: [],
    })
    const outputs = buildDeterministicIdeaOutputs(context)
    const proposedAction = outputs.find((output) => output.type === 'proposed_action')

    expect(proposedAction?.requiresConfirmation).toBe(true)
    expect(outputs.filter((output) => output.type === 'reading').every((output) => !output.action)).toBe(true)
    expect(outputs.filter((output) => output.type === 'report')).toEqual([])
  })

  it('blocks persistent or destructive action without confirmation', () => {
    const unsafe: IdeaOutput = {
      id: 'unsafe',
      type: 'proposed_action',
      title: 'Converter agora',
      description: 'Converter sem confirmar',
      confidence: 'high',
      assumptions: [],
      missingInformation: [],
      sourceSurface: 'inbox',
      createdAt: '2026-05-20T00:00:00.000Z',
      requiresConfirmation: false,
      action: {
        actionType: 'convert',
        label: 'Converter',
        destructive: true,
        reversible: false,
        confirmationCopy: 'Converter entrada',
      },
    }

    const safety = runIdeaSafetyGate(unsafe)

    expect(safety.allowed).toBe(false)
    expect(safety.reasonCode).toBe('persistent_without_confirmation')
  })

  it('keeps the confirmation sheet as a simulation without command handlers', () => {
    const sheet = readSource('src/features/idea/components/IdeaConfirmationSheet.tsx')

    expect(sheet).toContain('Nenhuma ação persistente será executada nesta fase.')
    expect(sheet).toContain('Confirmar simulação')
    expect(sheet).not.toContain('operationalCommandHandlers')
    expect(sheet).not.toContain('useOperationalStore')
  })

  it('keeps context builder and responder out of repositories, Supabase and external APIs', () => {
    const featureSource = readFeatureSource()

    expect(featureSource).not.toContain('repositories')
    expect(featureSource).not.toContain('getSupabaseClient')
    expect(featureSource).not.toContain('requireSupabaseClient')
    expect(featureSource).not.toContain('operationalCommandHandlers')
    expect(featureSource).not.toContain('OpenAI')
    expect(featureSource).not.toContain('apiKey')
    expect(featureSource).not.toContain('edge function')
    expect(featureSource).not.toContain('fetch(')
  })

  it('does not persist prompt or raw response content', () => {
    const featureSource = readFeatureSource()

    expect(featureSource).not.toContain('localStorage')
    expect(featureSource).not.toContain('sessionStorage')
    expect(featureSource).not.toContain('persistPrompt')
    expect(featureSource).not.toContain('persistResponse')
    expect(featureSource).not.toContain('entityChangeEventsRepository')
  })

  it('returns unavailable output instead of crashing when real IA is absent', () => {
    const context = buildIdeaContext({
      currentPath: '/desconhecido',
      items: [],
      inboxItems: [],
      conditions: [],
      dependencies: [],
      links: [],
    })
    const outputs = buildDeterministicIdeaOutputs(context)

    expect(outputs.map((output) => output.type)).toContain('unavailable')
  })
})

function readFeatureSource() {
  return listFiles(join(root, 'src/features/idea'))
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
