# Supabase Setup

## Env Local

Crie um `.env.local` a partir de `.env.example`:

```txt
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

Para rodar testes preparados de Supabase/RLS, adicione tambem dois usuarios reais de teste:

```txt
RLS_TEST_USER_A_EMAIL=
RLS_TEST_USER_A_PASSWORD=
RLS_TEST_USER_B_EMAIL=
RLS_TEST_USER_B_PASSWORD=
```

## Aplicar Migration

Com Supabase CLI configurado no projeto:

```bash
supabase db push
```

Ou aplique manualmente o SQL de:

```txt
supabase/migrations/20260517190000_release1_p0_foundation.sql
```

## Validar Build

```bash
npm install
npm run typecheck
npm run build
npm run test
```

## Validar Degraded Mode

Remova `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` do ambiente local.

```bash
npm run dev
```

Abra `/fazer/hoje` ou `/login`. O app deve indicar modo local/degraded e continuar funcional com fallback em memoria.

## Validar Supabase Mode

Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

```bash
npm run dev
```

Abra `/login`, autentique com um usuario Supabase existente e confirme que o status de auth muda para sessao autenticada. Em seguida, use `Sair` no topo para validar logout.

## Validar Repositories e RLS

Sem env Supabase, os testes locais devem passar e os testes Supabase/RLS devem ser skipped explicitamente:

```bash
npm run test:repositories
npm run test:rls
```

Com env Supabase e os dois usuarios de teste configurados, rode os mesmos comandos. O RLS deve impedir que o usuario B leia dados criados pelo usuario A nas tabelas principais do Release 1.
