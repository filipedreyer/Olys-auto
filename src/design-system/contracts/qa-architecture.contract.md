# QA Architecture Contract

## Papel

QA arquitetural valida que o Olys permanece coerente com Arquitetura, Governanca, Design System, matriz visual e guardrails legacy.

## Obrigatorio

- Fixtures canonicas com dados extremos.
- Estados empty, loading, error, offline, partial sync e unknown.
- Textos longos, alta densidade, safe areas e overflow.
- Itens incompletos, atrasados, bloqueados, arquivados e concluidos.
- Dependencias causais e vinculos contextuais separados.
- IA sem acao persistente sem confirmacao.
- Mobile-first, touch target minimo e contraste.

## Proibido

- Validar so com mock ideal.
- Aceitar dashboard generico.
- Aceitar backlog disfarçado.
- Aceitar PM tool, OKR tool ou knowledge base generica.
- Aceitar unknown como zero.

## Dependencias

Fases 8 a 14, fixtures, testes unitarios, testes estaticos, validacao visual e acessibilidade.

## Criterios De Aceite

- Build, typecheck e testes passam.
- Regressao visual e semantica tem guardrails.
- Dados extremos nao quebram UI.
- Matriz visual e contratos sao verificaveis.

## Riscos De Regressao

Polish sem sistema, QA apenas feliz, acessibilidade tardia e falsa aderencia ao canon.
