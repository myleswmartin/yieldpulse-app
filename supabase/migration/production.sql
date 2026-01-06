-- YieldPulse schema sync (matches current code & edge functions)
-- Run in Supabase SQL Editor. Safe to rerun.

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Helper functions
-- ------------------------------------------------------------
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return false; -- admin via service_role only
end;
$$ language plpgsql security definer;

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- ------------------------------------------------------------
-- Profiles
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- Analyses
-- ------------------------------------------------------------
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  property_name text,
  listing_url text,
  portal_source text check (portal_source in ('Bayut','Property Finder','Dubizzle','Other')),
  property_type text check (property_type in ('Apartment','Villa','Townhouse','Penthouse')),
  location text,
  area_sqft numeric(10,2) not null check (area_sqft >= 100 and area_sqft <= 50000),
  purchase_price numeric(12,2) not null check (purchase_price >= 100000),
  down_payment_percent numeric(5,2) not null check (down_payment_percent between 15 and 100),
  mortgage_interest_rate numeric(5,2) not null,
  mortgage_term_years integer not null check (mortgage_term_years between 5 and 30),
  expected_monthly_rent numeric(10,2) not null check (expected_monthly_rent >= 1000),
  service_charge_annual numeric(10,2) default 0,
  annual_maintenance_percent numeric(5,2) default 1,
  property_management_fee_percent numeric(5,2) default 5,
  dld_fee_percent numeric(5,2) default 4,
  agent_fee_percent numeric(5,2) default 2,
  capital_growth_percent numeric(5,2) default 3,
  rent_growth_percent numeric(5,2) default 2,
  vacancy_rate_percent numeric(5,2) default 5,
  holding_period_years integer default 5 check (holding_period_years between 1 and 30),
  gross_yield numeric(5,2),
  net_yield numeric(5,2),
  monthly_cash_flow numeric(10,2),
  annual_cash_flow numeric(10,2),
  cash_on_cash_return numeric(5,2),
  calculation_results jsonb,
  is_paid boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_analyses_user_id on public.analyses(user_id);
create index if not exists idx_analyses_created_at on public.analyses(created_at desc);
create index if not exists idx_analyses_is_paid on public.analyses(is_paid);

alter table public.analyses enable row level security;

drop policy if exists "Users can view own analyses" on public.analyses;
drop policy if exists "Users can insert own analyses" on public.analyses;
drop policy if exists "Users can update own analyses" on public.analyses;
drop policy if exists "Users can delete own analyses" on public.analyses;

create policy "Users can view own analyses"
  on public.analyses for select using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.analyses for insert with check (auth.uid() = user_id);

create policy "Users can update own analyses"
  on public.analyses for update using (auth.uid() = user_id);

create policy "Users can delete own analyses"
  on public.analyses for delete using (auth.uid() = user_id);

drop trigger if exists update_analyses_updated_at on public.analyses;
create trigger update_analyses_updated_at
  before update on public.analyses
  for each row execute function public.update_updated_at_column();

-- ------------------------------------------------------------
-- Payments (legacy/demo)
-- ------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  analysis_id uuid references public.analyses(id) on delete cascade,
  amount_aed numeric(10,2) not null default 49.00,
  payment_status text default 'completed' check (payment_status in ('pending','completed','failed','refunded')),
  payment_method text default 'simulated',
  transaction_id text,
  created_at timestamptz default now(),
  unique (analysis_id)
);

create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_payments_analysis_id on public.payments(analysis_id);
create index if not exists idx_payments_created_at on public.payments(created_at desc);

alter table public.payments enable row level security;

drop policy if exists "Users can view own payments" on public.payments;
drop policy if exists "Users can insert own payments" on public.payments;

create policy "Users can view own payments"
  on public.payments for select using (auth.uid() = user_id);

create policy "Users can insert own payments"
  on public.payments for insert with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Report files (future PDF storage)
-- ------------------------------------------------------------
create table if not exists public.report_files (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid references public.analyses(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_size_bytes integer,
  storage_bucket text default 'make-ef294769-reports',
  created_at timestamptz default now(),
  unique (analysis_id)
);

create index if not exists idx_report_files_user_id on public.report_files(user_id);
create index if not exists idx_report_files_analysis_id on public.report_files(analysis_id);

alter table public.report_files enable row level security;

drop policy if exists "Users can view own report files" on public.report_files;
drop policy if exists "Users can insert own report files" on public.report_files;

create policy "Users can view own report files"
  on public.report_files for select using (auth.uid() = user_id);

create policy "Users can insert own report files"
  on public.report_files for insert with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Report purchases (Stripe: single source of truth)
-- ------------------------------------------------------------
create table if not exists public.report_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  amount_aed integer not null default 49,
  currency text not null default 'aed',
  status text not null check (status in ('pending','paid','failed','refunded')),
  purchased_at timestamptz,
  report_version text not null default 'v1',
  snapshot jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_report_purchases_user_id on public.report_purchases(user_id);
create index if not exists idx_report_purchases_analysis_id on public.report_purchases(analysis_id);
create index if not exists idx_report_purchases_stripe_session on public.report_purchases(stripe_checkout_session_id);
create index if not exists idx_report_purchases_status on public.report_purchases(status);

alter table public.report_purchases enable row level security;

drop policy if exists "Users can view own purchases" on public.report_purchases;
drop policy if exists "Users can create own purchases" on public.report_purchases;
drop policy if exists "Service role can update purchases" on public.report_purchases;
drop policy if exists "Users can update pending purchases" on public.report_purchases;

create policy "Users can view own purchases"
  on public.report_purchases for select
  using (auth.uid() = user_id);

create policy "Users can create own purchases"
  on public.report_purchases for insert
  with check (auth.uid() = user_id);

-- allow user to set checkout_session_id on their own pending record
create policy "Users can update pending purchases"
  on public.report_purchases for update
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id and status = 'pending');

-- webhook / service-role updates (paid/refund, intent ids, etc.)
create policy "Service role can update purchases"
  on public.report_purchases for update
  using (auth.role() = 'service_role');

grant select, insert on public.report_purchases to authenticated;
grant all on public.report_purchases to service_role;

drop trigger if exists update_report_purchases_updated_at on public.report_purchases;
create trigger update_report_purchases_updated_at
  before update on public.report_purchases
  for each row execute function public.update_updated_at_column();

-- ------------------------------------------------------------
-- KV store used by Edge Function
-- ------------------------------------------------------------
create table if not exists public.kv_store_ef294769 (
  key text primary key,
  value jsonb not null
);

-- ------------------------------------------------------------
-- Foreign key fix (ensure FKs point to auth.users)
-- ------------------------------------------------------------
alter table public.analyses drop constraint if exists analyses_user_id_fkey;
alter table public.analyses
  add constraint analyses_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.payments drop constraint if exists payments_user_id_fkey;
alter table public.payments
  add constraint payments_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.report_files drop constraint if exists report_files_user_id_fkey;
alter table public.report_files
  add constraint report_files_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

-- Done
