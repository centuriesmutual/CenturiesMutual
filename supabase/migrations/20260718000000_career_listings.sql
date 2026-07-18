-- Career job listings editable from the admin portal.
-- Public careers page reads published rows; admin CRUD uses service role.

create table if not exists public.career_listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text not null,
  employment_type text not null default 'Full-Time',
  location text not null default 'Remote — US',
  description text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists career_listings_published_sort_idx
  on public.career_listings (published, sort_order, created_at desc);

drop trigger if exists career_listings_set_updated_at on public.career_listings;
create trigger career_listings_set_updated_at
  before update on public.career_listings
  for each row execute function public.set_updated_at();

alter table public.career_listings enable row level security;

-- Seed defaults only when the table is empty (idempotent for re-runs).
insert into public.career_listings (title, department, employment_type, location, description, sort_order)
select * from (values
  ('Licensed Insurance Agent', 'Insurance & Enrollment', 'Full-Time', 'Remote — US',
   'Guide members through health and life coverage decisions with clarity and care, matching each family to the plan that protects them best.', 10),
  ('Enrollment Coordinator', 'Insurance & Enrollment', 'Full-Time', 'Remote — US',
   'Own the enrollment journey end to end — verifying eligibility, shepherding applications, and keeping every member informed along the way.', 20),
  ('Member Services Specialist', 'Member Services', 'Full-Time', 'Remote — US',
   'Be the trusted voice members reach for, resolving questions about benefits, rewards, and claims with patience and precision.', 30),
  ('Community Outreach Associate', 'Member Services', 'Full-Time', 'Hybrid — US',
   'Build relationships with neighborhoods, clinics, and local partners to bring the membership to the families who need it most.', 40),
  ('Full-Stack Engineer', 'Engineering', 'Full-Time', 'Remote — US',
   'Design and ship the membership platform end to end, from secure member data services to the experiences families use every day.', 50),
  ('iOS Engineer', 'Engineering', 'Full-Time', 'Remote — US',
   'Craft a fast, accessible native app that puts coverage, rewards, and everyday savings in every member’s pocket.', 60),
  ('Product Designer', 'Design', 'Full-Time', 'Remote — US',
   'Shape calm, trustworthy interfaces for complex insurance and rewards flows, turning dense benefits into clear decisions.', 70),
  ('Data/BI Analyst', 'Data', 'Full-Time', 'Remote — US',
   'Turn membership, claims, and rewards data into the insights that steer product, operations, and member outcomes.', 80),
  ('Compliance Analyst', 'Compliance', 'Full-Time', 'Remote — US',
   'Safeguard members and the organization by keeping our practices aligned with insurance, privacy, and healthcare regulation.', 90),
  ('Operations Associate', 'Operations', 'Full-Time', 'Remote — US',
   'Keep the engine running — refining processes across enrollment, servicing, and rewards so the whole team can move faster.', 100)
) as seed(title, department, employment_type, location, description, sort_order)
where not exists (select 1 from public.career_listings limit 1);
