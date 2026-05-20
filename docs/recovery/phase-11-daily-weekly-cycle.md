# Fase 11 - Ciclo Diário e Revisão Semanal

## Escopo

Esta fase aprofundou FZ03, FZ04, FZ05, PL05 e PL06. O foco foi criar uma camada operacional de coerência entre execução diária, preservação de contexto, capacidade e direção semanal.

## Arquivos Criados

- `src/design-system/contracts/daily-cycle.contract.md`
- `src/design-system/contracts/weekly-review.contract.md`
- `src/features/daily-cycle/domain/dailyCycleProjection.ts`
- `src/features/daily-cycle/components/DailyCyclePanel.tsx`
- `src/features/daily-cycle/components/OpenDayPanel.tsx`
- `src/features/daily-cycle/components/CloseDayPanel.tsx`
- `src/features/daily-cycle/components/DayReadingCard.tsx`
- `src/features/daily-cycle/components/DiaryClosingField.tsx`
- `src/features/daily-cycle/components/BreathingCard.tsx`
- `src/features/daily-cycle/components/dailyCyclePresentation.ts`
- `src/features/weekly-review/domain/weeklyReviewProjection.ts`
- `src/features/weekly-review/domain/replanningContract.ts`
- `src/features/weekly-review/components/WeeklyReviewLayer.tsx`
- `src/features/weekly-review/components/WeeklyReviewReadings.tsx`
- `src/features/weekly-review/components/WeeklyDirectionBlock.tsx`
- `src/features/weekly-review/components/WeeklyCapacityBlock.tsx`
- `src/features/weekly-review/components/WeeklyContinuityBlock.tsx`
- `src/features/weekly-review/components/WeeklyProtectedEssentialsBlock.tsx`
- `src/features/weekly-review/components/WeeklyReviewPromptList.tsx`
- `src/features/weekly-review/components/weeklyReviewPresentation.ts`
- `src/tests/dailyCycleContract.test.ts`
- `src/tests/weeklyReviewContract.test.ts`

## Arquivos Modificados

- `src/features/fazer/screens/HojeScreen.tsx`
- `src/features/fazer/components/TodayCyclePanel.tsx`
- `src/features/planejar/screens/PlanejarScreen.tsx`
- `src/styles/globals.css`

## FZ03 - Abrir o Dia

Abrir o Dia agora usa `DailyCycleProjection` e `OpenDayPanel`. A abertura mostra estado do dia, leitura curta, capacidade, direção e atenção resumidas. A ação continua chamando `openDay(today)` pelo store.

Nada é reorganizado automaticamente.

## FZ04 - Fechar o Dia e Diário

Fechar o Dia agora usa `CloseDayPanel` e `DiaryClosingField`. O diário é um registro mínimo vinculado ao fechamento, sem virar journaling complexo ou feed emocional. A ação continua chamando `closeDay(today, closingNote)`.

## FZ05 - Carta de Respiro

`BreathingCard` aparece quando não há carga restante relevante ou quando a leitura de capacidade indica espaço. Ela não cria ação persistente e não tenta preencher tempo liberado com nova tarefa.

## PL05 - Essenciais Protegidos

Essenciais protegidos aparecem em `WeeklyProtectedEssentialsBlock` a partir de `EntityCondition.conditionType = essential_protected`. Eles permanecem condição, não entidade.

## PL06 - Revisão Semanal

`WeeklyReviewLayer` foi integrado em Planejar como camada, não rota. A projection conecta:

- direção;
- capacidade;
- continuidade;
- execução;
- Memória;
- Inbox em transição;
- essenciais protegidos.

A revisão não cria métrica artificial, ranking, relatório motivacional, OKR ou ferramenta de projeto.

## Replanejamento e Ordenação

`replanningContract.ts` registra que replanejamento é operação de coerência com confirmação. Não há replanejamento persistente automático nesta fase.

Ordenação manual temporária também ficou como contrato futuro: exige rastreabilidade e não substitui ordering canônico em silêncio.

## O Que Não Foi Alterado

- Domínio.
- Repositories.
- Command handlers.
- Regras de capacidade.
- Regras de direção.
- Regras de dependência.
- Ordering.
- Idea.
- Entity Sheets.
- Memória.
- Capturar.
- Inbox.
- Timeline.

## Riscos Remanescentes

- Revisão Semanal ainda não persiste uma sessão própria de revisão.
- Replanejamento real ainda precisa de confirmação, rastreabilidade e desenho de comando.
- Ordenação manual temporária ainda não foi implementada.
- Carta de Respiro depende de regra simples de apresentação; pode precisar de QA com dados extremos.

## Recomendação Para Fase 12

Implementar Acesso, Onboarding, PWA e Estados Sistêmicos, cobrindo AC01 a AC07 e SYS01/SYS02, com foco em sessão expirada, loading, skeleton, offline e erro parcial.
