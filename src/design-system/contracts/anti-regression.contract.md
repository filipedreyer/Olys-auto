# Anti Regression Contract

## Papel
Impedir retorno da deriva SaaS, dashboard e CRUD.

## Obrigatorio
- Usar tokens canonicos para cores novas.
- Manter UI como renderizacao de projections.
- Preservar territorios Fazer, Planejar e Memoria.
- Preservar Capturar e Idea como acoes transversais/contextuais.

## Proibido
- Deriva SaaS.
- Dashboard generico.
- Dark mode como default canonico.
- Chips decorativos sem funcao.
- Cards genericos para tudo.
- Hardcoded colors fora de tokens.
- IA executando acao sem confirmacao.
- Essencial protegido como entidade.
- Capturar ou Idea na bottom nav.

## Dependencias De Dominio
- Regras de entidade, condicao, Inbox, dependencias, capacidade e IA nao sao decididas pela UI.

## Criterios De Aceite
- Build e typecheck passam.
- Nenhum componente novo do DS usa cor hardcoded.
- Mudancas futuras apontam para contrato aplicavel.

## Riscos De Regressao
- Polimento visual mascarar incoerencia operacional.
- Componentes genericos substituirem gramatica operacional.
