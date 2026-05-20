# Daily Cycle Contract

## Papel

Abrir o Dia e Fechar o Dia são portas de ciclo operacional. Eles reduzem carga cognitiva, preservam contexto e mantêm rastreabilidade mínima.

## Obrigatório

- Abrir o Dia prepara execução.
- Fechar o Dia preserva contexto.
- Diário é registro mínimo vinculado ao fechamento.
- Carta de Respiro preserva capacidade.
- Leituras são curtas, operacionais e sóbrias.
- `openDay` e `closeDay` continuam fontes de persistência.

## Proibido

- Gamificação.
- Motivação genérica.
- Limpeza de backlog.
- Reorganização automática.
- Relatório de performance.
- IA aplicando mudança.

## Dependências

- `DailySession`.
- `buildTodayProjection`.
- Leituras existentes de capacidade, direção e atenção.

## Critérios de Aceite

- Dia por abrir, aberto e fechado são legíveis.
- Fechamento mantém nota mínima.
- Carta de Respiro não cria ação persistente.
- Nenhum dado é inventado.

## Riscos de Regressão

- Transformar ciclo em estética produtivista.
- Transformar diário em feed emocional.
- Replanejar sem confirmação.
