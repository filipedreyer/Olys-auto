# Phase 1 Shell Global

## Escopo
Migrar apenas o Shell Global para a fundacao canonica criada na Fase 0.

## Alterado
- `AppShell` passou a usar `TopBarOlys`, `BottomNavOlys` e `FloatingActionPair`.
- TopBar agora contem menu, logo oficial, Acesso, Inbox e Busca estrutural.
- BottomNav agora contem apenas Fazer, Planejar e Memoria com navegacao real via React Router.
- Capturar saiu da topbar e passou a abrir pelo FloatingActionPair.
- Idea passou a existir como porta transversal estrutural, sem IA avancada.
- Inbox navega para `/memoria/inbox` e mostra dot contextual.
- Manifest de assets passou a usar `new URL(..., import.meta.url)` para funcionar no build Vite.
- CSS do shell passou a usar tokens, safe areas e touch targets do DS.

## Nao Alterado
- Dominio.
- Repositories.
- Command handlers.
- Projections.
- Telas internas de Hoje, Timeline, Capturar, Inbox, Planejar e Memoria.
- Fluxos de IA avancada.

## Aderencia Aos Contratos
- `shell-global.contract.md`: BottomNav restrita aos tres territorios; Capturar e Idea no FloatingActionPair; TopBar com logo real e acoes globais.
- `anti-regression.contract.md`: sem Capturar/Idea na bottom nav; sem dark mode canonico; sem nova dependencia; sem shadcn.
- `source-of-truth.md`: a implementacao segue DS e arquitetura sem redefinir dominio.

## Aproximacoes Temporarias
- Dot do Inbox usa `inboxItems.length > 0` como aproximacao ate existir regra refinada de "novo" ou "pendente".
- Acesso usa o comportamento de auth existente: logout quando autenticado e `/login` quando nao autenticado.
- Busca e estrutural e marcada como nao implementada via `aria-disabled`.
- Idea abre um sheet leve de placeholder. A logica contextual real fica para a fase dedicada de IA.

## Riscos Remanescentes
- AppShell agora esta aderente ao contrato, mas telas internas ainda usam gramatica historica.
- Alguns estilos antigos permanecem para compatibilidade e devem ser removidos somente em fases de migracao especificas.
- O placeholder de Idea nao deve evoluir por acrecimo incremental fora da fase de IA.

## Pendencias Para Fase 2
- Migrar `OperationalItem`/`OperationalRow` para o contrato visual canonico.
- Usar rails oficiais e hierarchy interna forte.
- Proteger a migracao com testes anti-cardificacao e anti-CRUD.

## Validacoes
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `npm run test`: passou, 54 testes passados e 2 skipped.
- Rotas locais validadas com HTTP 200: `/fazer/hoje`, `/fazer/timeline`, `/planejar`, `/memoria`, `/memoria/inbox`.
- Navegador interno validou topbar, bottom nav, FloatingActionPair, abertura do CaptureSheet via Capturar e abertura do placeholder da Idea.

## Falhas Encontradas
- O teste legado de gramatica operacional ainda esperava a classe `capture-fab`. Ele foi atualizado para proteger `FloatingActionPair` e `shell-floating-action--capture`, que sao a nova gramatica canonica da Fase 1.
