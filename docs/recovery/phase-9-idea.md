# Phase 9 - Idea

Status: camada contextual governada, sem IA real externa.

## Escopo

Esta fase substituiu o placeholder da Idea por um drawer contextual governado. A implementação cria tipos, context builder mínimo, responder determinístico local, Safety Gate, guards de output, UI de saída e Confirmation Sheet.

Não foram criadas rotas, edge functions, chamadas externas, persistência de prompt/resposta, automações ou execução de command handlers.

## Arquivos Criados

- `src/features/idea/domain/ideaTypes.ts`
- `src/features/idea/domain/ideaContextBuilder.ts`
- `src/features/idea/domain/ideaDeterministicResponder.ts`
- `src/features/idea/domain/ideaSafetyGate.ts`
- `src/features/idea/domain/ideaOutputGuards.ts`
- `src/features/idea/components/IdeaDrawer.tsx`
- `src/features/idea/components/IdeaInput.tsx`
- `src/features/idea/components/IdeaOutputList.tsx`
- `src/features/idea/components/IdeaOutputCard.tsx`
- `src/features/idea/components/IdeaConfirmationSheet.tsx`
- `src/features/idea/components/IdeaContextSummary.tsx`
- `src/features/idea/components/IdeaUnavailableState.tsx`
- `src/features/idea/components/IdeaDisclosure.tsx`
- `src/tests/ideaGovernanceContract.test.ts`
- `docs/recovery/phase-9-checklist.md`

## Arquivos Modificados

- `src/app/shell/AppShell.tsx`
- `src/design-system/contracts/idea.contract.md`
- `src/styles/globals.css`
- `src/tests/shellContract.test.ts`

## IA01 a IA05

- IA01 Idea / Apoio contextual: `IdeaDrawer` abre pelo FloatingActionPair.
- IA02 Resposta contextual: `IdeaOutputCard` renderiza leitura e resposta local.
- IA03 Sugestões e ações propostas: `suggestion` e `proposed_action` são tipos separados.
- IA04 Relatório contextual: responder determinístico gera `report` quando a superfície pede leitura de síntese.
- IA05 Confirmation Sheet IA: `IdeaConfirmationSheet` revisa ação proposta sem persistir.

## Context Builder

`buildIdeaContext` usa somente dados já carregados no store e resume:

- superfície atual;
- contagens;
- sinais relevantes;
- unknown;
- blocked;
- inbox pending;
- memory recoverable;
- planning direction;
- timeline pressure.

Ele não acessa repositories, Supabase ou serviço externo. Texto livre é truncado e não é persistido.

## Output Types

Foram separados:

- `reading`;
- `suggestion`;
- `report`;
- `proposed_action`;
- `unavailable`;
- `safety_blocked`.

Reading e report não carregam ação persistente. Proposed action exige `requiresConfirmation: true`.

## Safety Gate

`runIdeaSafetyGate` bloqueia:

- ação persistente sem confirmação;
- ação destrutiva sem confirmação;
- payload com campos proibidos;
- linguagem de autoexecução;
- conteúdo sensível ou de risco;
- saída inválida para o tipo.

## Confirmation Sheet

A Confirmation Sheet mostra ação proposta, consequência, reversibilidade, dados ausentes e aviso de não persistência. O botão confirma apenas simulação. Nenhum command handler é chamado.

## Por Que Não Há IA Real

Não há integração segura de modelo, prompt versionado, logs minimizados produtivos, Safety Gate produtivo e infraestrutura de auditoria para ação real. A fase correta é validar contrato, UI, contexto mínimo, tipagem, fallback e confirmação.

## O Que Não Foi Alterado

- Domínio.
- Store.
- Repositories.
- Command handlers.
- Projections de Hoje, Timeline, Capturar, Inbox, Planejar ou Memória.
- Rotas.
- Capturar.
- Hoje.
- Timeline.
- Inbox.
- Planejar.
- Memória.
- Backend.

## Riscos Remanescentes

- IA real ainda precisa provider seguro, prompt governance e logs minimizados.
- Confirmation Sheet ainda simula aplicação.
- Safety Gate é determinístico e mínimo.
- Não há output schema externo validado.
- Não há auditoria produtiva de ações IA.

## Recomendação Para Fase 10

Iniciar Entity Sheets por entidade: ENT00 a ENT09, com sheet base, campos específicos, vínculos, dependências, composição, Event Prep, Project Stages, milestones, riscos, anexos e histórico. A regra central é evitar mega-formulário universal e separar campos editáveis, derivados e históricos.
