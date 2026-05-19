import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { captureDestinations } from '../features/capturar/domain/captureDestination'

const srcRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const repoRoot = dirname(srcRoot)

describe('operational grammar correction', () => {
  it('keeps CaptureGrid in the canonical 3x4 order', () => {
    expect(captureDestinations.map((destination) => destination.id)).toEqual([
      'inbox',
      'goal',
      'project',
      'task',
      'agenda',
      'note',
      'list',
      'habit',
      'routine',
      'template',
      'event',
      'reminder',
    ])
  })

  it('keeps Capturar as an emergent sheet rather than chip-based page grammar', () => {
    const appShell = readSource('app/shell/AppShell.tsx')
    const captureGrid = readSource('features/capturar/components/CaptureGrid.tsx')
    const css = readCss()

    expect(appShell).toContain('CaptureSheet')
    expect(appShell).toContain('FloatingActionPair')
    expect(appShell).toContain('shell-floating-action--capture')
    expect(captureGrid).toContain('capture-grid__cell')
    expect(captureGrid).not.toContain('capture-chip')
    expect(css).toContain('.capture-sheet')
    expect(css).toContain('.olys-floating-action-pair')
    expect(css).toContain('grid-template-columns: repeat(3, minmax(0, 1fr))')
  })

  it('keeps Fazer centered on a carousel and operational hierarchy', () => {
    const hoje = readSource('features/fazer/screens/HojeScreen.tsx')
    const css = readCss()

    expect(hoje).toContain('NowStage')
    expect(hoje).toContain('TodaySecondaryLayer')
    expect(hoje).toContain('AttentionLayer')
    expect(css).toContain('.operational-carousel')
    expect(css).toContain('.operational-row--featured')
  })

  it('keeps Timeline as spatial capacity and dependency surfaces', () => {
    const timeline = readSource('features/fazer/screens/TimelineScreen.tsx')
    const css = readCss()

    expect(timeline).toContain('TimelineSurface')
    expect(css).toContain('.timeline-capacity-lens')
    expect(css).toContain('.timeline-dependency-lens')
  })
})

function readSource(path: string) {
  return readFileSync(join(srcRoot, path), 'utf8')
}

function readCss() {
  return readFileSync(join(repoRoot, 'src/styles/globals.css'), 'utf8')
}
