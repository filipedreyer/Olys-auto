# Release 1 Final Audit

Data: 2026-05-18

Escopo: fechamento da Release 1 apos P0-P7, Rodada 1 de auditoria E2E e Rodada 2 de hardening leve. Nao houve expansao de produto nesta etapa.

## O Que Esta Pronto De Verdade

- Runtime Vite/React funcional.
- Rotas canonicas funcionando:
  - `/fazer/hoje`
  - `/fazer/timeline`
  - `/capturar`
  - `/memoria/inbox`
  - `/planejar`
  - `/memoria`
  - `/login`
- Auth foundation com estados `loading`, `unauthenticated`, `authenticated` e `degraded`.
- Persistence boundary consolidado por repositories e command handlers.
- Capturar com entrada transversal e destino default Inbox.
- Inbox como triagem, separando fila ativa de revisita controlada.
- Fazer com `TodayProjection` controlando lanes e readings.
- Ciclo do Dia com `openDay`, `closeDay` e `daily_sessions`.
- Timeline com lenses operacionais: calendario, capacidade e dependencias.
- Planejar minimo integrado ao Fazer por direction readings.
- Memoria minima como recuperacao, continuidade e reutilizacao simples.
- IA mantida como camada contextual com Confirmation Sheet, sem autoexecutar acao relevante.
- Testes anti-regressao canonicos e teste E2E da Release 1.

## O Que Esta Em Degraded/Local

- Sem `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`, o app roda em modo local/degraded seguro.
- Repositories usam fallback local em memoria quando Supabase nao esta configurado.
- Eventos `entity_change_events` existem no contrato local, mas nao sao log duravel em degraded mode.
- Dados locais nao persistem entre reloads/processos.

## O Que Depende De Supabase Real

- Persistencia duravel em banco real.
- Login contra usuarios Supabase reais.
- Aplicacao das migrations:
  - `20260517190000_release1_p0_foundation.sql`
  - `20260518010000_daily_sessions_operational_readings.sql`
- Validacao real de RLS com dois usuarios de teste.
- Testes Supabase/RLS sem skip:
  - `npm run test:repositories`
  - `npm run test:rls`

Status atual de RLS: prepared but not fully validated. Os testes existem e pulam explicitamente sem env/usuarios reais.

## O Que Ainda E Heuristico

- Leituras de direcao, capacidade e dependencia sao heuristicas simples.
- Capacidade e qualitativa; itens sem duracao permanecem `unknown`.
- Planejamento usa relacoes simples por `parentId` e `EntityLink`.
- Memoria usa recovery simples por arquivados/concluidos e templates via metadata.
- Caixola usa regras conservadoras para notas soltas e entradas em revisita.

## Dividas Tecnicas

- Mutation + event atomicity ainda nao e transacional; futura RPC pode fechar esse risco.
- Fallback local ainda e memoria de modulo, nao storage duravel.
- RLS real precisa evidencia em ambiente Supabase configurado.
- Conversao da Inbox ainda nao oferece escolha fina de tipo no momento da acao.
- Templates ainda nao possuem schema dedicado.
- Relacao Meta-Projeto ainda nao tem fluxo visual proprio.

## Limitacoes Da R1

- Sem IA avancada ou autonoma.
- Sem Admin.
- Sem dashboards.
- Sem analytics.
- Sem observabilidade profunda.
- Sem automacoes.
- Sem redesign amplo.
- Sem DS tecnico amplo.
- Sem busca semantica.
- Sem file manager ou knowledge base.
- Sem calendario corporativo.

## Riscos Conhecidos

- Em Supabase real, mutacao e evento podem ter sucesso parcial ate existir camada transacional.
- Migrations precisam estar aplicadas na ordem correta antes de validar daily sessions reais.
- Dados degraded/local sao uteis para avaliacao funcional, mas nao substituem persistencia real.
- Avaliacao visual/experiencial fina ainda deve ocorrer como escopo separado, sem reabrir arquitetura.

## Regras Canonicas Preservadas

- OperationalRow continua dominante em Fazer.
- Essencial Protegido continua `EntityCondition`, nao entidade.
- Inbox continua triagem, nao backlog.
- Capturar continua porta transversal, nao upload.
- Timeline nao e calendario simples; opera por lenses.
- Dependencia continua `DependencyEdge`, separada de `EntityLink`.
- Capacidade nao inventa duracao.
- UI renderiza projections e nao decide dominio central.
- Componentes nao chamam Supabase diretamente.
- IA nao persiste acao relevante sem Confirmation Sheet.
- App segue funcional em degraded mode.
- Territorios principais continuam Fazer, Planejar e Memoria.

## Fluxos Funcionais Confirmados

- Capturar sem tipo -> Inbox.
- Capturar tipado -> entidade operacional quando ha informacao suficiente.
- Lembrete sem data -> Inbox para triagem.
- Inbox -> Converter -> OlysItem com rastreabilidade.
- Inbox -> Manter/Concluir/Adiar/Descartar com eventos.
- Abrir o Dia -> daily session com readings.
- Fechar o Dia -> closing note e evento.
- Fazer -> TodayProjection com now/later/attention/blocked/paused/completed.
- Timeline -> lens calendario/capacidade/dependencias.
- Planejar -> metas/projetos/habitos/rotinas influenciam direction reading.
- Concluir/Arquivar -> Memoria.
- Memoria -> Recovery/Restaurar contexto.
- Template -> reutilizacao operacional minima.

## O Que Nao Foi Implementado Propositalmente

- IA completa.
- Autonomias de IA.
- Admin e roles UI.
- RPC transacional.
- Observabilidade profunda.
- Analytics.
- Dashboards.
- Kanban/PM suite.
- Calendario completo.
- Editor complexo de templates.
- Busca semantica.
- Redesign visual.

## Validacao Final

- `npm install`: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `npm run test`: passou.
- `npm run test:repositories`: passou com skip explicito de Supabase real sem env.
- `npm run test:rls`: passou com skip explicito de RLS real sem env.
- Runtime local HTTP:
  - `/capturar`: 200
  - `/fazer/hoje`: 200
  - `/fazer/timeline`: 200
  - `/memoria/inbox`: 200
  - `/planejar`: 200
  - `/memoria`: 200
  - `/login`: 200

## Status Da Release 1

Release 1 fechada como nucleo operacional coerente em modo degraded/local e pronta para validacao Supabase real controlada. Proximos escopos devem ser separados entre correcoes, validacao real de Supabase/RLS e evolucao de produto.
