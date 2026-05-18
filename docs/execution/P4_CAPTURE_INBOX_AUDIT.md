# P4 Capture Inbox Audit

Data: 2026-05-17

Escopo executado: Bloco C, Capturar + Inbox reais para Release 1.

## Arquivos Alterados

- `src/domain/entities/types.ts`
- `src/features/capturar/components/CaptureGrid.tsx`
- `src/features/capturar/domain/captureDestination.ts`
- `src/features/capturar/screens/CapturarScreen.tsx`
- `src/features/inbox/domain/inboxProjection.ts`
- `src/features/inbox/domain/inboxTriage.ts`
- `src/features/inbox/screens/InboxScreen.tsx`
- `src/shared/commands/operationalCommandHandlers.ts`
- `src/shared/repositories/repositoryMappers.ts`
- `src/shared/store/operationalStore.ts`
- `src/styles/globals.css`
- `src/tests/captureInbox.test.ts`

## Decisoes

- Capturar segue como entrada transversal, nao upload.
- Destino default e `Inbox`.
- `CaptureGrid` e simples e funcional, sem cardificacao ornamental.
- A decisao de destino fica em `captureDestination`, nao na tela.
- Lembrete so vira entidade final quando ha data/tempo suficiente; sem isso entra como `InboxItem` com `suggestedType: reminder`.
- Inbox ganhou projection propria em `inboxProjection`.
- Inbox continua separada de `OlysItem`.
- Store continua como adapter/cache; mutacoes passam por command handlers e repositories.

## Fluxos Implementados

- Captura sem tipo cria `InboxItem`.
- Captura tipada cria `OlysItem`.
- Captura como lembrete sem data cria `InboxItem` para triagem.
- Captura como lembrete com data cria `OlysItem` do tipo `reminder`.
- Inbox mostra itens pendentes de triagem com origem, data de captura, tipo sugerido e status.
- Converter cria entidade operacional e fecha o `InboxItem` como `converted`.
- Concluir fecha o `InboxItem` como `completed`, sem criar entidade.
- Adiar fecha como `postponed`, preservando `needsRevisit`, `postponedAt` e metadata.
- Descartar fecha como `discarded` e emite evento.
- Manter preserva como `kept`, ainda dentro da triagem.

## Eventos Emitidos

- `inbox_captured`
- `inbox_converted`
- `inbox_completed`
- `inbox_postponed`
- `inbox_discarded`
- `inbox_kept`
- `item_created` para capturas tipadas

## Metadata De Rastreabilidade

Adiar preserva:

- `inbox_postponed`
- `inbox_postponed_at`
- `inbox_needs_revisit`
- `inbox_source_id`

Conversao preserva origem em:

- `sourceContext: inbox:<id>`
- `metadata.inbox_source_id`
- `metadata.inbox_source_context`

## Testes Adicionados

- Captura sem tipo vai para Inbox.
- Captura tipada cria entidade correta.
- Lembrete sem data nao vira entidade final.
- Converter InboxItem cria OlysItem.
- Concluir InboxItem fecha triagem.
- Adiar preserva metadata.
- Descartar preserva evento.
- Inbox nao vira backlog.
- UI nao chama Supabase diretamente.
- UI nao decide dominio.

## Validacao P4

- `npm run typecheck`: passou.
- `npm run test`: passou.

## Dividas Tecnicas

- Inbox ainda nao possui selecao fina de tipo no momento da conversao; usa tipo sugerido ou `task`.
- Fallback local segue em memoria.
- Eventos ainda nao sao atomicos com mutacao.
- Supabase/RLS real continua pendente de env real, conforme P3.

## Riscos

- Em Supabase real, conversao + evento podem ter sucesso parcial ate existir RPC transacional.
- Metadata de triagem esta flexivel; pode ganhar schema mais estrito depois do Release 1.

## Proximo Passo

Iniciar P5: Ciclo do Dia + Timeline real, focando em `daily_sessions`, Abrir o Dia, Fechar o Dia e leituras contextuais, sem expandir Planejar, Memoria ou IA.
