# Phase 7.5 - Matrix And Legacy Consolidation

Status: documentacao e contratos. Nenhum runtime alterado.

## Escopo

Esta fase incorporou a matriz visual tela a tela e os documentos legacy como referencias navegaveis para as fases restantes. Ela nao implementou Memoria, Idea, Entity Sheets, Acesso, Central, Admin ou QA visual.

## Arquivos Criados

- `docs/recovery/visual-matrix/visual-matrix-summary.md`
- `docs/recovery/visual-matrix/visual-matrix-screen-inventory.md`
- `docs/recovery/visual-matrix/visual-matrix-component-anatomy.md`
- `docs/recovery/visual-matrix/visual-matrix-state-requirements.md`
- `docs/recovery/visual-matrix/visual-matrix-responsive-rules.md`
- `docs/recovery/visual-matrix/visual-matrix-ux-writing.md`
- `docs/recovery/visual-matrix/visual-matrix-qa-predesign.md`
- `docs/recovery/visual-matrix/visual-matrix-open-pendencies.md`
- `docs/recovery/legacy-integration/legacy-integration-summary.md`
- `docs/recovery/legacy-integration/legacy-to-remaining-phases-map.md`
- `docs/recovery/legacy-integration/legacy-guardrails.md`
- `docs/recovery/remaining-phases-roadmap.md`
- `docs/recovery/phase-7-5-checklist.md`
- `src/tests/recoveryRoadmapContract.test.ts`

## Como A Matriz Foi Incorporada

A planilha foi sintetizada em documentos por uso:

- resumo executivo;
- inventario de telas;
- anatomia de componentes;
- estados obrigatorios;
- responsividade;
- UX writing;
- QA pre-design;
- pendencias visuais.

A matriz permanece fonte visual e de QA. Ela nao redefine regra funcional.

## Como O Legacy Foi Incorporado

O zip legacy foi incorporado como inventario conceitual:

- resumo de integracao;
- mapa para fases restantes;
- guardrails contra importacao.

Nenhum codigo, token, componente, migration, prompt ou edge function legado foi copiado.

## Conflitos Encontrados

- O roadmap legacy tinha numeracao antiga de fases; foi remapeado para Fases 8 a 15 atuais.
- O legado usa Orbita, emojis e navegacao antiga; tudo foi bloqueado por guardrail.
- O legado possui storage publico de anexos; incompatibilidade registrada.
- O legado usa EntitySheet monolitica; foi reclassificada como inventario, nao componente.
- A matriz registra Caixola dentro de Acesso como pendencia; o roadmap preserva Memoria como fonte de Caixola e Acesso apenas como retomada contextual futura.
- A matriz registra Meta e IA com violeta semelhante; mantido como pendencia de decisao visual.
- A matriz registra equivalencias de Verde Olys; mantido como pendencia antes do design visual final.

## Pendencias Criticas

- Memoria ainda nao migrada.
- Entity Sheets ainda nao migradas.
- Idea ainda nao governada funcionalmente.
- PL05 Essenciais protegidos e PL06 Revisao Semanal ainda pendentes.
- Focus trap robusto de `OlysSheet`.
- Confirmacao para Descartar na Inbox.
- Anexos privados e busca governada.
- Contraste final dos tokens e biblioteca final de icones.

## Roadmap Revisado

1. Fase 8: Memoria, Caixola, Templates, Anexos e Busca.
2. Fase 9: Idea e IA contextual governada.
3. Fase 10: Entity Sheets por entidade.
4. Fase 11: Abrir o Dia, Fechar o Dia e Revisao Semanal.
5. Fase 12: Acesso, Onboarding, PWA e Estados Sistemicos.
6. Fase 13: Central de Confianca.
7. Fase 14: Admin seguro.
8. Fase 15: QA arquitetural e fixtures.

## O Que Nao Foi Alterado

- Runtime.
- Telas.
- Dominio.
- Projections.
- Store.
- Repositories.
- Command handlers.
- Rotas.
- CSS de produto.
- Componentes React.

## Recomendacao Para Fase 8

Iniciar Memoria como recuperacao operacional: MEM00 a MEM07, com Caixola, Templates, Arquivados, Concluidos, contrato futuro de Anexos privados e busca por origem/status/entidade/acao. Nao iniciar Idea, Entity Sheets ou Central antes de fechar a continuidade longitudinal.
