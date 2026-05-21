import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()

describe('pwa contract', () => {
  it('provides a coherent manifest without promising offline sync', () => {
    const manifestPath = join(root, 'public/manifest.webmanifest')

    expect(existsSync(manifestPath)).toBe(true)

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, string>

    expect(manifest.name).toBe('Olys')
    expect(manifest.short_name).toBe('Olys')
    expect(manifest.display).toBe('standalone')
    expect(manifest.start_url).toBe('/splash')
    expect(JSON.stringify(manifest).toLowerCase()).not.toContain('offline completo')
  })

  it('handles install prompt as optional and non-blocking', () => {
    const prompt = readSource('src/features/pwa/components/PwaInstallPrompt.tsx')
    const state = readSource('src/features/pwa/domain/pwaInstallState.ts')

    expect(state).toContain('beforeinstallprompt')
    expect(prompt).toContain('Instalação depende do browser')
    expect(prompt).toContain('Agora não')
    expect(prompt).not.toContain('throw new Error')
  })

  it('does not add tracking, analytics or service worker claims', () => {
    const source = [
      readSource('src/features/pwa/components/PwaInstallPrompt.tsx'),
      readSource('src/features/pwa/domain/pwaInstallState.ts'),
      readSource('src/features/pwa/screens/PwaInstallScreen.tsx'),
      readSource('vite.config.ts'),
    ].join('\n').toLowerCase()

    expect(source).not.toContain('analytics')
    expect(source).not.toContain('tracking')
    expect(source).not.toContain('serviceworker')
    expect(source).not.toContain('registersw')
  })

  it('links manifest from index.html', () => {
    const index = readSource('index.html')

    expect(index).toContain('rel="manifest"')
    expect(index).toContain('/manifest.webmanifest')
  })
})

function readSource(path: string) {
  return readFileSync(join(root, path), 'utf8')
}
