# P5 Daily Timeline Audit

Data: 2026-05-17

Escopo executado: Bloco D, Ciclo do Dia + Timeline real.

## Arquivos Alterados

- `src/domain/entities/types.ts`
- `src/domain/commands/dailySessionCommands.ts`
- `src/features/fazer/screens/HojeScreen.tsx`
- `src/features/fazer/screens/TimelineScreen.tsx`
- `src/features/fazer/domain/timelineProjection.ts`
- `src/shared/commands/operationalCommandHandlers.ts`
- `src/shared/repositories/repositoryMappers.ts`
- `src/styles/globals.css`
- `src/tests/dailyTimeline.test.ts`
- `supabase/migrations/20260518010000_daily_sessions_operational_readings.sql`

## Decisoes

- `daily_sessions` recebeu campos minimos para preservar leitura operacional:
  - `opening_reading`
  - `capacity_reading`
  - `direction_reading`
  - `attention_summary`
  - `session_status`
- Abertura e fechamento do dia continuam passando por command handlers e repositories.
- Leituras sao derivadas de `TodayProjection`, sem IA avancada.
- HojeScreen apenas aciona abrir/fechar e renderiza estado da sessao.
- Timeline segue por lenses operacionais, nao por calendario corporativo.

## Leituras Implementadas

- Direction reading:
  - estado
  - statement
  - quantidade de itens protegidos
- Capacity reading:
  - state
  - confidence
  - qualitativeLoad
  - unknownLoadCount
  - inferredLoadCount
- Attention summary:
  - contagem contextual simples
  - texto curto e operacional

## Comportamento Da Timeline

Lens Calendario:

- Mostra apenas itens temporais ou com natureza temporal.
- Nao tenta virar agenda completa.

Lens Capacidade:

- Mostra carga declarada ou `Duracao unknown`.
- Mantem leitura qualitativa.
- Nao inventa duracao.

Lens Dependencias:

- Mostra predecessor, sucessor, tipo e impacto.
- Usa `DependencyEdge`, separado de `EntityLink`.

## Eventos Emitidos

- `day_opened`
- `day_closed`

Os eventos carregam `sessionId`, `date` e `attentionSummary` em metadata.

## Testes Adicionados

- Abrir sessao diaria.
- Fechar sessao diaria.
- Persistir `closing_note`.
- Emitir eventos de abertura e fechamento.
- TodayProjection consistente com lanes e readings.
- Timeline com lenses reais.
- Capacidade qualitativa sem inventar duracao.
- Dependencia continua sendo bloqueio/sequencia/impacto.
- UI nao chama Supabase diretamente.
- UI nao decide regras centrais de dominio.

## Limites Do Release 1

- Fechar o Dia e um fechamento operacional minimo, nao journaling complexo.
- Leituras sao heuristicas simples, nao IA.
- Timeline nao e calendario completo.
- Sem dashboards, analytics ou observabilidade nova.
- Sem RPC transacional neste ciclo.

## Riscos

- Supabase real precisa aplicar a migration P5 antes de persistir os novos campos de `daily_sessions`.
- Mutation + event atomicity segue como risco conhecido documentado em P3.
- UI de fechamento aceita texto livre curto; schema de resumo pode ser refinado depois.

## Dividas Tecnicas

- Criar projection dedicada de DayCycle pode reduzir ainda mais acoplamento da HojeScreen.
- Adicionar testes Supabase reais para a migration P5 quando env existir.
- Considerar RPC transacional para `openDay`/`closeDay` no futuro.

## Proximos Passos

Depois de validar P4/P5 em ambiente real, o proximo bloco recomendado e consolidar Release 1 com uma auditoria final de fluxo ponta a ponta antes de qualquer expansao para Planejar, Memoria completa ou IA avancada.
