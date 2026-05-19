# Operational Item Contract

## Papel
Definir a unidade operacional superior renderizada como row ou card.

## Obrigatorio
- OperationalItem e o contrato superior.
- OperationalRow e OperationalCard sao representacoes do mesmo contrato.
- Deve haver entidade, titulo, contexto temporal, estado, elegibilidade, sinais e acoes rapidas.
- Deve usar rail lateral de entidade.
- Deve favorecer scanning rapido e leitura operacional.

## Proibido
- Usar icone redundante quando o rail estiver presente.
- Transformar row em card generico.
- Colocar logica de elegibilidade ou capacidade dentro da UI.
- Criar containers equivalentes para todos os estados.

## Dependencias De Dominio
- Estados, elegibilidade, dependencias, capacidade e atencao vem de projections/dominio.
- Essencial protegido e condicao, nao entidade.

## Criterios De Aceite
- UI renderiza projection.
- Rail comunica entidade.
- Estado operacional e legivel sem excesso de texto.

## Riscos De Regressao
- Lista CRUD.
- Cardificacao.
- UI decidindo dominio.
