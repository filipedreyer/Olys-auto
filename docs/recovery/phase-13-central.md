# Fase 13 - Central de Confiança

## Escopo

A Fase 13 criou a Central como superfície logada de confiança, privacidade, conta, IA/transparência, suporte, recados e guia. A Central não entrou na BottomNav, não virou Admin e não executa fluxos sensíveis reais.

## Arquivos Criados

- `src/features/central/screens/CentralScreen.tsx`
- `src/features/central/components/CentralHeader.tsx`
- `src/features/central/components/CentralSectionGrid.tsx`
- `src/features/central/components/CentralSectionCard.tsx`
- `src/features/central/components/CentralGuideSection.tsx`
- `src/features/central/components/CentralMessagesSection.tsx`
- `src/features/central/components/CentralDataPrivacySection.tsx`
- `src/features/central/components/CentralPreferencesSection.tsx`
- `src/features/central/components/CentralAiTransparencySection.tsx`
- `src/features/central/components/CentralSupportSection.tsx`
- `src/features/central/components/CentralAccountSection.tsx`
- `src/features/central/components/CentralGovernedFlow.tsx`
- `src/features/central/components/CentralDisclosureBlock.tsx`
- `src/features/central/domain/centralPresentation.ts`
- `src/features/central/domain/centralGovernance.ts`
- `src/tests/centralContract.test.ts`

## Arquivos Modificados

- `src/design-system/contracts/central.contract.md`
- `src/app/router/AppRouter.tsx`
- `src/app/shell/AppShell.tsx`
- `src/styles/globals.css`

## CTR00 a CTR07

CTR00 foi endereçado com `CentralHeader` e `CentralSectionGrid`, que apresentam o mapa da Central sem transformá-la em dashboard.

CTR01 foi endereçado com `CentralGuideSection`, explicando execução, direção, memória, Inbox, Caixola, vínculos, dependências e Idea de forma curta.

CTR02 foi endereçado com `CentralMessagesSection`, deixando recados como área preparatória dependente de Admin seguro, sem backend de recados nesta fase.

CTR03 foi endereçado com `CentralDataPrivacySection`, declarando categorias de dados, limites de IA, offline, anexos futuros, exportação e exclusão.

CTR04 foi endereçado com `CentralPreferencesSection`, tratando preferências como preparatórias quando não há persistência real.

CTR05 foi endereçado com `CentralAiTransparencySection`, descrevendo outputs tipados, Safety Gate, Confirmation Sheet, logs minimizados e ausência de ação automática.

CTR06 foi endereçado com `CentralSupportSection`, oferecendo orientação de suporte sem ticket, chat ou FAQ extensa.

CTR07 foi endereçado com `CentralAccountSection`, mostrando estado de autenticação, modo Supabase/local, identificador mínimo e logout seguro existente.

## Exportação e Exclusão

Exportação e exclusão foram tratadas por `CentralGovernedFlow`. Nesta fase, os fluxos explicam consequência e limite, mas não geram arquivo, não apagam dados, não acessam repositories e não chamam command handlers.

## IA e Transparência

A Central documenta a Idea como camada governada já existente: contexto carregado e minimizado, outputs tipados, Safety Gate, Confirmation Sheet e nenhuma ação persistente sem confirmação. A feature Idea não foi alterada para executar ações reais.

## O Que Não Foi Alterado

- Domínio operacional.
- Store operacional.
- Command handlers.
- Repositories.
- Projections operacionais.
- BottomNav.
- Rotas públicas de acesso.
- Idea, Capturar, Hoje, Timeline, Inbox, Planejar, Memória e Entity Sheets.

## Riscos Remanescentes

- Exportação e exclusão ainda dependem de backend governado.
- Preferências ainda não têm persistência real.
- Recados administrados dependem da Fase 14.
- Suporte real depende de fluxo seguro e minimização de dados.

## Recomendação Para Fase 14

Implementar Admin como território separado, com shell próprio, roles reais, auditoria, saúde do app, recados administrados, governança de prompts e permissões. Não reutilizar Central como Admin e não confiar apenas em UI para permissão.
