alter table public.daily_sessions
add column if not exists opening_reading jsonb not null default '{}'::jsonb,
add column if not exists capacity_reading jsonb not null default '{}'::jsonb,
add column if not exists direction_reading jsonb not null default '{}'::jsonb,
add column if not exists attention_summary text,
add column if not exists session_status text not null default 'open'
  check (session_status in ('open', 'closed'));
