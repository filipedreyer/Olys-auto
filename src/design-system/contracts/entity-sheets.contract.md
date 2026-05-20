# Entity Sheets Contract

## Papel

Entity Sheets sao superficies de detalhe, edicao controlada, relacoes, dependencias, historico e contexto por entidade.

## Obrigatorio

- ENT00 define anatomia comum.
- ENT01 a ENT09 possuem campos especificos por entidade.
- EntityHeader mostra tipo, estado e titulo.
- FieldBlock separa campo editavel de campo derivado.
- RelationBlock trata vinculos contextuais.
- DependencyBlock trata bloqueio, ordem, risco e impacto.
- HistoryBlock preserva rastreabilidade.
- AttachmentBlock exige contrato privado.
- Acoes sensiveis exigem confirmacao.

## Proibido

- Copiar EntitySheet monolitica do legado.
- Criar mega-formulario universal.
- Tratar todos os campos como metadata livre.
- Tornar campos derivados editaveis.
- Confundir EntityLink com DependencyEdge.
- Criar anexo publico.

## Dependencias

Dominio de entidades, repositories, eventos, contratos de Memoria, Idea e Governanca.

## Criterios De Aceite

- Cada entidade tem campos e riscos proprios.
- O usuario sabe o que altera, o que e calculado e o que e historico.
- Vínculo, dependência, composição e preparação ficam separados.

## Riscos De Regressao

CRUD generico, PM tool, OKR tool, app de notas, calendario corporativo e mega-formulario.
