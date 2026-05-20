# Memory Contract

## Papel

Memoria e continuidade longitudinal, recuperacao e ciclo de vida. Nao e arquivo morto, wiki, file manager ou knowledge base generica.

## Obrigatorio

- MEM00 a MEM07 devem preservar recuperacao contextual.
- Caixola e incubacao/recuperacao, nao Inbox.
- Arquivados preservam rastreabilidade.
- Concluidos permanecem recuperaveis.
- Templates sao modelos governados.
- Anexos exigem contrato privado e metadata.
- Busca deve retornar origem, entidade, status e acao possivel.

## Proibido

- Transformar Memoria em backlog.
- Transformar Memoria em lixeira.
- Usar storage publico para anexos.
- Tratar Template como entidade operacional principal.
- Misturar vinculo contextual com DependencyEdge.

## Dependencias

OperationalItem, repositories, entity_change_events, capture/inbox origin metadata e futuros Entity Sheets.

## Criterios De Aceite

- O usuario reencontra, reutiliza, revisa ou restaura contexto.
- Itens arquivados e concluidos nao somem.
- Caixola tem limite conceitual e nao vira dump infinito.
- Memoria alimenta Fazer/Planejar sem sobrecarregar UI.

## Riscos De Regressao

Knowledge base generica, file manager, cards em grid sem acao, busca sem contexto e arquivo morto.
