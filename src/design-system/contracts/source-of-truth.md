# Source Of Truth

## Papel
Definir a hierarquia normativa usada por produto, engenharia e design.

## Obrigatorio
- Arquitetura Operacional define funcionamento, entidades, fluxos e regras de dominio.
- Governanca define dados, IA, seguranca, logs, permissoes, Safety Gate, privacidade e falha segura.
- Design System define manifestacao visual, tokens, componentes, microinteracoes, acessibilidade e UX writing.
- Brandbook define marca, paleta, logo, tom visual e identidade.
- Implementacao deve obedecer as fontes canonicas.

## Proibido
- Tratar codigo atual como fonte normativa quando ele contradiz arquitetura, governanca, DS ou brandbook.
- Resolver deriva de produto com preferencia visual local.

## Dependencias De Dominio
- Entidades, condicoes, vinculos, dependencias, Inbox, Capturar, Timeline e IA seguem a arquitetura.

## Criterios De Aceite
- Toda mudanca estrutural declara qual fonte canonica esta seguindo.
- Nenhuma implementacao contradiz regra funcional documentada.

## Riscos De Regressao
- Produto virar SaaS generico.
- DS virar biblioteca decorativa sem autoridade operacional.
