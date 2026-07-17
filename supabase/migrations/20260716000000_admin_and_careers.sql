-- Centuries Mutual — admin portal + careers migration
-- Apply after 20260715000000_centuries_mutual_foundation.sql
-- Adds product categorization to applications and a careers pipeline.

-- ---------------------------------------------------------------------------
-- insurance_applications: product/plan categorization
-- ---------------------------------------------------------------------------
-- Nullable so external submitters (e.g. medicare.reviews) that do not yet send
-- a plan type still insert cleanly and show up in the admin portal.
alter table public.insurance_applications
  add column if not exists plan_type text;

alter table public.insurance_applications
  add column if not exists source text;

create index if not exists insurance_applications_plan_type_idx
  on public.insurance_applications (plan_type);

create index if not exists insurance_applications_created_at_idx
  on public.insurance_applications (created_at desc);

-- ---------------------------------------------------------------------------
-- career_applications
-- ---------------------------------------------------------------------------
create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  position text not null,
  location text,
  work_authorization text,
  linkedin_url text,
  portfolio_url text,
  cover_letter text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists career_applications_status_idx
  on public.career_applications (status);

create index if not exists career_applications_created_at_idx
  on public.career_applications (created_at desc);

drop trigger if exists career_applications_set_updated_at on public.career_applications;
create trigger career_applications_set_updated_at
  before update on public.career_applications
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- No public policies: applicants submit through the /api/careers route, which
-- writes with the service-role key. Admins read through service-role portal
-- routes. This keeps the table closed to anon/authenticated direct access.
alter table public.career_applications enable row level security;

-- ---------------------------------------------------------------------------
-- Admin note:
-- The admin portal (admin.* / /admin) reads insurance_applications and
-- career_applications with SUPABASE_SERVICE_ROLE_KEY (bypasses RLS). Access is
-- gated in the app layer by the ADMIN_EMAILS allowlist. Do not add broad member
-- RLS policies to satisfy the portal.
-- ---------------------------------------------------------------------------
