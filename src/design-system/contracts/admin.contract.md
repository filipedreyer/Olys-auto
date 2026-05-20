# Admin Contract

## Papel

Admin e area separada de governanca operacional interna. Nao e parte do app pessoal do usuario.

## Obrigatorio

- ADM00 a ADM06 devem ter acesso restrito real.
- Roles precisam ser aplicadas no backend/RLS.
- Auditoria registra ator, acao, escopo e timestamp.
- Prompts IA devem ter versao, autoria e status.
- Recados administrados precisam autoria e escopo.
- Logs devem ser minimizados.

## Proibido

- Admin protegido so por UI.
- Copiar Admin legado.
- Copiar setup sensivel legado.
- Logar prompt/resposta IA brutos por padrao.
- Misturar shell pessoal e Admin sem separacao.

## Dependencias

Roles reais, RLS validado, backend seguro, prompt governance e logs minimizados.

## Criterios De Aceite

- Usuario sem permissao e bloqueado no backend.
- Cada acao administrativa relevante e auditavel.
- UI nao e a unica barreira de seguranca.

## Riscos De Regressao

Dashboard administrativo generico, permissao fake, auditoria sensivel e observabilidade prematura.
