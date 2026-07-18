-- ACA enrollment period flags + per-state licensing/availability.
-- Editable from admin without redeploy. Backend is the source of truth.

-- ---------------------------------------------------------------------------
-- aca_enrollment_flags
-- ---------------------------------------------------------------------------
create table if not exists public.aca_enrollment_flags (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text not null default '',
  enabled boolean not null default false,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists aca_enrollment_flags_set_updated_at on public.aca_enrollment_flags;
create trigger aca_enrollment_flags_set_updated_at
  before update on public.aca_enrollment_flags
  for each row execute function public.set_updated_at();

alter table public.aca_enrollment_flags enable row level security;

insert into public.aca_enrollment_flags (key, name, description, enabled, start_date, end_date)
values
  (
    'ACA_OEP_ENABLED',
    'ACA Open Enrollment Period',
    'Controls whether the ACA Open Enrollment Period (OEP) is active. Active only when enabled and the current date is within startDate–endDate.',
    false,
    null,
    null
  ),
  (
    'ACA_SEP_ENABLED',
    'ACA Special Enrollment Period',
    'Controls whether ACA Special Enrollment Period (SEP) applications are accepted.',
    true,
    null,
    null
  )
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- aca_state_flags
-- ---------------------------------------------------------------------------
create table if not exists public.aca_state_flags (
  id uuid primary key default gen_random_uuid(),
  state_code text not null unique,
  state_name text not null,
  enabled boolean not null default false,
  licensed boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aca_state_flags_enabled_licensed_idx
  on public.aca_state_flags (enabled, licensed);

create index if not exists aca_state_flags_display_order_idx
  on public.aca_state_flags (display_order, state_name);

drop trigger if exists aca_state_flags_set_updated_at on public.aca_state_flags;
create trigger aca_state_flags_set_updated_at
  before update on public.aca_state_flags
  for each row execute function public.set_updated_at();

alter table public.aca_state_flags enable row level security;

-- Seed all 50 states + DC when empty.
insert into public.aca_state_flags (state_code, state_name, enabled, licensed, display_order)
select * from (values
  ('AL','Alabama',false,false,10),
  ('AK','Alaska',false,false,20),
  ('AZ','Arizona',true,true,30),
  ('AR','Arkansas',false,false,40),
  ('CA','California',false,false,50),
  ('CO','Colorado',false,false,60),
  ('CT','Connecticut',false,false,70),
  ('DE','Delaware',false,false,80),
  ('DC','District of Columbia',false,false,90),
  ('FL','Florida',false,false,100),
  ('GA','Georgia',false,false,110),
  ('HI','Hawaii',false,false,120),
  ('ID','Idaho',false,false,130),
  ('IL','Illinois',false,false,140),
  ('IN','Indiana',false,false,150),
  ('IA','Iowa',false,false,160),
  ('KS','Kansas',false,false,170),
  ('KY','Kentucky',false,false,180),
  ('LA','Louisiana',false,false,190),
  ('ME','Maine',false,false,200),
  ('MD','Maryland',false,false,210),
  ('MA','Massachusetts',false,false,220),
  ('MI','Michigan',false,false,230),
  ('MN','Minnesota',false,false,240),
  ('MS','Mississippi',false,false,250),
  ('MO','Missouri',false,false,260),
  ('MT','Montana',false,false,270),
  ('NE','Nebraska',false,false,280),
  ('NV','Nevada',false,false,290),
  ('NH','New Hampshire',false,false,300),
  ('NJ','New Jersey',false,false,310),
  ('NM','New Mexico',false,false,320),
  ('NY','New York',false,false,330),
  ('NC','North Carolina',false,false,340),
  ('ND','North Dakota',false,false,350),
  ('OH','Ohio',false,false,360),
  ('OK','Oklahoma',false,false,370),
  ('OR','Oregon',false,false,380),
  ('PA','Pennsylvania',false,false,390),
  ('RI','Rhode Island',false,false,400),
  ('SC','South Carolina',true,true,410),
  ('SD','South Dakota',false,false,420),
  ('TN','Tennessee',false,false,430),
  ('TX','Texas',true,true,440),
  ('UT','Utah',false,false,450),
  ('VT','Vermont',false,false,460),
  ('VA','Virginia',false,false,470),
  ('WA','Washington',false,false,480),
  ('WV','West Virginia',false,false,490),
  ('WI','Wisconsin',false,false,500),
  ('WY','Wyoming',false,false,510)
) as seed(state_code, state_name, enabled, licensed, display_order)
where not exists (select 1 from public.aca_state_flags limit 1);
