# Architectural Drift Correction Audit

Data: 2026-05-18

Escopo: correcao de deriva arquitetural no nucleo experiencial. Foram alterados somente Fazer, Timeline, Capturar, CaptureGrid, OperationalRow e composicao visual/espacial relacionada. Dominio, repositories, projections, command handlers e persistence boundary foram preservados.

## Problema Corrigido

O app tinha regredido para uma gramatica de sections, cards e listas equivalentes. Isso aproximava o Olys de um dashboard SaaS/CRUD e enfraquecia a ideia canonica de territorio operacional, foco, pressao, continuidade e ritmo.

## Arquivos Alterados

- `src/app/shell/AppShell.tsx`
- `src/features/capturar/components/CaptureGrid.tsx`
- `src/features/capturar/components/CaptureSheet.tsx`
- `src/features/capturar/components/CaptureSurface.tsx`
- `src/features/capturar/domain/captureDestination.ts`
- `src/features/capturar/screens/CapturarScreen.tsx`
- `src/features/fazer/components/OperationalCarousel.tsx`
- `src/features/fazer/components/OperationalRow.tsx`
- `src/features/fazer/screens/HojeScreen.tsx`
- `src/features/fazer/screens/TimelineScreen.tsx`
- `src/styles/globals.css`
- `src/tests/operationalGrammar.test.ts`
- `docs/execution/screenshots/*.png`

## Correcoes Estruturais Feitas

- Fazer deixou de ser uma pilha de sections equivalentes.
- Hoje passou a ter header operacional com tabs Hoje/Timeline, estado do dia e indicadores.
- Abrir/Fechar o Dia ficou integrado ao topo operacional, nao em card isolado.
- "Para fazer agora" virou palco dominante.
- Foi criado `OperationalCarousel` horizontal com item principal dominante e itens laterais menores.
- `OperationalRow` ganhou tamanhos operacionais: `featured`, `secondary`, `tertiary`, `compact`.
- Cabe Hoje virou camada secundaria colapsavel.
- Atenção virou camada de risco, com borda semantica e menos volume.
- Timeline passou a renderizar superficies espaciais por lens, nao lista unica.
- Capacidade virou campo de pressao/distribuicao com `capacity-node`.
- Dependencias viraram cadeia operacional com indentacao por profundidade.
- Capturar deixou de depender de chips horizontais.
- Foi criado `CaptureGrid` canonico 3x4:
  - Inbox, Meta, Projeto
  - Tarefa, Agenda, Nota
  - Lista, Habito, Rotina
  - Template, Evento, Lembrete
- Capturar passou a abrir como `CaptureSheet` emergente via FAB.
- A rota `/capturar` agora abre a sheet sobre `/fazer/hoje`, preservando continuidade espacial.

## O Que Foi Preservado

- `TodayProjection`
- `TimelineProjection`
- `InboxProjection`
- command handlers
- repositories
- persistence boundary
- Auth/degraded mode
- Supabase/RLS preparation
- Planejar
- Memoria
- IA foundation

## Screenshots Reais

Antes:

- `docs/execution/screenshots/before-hoje.png`
- `docs/execution/screenshots/before-timeline.png`
- `docs/execution/screenshots/before-capturar.png`

Depois:

- `docs/execution/screenshots/after-hoje.png`
- `docs/execution/screenshots/after-timeline-capacity.png`
- `docs/execution/screenshots/after-timeline-dependencies.png`
- `docs/execution/screenshots/after-capture-sheet.png`

## Comparacao Antes vs Depois

Antes:

- Fazer era uma pagina vertical com header, day-cycle card, chips de leitura e sections empilhadas.
- OperationalRow parecia card padrao com borda e padding uniforme.
- Timeline era uma pagina com lens switcher e lista.
- Capturar era uma rota/formulario com textarea e chips horizontais.

Depois:

- Fazer opera como territorio: tabs, indicadores, pressao do dia e palco central.
- A acao principal aparece em carousel horizontal, com foco e profundidade.
- Cabe Hoje e Atenção perderam equivalencia visual com o foco principal.
- Timeline distribui capacidade/dependencias em superficies diferentes.
- Capturar aparece como camada emergente, com fundo preservado e CaptureGrid 3x4.

## Validacao

- `npm run typecheck`: passou.
- `npm run build`: passou.
- `npm run test`: passou com `41 passed | 2 skipped`.
- Screenshots reais gerados com Chrome headless.

## O Que Ainda Continua Errado

- A comparacao visual ainda mostra que Planejar e Memoria permanecem mais section/card-based; elas ficaram fora do escopo por decisao do prompt.
- O carousel ainda usa dados limitados; com poucos itens, a estrutura espacial aparece menos completa.
- Timeline Dependencias ainda usa profundidade por ordem da projection, nao por grafo real com niveis calculados.
- Timeline Capacidade ainda depende de leitura qualitativa simples; a distribuicao espacial e visual, nao um motor temporal granular.
- Capturar como sheet esta implementado, mas ainda nao nasce fisicamente do FAB com animacao/origem precisa.
- OperationalRow melhorou como unidade operacional, mas ainda nao tem todos os estados de tactilidade e microinteracao previstos no DS.
- O design system continua CSS local, nao catalogo versionado.

## Partes Que Ainda Possuem Deriva SaaS

- Topbar ainda e bastante web-app convencional.
- Bottom nav ainda parece componente de app padrao.
- Auth/Login ainda e tela funcional minima, nao experiencia Olys completa.
- Planejar e Memoria ainda usam rows/agrupadores simples.
- SuggestionCard de IA ainda tem forma de card.

## Partes Que Ainda Precisam De Rearquitetura

- Planejar: transformar de projection listada para territorio de direcao.
- Memoria: sair de grupos/cards para recuperacao longitudinal mais espacial.
- Entity Sheets: ainda inexistentes.
- Idea: ainda nao e camada contextual distribuida.
- DS: precisa de tokens/componentes canonicos versionados.
- Timeline: precisa calcular cadeia real por grafo e niveis, nao apenas exibir edges.
- Capacidade: precisa granularidade por horizonte sem inventar duracao.
