# Weekly Review Contract

## Papel

Revisão Semanal conecta direção, capacidade, continuidade e execução. Ela é uma leitura de coerência, não um relatório de desempenho.

## Obrigatório

- PL05 Essenciais protegidos aparecem como condição.
- PL06 Revisão Semanal usa dados já carregados.
- Direção, capacidade, continuidade e execução ficam conectadas.
- Informação faltante deve ser declarada.
- Replanejamento é contrato controlado, não ação automática.

## Proibido

- Score.
- Streak.
- Ranking.
- Ferramenta de OKR.
- Ferramenta de PM.
- Dashboard produtivista.
- Progresso inventado.
- Saúde de meta opaca.

## Dependências

- `buildPlanningProjection`.
- `buildMemoryProjection`.
- Leituras existentes de capacidade, direção e dependências.
- `EntityCondition.conditionType = essential_protected`.

## Critérios de Aceite

- Revisão Semanal aparece em Planejar sem virar rota.
- Essencial protegido não aparece como entidade.
- Nenhuma automação persistente é executada.
- Planejar não vira dashboard.

## Riscos de Regressão

- Transformar revisão em relatório de produtividade.
- Tratar condição como entidade.
- Inventar progresso ou relação entre entidades.
