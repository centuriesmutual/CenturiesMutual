-- Application Conversations — internal staff messaging per insurance application.
-- Customers must never have access (no customer-facing policies).

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.insurance_applications (id) on delete set null,
  title text not null,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists conversations_application_id_idx
  on public.conversations (application_id);

create index if not exists conversations_updated_at_idx
  on public.conversations (updated_at desc);

create table if not exists public.conversation_members (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'office'
    check (role in ('admin', 'office', 'producer', 'system')),
  joined_at timestamptz not null default now(),
  unique (conversation_id, user_id)
);

create index if not exists conversation_members_user_id_idx
  on public.conversation_members (user_id);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid references auth.users (id) on delete set null,
  sender_role text not null default 'office'
    check (sender_role in ('admin', 'office', 'producer', 'system')),
  message text not null default '',
  message_type text not null default 'user'
    check (message_type in ('user', 'system', 'status', 'assignment', 'note')),
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create index if not exists messages_conversation_id_created_at_idx
  on public.messages (conversation_id, created_at desc);

create table if not exists public.message_reads (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  read_at timestamptz not null default now(),
  unique (message_id, user_id)
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages (id) on delete cascade,
  storage_path text not null,
  filename text not null,
  size bigint not null default 0,
  mime_type text not null default 'application/octet-stream'
);

create index if not exists attachments_message_id_idx
  on public.attachments (message_id);

create table if not exists public.staff_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  conversation_id uuid references public.conversations (id) on delete set null,
  application_id uuid references public.insurance_applications (id) on delete set null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists staff_notifications_user_id_created_at_idx
  on public.staff_notifications (user_id, created_at desc);

create sequence if not exists public.application_conversation_seq start 421;

create or replace function public.next_application_conversation_number()
returns bigint
language sql
as $$
  select nextval('public.application_conversation_seq');
$$;

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_conversations_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute function public.set_conversations_updated_at();

-- ---------------------------------------------------------------------------
-- RLS — staff via membership; customers have no policies granting access
-- ---------------------------------------------------------------------------

alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.message_reads enable row level security;
alter table public.attachments enable row level security;
alter table public.staff_notifications enable row level security;

-- Helper: is staff admin via JWT metadata
create or replace function public.is_staff_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'staff_admin'),
    false
  );
$$;

drop policy if exists "Staff can select conversations" on public.conversations;
create policy "Staff can select conversations"
  on public.conversations for select
  to authenticated
  using (
    public.is_staff_admin()
    or exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = conversations.id
        and cm.user_id = auth.uid()
    )
  );

drop policy if exists "Staff can select members" on public.conversation_members;
create policy "Staff can select members"
  on public.conversation_members for select
  to authenticated
  using (
    public.is_staff_admin()
    or user_id = auth.uid()
    or exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = conversation_members.conversation_id
        and cm.user_id = auth.uid()
    )
  );

drop policy if exists "Staff can select messages" on public.messages;
create policy "Staff can select messages"
  on public.messages for select
  to authenticated
  using (
    public.is_staff_admin()
    or exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = messages.conversation_id
        and cm.user_id = auth.uid()
    )
  );

drop policy if exists "Staff can insert own messages" on public.messages;
create policy "Staff can insert own messages"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = messages.conversation_id
        and cm.user_id = auth.uid()
    )
  );

drop policy if exists "Staff can select reads" on public.message_reads;
create policy "Staff can select reads"
  on public.message_reads for select
  to authenticated
  using (
    public.is_staff_admin()
    or user_id = auth.uid()
  );

drop policy if exists "Staff can upsert own reads" on public.message_reads;
create policy "Staff can upsert own reads"
  on public.message_reads for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Staff can select attachments" on public.attachments;
create policy "Staff can select attachments"
  on public.attachments for select
  to authenticated
  using (
    public.is_staff_admin()
    or exists (
      select 1
      from public.messages m
      join public.conversation_members cm on cm.conversation_id = m.conversation_id
      where m.id = attachments.message_id
        and cm.user_id = auth.uid()
    )
  );

drop policy if exists "Staff can select own notifications" on public.staff_notifications;
create policy "Staff can select own notifications"
  on public.staff_notifications for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Staff can update own notifications" on public.staff_notifications;
create policy "Staff can update own notifications"
  on public.staff_notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------

do $$
begin
  alter publication supabase_realtime add table public.messages;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.conversations;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Storage bucket for conversation attachments (staff via service role / signed URLs)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'conversation-attachments',
  'conversation-attachments',
  false,
  15728640,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;
