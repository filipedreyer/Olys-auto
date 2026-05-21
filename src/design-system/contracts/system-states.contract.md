# System States Contract

## Papel

Estados sistêmicos explicam disponibilidade, carregamento, erro e degradação sem gerar tela branca ou falsa confiança.

## Obrigatório

- Loading inicial com contexto.
- Skeleton leve quando houver espera.
- Offline explícito.
- Erro parcial e recuperável.
- Erro de configuração claro.
- Empty state legível.
- Sessão expirada sem Shell logado.
- App funcional com degradação controlada quando possível.

## Proibido

- Spinner infinito sem mensagem.
- Erro só por cor.
- Prometer sincronização completa quando não existe.
- Ocultar falha de Supabase/configuração.
- Alterar store operacional para mostrar estado sistêmico.

## Critérios De Aceite

- Estado usa texto acessível.
- Erro tem caminho de recuperação.
- Offline não bloqueia navegação local sem necessidade.
