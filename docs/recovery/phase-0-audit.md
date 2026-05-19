# Phase 0 Audit

## O Que Pode Ser Preservado
- Runtime React, Vite e TypeScript estrito.
- Router, AppShell atual e rotas principais existentes.
- Persistence boundary, repositories, command handlers e degraded mode.
- Projections de Hoje, Timeline, Planejar e Memoria ja existentes.
- Fluxos Capturar, Inbox, ciclo do dia, Planejar minimo e Memoria minima.
- Testes de regressao canonica, repositories, RLS preparado e fluxo E2E.

## O Que Esta Desalinhado
- `src/styles/globals.css` ainda tratava dark mode como base da aplicacao.
- Nao havia fonte canonica de tokens dentro do produto.
- Assets oficiais do pacote de DS nao estavam organizados por papel semantico.
- Nao havia contratos internos para Shell, OperationalItem, Hoje, Capturar/Inbox, Timeline e Idea.
- Componentes base do DS nao existiam como camada preparatoria.
- O codigo atual ainda contem telas materializadas antes da fundacao normativa e nao deve ser tratado como fonte de verdade visual.

## O Que A Fase 0 Vai Resolver
- Criar estrutura canonica em `src/design-system`.
- Consolidar tokens canonicos e aliases temporarios depreciados.
- Consolidar assets normativos e manifest semantico.
- Criar contratos anti-regressao curtos e executaveis.
- Criar stubs tipados de componentes base sem substituir telas.
- Documentar caminho de migracao das proximas fases.

## Fora Da Fase 0
- Redesenhar Hoje, Timeline, Capturar, Planejar, Memoria ou Inbox.
- Reescrever AppShell.
- Alterar dominio, store, repositories, command handlers ou projections.
- Avancar Supabase, RLS, Admin, observabilidade ou Edge Functions.
- Implementar IA avancada.
- Fazer polish visual amplo.
