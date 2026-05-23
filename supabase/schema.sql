-- tayinciyim.com — Supabase şema (beta)
-- Supabase SQL Editor'da çalıştırın.

-- extensions
create extension if not exists "pgcrypto";

-- —— profiles ——
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  display_name text,
  avatar_url text,
  user_type text default 'bireysel',
  officer_group text default 'none',
  city text,
  district text,
  phone text,
  whatsapp text,
  email text,
  bio text,
  trust_score int default 60,
  rating_average numeric default 0,
  rating_count int default 0,
  completed_transaction_count int default 0,
  active_listing_count int default 0,
  report_count int default 0,
  response_rate int default 0,
  average_response_time text,
  badges jsonb default '[]'::jsonb,
  is_verified boolean default false,
  is_phone_verified boolean default false,
  is_email_verified boolean default false,
  is_identity_verified boolean default false,
  is_carrier_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- —— carrier_profiles ——
create table if not exists public.carrier_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  company_name text,
  tax_or_registration_note text,
  service_cities jsonb default '[]'::jsonb,
  vehicle_types jsonb default '[]'::jsonb,
  has_lift_service boolean default false,
  has_packing_service boolean default false,
  has_insurance boolean default false,
  total_moves int default 0,
  completed_moves int default 0,
  cancelled_moves int default 0,
  vehicle_count int default 0,
  verification_status text default 'none',
  documents_note text,
  working_hours text,
  service_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- —— listings ——
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  category text not null,
  title text not null,
  description text not null,
  contact_name text,
  whatsapp text,
  city_from text,
  district_from text,
  city_to text,
  district_to text,
  available_date date,
  available_time_start text,
  available_time_end text,
  price numeric,
  details jsonb default '{}'::jsonb,
  images jsonb default '[]'::jsonb,
  status text default 'pending',
  is_urgent boolean default false,
  is_featured boolean default false,
  report_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Kategori: hizmet-verenler — serviceType, serviceCities, priceType vb. details jsonb içinde tutulur.
-- TODO: İleride service_providers tablosuna normalize edilebilir (profil + hizmet paketleri).

create index if not exists listings_status_idx on public.listings (status);
create index if not exists listings_category_idx on public.listings (category);
create index if not exists listings_city_from_idx on public.listings (city_from);

-- —— reports ——
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings (id) on delete cascade,
  reporter_name text,
  reporter_contact text,
  reason text not null,
  message text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- —— reviews ——
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references public.profiles (id) on delete set null,
  to_user_id uuid references public.profiles (id) on delete cascade,
  listing_id uuid references public.listings (id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text,
  review_tags jsonb default '[]'::jsonb,
  is_verified_transaction boolean default false,
  created_at timestamptz default now()
);

-- —— transactions ——
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings (id) on delete set null,
  listing_title text,
  listing_category text,
  from_user_id uuid references public.profiles (id) on delete set null,
  to_user_id uuid references public.profiles (id) on delete set null,
  transaction_type text,
  status text default 'devam-ediyor',
  completed_at timestamptz,
  rating_given boolean default false,
  review_id uuid references public.reviews (id) on delete set null,
  created_at timestamptz default now()
);

-- —— city_guides ——
create table if not exists public.city_guides (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  district text,
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- —— location_insights ——
create table if not exists public.location_insights (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings (id) on delete cascade,
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- —— updated_at trigger ——
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists listings_updated_at on public.listings;
create trigger listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

-- —— RLS ——
alter table public.profiles enable row level security;
alter table public.carrier_profiles enable row level security;
alter table public.listings enable row level security;
alter table public.reports enable row level security;
alter table public.reviews enable row level security;
alter table public.transactions enable row level security;
alter table public.city_guides enable row level security;
alter table public.location_insights enable row level security;

-- profiles: public read
drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read" on public.profiles
  for select using (true);

-- listings: approved public read
drop policy if exists "listings_approved_read" on public.listings;
create policy "listings_approved_read" on public.listings
  for select using (status = 'approved');

-- listings: insert — seçenek A: herkese açık (misafir ilan)
drop policy if exists "listings_public_insert" on public.listings;
create policy "listings_public_insert" on public.listings
  for insert with check (true);

-- listings: insert — seçenek B (yorum): yalnızca authenticated
-- drop policy if exists "listings_auth_insert" on public.listings;
-- create policy "listings_auth_insert" on public.listings
--   for insert to authenticated with check (auth.uid() = user_id);

-- TODO: admin role based policy — update/delete listings
-- TODO: moderation role

drop policy if exists "reports_public_insert" on public.reports;
create policy "reports_public_insert" on public.reports
  for insert with check (true);

drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (true);

drop policy if exists "carrier_profiles_public_read" on public.carrier_profiles;
create policy "carrier_profiles_public_read" on public.carrier_profiles
  for select using (true);

drop policy if exists "city_guides_public_read" on public.city_guides;
create policy "city_guides_public_read" on public.city_guides
  for select using (true);

drop policy if exists "location_insights_public_read" on public.location_insights;
create policy "location_insights_public_read" on public.location_insights
  for select using (true);

drop policy if exists "transactions_public_read" on public.transactions;
create policy "transactions_public_read" on public.transactions
  for select using (true);
