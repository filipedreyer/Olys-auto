# Fase 7 — Planejar Canônico

## Escopo

A Fase 7 migrou Planejar para uma superfície de direção operacional, continuidade e conexão com execução. A mudança reorganiza a apresentação em camadas canônicas sem alterar projection, store, repositories, command handlers, direção, dependências, links, parentId ou regras de metas, projetos, hábitos e rotinas.

## Arquivos Alterados

- `src/features/planejar/screens/PlanejarScreen.tsx`
- `src/styles/globals.css`

## Arquivos Criados

- `src/features/planejar/components/PlanningHeader.tsx`
- `src/features/planejar/components/PlanningReadings.tsx`
- `src/features/planejar/components/PlanningDirectionLayer.tsx`
- `src/features/planejar/components/PlanningGoalsLayer.tsx`
- `src/features/planejar/components/PlanningProjectsLayer.tsx`
- `src/features/planejar/components/PlanningRhythmsLayer.tsx`
- `src/features/planejar/components/PlanningEntityRow.tsx`
- `src/features/planejar/components/planningPresentation.ts`
- `src/tests/planningContract.test.ts`
- `docs/recovery/phase-7-planejar.md`
- `docs/recovery/phase-7-checklist.md`

## Planejar Como Superfície De Direção

`PlanejarScreen` agora renderiza:

- `PlanningHeader`
- `PlanningReadings`
- `PlanningDirectionLayer`
- `PlanningGoalsLayer`
- `PlanningProjectsLayer`
- `PlanningRhythmsLayer`

A tela continua usando `buildPlanningProjection(items, conditions, dependencies, links)` como fonte única.

## Metas

Metas usam `entityType="goal"` e são apresentadas como direção operacional. `qualitativeProgress` foi preservado e apenas traduzido para labels visuais como “Direção clara”, “Conectada ao Fazer”, “Solta” e “Pausada”.

Não foram criados score, percentual, OKR ou progresso quantitativo.

## Projetos

Projetos usam `entityType="project"` e mostram meta vinculada, itens operacionais ativos, relação com o Fazer e risco de dependência já calculado pela projection.

Não foi criado kanban, timeline de projeto ou backlog.

## Ritmos

Hábitos e rotinas usam `entityType` real (`habit` ou `routine`). Eles aparecem como ritmos contextuais, com recorrência quando existir e leitura qualitativa já fornecida pela projection.

Não foram criados streak, score ou checklist ornamental.

## Readings

`PlanningReadings` usa `OlysIndicator` para mostrar no máximo quatro leituras:

- direção;
- trajetória;
- dependências;
- itens direcionais ativos.

## Projection

`planningProjection.ts` não foi alterado. A Fase 7 não enriqueceu nem reescreveu a projection.

## O Que Não Foi Alterado

- Repositories
- Command handlers
- `operationalStore`
- regras de direção
- cálculo de dependências
- links
- parentId
- Hoje
- Timeline
- Capturar
- Inbox
- Shell

## Riscos Remanescentes

- Planejar ainda depende da qualidade de links e parentId existentes para explicar conexão.
- Projetos sem item operacional ativo continuam aparecendo como desconectados, sem sugestão automática.
- Ritmos ainda não possuem uma superfície própria de edição ou recorrência refinada.

## Pendências Para Fase 8

Migrar Memória para gramática canônica de recuperação longitudinal, preservando ciclo de vida, concluídos, arquivados, Caixola, templates e recuperação sem virar arquivo morto ou knowledge base genérica.
