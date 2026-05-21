import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()

describe('access contract', () => {
  it('defines public access routes separately from private shell routes', () => {
    const router = readSource('src/app/router/AppRouter.tsx')

    for (const route of ['/splash', '/login', '/signup', '/recover', '/onboarding', '/session-expired', '/install']) {
      expect(router).toContain(`path="${route}"`)
    }

    expect(router).toContain('function PrivateRoute')
    expect(router).toContain('<AppShell>{children}</AppShell>')
    expect(router).toContain('path="/fazer/hoje" element={<PrivateRoute><HojeScreen /></PrivateRoute>}')
  })

  it('keeps public access screens out of the logged shell', () => {
    const accessSource = readFeatureSource('src/features/access')

    expect(accessSource).toContain('AccessShell')
    expect(accessSource).not.toContain('AppShell')
    expect(accessSource).not.toContain('BottomNavOlys')
    expect(accessSource).not.toContain('FloatingActionPair')
    expect(accessSource).not.toContain('CaptureSheet')
    expect(accessSource).not.toContain('IdeaDrawer')
  })

  it('uses AccessShell for login, signup, recovery, onboarding and session expired', () => {
    for (const file of [
      'src/features/access/screens/LoginScreen.tsx',
      'src/features/access/screens/SignupScreen.tsx',
      'src/features/access/screens/PasswordRecoveryScreen.tsx',
      'src/features/access/screens/OnboardingScreen.tsx',
      'src/features/access/screens/SessionExpiredScreen.tsx',
    ]) {
      expect(readSource(file)).toContain('<AccessShell>')
    }
  })

  it('keeps onboarding short and non-gamified', () => {
    const onboarding = readFeatureSource('src/features/access').toLowerCase()

    expect(onboarding).toContain('Capturar sem organizar tudo agora'.toLowerCase())
    expect(onboarding).toContain('Revisar continuidade sem medir performance'.toLowerCase())
    expect(onboarding).not.toContain('streak')
    expect(onboarding).not.toContain('score')
    expect(onboarding).not.toContain('produtividade gamificada')
    expect(onboarding).not.toContain('desbloqueie seu potencial')
  })

  it('extends AuthProvider without logging sensitive credentials', () => {
    const auth = readSource('src/shared/auth/AuthProvider.tsx')

    expect(auth).toContain('signup:')
    expect(auth).toContain('recoverPassword:')
    expect(auth).toContain("'expired'")
    expect(auth).not.toContain('console.log')
    expect(auth).not.toContain('console.error')
    expect(auth).not.toContain('password)')
  })

  it('preserves shell and operational routes', () => {
    const shell = readSource('src/app/shell/AppShell.tsx')
    const router = readSource('src/app/router/AppRouter.tsx')

    expect(shell).toContain('TopBarOlys')
    expect(shell).toContain('BottomNavOlys')
    expect(shell).toContain('FloatingActionPair')
    expect(router).toContain('path="/fazer/timeline"')
    expect(router).toContain('path="/capturar"')
    expect(router).toContain('path="/memoria/inbox"')
    expect(router).toContain('path="/planejar"')
    expect(router).toContain('path="/memoria"')
    expect(router).not.toContain('path="/idea"')
    expect(router).not.toContain('path="/entity-sheet"')
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
