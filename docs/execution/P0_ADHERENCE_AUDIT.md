# P0 Adherence Audit

Date: 2026-05-17

## Canon Applied

- Documento Mestre Release 1 from `olys_documento_mestre_release1.zip`.
- Arquitetura Operacional Olys.
- Arquitetura Operacional - Tabelas.
- Governanca Dados, Seguranca e IA v3.

## Implemented In This Cycle

- Canonical routes:
  - `/fazer/hoje`
  - `/fazer/timeline`
  - `/capturar`
  - `/memoria/inbox`
  - `/planejar`
  - `/memoria`
- Legacy redirects:
  - `/hoje` -> `/fazer/hoje`
  - `/timeline` -> `/fazer/timeline`
  - `/inbox` -> `/memoria/inbox`
- Canonical domain vocabulary in TypeScript:
  - `EntityType`
  - `ItemStatus`
  - `ConditionType`
  - `DependencyType`
  - `LinkType`
  - `InboxStatus`
  - `CapacityState`
  - `DirectionState`
- Inbox is separated from final entities through `InboxItem`.
- Essential Protected is represented as `EntityCondition`.
- Dependencies are represented as `DependencyEdge`.
- Links remain separate as `EntityLink`.
- Domain commands were introduced for:
  - items
  - inbox triage
  - conditions
  - links
  - dependencies
  - daily sessions
- Supabase client was added with safe degradation when env vars are absent.
- Supabase P0 migration was added with tables, constraints, triggers, indexes and RLS.

## Verified

- `npm install @supabase/supabase-js`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Browser routes rendered:
  - `/fazer/hoje`
  - `/fazer/timeline`
  - `/capturar`
  - `/memoria/inbox`
  - `/planejar`
  - `/memoria`
- Capturar without type creates an Inbox entry in the local operational store.

## Remaining P0 Debt

- UI still uses local Zustand state; Supabase commands are not wired to persistence yet.
- Auth screens and session handling are not implemented.
- RLS migration has not been applied to a real Supabase project in this cycle.
- Admin route, `user_roles` enforcement and audit UI are not implemented yet.
- Safety Gate and Action Policy are still conceptual/foundation only.
- Automated anti-regression tests are still missing.
- Design System is still a CSS layer, not a formal `design-system/` package.

## Next Recommended Slice

Implement persistence boundary:

1. Auth/session provider.
2. Supabase repository layer for `items`, `inbox_items`, `entity_conditions`, `entity_links`, `dependency_edges` and `daily_sessions`.
3. Command handlers that call repositories instead of mutating store directly.
4. First anti-regression tests for:
   - Essential Protected is not an entity.
   - Inbox conversion creates an item and preserves origin.
   - Capacity does not consume unknown duration.
   - Dependency does not equal link.
   - IA action proposal requires confirmation.
