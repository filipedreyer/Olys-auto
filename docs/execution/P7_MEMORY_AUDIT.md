# P7 Memory Audit

Data: 2026-05-18

Escopo executado: Memoria minima operacional + continuidade longitudinal.

## Arquivos Alterados

- `src/features/fazer/domain/directionReading.ts`
- `src/features/memoria/domain/memoryProjection.ts`
- `src/features/memoria/screens/MemoriaScreen.tsx`
- `src/shared/commands/operationalCommandHandlers.ts`
- `src/shared/store/operationalStore.ts`
- `src/tests/memory.test.ts`

## Projections Criadas/Endurecidas

- `MemoryProjection`
- `ArchivedProjection` via `archived`
- `CompletedProjection` via `completed`
- `TemplatesProjection` via `templates`
- `RecoveryProjection` via `recovery`
- `Caixola` via `caixola`

## Fluxos Implementados

- Arquivados aparecem como material recuperavel, com rastreabilidade de vinculos e dependencias.
- Concluidos aparecem como historico util e recuperavel.
- Caixola mostra notas soltas e entradas mantidas/adiadas, sem misturar Inbox nova com Memoria final.
- Templates podem ser reutilizados como estrutura operacional minima.
- Recovery permite restaurar contexto arquivado/concluido para o fluxo ativo.

## Recuperacao Implementada

- `restoreItem` ja existente foi exposto na MemoriaScreen como "Restaurar contexto".
- `reuseTemplate` foi adicionado como command handler/store action.
- `template_reused` e emitido em `entity_change_events`.

## Relacao Com Fazer E Planejar

- `DirectionReading` agora preserva `recentCompletions`.
- Memoria alimenta continuidade por historico recuperavel e templates reutilizaveis.
- Nenhuma leitura de Memoria vira dashboard historico ou analytics.

## Limites Do Release 1

- Sem busca semantica.
- Sem knowledge base.
- Sem file manager.
- Sem editor complexo de templates.
- Sem analytics de produtividade.
- Sem automacoes sofisticadas.

## Testes Adicionados

- Arquivamento preserva rastreabilidade.
- Concluidos continuam recuperaveis.
- Caixola nao vira backlog oculto.
- Templates reutilizam estrutura.
- Recovery restaura contexto.
- Relacao minima entre Memoria e Fazer por `recentCompletions`.
- UI nao chama Supabase diretamente.
- UI nao decide dominio.

## Riscos

- Reutilizacao de template ainda e simples e baseada em metadata `template_entity_type`.
- Caixola usa regras conservadoras; pode precisar de refinamento com uso real.
- Eventos continuam nao atomicos com mutacao, risco ja documentado desde P3.

## Dividas Tecnicas

- Criar schema mais explicito para templates.
- Criar projection dedicada para contexto recente quando houver volume real.
- Validar recovery contra Supabase real quando env estiver disponivel.

## Proximos Passos

Antes de qualquer expansao para IA, Admin ou DS tecnico, realizar uma auditoria Release 1 ponta a ponta cobrindo: Capturar, Inbox, Fazer, Planejar, Memoria, Timeline e Ciclo do Dia.
