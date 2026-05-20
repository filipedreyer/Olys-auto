# Access Contract

## Papel

Acesso cobre entrada, autenticacao, sessao, onboarding, PWA e estados sistemicos de disponibilidade.

## Obrigatorio

- AC01 a AC07 devem ser tratados como superficie de confianca.
- Login e cadastro devem ser claros e baixos em friccao.
- Sessao expirada preserva continuidade.
- Onboarding ensina a logica Olys, nao produtividade generica.
- PWA nao bloqueia uso.
- Degraded/local mode continua funcional quando Supabase nao existe.

## Proibido

- Dark SaaS como default.
- Splash promocional.
- Onboarding longo e obrigatório sem valor.
- Prometer sync/offline alem do implementado.
- Acesso como cadeado/cofre quando o papel for retomada.

## Dependencias

AuthProvider, Supabase mode, degraded mode, Shell Global e Governanca de Dados.

## Criterios De Aceite

- Estados unauthenticated, loading, authenticated, degraded e expired session sao legiveis.
- Erros de acesso nao quebram runtime.
- PWA e safe area funcionam em mobile.

## Riscos De Regressao

Auth generico, perda de contexto, onboarding produtivista e bloqueio indevido do app local.
