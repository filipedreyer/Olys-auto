# Phase 8 - Memoria

Status: migracao da Memoria para superficie canonica de recuperacao operacional.

## Escopo

Esta fase migrou Memoria para continuidade longitudinal, recuperacao e ciclo de vida. O trabalho foi limitado a projection apresentacional, componentes de Memoria, CSS localizado, testes e documentacao.

Nao foram alterados repositories, command handlers, operationalStore, Inbox, Capturar, Hoje, Timeline, Planejar, Shell, dominio, rotas ou infraestrutura.

## Arquivos Criados

- `src/features/memoria/components/MemoryHeader.tsx`
- `src/features/memoria/components/MemoryReadingBand.tsx`
- `src/features/memoria/components/MemorySubareaGrid.tsx`
- `src/features/memoria/components/MemoryRecoveryLayer.tsx`
- `src/features/memoria/components/MemoryCaixolaLayer.tsx`
- `src/features/memoria/components/MemoryTemplatesLayer.tsx`
- `src/features/memoria/components/MemoryArchiveLayer.tsx`
- `src/features/memoria/components/MemoryCompletedLayer.tsx`
- `src/features/memoria/components/MemoryAttachmentsLayer.tsx`
- `src/features/memoria/components/MemorySearchLayer.tsx`
- `src/features/memoria/components/MemoryItemRow.tsx`
- `src/features/memoria/components/memoryPresentation.ts`
- `src/tests/memoryContract.test.ts`
- `docs/recovery/phase-8-checklist.md`

## Arquivos Alterados

- `src/features/memoria/domain/memoryProjection.ts`
- `src/features/memoria/screens/MemoriaScreen.tsx`
- `src/styles/globals.css`
- `src/tests/memory.test.ts`

## MEM00 a MEM07

- MEM00 Home de Memoria: representada por `MemoryHeader`, `MemoryReadingBand` e `MemorySubareaGrid`.
- MEM01 Atalhos: representada como subarea de retomadas por origem, entidade, status e acao.
- MEM02 Caixola: `MemoryCaixolaLayer`.
- MEM03 Templates: `MemoryTemplatesLayer`.
- MEM04 Arquivados: `MemoryArchiveLayer`.
- MEM05 Concluidos: `MemoryCompletedLayer`.
- MEM06 Anexos: `MemoryAttachmentsLayer` como contrato futuro privado.
- MEM07 Busca em Memoria: `MemorySearchLayer` com filtro local sobre projection.

## Caixola

Caixola mostra notas soltas e InboxItems em `kept` ou `postponed`. Itens `new` e `error` permanecem na Inbox/Triagem. A camada nao converte, nao tria e nao cria fila ativa.

## Templates

Templates continuam `entityType: template` e usam `reuseTemplate` existente. Nao houve editor, loja, marketplace ou nova entidade.

## Arquivados

Arquivados aparecem como material fora do fluxo ativo, ainda recuperavel. `restoreItem` foi preservado como acao.

## Concluidos

Concluidos aparecem como historico operacional recuperavel. A tela nao cria placar, score, streak ou leitura produtivista.

## Anexos

Anexos foram tratados como contrato futuro: privados, com metadata, permissao e governanca. Nao foi criado upload, storage, URL publica ou infraestrutura nova.

## Busca

Busca em Memoria usa filtro local sobre `projection.search`. Ela nao acessa Supabase, repositories ou busca global.

## O Que Nao Foi Alterado

- Dominio.
- Store.
- Repositories.
- Command handlers.
- Regras de `restoreItem`.
- Regras de `reuseTemplate`.
- Inbox triage.
- Capturar.
- Hoje.
- Timeline.
- Planejar.
- Shell.
- Rotas.
- Storage.
- IA.

## Riscos Remanescentes

- Anexos ainda dependem de storage privado e governanca real.
- Busca local nao substitui busca global futura.
- Atalhos ainda sao representacao de subarea, nao fluxo dedicado.
- Entity Sheets ainda faltam para abrir detalhe completo de cada item.
- Focus trap e QA visual final continuam pendentes para fase posterior.

## Recomendacao Para Fase 9

Iniciar Idea como apoio contextual governado: IA01 a IA05, separando leitura, sugestao, relatorio e acao proposta. A primeira entrega deve implementar context builder minimo, output estruturado e Confirmation Sheet obrigatoria para qualquer acao persistente, sem transformar Idea em chatbot ou rota principal.
