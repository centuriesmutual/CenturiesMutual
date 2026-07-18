-- ACA enrollment: force next-month coverage start flag + durable daily rate limits.

insert into public.aca_enrollment_flags (key, name, description, enabled, start_date, end_date)
values
  (
    'ACA_FORCE_NEXT_MONTH_START',
    'Force coverage start — 1st of next month',
    'When enabled, every ACA enrollment coverage start date is set to the first day of the next calendar month, regardless of what the applicant enters.',
    true,
    null,
    null
  )
on conflict (key) do nothing;

create table if not exists public.aca_enrollment_rate_limits (
  id uuid primary key default gen_random_uuid(),
  fingerprint text not null,
  email text,
  ip text,
  application_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists aca_enrollment_rate_limits_fingerprint_created_idx
  on public.aca_enrollment_rate_limits (fingerprint, created_at desc);

create index if not exists aca_enrollment_rate_limits_email_created_idx
  on public.aca_enrollment_rate_limits (email, created_at desc);

alter table public.aca_enrollment_rate_limits enable row level security;
