# Fase 12 - Acesso, Onboarding, PWA e Estados Sistêmicos

## Escopo

Esta fase implementou AC01 a AC07 e SYS01/SYS02 como camada de confiança, entrada e degradação controlada. A mudança principal foi separar rotas públicas do Shell logado.

## Arquivos Criados

- `src/features/access/screens/SplashScreen.tsx`
- `src/features/access/screens/LoginScreen.tsx`
- `src/features/access/screens/SignupScreen.tsx`
- `src/features/access/screens/PasswordRecoveryScreen.tsx`
- `src/features/access/screens/OnboardingScreen.tsx`
- `src/features/access/screens/SessionExpiredScreen.tsx`
- `src/features/access/components/AccessShell.tsx`
- `src/features/access/components/AccessCard.tsx`
- `src/features/access/components/AccessFormField.tsx`
- `src/features/access/components/AccessTrustBlock.tsx`
- `src/features/access/components/OnboardingMaturityStep.tsx`
- `src/features/access/domain/accessPresentation.ts`
- `src/features/system-states/components/AppLoadingState.tsx`
- `src/features/system-states/components/SkeletonBlock.tsx`
- `src/features/system-states/components/InlineLoadingState.tsx`
- `src/features/system-states/components/ConfigurationErrorScreen.tsx`
- `src/features/system-states/components/PartialErrorState.tsx`
- `src/features/system-states/components/OfflineBanner.tsx`
- `src/features/system-states/components/useOnlineStatus.ts`
- `src/features/system-states/domain/systemStatePresentation.ts`
- `src/features/pwa/domain/pwaInstallState.ts`
- `src/features/pwa/components/PwaInstallPrompt.tsx`
- `src/features/pwa/screens/PwaInstallScreen.tsx`
- `src/design-system/contracts/system-states.contract.md`
- `src/design-system/contracts/pwa.contract.md`
- `src/tests/accessContract.test.ts`
- `src/tests/systemStatesContract.test.ts`
- `src/tests/pwaContract.test.ts`
- `public/manifest.webmanifest`

## Arquivos Modificados

- `src/app/App.tsx`
- `src/app/router/AppRouter.tsx`
- `src/app/shell/AppShell.tsx`
- `src/shared/auth/AuthProvider.tsx`
- `src/design-system/contracts/access.contract.md`
- `src/styles/globals.css`
- `index.html`

## AC01 Splash

`SplashScreen` direciona conforme estado de autenticação: carregando, logado/local degradado, expirado ou login. Não promete sincronização.

## AC02 Login

`LoginScreen` usa `AccessShell`, não renderiza Shell logado, mostra modo local/Supabase e preserva integração existente com `AuthProvider.login`.

## AC03 Cadastro

`SignupScreen` usa `AuthProvider.signup` quando Supabase existe. Em modo local, informa honestamente que cadastro remoto exige configuração.

## AC04 Recuperação

`PasswordRecoveryScreen` usa `AuthProvider.recoverPassword` quando Supabase existe. Em modo local, não promete envio.

## AC05 Onboarding

`OnboardingScreen` é curto, com três passos de maturidade: capturar sem organizar tudo, fazer com capacidade/direção e revisar continuidade sem medir performance. Não persiste preferência nesta fase.

## AC06 PWA

`PwaInstallPrompt` trata `beforeinstallprompt` quando disponível, permite dispensar e não bloqueia o app. O manifest foi criado com `start_url: /splash` e `display: standalone`.

## AC07 Sessão Expirada

`SessionExpiredScreen` explica a expiração sem sugerir perda de dados.

## SYS01 Loading e Skeletons

`AppLoadingState`, `SkeletonBlock` e `InlineLoadingState` evitam tela branca e indicam carregamento com contexto.

## SYS02 Offline e Erro Parcial

`OfflineBanner` usa `navigator.onLine`. `PartialErrorState` e `ConfigurationErrorScreen` explicam degradação sem prometer sincronização completa.

## Limitações Reais

- Não há service worker novo.
- Offline não significa sincronização completa.
- Onboarding ainda não persiste estado.
- Cadastro e recuperação dependem de Supabase configurado.
- `configurationError` está previsto no contrato de auth, mas o modo local degradado continua sendo o fallback atual para Supabase ausente.

## O Que Não Foi Alterado

- Domínio operacional.
- Repositories.
- Command handlers.
- Projections operacionais.
- Regras de Capturar, Hoje, Timeline, Inbox, Planejar, Memória, Idea, Entity Sheets ou Ciclo.

## Riscos Remanescentes

- Fluxo real de redefinição de senha depende de configuração Supabase.
- Instalação PWA depende do browser e não tem ícones finais.
- Sem service worker, offline é apenas estado legível, não operação offline completa.

## Recomendação Para Fase 13

Implementar Central de Confiança: dados e privacidade, preferências, IA e transparência, suporte e conta, com exportação/exclusão como fluxos governados.
