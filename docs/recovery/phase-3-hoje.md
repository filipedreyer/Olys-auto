# Phase 3 Hoje

## Escopo
Migrar a tela Hoje para a gramatica canonica criada nas Fases 0, 1 e 2, sem alterar dominio, projections, ordering, capacidade, dependencia ou regras de elegibilidade.

## Arquivos Alterados
- `src/features/fazer/screens/HojeScreen.tsx`
- `src/features/fazer/components/OperationalCarousel.tsx`
- `src/features/fazer/components/OperationalRow.tsx`
- `src/features/fazer/components/todayItemPresentation.ts`
- `src/features/fazer/components/TodayHeader.tsx`
- `src/features/fazer/components/TodayCyclePanel.tsx`
- `src/features/fazer/components/TodayIndicators.tsx`
- `src/features/fazer/components/NowStage.tsx`
- `src/features/fazer/components/TodaySecondaryLayer.tsx`
- `src/features/fazer/components/AttentionLayer.tsx`
- `src/features/fazer/components/CompletedLayer.tsx`
- `src/styles/globals.css`
- `src/tests/todayScreenContract.test.ts`

## Agora
`projection.now` continua sendo a fonte unica. A renderizacao passa por `NowStage` e `OperationalCarousel`, que agora usa `OperationalCardOlys` com density featured, secondary e tertiary.

## Cabe Hoje
`projection.later` foi isolado em `TodaySecondaryLayer`, preservando o comportamento colapsavel e usando `OperationalRow` como wrapper canonico sobre `OperationalRowOlys`.

## Atencao
`AttentionLayer` separa attention e blocked com estados visuais diferentes. Attention usa motivo vindo de `projection.itemDetails` quando disponivel, com fallback curto. Blocked usa `state="blocked"`.

## Concluidos
`CompletedLayer` renderiza somente quando `projection.completed` existe, com `state="completed"` e baixo peso visual.

## Ciclo Do Dia
`TodayCyclePanel` separa Abrir o Dia, Fechar o Dia e nota de fechamento do header. Os handlers existentes `openDay(today)` e `closeDay(today, closingNote)` foram preservados.

## Indicadores
`TodayIndicators` usa as readings existentes de direction, capacity e dependencyRisk. Nao recalcula capacidade, direcao ou dependencia.

## Unknown Sem Ruido
O helper apresentacional evita promover todo item sem duracao a chip `Unknown`. Unknown continua aparecendo quando houver estado unknown, duracao explicitamente nula ou motivo de atencao com informacao unknown.

## O Que Nao Foi Alterado
- Dominio.
- Repositories.
- Command handlers.
- Projections.
- Ordering.
- Elegibilidade.
- Capacidade.
- Dependencias.
- Timeline.
- Capturar.
- Shell Global.

## Riscos Remanescentes
- Textos vindos do dominio ainda podem conter acentuacao ausente, porque a fase nao alterou projections.
- `OperationalCarousel` agora usa `OperationalCardOlys`, mas ainda preserva classes antigas para compatibilidade visual/testes.
- Timeline ainda tem gramatica propria e fica para fase especifica.

## Pendencias Para Fase 4
- Migrar Capturar para a gramatica canonica de sheet emergente e CaptureGrid sem alterar fluxo de dados.

## Validacoes
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `npm run test`: passou, 70 testes passados e 2 skipped.
- Rotas locais validadas com HTTP 200: `/fazer/hoje`, `/fazer/timeline`, `/planejar`, `/memoria`, `/memoria/inbox`.
- Navegador interno validou Shell, BottomNav, FloatingActionPair, abertura de Capturar e placeholder da Idea.
- Navegador interno validou `TodayHeader`, `TodayCyclePanel`, `TodayIndicators`, cards em Agora, rows em Atencao e rails nos itens de Hoje.

## Falhas Encontradas
- Testes antigos ainda verificavam a composicao anterior de Hoje e a passagem literal de `entityType` pelo carousel. Foram atualizados para proteger `NowStage`, `OperationalCardOlys` e o view model apresentacional.
