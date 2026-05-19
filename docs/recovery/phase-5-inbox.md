# Fase 5 — Inbox/Triagem Canônica

## Escopo

A Fase 5 migrou Inbox para uma camada transitória de triagem cognitiva. A entrega reorganiza a apresentação de `InboxItem` sem alterar domínio, store, command handlers, repositories, regras de triagem, regras de conversão ou metadata de rastreabilidade.

## Arquivos Alterados

- `src/features/inbox/screens/InboxScreen.tsx`
- `src/styles/globals.css`

## Arquivos Criados

- `src/features/inbox/components/InboxHeader.tsx`
- `src/features/inbox/components/InboxReadingBand.tsx`
- `src/features/inbox/components/InboxTriageLayer.tsx`
- `src/features/inbox/components/InboxRevisitLayer.tsx`
- `src/features/inbox/components/InboxTriageItem.tsx`
- `src/features/inbox/components/InboxTriageActions.tsx`
- `src/features/inbox/components/inboxPresentation.ts`
- `src/tests/inboxTriageContract.test.ts`
- `docs/recovery/phase-5-inbox.md`
- `docs/recovery/phase-5-checklist.md`

## Como A Inbox Foi Migrada

`InboxScreen` deixou a estrutura administrativa de seções genéricas e passou a renderizar:

- `InboxHeader`
- `InboxReadingBand`
- `InboxTriageLayer`
- `InboxRevisitLayer`

A tela ainda usa `buildInboxProjection(inboxItems)` como fonte única de apresentação.

## Triagem Nova E Revisita Controlada

`triageItems` continuam representando `new` e `error`.

`revisitItems` continuam representando `kept` e `postponed`.

Triagem nova tem maior peso porque exige decisão antes de virar trabalho. Revisita controlada é secundária e não compete como fila ativa.

## Separação Entre InboxItem E OlysItem

`InboxTriageItem` representa explicitamente `InboxItem`. Ele não usa entidade operacional específica, não cria prioridade e não trata entrada como tarefa.

`OlysItem` só surge quando o usuário escolhe Converter, preservando a fronteira de decisão.

## Ações Preservadas

Modo triage:

- Manter
- Converter
- Concluir
- Adiar
- Descartar

Modo revisit:

- Converter
- Concluir
- Descartar

Converter continua usando `suggestedType ?? 'task'`.

## Rastreabilidade Preservada

Não foram alterados:

- `convertedItemId`
- `postponedAt`
- `needsRevisit`
- `metadata.inbox_source_id`
- `metadata.inbox_postponed`
- `metadata.inbox_postponed_at`
- `metadata.inbox_needs_revisit`
- `sourceContext`
- eventos emitidos nos command handlers

## O Que Não Foi Alterado

- `buildInboxProjection`
- `inboxTriage`
- `operationalStore`
- command handlers
- repositories
- Capturar
- Hoje
- Timeline
- Shell
- Planejar
- Memória

## Riscos Remanescentes

- A conversão ainda não permite escolha refinada de tipo além de `suggestedType ?? 'task'`.
- A tela não tem confirmação para Descartar; o destaque visual foi reduzido, mas a ação continua direta como antes.
- Revisita controlada ainda depende do usuário voltar à Inbox; não há lembrete ou automação nesta fase.

## Pendências Para Fase 6

Migrar Timeline para gramática canônica, com foco em lentes operacionais, capacidade qualitativa e cadeia de dependências, sem transformar a tela em calendário ou analytics.
