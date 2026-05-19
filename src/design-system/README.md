# Olys Design System

Esta pasta e a fonte normativa incremental do Design System dentro do produto. Ela nao substitui a arquitetura operacional, a governanca ou o dominio.

## Hierarquia

1. Arquitetura Operacional define funcionamento, entidades, fluxos e regras.
2. Governanca define dados, seguranca, IA, logs, permissao e falha segura.
3. Design System define manifestacao visual, tokens, componentes, microinteracoes e escrita de interface.
4. Brandbook define marca, paleta, logo e identidade.
5. Codigo atual e implementacao e nao pode contradizer as fontes canonicas.

## Uso

- Use `tokens/olys-tokens.css` como fonte de cores, superficies, estados, spacing, foco e motion.
- Use `assets/manifest.ts` para referenciar assets por papel semantico.
- Use `components/` como base tipada para migracoes futuras.
- Consulte `contracts/` antes de alterar Shell, Hoje, Capturar, Timeline, Idea ou OperationalItem.

## Proibido

- Hardcoded colors novos fora dos tokens.
- Capturar ou Idea como itens da bottom nav.
- Essencial protegido como entidade.
- Dark mode como default canonico.
- Cards genericos para toda estrutura operacional.
- IA persistindo acao relevante sem confirmacao.
