# P3 Supabase Auth RLS Audit

Data: 2026-05-17

Escopo executado: Supabase Real Controlado + Auth UI minima + RLS Validation preparado.

## Arquivos Alterados

- `.env.example`
- `package.json`
- `docs/execution/SUPABASE_SETUP.md`
- `docs/execution/P3_SUPABASE_AUTH_RLS_AUDIT.md`
- `src/app/router/AppRouter.tsx`
- `src/app/shell/AppShell.tsx`
- `src/domain/commands/dailySessionCommands.ts`
- `src/domain/commands/dependencyCommands.ts`
- `src/domain/commands/itemCommands.ts`
- `src/domain/commands/linkCommands.ts`
- `src/features/inbox/domain/inboxTriage.ts`
- `src/shared/auth/AuthProvider.tsx`
- `src/shared/auth/AuthStatusControl.tsx`
- `src/shared/auth/LoginScreen.tsx`
- `src/shared/commands/operationalCommandHandlers.ts`
- `src/styles/globals.css`
- `src/tests/repositoriesFallback.test.ts`
- `src/tests/repositoriesSupabase.test.ts`
- `src/tests/rls.test.ts`
- `src/tests/testEnv.ts`

## Env Esperado

Obrigatorio para Supabase mode:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Obrigatorio para repository/RLS real:

- `RLS_TEST_USER_A_EMAIL`
- `RLS_TEST_USER_A_PASSWORD`
- `RLS_TEST_USER_B_EMAIL`
- `RLS_TEST_USER_B_PASSWORD`

## Validado De Verdade Neste Ambiente

- `npm install`: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `npm run test`: passou.
- `npm run test:repositories`: passou.
- `npm run test:rls`: passou com skip explicito da validacao real.
- Runtime local:
  - `/fazer/hoje`: HTTP 200.
  - `/login`: HTTP 200.
- Degraded mode continuou funcional sem env Supabase.
- Teste fallback/local cobriu:
  - create item
  - update item
  - complete item
  - archive item
  - create inbox item via captura sem tipo
  - convert inbox item
  - postpone inbox item
  - create dependency
  - create link
  - apply essential protected
  - open day
  - close day
  - emit entity_change_events

## Skipped Explicitamente

- Supabase repository mode foi preparado, mas skipped porque este ambiente nao tem env Supabase + usuario de teste.
- RLS real foi preparado, mas skipped porque este ambiente nao tem env Supabase + dois usuarios de teste.

RLS nao foi declarado validado neste ciclo. O script existe para validar quando o ambiente real estiver configurado.

## Auth UI Minima

- `/login` criado.
- Topbar mostra estado simples:
  - loading
  - local/degraded
  - entrar
  - sair
- Login usa `supabase.auth.signInWithPassword` quando Supabase esta configurado.
- Logout usa `supabase.auth.signOut`.
- Sem env Supabase, `/login` informa degraded/local e nao bloqueia o app.

## Supabase Mode

Pronto para validar com env real:

- Supabase client continua centralizado em `src/lib/supabase/client.ts`.
- UI nao chama Supabase diretamente.
- AuthProvider usa sessao real quando env existe.
- Repositories continuam encapsulando acesso a tabelas Supabase.
- Geracao de ids em comandos novos foi ajustada para UUID canonico, compativel com a migration.

## Degraded Mode

Status: funcional.

- Sem env Supabase, `getSupabaseClient()` retorna `null`.
- Auth entra em `degraded`.
- Repositories usam fallback local em memoria.
- Build e testes continuam passando.

## RLS Validation Preparada

`npm run test:rls` valida, quando env real existir, que usuario B nao consegue ler registros do usuario A em:

- `items`
- `inbox_items`
- `entity_conditions`
- `entity_links`
- `dependency_edges`
- `daily_sessions`
- `entity_change_events`

O teste cria dados com usuario A, tenta ler com usuario B e espera resultado vazio.

## Mutation + Event Atomicity

Risco ainda aberto: mutacao operacional e emissao de `entity_change_events` nao sao atomicas.

Estado atual:

- Command handler executa mutacao no repository.
- Depois emite evento em `entity_change_events`.
- Se a mutacao passar e o evento falhar, o sistema pode ficar sem trilha completa.

Preparacao recomendada:

- Criar RPC Supabase por comando critico ou uma camada transacional server-side.
- Manter assinatura futura orientada a comando:
  - payload do comando
  - entity ids afetados
  - change type
  - metadata de auditoria

Nao foi implementada RPC neste ciclo para nao expandir P3.

## Riscos Restantes

- RLS ainda nao foi executado contra Supabase real neste ambiente.
- Repository Supabase mode ainda depende de usuarios reais configurados para teste.
- Login/signup nao cria usuario; usuarios devem existir no Supabase.
- Fallback local segue em memoria e nao e duravel.
- Policies atuais validam ownership por `user_id`; futuras validacoes devem testar tambem referencias cruzadas de entidades em links/dependencies/conditions.

## Proximos Passos

1. Configurar Supabase real/local com a migration P0 aplicada.
2. Criar dois usuarios de teste.
3. Rodar `npm run test:repositories` e `npm run test:rls` com env configurado.
4. Se RLS passar, documentar evidencia real e data.
5. Desenhar RPCs transacionais para mutacao + evento sem implementar UI nova.
