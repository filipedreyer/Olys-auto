create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text not null default 'America/Sao_Paulo',
  locale text not null default 'pt-BR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null check (
    entity_type in (
      'goal',
      'project',
      'task',
      'habit',
      'routine',
      'agenda',
      'event',
      'reminder',
      'note',
      'list',
      'template'
    )
  ),
  title text not null check (char_length(trim(title)) > 0),
  description text,
  status text not null default 'active' check (
    status in ('active', 'paused', 'completed', 'archived', 'deleted')
  ),
  priority integer not null default 0 check (priority between 0 and 3),
  date_start date,
  date_end date,
  start_at timestamptz,
  end_at timestamptz,
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  all_day boolean not null default false,
  recurrence_rule text,
  parent_id uuid references public.items(id) on delete set null,
  source_context text,
  metadata jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  archived_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (entity_type not in ('idea', 'essential_protected'))
);

create table public.inbox_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null check (char_length(trim(text)) > 0),
  attachment_ref text,
  suggested_type text check (
    suggested_type is null or suggested_type in (
      'goal',
      'project',
      'task',
      'habit',
      'routine',
      'agenda',
      'event',
      'reminder',
      'note',
      'list',
      'template'
    )
  ),
  status text not null default 'new' check (
    status in (
      'new',
      'kept',
      'converted',
      'completed',
      'postponed',
      'discarded',
      'archived',
      'error'
    )
  ),
  source_context text not null default 'capture',
  converted_item_id uuid references public.items(id) on delete set null,
  postponed_at timestamptz,
  needs_revisit boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.entity_conditions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_id uuid not null references public.items(id) on delete cascade,
  condition_type text not null check (
    condition_type in (
      'essential_protected',
      'blocked',
      'recurring',
      'overdue',
      'attention',
      'unknown',
      'has_time',
      'has_date',
      'no_time',
      'no_date'
    )
  ),
  value text,
  created_by text not null default 'user' check (created_by in ('user', 'system', 'ia')),
  created_at timestamptz not null default now(),
  removed_at timestamptz
);

create table public.entity_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_entity_id uuid not null references public.items(id) on delete cascade,
  target_entity_id uuid not null references public.items(id) on delete cascade,
  link_type text not null check (
    link_type in (
      'relates_to',
      'supports',
      'belongs_to',
      'references',
      'derived_from'
    )
  ),
  created_by text not null default 'user' check (created_by in ('user', 'system', 'ia')),
  created_at timestamptz not null default now(),
  removed_at timestamptz,
  check (source_entity_id <> target_entity_id)
);

create table public.dependency_edges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  predecessor_id uuid not null references public.items(id) on delete cascade,
  successor_id uuid not null references public.items(id) on delete cascade,
  type text not null check (type in ('blocks', 'precedes', 'requires', 'enables')),
  status text not null default 'active' check (
    status in ('active', 'candidate', 'inactive', 'needs_review')
  ),
  source text not null default 'manual' check (
    source in ('manual', 'ia_suggested', 'imported', 'template')
  ),
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)),
  justification text not null check (char_length(trim(justification)) > 0),
  impact text not null check (char_length(trim(impact)) > 0),
  created_at timestamptz not null default now(),
  removed_at timestamptz,
  check (predecessor_id <> successor_id)
);

create table public.entity_change_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_id uuid references public.items(id) on delete set null,
  change_type text not null,
  source_context text not null,
  previous_state_ref jsonb,
  new_state_ref jsonb,
  actor text not null default 'user' check (actor in ('user', 'system', 'ia')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.daily_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  opened_at timestamptz,
  closed_at timestamptz,
  closing_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_id uuid references public.items(id) on delete set null,
  inbox_item_id uuid references public.inbox_items(id) on delete set null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create table public.system_messages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  severity text not null default 'info' check (
    severity in ('info', 'warning', 'critical')
  ),
  audience text not null default 'all',
  status text not null default 'draft' check (
    status in ('draft', 'published', 'expired', 'archived')
  ),
  cta jsonb,
  published_at timestamptz,
  expires_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'support')),
  granted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (user_id, role)
);

create table public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  target_type text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  justification text,
  created_at timestamptz not null default now()
);

create table public.ai_prompt_versions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  version text not null,
  context text not null,
  objective text not null,
  schema jsonb not null,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'retired')
  ),
  created_at timestamptz not null default now(),
  approved_by uuid references auth.users(id) on delete set null,
  unique (name, version)
);

create table public.ai_interaction_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  context text not null,
  prompt_version text,
  action_type text,
  output_type text,
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)),
  confirmation_required boolean not null default false,
  confirmed boolean,
  safety_category text,
  correlation_id uuid not null default gen_random_uuid(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.safety_events (
  id uuid primary key default gen_random_uuid(),
  user_id_hash text,
  category text not null,
  severity text not null,
  blocked_actions text[] not null default '{}',
  context text not null,
  correlation_id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table public.data_exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  export_type text not null default 'json',
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  file_expires_at timestamptz,
  status text not null default 'requested' check (
    status in ('requested', 'processing', 'completed', 'failed', 'expired')
  )
);

create table public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  requested_at timestamptz not null default now(),
  status text not null default 'requested' check (
    status in ('requested', 'processing', 'completed', 'cancelled', 'failed')
  ),
  completed_at timestamptz,
  retention_notes text
);

create index items_user_id_idx on public.items(user_id);
create index inbox_items_user_id_idx on public.inbox_items(user_id);
create index entity_conditions_entity_id_idx on public.entity_conditions(entity_id);
create index entity_links_source_idx on public.entity_links(source_entity_id);
create index dependency_edges_predecessor_idx on public.dependency_edges(predecessor_id);
create index dependency_edges_successor_idx on public.dependency_edges(successor_id);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger items_set_updated_at
before update on public.items
for each row execute function public.set_updated_at();

create trigger inbox_items_set_updated_at
before update on public.inbox_items
for each row execute function public.set_updated_at();

create trigger daily_sessions_set_updated_at
before update on public.daily_sessions
for each row execute function public.set_updated_at();

create trigger system_messages_set_updated_at
before update on public.system_messages
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.inbox_items enable row level security;
alter table public.entity_conditions enable row level security;
alter table public.entity_links enable row level security;
alter table public.dependency_edges enable row level security;
alter table public.entity_change_events enable row level security;
alter table public.daily_sessions enable row level security;
alter table public.attachments enable row level security;
alter table public.system_messages enable row level security;
alter table public.user_roles enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.ai_prompt_versions enable row level security;
alter table public.ai_interaction_events enable row level security;
alter table public.safety_events enable row level security;
alter table public.data_exports enable row level security;
alter table public.account_deletion_requests enable row level security;

create policy "profiles owner access" on public.profiles
for all using (id = auth.uid())
with check (id = auth.uid());

create policy "items owner access" on public.items
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "inbox owner access" on public.inbox_items
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "conditions owner access" on public.entity_conditions
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "links owner access" on public.entity_links
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "dependencies owner access" on public.dependency_edges
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "change events owner access" on public.entity_change_events
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "daily sessions owner access" on public.daily_sessions
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "attachments owner access" on public.attachments
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "data exports owner access" on public.data_exports
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "account deletion owner access" on public.account_deletion_requests
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "user can read own roles" on public.user_roles
for select using (user_id = auth.uid());

create policy "user can insert own ai events" on public.ai_interaction_events
for insert with check (user_id = auth.uid());

create policy "user can read own ai events" on public.ai_interaction_events
for select using (user_id = auth.uid());

create policy "published messages are readable" on public.system_messages
for select using (
  status = 'published'
  and (expires_at is null or expires_at > now())
);
