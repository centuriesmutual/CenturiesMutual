-- Office calendar events + internal mailbox (staff Realtime messaging)

create table if not exists public.office_calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  all_day boolean not null default false,
  -- individual | executive | team | company
  scope text not null default 'company'
    check (scope in ('individual', 'executive', 'team', 'company')),
  assignee_user_id uuid references auth.users (id) on delete set null,
  assignee_email text,
  created_by uuid references auth.users (id) on delete set null,
  created_by_email text,
  sync_to_office boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists office_calendar_events_starts_at_idx
  on public.office_calendar_events (starts_at);

create index if not exists office_calendar_events_scope_idx
  on public.office_calendar_events (scope);

create table if not exists public.office_mailbox_threads (
  id uuid primary key default gen_random_uuid(),
  subject text not null default '(no subject)',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.office_mailbox_participants (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.office_mailbox_threads (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  email text,
  joined_at timestamptz not null default now(),
  unique (thread_id, user_id)
);

create table if not exists public.office_mailbox_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.office_mailbox_threads (id) on delete cascade,
  sender_id uuid references auth.users (id) on delete set null,
  sender_email text,
  body text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists office_mailbox_messages_thread_created_idx
  on public.office_mailbox_messages (thread_id, created_at desc);

create table if not exists public.office_mailbox_reads (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.office_mailbox_messages (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  read_at timestamptz not null default now(),
  unique (message_id, user_id)
);

alter table public.office_calendar_events enable row level security;
alter table public.office_mailbox_threads enable row level security;
alter table public.office_mailbox_participants enable row level security;
alter table public.office_mailbox_messages enable row level security;
alter table public.office_mailbox_reads enable row level security;

-- Staff with admin JWT metadata can read calendar events synced to office
drop policy if exists "Staff can read calendar events" on public.office_calendar_events;
create policy "Staff can read calendar events"
  on public.office_calendar_events for select
  to authenticated
  using (
    public.is_staff_admin()
    or assignee_user_id = auth.uid()
    or scope = 'company'
    or scope = 'team'
  );

drop policy if exists "Staff can read mailbox threads" on public.office_mailbox_threads;
create policy "Staff can read mailbox threads"
  on public.office_mailbox_threads for select
  to authenticated
  using (
    public.is_staff_admin()
    or exists (
      select 1 from public.office_mailbox_participants p
      where p.thread_id = office_mailbox_threads.id and p.user_id = auth.uid()
    )
  );

drop policy if exists "Staff can read mailbox messages" on public.office_mailbox_messages;
create policy "Staff can read mailbox messages"
  on public.office_mailbox_messages for select
  to authenticated
  using (
    public.is_staff_admin()
    or exists (
      select 1 from public.office_mailbox_participants p
      where p.thread_id = office_mailbox_messages.thread_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "Staff can insert mailbox messages" on public.office_mailbox_messages;
create policy "Staff can insert mailbox messages"
  on public.office_mailbox_messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.office_mailbox_participants p
      where p.thread_id = office_mailbox_messages.thread_id and p.user_id = auth.uid()
    )
  );

do $$
begin
  alter publication supabase_realtime add table public.office_mailbox_messages;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.office_calendar_events;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
