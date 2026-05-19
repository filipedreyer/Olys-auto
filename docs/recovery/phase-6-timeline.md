# Fase 6 — Timeline Canônica

## Escopo

A Fase 6 migrou Timeline para uma superfície temporal operacional com lentes separadas de calendário, capacidade e dependências. A mudança enriquece a projection apenas com dados já existentes em `OlysItem` e `DependencyEdge`, sem alterar regras de capacidade, dependência, elegibilidade, ordering, store, repositories ou command handlers.

## Arquivos Alterados

- `src/features/fazer/screens/TimelineScreen.tsx`
- `src/features/fazer/components/TimelineLensSwitcher.tsx`
- `src/features/fazer/domain/timelineProjection.ts`
- `src/features/fazer/domain/timelineLens.ts`
- `src/styles/globals.css`
- `src/tests/todayScreenContract.test.ts`
- `src/tests/operationalGrammar.test.ts`

## Arquivos Criados

- `src/features/fazer/components/timeline/TimelineHeader.tsx`
- `src/features/fazer/components/timeline/TimelineReadings.tsx`
- `src/features/fazer/components/timeline/TimelineSurface.tsx`
- `src/features/fazer/components/timeline/TimelineCapacityLens.tsx`
- `src/features/fazer/components/timeline/TimelineDependencyLens.tsx`
- `src/features/fazer/components/timeline/TimelineCalendarLens.tsx`
- `src/features/fazer/components/timeline/TimelineEntryRow.tsx`
- `src/features/fazer/components/timeline/timelinePresentation.ts`
- `src/tests/timelineContract.test.ts`
- `docs/recovery/phase-6-timeline.md`
- `docs/recovery/phase-6-checklist.md`

## Timeline Como Superfície Única

`TimelineScreen` agora renderiza:

- `TimelineHeader`
- `TimelineReadings`
- `TimelineSurface`

`TimelineSurface` escolhe a lente ativa sem misturar calendário, capacidade e dependências ao mesmo tempo.

## Capacidade

`TimelineCapacityLens` usa `projection.readings.capacity` e `projection.entries`. Ela não recalcula carga, não soma duração paralela e não inventa duração. Itens sem duração seguem como `unknown`.

## Dependências

`TimelineDependencyLens` representa cadeia simples com predecessor, sucessor, tipo, impacto e status. Ela não cria novas dependências e não trata vínculo contextual como dependência.

## Calendário

`TimelineCalendarLens` usa `TimelineEntryRow` e `OperationalRow` para mostrar janelas temporais declaradas. Não há grade mensal nem calendário genérico.

## Enriquecimento Da Projection

`TimelineEntry` agora expõe, quando disponível:

- `entryKind`
- `entityType`
- `status`
- `dateStart`
- `dateEnd`
- `startAt`
- `endAt`
- `durationMinutes`
- `sourceContext`
- `predecessorTitle`
- `successorTitle`
- `dependencyType`
- `dependencyImpact`
- `dependencyStatus`

Esses campos apenas refletem dados já existentes.

## O Que Não Foi Alterado

- Repositories
- Command handlers
- `operationalStore`
- regras de capacidade
- cálculo de dependências
- elegibilidade
- ordering
- Hoje
- Capturar
- Inbox
- Shell

## Riscos Remanescentes

- A URL de lente ainda depende de estado local inicial; mudanças externas no query param durante a mesma montagem não sincronizam automaticamente.
- A cadeia de dependências é visualmente simples e não resolve agrupamentos complexos.
- A lente calendário ainda depende da qualidade dos dados temporais existentes; não cria data ou horário ausente.

## Pendências Para Fase 7

Migrar Planejar/Memória para a gramática canônica restante ou iniciar QA arquitetural das superfícies já recuperadas, conforme prioridade da próxima rodada.
