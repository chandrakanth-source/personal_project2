create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  role text not null default 'Admin',
  created_at timestamptz not null default now()
);

create table if not exists public.shop_products (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.shop_sales (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.shop_settings (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.apply_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(coalesce(new.email, '')) = 'chandrakanthyaddhula@gmail.com' then
    new.role := 'Admin';
  else
    new.role := 'Staff';
  end if;
  return new;
end;
$$;

drop trigger if exists apply_profile_role_trigger on public.profiles;
create trigger apply_profile_role_trigger
  before insert or update on public.profiles
  for each row execute function public.apply_profile_role();

alter table public.profiles enable row level security;
alter table public.shop_products enable row level security;
alter table public.shop_sales enable row level security;
alter table public.shop_settings enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'Admin'
  );
$$;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users upsert own profile" on public.profiles;
create policy "Users upsert own profile" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Admins manage products" on public.shop_products;
create policy "Admins manage products" on public.shop_products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage sales" on public.shop_sales;
create policy "Admins manage sales" on public.shop_sales
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage settings" on public.shop_settings;
create policy "Admins manage settings" on public.shop_settings
  for all using (public.is_admin()) with check (public.is_admin());
