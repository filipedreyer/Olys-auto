import { loadEnv } from 'vite'

const env = loadEnv('test', process.cwd(), '')

export function getTestEnv(name: string) {
  return process.env[name] ?? env[name] ?? import.meta.env[name]
}

export function hasSupabaseEnv() {
  return Boolean(
    getTestEnv('VITE_SUPABASE_URL') && getTestEnv('VITE_SUPABASE_ANON_KEY'),
  )
}

export function hasRlsEnv() {
  return Boolean(
    hasSupabaseEnv() &&
      getTestEnv('RLS_TEST_USER_A_EMAIL') &&
      getTestEnv('RLS_TEST_USER_A_PASSWORD') &&
      getTestEnv('RLS_TEST_USER_B_EMAIL') &&
      getTestEnv('RLS_TEST_USER_B_PASSWORD'),
  )
}
