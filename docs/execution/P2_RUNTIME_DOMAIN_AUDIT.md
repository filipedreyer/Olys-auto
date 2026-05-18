# P2 Runtime Domain Audit

Data: 2026-05-17

Escopo executado: Persistencia Real + Nucleo Operacional Real, sem expansao de UI e sem criar novas features.

## Validacao

- `npm install`: executado; dependencias atualizadas para incluir testes.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `npm run test`: passou, 9 testes.
- Runtime local: `/hoje` respondeu HTTP 200 em modo degraded/local.

## Arquivos Alterados

- `package.json`
- `package-lock.json`
- `src/domain/entities/types.ts`
- `src/features/fazer/domain/capacity.ts`
- `src/features/fazer/domain/dependencies.ts`
- `src/features/fazer/domain/eligibility.ts`
- `src/features/fazer/domain/ordering.ts`
- `src/features/fazer/domain/todayProjection.ts`
- `src/features/fazer/screens/HojeScreen.tsx`
- `src/shared/auth/AuthProvider.tsx`
- `src/shared/commands/operationalCommandHandlers.ts`
- `src/shared/repositories/conditionsRepository.ts`
- `src/shared/repositories/dailySessionsRepository.ts`
- `src/shared/repositories/dependenciesRepository.ts`
- `src/shared/repositories/entityChangeEventsRepository.ts`
- `src/shared/repositories/inboxRepository.ts`
- `src/shared/repositories/itemsRepository.ts`
- `src/shared/repositories/linksRepository.ts`
- `src/shared/repositories/localPersistence.ts`
- `src/shared/repositories/repositoryMappers.ts`
- `src/tests/antiRegression.test.ts`

## Decisoes

- `AuthProvider` manteve os estados canonicos `unauthenticated`, `loading`, `authenticated` e `degraded`; sem env Supabase, usa usuario local seguro.
- Repositories passaram a expor operacoes especificas `create` e `update`, mantendo Supabase encapsulado em `src/shared/repositories`.
- Command handlers deixaram de persistir colecoes inteiras e passaram a derivar a entidade criada/alterada a partir dos comandos puros de dominio.
- `entity_change_events` ganhou repository proprio para eventos criticos.
- Store continua existindo apenas como cache/adaptador de apresentacao; mutacoes relevantes passam por command handler.
- Capacidade agora separa `state`, `confidence`, `qualitativeLoad`, carga declarada, carga inferida e carga unknown.
- `TodayProjection` agora retorna `now`, `later`, `attention`, `blocked`, `paused`, `completed`, `itemDetails` e `readings`.
- `HojeScreen` deixou de recalcular condicoes operacionais e renderiza detalhes vindos da projection.

## Eventos Implementados

- `item_created`
- `item_updated`
- `item_completed`
- `item_archived`
- `inbox_converted`
- `inbox_postponed`
- `dependency_created`
- `essential_protected_applied`
- `day_opened`
- `day_closed`

Eventos adicionais de manutencao tambem foram deixados prontos: `item_restored`, `item_deleted`, `essential_protected_removed`.

## Ainda Local/Degraded

- Sem `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`, auth e repositories operam com fallback local em memoria.
- Fallback local nao e duravel entre reloads de processo.
- Eventos locais ficam em memoria e servem como contrato arquitetural, nao como log duravel.

## Pronto Para Supabase Real

- Auth usa `supabase.auth.getSession`, `onAuthStateChange` e `signOut`.
- Repositories conhecem as tabelas da migration P0:
  - `items`
  - `inbox_items`
  - `entity_conditions`
  - `entity_links`
  - `dependency_edges`
  - `daily_sessions`
  - `entity_change_events`
- UI e features nao importam client Supabase diretamente.
- Mutacoes principais entram por command handlers e repositories.

## Aderencia Canonica

- OperationalRow continua dominante em Fazer.
- Inbox continua triagem; convertido sai da projection de triagem.
- Essencial Protegido continua `EntityCondition`, nao entidade.
- `DependencyEdge` segue separado de `EntityLink`.
- Timeline permanece organizada por lenses: calendario, capacidade e dependencias.
- Capacidade nao inventa duracao; itens sem duracao permanecem `unknown`.
- IA permanece como sugestao pendente e nao importa commands/repositories.
- UI renderiza projections e nao chama Supabase diretamente.

## Riscos Restantes

- Repositories ainda nao usam transacoes para mutacao + evento; em Supabase real pode haver sucesso parcial se evento falhar apos mutacao.
- Ainda falta autenticar fluxos de login/signup na UI; a foundation ja suporta sessao e logout.
- Fallback local ainda e memoria de modulo, nao IndexedDB/localStorage.
- Testes cobrem invariantes canonicas, mas ainda nao cobrem cada repository contra Supabase real.
- RLS real precisa ser validado em ambiente Supabase com usuarios reais.

## Proximo Passo Recomendado

P3 deve focar em integracao Supabase real controlada: configurar env, validar RLS, testar repositories contra banco remoto/local, introduzir login/logout minimo sem redesenhar o produto e fechar transacoes/eventos criticos.
