# Phase 2 Operational Item

## Escopo
Migrar a gramatica de representacao de itens operacionais para a familia canonica do Design System, sem redesenhar Hoje, Timeline ou Capturar como telas.

## Arquivos Alterados
- `src/design-system/contracts/operational-item.contract.md`
- `src/design-system/components/operational-item/*`
- `src/design-system/index.ts`
- `src/features/fazer/components/OperationalRow.tsx`
- `src/features/fazer/components/OperationalCarousel.tsx`
- `src/features/fazer/screens/HojeScreen.tsx`
- `src/features/fazer/screens/TimelineScreen.tsx`
- `src/styles/globals.css`
- `src/tests/operationalItemContract.test.ts`

## OperationalItem Como Contrato Superior
`OperationalItemBase` passou a carregar `data-state`, `data-density`, `data-entity` e `data-variant`. Ele compoe `EntityRail`, corpo textual, sinais e acoes opcionais sem calcular dominio.

## Row E Card
- `OperationalRowOlys` representa leitura linear/densa para listas, camadas secundarias e Timeline.
- `OperationalCardOlys` representa destaque/foco para Agora e carousel.
- Ambos usam a mesma base e diferem por `variant` e `density`.

## Rail
`EntityRail` recebeu `density` e `variant`, continua `aria-hidden` e usa tokens por entidade. O rail e a marca primaria da entidade; nao foi adicionado icone redundante.

## Estados E Sinais
Estados visuais suportados: default, attention, blocked, paused, completed e unknown.

Sinais suportados: essential, high_priority, scheduled, dependency, overdue, unknown e blocked.

`OperationalSignalStack` renderiza sinais curtos e discretos. `OperationalActions` prepara acoes rapidas sem implementar nova logica.

## Integracao Com Fazer
`OperationalRow` permanece como wrapper de compatibilidade para preservar a API existente, mas agora renderiza `OperationalRowOlys`.

Hoje passa `entityType`, prioridade e temporalidade quando o item real esta disponivel. `OperationalCarousel` tambem passa esses dados. Timeline usa fallback explicito `unclassified`, porque sua projection ainda nao expoe entidade.

## O Que Nao Foi Alterado
- Dominio.
- Repositories.
- Command handlers.
- Projections.
- Ordering.
- Logica de capacidade.
- Logica de dependencia.
- Layout geral de Hoje e Timeline.

## Riscos Remanescentes
- Timeline ainda usa `unclassified` em CalendarField ate a projection poder expor entidade sem expandir dominio.
- CapacityField e DependencyChain ainda possuem gramatica propria; a migracao delas deve acontecer em fase especifica da Timeline.
- `OperationalCardOlys` existe como base preparatoria, mas o carousel ainda passa pelo wrapper `OperationalRow` por compatibilidade.

## Fase 3
Migrar Hoje sobre a gramatica nova: hierarquia de Agora, Cabe hoje, Atencao e Concluidos usando `OperationalCardOlys`/`OperationalRowOlys` sem redesenhar regras de dominio.

## Validacoes
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `npm run test`: passou, 61 testes passados e 2 skipped.
- Rotas locais validadas com HTTP 200: `/fazer/hoje`, `/fazer/timeline`, `/memoria/inbox`.
- Navegador interno validou Shell ativo, FloatingActionPair ativo, CaptureSheet abrindo e placeholder da Idea abrindo.
- Navegador interno validou rails em Hoje e fallback `unclassified` na Timeline calendar lens.

## Falhas Encontradas
- Primeira rodada de typecheck falhou porque o teste novo usava `replaceAll`, incompatível com o alvo ES2020. Corrigido para regex simples.
