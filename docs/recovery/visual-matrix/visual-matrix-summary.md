# Visual Matrix Summary

Status: referencia normativa de manifestacao visual para fases futuras.
Origem: `Olys_matriz_visual_tela_a_tela_v2 (1).xlsx`.
Escopo: documentacao, guardrails e QA. Nao altera runtime.

## Objetivo

A matriz visual tela a tela organiza como o Olys deve se manifestar em telas, superficies, overlays, sheets, estados, responsividade, microcopy e criterios de QA antes do desenho final. Ela existe para impedir regressao para UI generica, cardificacao excessiva, dark SaaS, dashboard, backlog, PM tool ou IA dominante.

## O Que E

- Inventario visual por territorio e tela.
- Detalhamento de componentes, anatomia, estados obrigatorios e responsividade.
- Fonte de QA pre-design para fases futuras.
- Ponte entre Design System, Arquitetura Operacional e implementacao.

## O Que Nao E

- Nao e especificacao funcional final.
- Nao redefine dominio, entidades, permisssoes, dados, IA, logs ou regras de negocio.
- Nao autoriza reescrever telas ja migradas.
- Nao substitui Arquitetura Operacional nem Governanca.
- Nao transforma pendencias visuais em regra funcional.

## Como Usar

Use a matriz como checklist de aderencia antes de cada fase restante. Quando houver conflito, a hierarquia permanece:

1. Arquitetura Operacional define dominio, entidades, fluxos e regras.
2. Governanca define dados, seguranca, IA, logs, permissoes e falha segura.
3. Design System define manifestacao visual e interacao.
4. Matriz visual detalha telas, estados, responsividade, microcopy e QA.
5. Legacy e memoria conceitual, nunca implementacao.
6. Codigo atual e implementacao, nao fonte normativa quando conflitar.

## Fronteira Visual x Funcional

A matriz pode dizer que uma tela precisa expor `unknown`, `blocked`, `empty`, `offline`, ou que Timeline precisa diferenciar calendario, capacidade e dependencias. Ela nao pode inventar duracao, criar dependencia, converter Inbox automaticamente, tratar Essencial protegido como entidade ou permitir IA executar acao persistente sem confirmacao.

## Territorios Cobertos

- Acesso
- Global
- Fazer
- Timeline
- Capturar
- Inbox
- Planejar
- Memoria
- Idea
- Entity Sheets
- Central
- Admin
- Estados sistemicos

## Relacao Com Fases 0 a 7

- Fase 0 criou tokens, assets, componentes base e contratos.
- Fase 1 migrou Shell Global.
- Fase 2 criou OperationalItem canonico.
- Fase 3 migrou Hoje.
- Fase 4 migrou Capturar.
- Fase 5 migrou Inbox.
- Fase 6 migrou Timeline.
- Fase 7 migrou Planejar.

Fazer, Timeline, Capturar, Inbox e Planejar ja foram parcialmente migrados. Ainda assim, a matriz continua obrigatoria para QA, lacunas visuais, estados pendentes, responsividade, microcopy e refinamento de componentes.

## Implicacoes Para Roadmap

- Memoria deve vir antes de Idea avancada, para fechar recuperacao e continuidade.
- Idea deve ser governada por Confirmation Sheet e Safety Gate.
- Entity Sheets devem ser uma familia por entidade, nao mega-formulario.
- Abrir o Dia, Fechar o Dia e Revisao Semanal precisam projection propria.
- Acesso, PWA e estados sistemicos precisam tratar autenticacao, offline e falha parcial.
- Central e Admin devem permanecer separados.
- QA arquitetural deve validar dados extremos, estados, responsividade e anti-regressao.
