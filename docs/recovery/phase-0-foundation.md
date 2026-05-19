# Phase 0 Foundation

## Criado
- Estrutura `src/design-system`.
- Tokens canonicos em `src/design-system/tokens/olys-tokens.css`.
- Manifest semantico de assets em `src/design-system/assets/manifest.ts`.
- Contratos normativos em `src/design-system/contracts`.
- Componentes base tipados em `src/design-system/components`.
- Documentacao local em `src/design-system/README.md`.
- Checklist anti-regressao em `docs/recovery/phase-0-checklist.md`.

## Tokens Canonicos
- Brand: Olys Black, Olys Teal, Teal Light, Teal Pale, IA Violet, Paper e Off-white.
- Semanticos: attention, critical, positive, disabled, unknown, blocked e partial.
- Superficies, texto, bordas, foco, entidades, estados operacionais, spacing, radius, shadows, z-index, motion, tipografia, touch targets e safe areas.

## Tokens Antigos Depreciados
- `--background`, `--surface`, `--surface-raised`, `--surface-soft`, `--line`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent`, `--accent-quiet`, `--blue`, `--warning` e `--danger` permanecem como aliases de compatibilidade.
- A base canonica passa a ser light. Dark mode antigo fica como legado de implementacao, nao canon.

## Assets Consolidados
- Logos principais, negativos, simbolos teal e white-on-teal.
- Icones de navegacao para Fazer, Planejar, Memoria, Capturar, Idea, Acesso, Inbox, Hoje e Timeline.
- FloatingActionPair default, capturar pressed, idea pressed e idea relevant.
- Tabs Hoje/Timeline, indicadores de capacidade/direcao, rails de entidade, checkbox square, chips e estado unknown.

## Contratos Criados
- `source-of-truth.md`
- `shell-global.contract.md`
- `operational-item.contract.md`
- `today.contract.md`
- `capture-inbox.contract.md`
- `timeline.contract.md`
- `idea.contract.md`
- `anti-regression.contract.md`

## Componentes Base Criados
- `OlysIcon`
- `OlysButton`
- `OlysSurface`
- `TopBarOlys`
- `BottomNavOlys`
- `FloatingActionPair`
- `EntityRail`
- `OperationalItemBase`
- `OlysIndicator`
- `OlysSheet`

## Telas Ainda Nao Migradas
- AppShell atual.
- Hoje.
- Timeline.
- Capturar.
- Inbox.
- Planejar.
- Memoria.
- Idea.

## Validacoes
- `npm install`: passou, sem vulnerabilidades reportadas.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `npm run test`: passou, 47 testes passados e 2 skipped.
- Inicializacao local: `http://127.0.0.1:5173/hoje` respondeu 200.

## Falhas Encontradas
- Nenhuma falha relacionada a Fase 0.

## Riscos Remanescentes
- As telas atuais ainda nao foram migradas para os componentes do DS.
- `AppShell` ainda e implementacao existente, nao o contrato final `TopBarOlys`/`BottomNavOlys`/`FloatingActionPair`.
- Alguns estilos de tela ainda dependem de classes historicas; os aliases foram preservados para evitar quebra nesta fase.
- A validacao de RLS real continua fora do escopo desta fase.

## Ordem Recomendada Das Proximas Fases
1. Shell Global
2. OperationalItem
3. Hoje
4. Capturar
5. Timeline
6. Idea
7. Planejar/Memoria/Inbox/Entity Sheets
8. QA arquitetural
