# Access Contract

## Papel

Acesso cobre entrada, autenticação, sessão, onboarding e retomada de confiança. Ele não herda a gramática do Shell logado.

## Obrigatório

- AC01 a AC07 são superfícies de confiança.
- Login, cadastro e recuperação são leves e diretos.
- Onboarding é curto e orientado a maturidade.
- Sessão expirada preserva confiança e não sugere perda de dados sem evidência.
- Erro de configuração precisa ser claro.
- Nenhum dado operacional pode ser perdido silenciosamente.
- Rotas públicas não renderizam TopBar, BottomNav, FloatingActionPair, Capturar ou Idea.

## Proibido

- Landing page SaaS.
- Tutorial longo de produtividade.
- Gamificação.
- Prometer sync/offline além do implementado.
- Esconder falha de configuração.
- Apagar contexto no logout sem regra explícita.

## Dependências

AuthProvider, Supabase mode, degraded/local mode, Shell Global, contratos de PWA e estados sistêmicos.

## Critérios De Aceite

- Estados loading, authenticated, unauthenticated, degraded/configuração e sessão expirada são legíveis.
- Rotas públicas e privadas ficam separadas.
- Falha de acesso não quebra runtime.

## Riscos De Regressão

Auth genérico, perda de contexto, onboarding produtivista, Shell logado aparecendo em acesso e promessa falsa de sincronização.
