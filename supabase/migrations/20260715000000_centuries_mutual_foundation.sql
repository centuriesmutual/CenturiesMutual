-- Centuries Mutual — Supabase foundation migration
-- Apply in Supabase SQL editor or via CLI: supabase db push
-- Designed for future admin.centuriesmutual.com / office.centuriesmutual.com server roles

-- Extensions
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.application_status as enum (
    'submitted',
    'under_review',
    'additional_information',
    'approved',
    'declined',
    'active'
  );
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (email);

-- ---------------------------------------------------------------------------
-- insurance_applications
-- ---------------------------------------------------------------------------
create table if not exists public.insurance_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  application_status public.application_status not null default 'submitted',
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  address text,
  city text,
  state text,
  zip text,
  date_of_birth date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists insurance_applications_user_id_idx
  on public.insurance_applications (user_id);

create index if not exists insurance_applications_status_idx
  on public.insurance_applications (application_status);

-- ---------------------------------------------------------------------------
-- application_documents
-- ---------------------------------------------------------------------------
create table if not exists public.application_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.insurance_applications (id) on delete cascade,
  storage_path text not null,
  filename text not null,
  mime_type text,
  uploaded_at timestamptz not null default now(),
  lead_id text,
  marketing_id text,
  producer_id text
);

create index if not exists application_documents_application_id_idx
  on public.application_documents (application_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists insurance_applications_set_updated_at on public.insurance_applications;
create trigger insurance_applications_set_updated_at
  before update on public.insurance_applications
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, phone)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'first_name', ''),
    nullif(new.raw_user_meta_data ->> 'last_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        first_name = coalesce(excluded.first_name, public.profiles.first_name),
        last_name = coalesce(excluded.last_name, public.profiles.last_name),
        phone = coalesce(excluded.phone, public.profiles.phone),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.insurance_applications enable row level security;
alter table public.application_documents enable row level security;

-- profiles
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- insurance_applications
drop policy if exists "Users can create own applications" on public.insurance_applications;
create policy "Users can create own applications"
  on public.insurance_applications for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can view own applications" on public.insurance_applications;
create policy "Users can view own applications"
  on public.insurance_applications for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can update own applications" on public.insurance_applications;
create policy "Users can update own applications"
  on public.insurance_applications for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- application_documents (scoped via parent application ownership)
drop policy if exists "Users can upload own application documents" on public.application_documents;
create policy "Users can upload own application documents"
  on public.application_documents for insert
  to authenticated
  with check (
    exists (
      select 1 from public.insurance_applications a
      where a.id = application_id and a.user_id = auth.uid()
    )
  );

drop policy if exists "Users can read own application documents" on public.application_documents;
create policy "Users can read own application documents"
  on public.application_documents for select
  to authenticated
  using (
    exists (
      select 1 from public.insurance_applications a
      where a.id = application_id and a.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Storage: private applications bucket
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'applications',
  'applications',
  false,
  10485760,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Path convention: {user_id}/{application_id}/{filename}
drop policy if exists "Users upload own application files" on storage.objects;
create policy "Users upload own application files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'applications'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users read own application files" on storage.objects;
create policy "Users read own application files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'applications'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users delete own application files" on storage.objects;
create policy "Users delete own application files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'applications'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------------
-- Future admin/office note:
-- Grant service-role or dedicated Postgres roles for subdomain portals.
-- Do not broaden member RLS; server portals use SUPABASE_SERVICE_ROLE_KEY.
-- ---------------------------------------------------------------------------
