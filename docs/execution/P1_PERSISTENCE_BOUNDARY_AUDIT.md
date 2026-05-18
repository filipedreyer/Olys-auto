# P1 Persistence Boundary Audit

Date: 2026-05-17

## Objective

Implement a persistence boundary for Olys Release 1 without expanding UI, redesigning screens or adding new product features.

## Files Altered

- `src/app/App.tsx`
- `src/shared/auth/AuthProvider.tsx`
- `src/shared/store/OperationalDataProvider.tsx`
- `src/shared/store/operationalStore.ts`
- `src/shared/commands/operationalCommandHandlers.ts`
- `src/shared/repositories/localPersistence.ts`
- `src/shared/repositories/repositoryMappers.ts`
- `src/shared/repositories/itemsRepository.ts`
- `src/shared/repositories/inboxRepository.ts`
- `src/shared/repositories/conditionsRepository.ts`
- `src/shared/repositories/linksRepository.ts`
- `src/shared/repositories/dependenciesRepository.ts`
- `src/shared/repositories/dailySessionsRepository.ts`

## Decisions Taken

- `AuthProvider` is the single auth foundation for the app shell.
- Auth states are explicit:
  - `loading`
  - `unauthenticated`
  - `authenticated`
  - `degraded`
- If Supabase env vars are absent, the app enters `degraded` mode with the local seed user.
- Repositories are the only layer that talks to Supabase.
- Repositories automatically use local in-memory persistence when Supabase is not configured.
- Command handlers orchestrate:
  - domain commands
  - repositories
  - snapshot reloads
- Zustand remains only a presentation cache and action adapter.
- UI still renders projections and does not call Supabase, repositories or domain commands directly.

## Implemented Boundary

Repositories:

- `itemsRepository`
- `inboxRepository`
- `conditionsRepository`
- `linksRepository`
- `dependenciesRepository`
- `dailySessionsRepository`

Command handlers:

- `createItem`
- `updateItem`
- `completeItem`
- `archiveItem`
- `restoreItem`
- `softDeleteItem`
- `applyEssentialProtected`
- `removeEssentialProtected`
- `captureInput`
- `convertInboxItem`
- `postponeInboxItem`
- `triageInboxItem`
- `createDependency`
- `removeDependency`
- `createLink`
- `removeLink`
- `openDay`
- `closeDay`

## Canon Preserved

- `essential_protected` remains `EntityCondition`.
- `InboxItem` remains separate from `OlysItem`.
- `DependencyEdge` remains separate from `EntityLink`.
- UI does not decide domain behavior.
- UI does not call Supabase directly.
- Capacity still does not consume unknown duration.
- IA foundation still does not persist action without confirmation.

## Still Local / Degraded

- Local in-memory persistence is still active when Supabase env vars are absent.
- The app does not yet include visible login/signup/logout screens.
- Supabase repositories are ready, but the migration has not been applied to a real project in this cycle.
- Command handlers use full-list repository replacement/upsert for this boundary step; finer RPC/row-level command persistence is still future work.
- Entity change events are not yet emitted by command handlers.
- Safety Gate and Action Policy are not yet wired to IA command execution.

## Ready For Real Supabase

- `AuthProvider` can read Supabase session when env vars exist.
- Repositories read from the P0 table names:
  - `items`
  - `inbox_items`
  - `entity_conditions`
  - `entity_links`
  - `dependency_edges`
  - `daily_sessions`
- Repository mappers translate snake_case database rows to camelCase domain types.
- The store can hydrate from authenticated/degraded user context.

## Validation

- Pre-change `npm run typecheck`: passed.
- Pre-change `npm run build`: passed.
- Post-change `npm run typecheck`: passed.
- Post-change `npm run build`: passed.
- Browser route render check passed for:
  - `/fazer/hoje`
  - `/fazer/timeline`
  - `/capturar`
  - `/memoria/inbox`
  - `/planejar`
  - `/memoria`
- Browser text input automation was blocked by the current Browser virtual clipboard runtime, so mutation-by-typing was not used as final evidence in this cycle.

## Risks Remaining

- Supabase row writes are not yet validated against a live project.
- RLS may expose mismatches only after applying migrations and running authenticated sessions.
- Without visible auth UI, configured Supabase mode can become `unauthenticated` with empty operational state.
- Local fallback is in-memory only; reload resets degraded data.
- Repository `replaceAll` is acceptable for P1 boundary but should become command-specific writes or RPCs before heavier data volume.

## Next Recommended Step

Implement the persistence integration slice:

1. Apply the P0 migration to a real Supabase project.
2. Add minimal auth screens/session controls.
3. Replace repository `replaceAll` with command-specific persistence methods or RPCs.
4. Emit `entity_change_events` from command handlers.
5. Add anti-regression tests for:
   - Essential Protected is not an entity.
   - Inbox conversion preserves origin.
   - Capacity does not consume unknown duration.
   - Dependency does not equal link.
   - UI has no Supabase imports.
