# Operational Item Contract

## Papel
Definir a unidade operacional superior renderizada como row ou card.

## Obrigatorio
- OperationalItem e o contrato superior.
- OperationalRow e OperationalCard sao representacoes do mesmo contrato.
- Row e para listas, camadas secundarias, Timeline e leitura densa.
- Card e para foco operacional, Agora, carousel e destaque.
- Todo item precisa representar entidade, titulo, estado, contexto, temporalidade e sinais.
- Rail lateral e a marca visual primaria da entidade.
- Deve haver entidade, titulo, contexto temporal, estado, elegibilidade, sinais e acoes rapidas quando existirem.
- Deve usar rail lateral de entidade em row e card.
- Deve favorecer scanning rapido e leitura operacional.
- Unknown deve ser explicito quando houver falta de duracao, data, horario ou informacao critica.
- Blocked deve ser distinguido de attention.
- Completed deve perder peso visual.
- Paused deve ser visivel sem parecer erro.

## Proibido
- Usar icone redundante quando o rail estiver presente.
- Transformar row em card generico.
- Colocar logica de elegibilidade ou capacidade dentro da UI.
- Criar containers equivalentes para todos os estados.
- Field labels em modo leitura.
- Acoes rapidas dominantes.
- Estado visual depender so de cor.
- OperationalItem virar CRUD row.

## Dependencias De Dominio
- Estados, elegibilidade, dependencias, capacidade e atencao vem de projections/dominio.
- Essencial protegido e condicao, nao entidade.
- Dependencia continua separada de vinculo.

## Criterios De Aceite
- UI renderiza projection.
- Rail comunica entidade.
- Estado operacional e legivel sem excesso de texto.
- Row e Card compartilham a mesma base.
- Sinais aparecem antes de acoes.

## Riscos De Regressao
- Lista CRUD.
- Cardificacao.
- UI decidindo dominio.
- Iconografia redundante competindo com rail.
