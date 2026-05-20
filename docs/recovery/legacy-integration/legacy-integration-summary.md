# Legacy Integration Summary

Status: inventario conceitual, nao runtime.
Origem: `olys_legacy_recovery_docs (2).zip`.

## Decisao Central

O app piloto e memoria funcional. Ele ajuda a lembrar problemas que o Olys precisa resolver, mas nao e base normativa. Nenhuma parte do legado pode ser copiada para runtime sem traducao pela ontologia atual do Olys.

## Uso Permitido

- Inventariar problemas funcionais.
- Mapear oportunidades futuras.
- Informar QA, fixtures e casos extremos.
- Orientar perguntas de produto.
- Traduzir conceitos para Arquitetura Operacional, Governanca e Design System atuais.

## Uso Proibido

- Importar codigo legado.
- Importar tokens legados.
- Importar componentes legados.
- Importar migrations antigas.
- Importar edge functions antigas.
- Copiar prompts legados.
- Aplicar storage publico legado.
- Copiar Admin antigo.
- Guardar prompt/resposta IA brutos por padrao.
- Reintroduzir Orbita, emojis como iconografia ou navegacao antiga.

## Riscos Confirmados

- Storage publico legado e incompativel com Governanca atual.
- Admin antigo nao pode ser copiado; permissao precisa backend, roles e auditoria.
- AI interactions antigas nao devem armazenar texto bruto por padrao.
- Migrations antigas nao podem ser aplicadas no banco atual.
- Edge functions antigas exigiriam revisao completa de autenticacao, permissao, rate limit, logs e falha segura.
- EntitySheet e CaptureModal legados sao inventario funcional, mas arquiteturalmente monoliticos.

## Como Traduzir Conceitos

Cada conceito util deve responder:

1. Qual problema cognitivo ou operacional o legado tentava resolver?
2. Esse problema existe na Arquitetura Operacional atual?
3. Qual contrato atual governa dominio, visual, IA e seguranca?
4. Qual fase futura e responsavel?
5. Que teste impede regressao para o legado?

Se a resposta exigir copiar componente, token, schema, prompt ou migration, a resposta correta e nao importar.
