# R1 E2E Coherence Audit

Data: 2026-05-18

Escopo executado: Rodada 1 de fechamento da Release 1, focada em auditoria ponta a ponta, coerencia operacional e correcoes pequenas. Nao houve expansao de features, redesign, IA avancada, dashboards, analytics, Admin ou infraestrutura nova.

## Fluxo Auditado

Fluxo obrigatorio validado:

Capturar -> Inbox -> Converter -> Fazer -> Abrir o Dia -> Timeline -> Planejar -> Concluir/Arquivar -> Memoria -> Recuperar.

## Arquivos Alterados

- `docs/execution/R1_E2E_COHERENCE_AUDIT.md`
- `src/domain/commands/dailySessionCommands.ts`
- `src/domain/commands/itemCommands.ts`
- `src/features/fazer/domain/directionReading.ts`
- `src/features/fazer/domain/timelineProjection.ts`
- `src/features/fazer/screens/HojeScreen.tsx`
- `src/features/fazer/screens/TimelineScreen.tsx`
- `src/features/inbox/domain/inboxProjection.ts`
- `src/features/inbox/screens/InboxScreen.tsx`
- `src/features/memoria/screens/MemoriaScreen.tsx`
- `src/features/planejar/screens/PlanejarScreen.tsx`
- `src/shared/components/EmptyState.tsx`
- `src/styles/globals.css`
- `src/tests/captureInbox.test.ts`
- `src/tests/dailyTimeline.test.ts`
- `src/tests/memory.test.ts`
- `src/tests/release1E2E.test.ts`

## Incoerencias Encontradas

- Inbox misturava entradas novas, mantidas e adiadas no mesmo bloco de triagem, deixando a tela mais proxima de backlog do que de triagem.
- Hoje ja possuia `blocked`, `paused` e `completed` na `TodayProjection`, mas a tela nao renderizava essas lanes.
- Algumas telas ficavam silenciosamente vazias quando a projection nao retornava linhas.
- `openDay` em uma sessao ja fechada atualizava a sessao e podia emitir novo `day_opened`, mesmo sem reabrir o dia.
- `restoreItem` podia restaurar item concluido mantendo `completedAt`, deixando estado historico incoerente com item ativo.
- Timeline usava um titulo generico para a lens calendario; foi alinhada para "Calendario operacional".
- Havia um residuo de encoding em `directionReading`, corrigido para separador ASCII simples.

## Correcoes Feitas

- `InboxProjection` agora separa:
  - `triageItems`: entradas novas ou com erro, ainda aguardando decisao;
  - `revisitItems`: entradas mantidas ou adiadas, em revisita controlada.
- `InboxScreen` renderiza "Em triagem" e "Revisita controlada" separadamente, sem misturar espera controlada com fila ativa.
- `HojeScreen` passou a renderizar estados vazios e as lanes de bloqueados, pausados e concluidos recentes vindas da projection.
- `TimelineScreen`, `PlanejarScreen` e `MemoriaScreen` ganharam estados vazios simples e operacionais.
- `openDay` ficou idempotente para dias ja fechados.
- `restoreItem` limpa `completedAt`, `archivedAt` e `deletedAt` ao restaurar contexto para ativo.
- Foi criado `EmptyState` compartilhado apenas para estados minimos, sem novo modulo de produto.

## Testes Adicionados Ou Endurecidos

- `release1E2E.test.ts`: cobre o fluxo operacional de ponta a ponta em modo degraded/local.
- `captureInbox.test.ts`: garante que mantidos/adiados saem da triagem ativa e entram em revisita controlada.
- `dailyTimeline.test.ts`: garante que dia fechado nao reabre nem duplica evento de abertura.
- `memory.test.ts`: garante que restaurar item concluido nao deixa `completedAt` stale.

## Aderencia Canonica

- Capturar continua entrada transversal, nao upload.
- Inbox continua triagem; mantidos e adiados nao viram backlog ativo.
- Fazer continua centrado em `OperationalRow`.
- Hoje renderiza `TodayProjection`; a tela nao decide elegibilidade, capacidade ou dependencia.
- Timeline continua por lenses operacionais e nao virou calendario corporativo.
- Planejar segue conectado ao Fazer por direction readings, sem dashboard estrategico.
- Memoria segue como recuperacao/contexto, nao arquivo morto.
- Capacidade continua qualitativa e nao inventa duracao.
- `DependencyEdge` segue separado de `EntityLink`.
- UI continua sem chamada direta a Supabase.

## Riscos Restantes

- RLS real segue preparado, mas nao validado sem env Supabase e usuarios de teste.
- Mutation + event atomicity continua risco conhecido, documentado desde P3.
- Estados vazios sao minimos; a avaliacao visual/experiencial fina fica para escopo posterior.
- Alguns fluxos ainda dependem de fallback local em memoria quando Supabase nao esta configurado.

## Pontos Frageis Ainda Existentes

- Conversao da Inbox ainda usa tipo sugerido ou `task` quando nao ha escolha fina no momento da acao.
- Relacao Meta-Projeto ainda depende de `parentId` ou `EntityLink`, sem fluxo visual dedicado.
- Templates continuam simples e baseados em metadata.
- Supabase mode precisa validacao real de migrations P0/P5 em ambiente configurado.

## Validacao

- `npm run typecheck`: passou.
- `npm run build`: passou.
- `npm run test`: passou.
- Runtime local via HTTP:
  - `/fazer/hoje`: 200
  - `/fazer/timeline`: 200
  - `/memoria/inbox`: 200
  - `/planejar`: 200
  - `/memoria`: 200

## Proximo Passo Recomendado

Executar Rodada 2: Release hardening leve, focando robustez, responsividade basica, acessibilidade minima, degraded mode, guards e documentacao final `RELEASE1_FINAL_AUDIT.md`, sem abrir escopo de produto.
