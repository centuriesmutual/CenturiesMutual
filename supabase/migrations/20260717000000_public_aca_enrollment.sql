-- Centuries Mutual — public ACA enrollment support
-- Apply after 20260716000000_admin_and_careers.sql
--
-- The hero "Enrollment" button opens a public ACA enrollment flow that must be
-- usable BEFORE a member has an account. Those submissions are written by the
-- /api/enrollment/aca route with the service-role key, so user_id may be null.
-- Admins see them in the ACA tab (service-role read + ADMIN_EMAILS allowlist).

-- Allow anonymous / pre-account submissions (service-role insert).
alter table public.insurance_applications
  alter column user_id drop not null;

-- Categorization columns are added in 20260716000000; keep them present here too
-- so this migration is safe to run standalone.
alter table public.insurance_applications
  add column if not exists plan_type text;

alter table public.insurance_applications
  add column if not exists source text;

create index if not exists insurance_applications_source_idx
  on public.insurance_applications (source);

-- No new RLS policies: anon/authenticated members still cannot see other
-- members' rows. Public enrollment writes and admin reads both go through the
-- service-role key, which bypasses RLS. Members with accounts continue to see
-- only their own rows via the existing "Users can view own applications" policy.
