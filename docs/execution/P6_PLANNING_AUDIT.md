# P6 Planning Audit

Data: 2026-05-18

Escopo executado: Planejar minimo integrado ao Fazer.

## Arquivos Alterados

- `src/domain/entities/types.ts`
- `src/features/capturar/domain/captureDestination.ts`
- `src/features/fazer/domain/directionReading.ts`
- `src/features/fazer/screens/HojeScreen.tsx`
- `src/features/planejar/domain/planningProjection.ts`
- `src/features/planejar/screens/PlanejarScreen.tsx`
- `src/tests/planning.test.ts`

## Decisoes

- `goal`, `project`, `habit` e `routine` continuam como `OlysItem`; nao foram criadas entidades paralelas.
- Foram adicionados aliases de tipo para reforcar vocabulario canonico:
  - `GoalItem`
  - `ProjectItem`
  - `HabitItem`
  - `RoutineItem`
- Planejar existe para orientar Fazer, nao para virar modulo estrategico isolado.
- Capturar agora permite destino `Meta`, usando o mesmo fluxo de command handler/repository.
- Direction reading passou a considerar metas, projetos, habitos e rotinas como trajetoria.

## Projections Criadas/Endurecidas

- `PlanningProjection`
- `GoalProjection`
- `ProjectProjection`
- `RhythmProjection`

As projections mostram:

- direcao;
- progresso qualitativo;
- relacao com execucao atual;
- riscos de dependencia;
- ritmos operacionais sem gamificacao.

## Integracao Com Fazer

- `buildDirectionReading` agora retorna:
  - `goals`
  - `projects`
  - `habits`
  - `routines`
  - `trajectory`
- Hoje renderiza a trajetoria como leitura curta, sem dashboard.
- Planejar usa os mesmos itens operacionais que alimentam Fazer.

## Limites Do Release 1

- Sem OKRs.
- Sem KPI dashboard.
- Sem graficos.
- Sem board de projeto.
- Sem gamificacao de habitos.
- Sem checklist ornamental de rotinas.

## Testes Adicionados

- `GoalProjection`.
- `ProjectProjection`.
- relacao entre Planejar e Fazer via direction reading.
- habitos nao gamificados.
- rotinas sem checklist ornamental.
- EntityLink separado de DependencyEdge.
- UI sem Supabase direto.
- UI sem decidir dominio.
- capacidade continua qualitativa.

## Riscos

- Relacoes entre metas/projetos usam `parentId` e `EntityLink`; ainda nao ha UI dedicada para criar links.
- Progresso e qualitativo, por escolha canonica; usuarios podem pedir numeros no futuro, mas isso deve ser tratado com cuidado.
- Planejar ainda depende dos itens existentes; criacao estruturada de metas/projetos pode ser refinada depois.

## Dividas Tecnicas

- Criar fluxo minimo de vinculo Meta-Projeto quando necessario.
- Refinar schema de metadata para habitos/rotinas.
- Evitar qualquer expansao para PM suite antes do Release 1 estabilizar.

## Proximos Passos

Iniciar P7: Memoria minima operacional + continuidade longitudinal, sem transformar Memoria em arquivo morto ou knowledge base generica.
