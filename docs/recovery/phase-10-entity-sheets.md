# Fase 10 - Entity Sheets

## Escopo

Esta fase criou a arquitetura canônica de Entity Sheets para ENT00 a ENT09. O objetivo foi permitir detalhe contextual por entidade sem rota principal, sem mega-formulário universal e sem alteração da ontologia.

## Arquivos criados

- `src/features/entity-sheets/domain/entitySheetTypes.ts`
- `src/features/entity-sheets/domain/entitySheetProjection.ts`
- `src/features/entity-sheets/domain/entitySheetFields.ts`
- `src/features/entity-sheets/domain/entitySheetGuards.ts`
- `src/features/entity-sheets/context/EntitySheetContext.tsx`
- `src/features/entity-sheets/components/EntitySheetHost.tsx`
- `src/features/entity-sheets/components/EntitySheet.tsx`
- `src/features/entity-sheets/components/EntitySheetHeader.tsx`
- `src/features/entity-sheets/components/EntityEditableFields.tsx`
- `src/features/entity-sheets/components/EntityDerivedFields.tsx`
- `src/features/entity-sheets/components/EntityRelationBlock.tsx`
- `src/features/entity-sheets/components/EntityDependencyBlock.tsx`
- `src/features/entity-sheets/components/EntityCompositionBlock.tsx`
- `src/features/entity-sheets/components/EntityHistoryBlock.tsx`
- `src/features/entity-sheets/components/EntityAttachmentBlock.tsx`
- `src/features/entity-sheets/components/EntitySpecificBlock.tsx`
- `src/features/entity-sheets/components/EntitySheetActions.tsx`
- `src/features/entity-sheets/components/EntitySheetConfirmation.tsx`
- `src/tests/entitySheetsContract.test.ts`

## Arquivos modificados

- `src/app/shell/AppShell.tsx`
- `src/features/fazer/components/OperationalRow.tsx`
- `src/features/fazer/components/OperationalCarousel.tsx`
- `src/features/fazer/components/TodaySecondaryLayer.tsx`
- `src/features/fazer/components/AttentionLayer.tsx`
- `src/features/fazer/components/CompletedLayer.tsx`
- `src/features/fazer/components/timeline/TimelineEntryRow.tsx`
- `src/features/planejar/components/PlanningEntityRow.tsx`
- `src/features/planejar/components/PlanningGoalsLayer.tsx`
- `src/features/planejar/components/PlanningProjectsLayer.tsx`
- `src/features/planejar/components/PlanningRhythmsLayer.tsx`
- `src/features/memoria/components/MemoryItemRow.tsx`
- `src/styles/globals.css`

## ENT00 a ENT09

- ENT00 Entity Sheet base: `EntitySheetHost`, `EntitySheet`, header, campos, vínculos, dependências, composição, histórico, anexos e ações.
- ENT01 Meta: direção qualitativa, projetos relacionados e ausência de métrica artificial.
- ENT02 Projeto: meta vinculada, itens ativos, Project Stages, milestones e riscos como metadata/contrato controlado.
- ENT03 Tarefa: prioridade, temporalidade, duração, bloqueio e unknown.
- ENT04 Hábito: recorrência declarada sem gamificação.
- ENT05 Rotina: sequência operacional e composição sem editor de árvore.
- ENT06 Agenda/Evento: janela temporal e Event Prep como contrato contextual, não entidade.
- ENT07 Lembrete: suficiência temporal explícita.
- ENT08 Nota: origem, vínculos e relação com Caixola quando solta.
- ENT09 Lista: estrutura simples, sem planilha geral.
- Template: reuso governado pelo tipo de template existente.

## Separações arquiteturais

Campos editáveis foram separados de campos derivados, mas edição real ficou read-only nesta fase. O `operationalStore` não foi alterado e `updateItem` não foi exposto como action de UI. Isso evita fingir edição segura antes de uma decisão de produto e governança.

`EntityRelationBlock` usa `EntityLink`. `EntityDependencyBlock` usa `DependencyEdge`. A composição usa `parentId` e filhos carregados. Esses três conceitos permanecem separados.

Histórico usa apenas `EntityChangeEvent` minimizado quando estiver carregado. Como o store ainda não expõe eventos, a UI mostra contrato futuro sem texto sensível bruto.

Anexos são contrato futuro privado: sem upload, sem storage público, sem URL pública.

## Ações

Ações sensíveis usam confirmação:

- concluir;
- arquivar;
- restaurar;
- remover;
- aplicar/remover essencial protegido.

Essas ações usam handlers existentes via store quando confirmadas. Não há IA, command handler novo, repository novo ou regra funcional nova.

## O Que Não Foi Alterado

- Domínio.
- EntityType.
- Repositories.
- Command handlers.
- Projections de Hoje, Timeline, Inbox, Planejar ou Memória.
- Regras de vínculos, dependências, composição, restore, archive, complete ou soft delete.
- Rotas.
- Upload/storage/anexos reais.

## Riscos Remanescentes

- Edição real ainda precisa de Fase futura com `updateItem` exposto de forma segura.
- Histórico depende de event log carregado no store.
- Anexos dependem de storage privado, metadata, permissões e governança.
- Project Stages, milestones, risks e Event Prep ainda precisam de contrato de metadata mais preciso.
- A abertura por ação discreta já existe, mas o desenho final de actions por superfície ainda precisa de QA visual.

## Recomendação Para Fase 11

Implementar Abrir o Dia, Fechar o Dia e Revisão Semanal como ciclo operacional próprio, com projection dedicada e sem transformar revisão em relatório produtivista.
