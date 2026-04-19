-- ============================================================
-- Daily Action MVP — Supabase Schema
-- Run this in the Supabase SQL Editor to set up your project
-- ============================================================

-- 1. Profiles (extends auth.users)
create table if not exists public.profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  name       text not null,
  dept       text,
  role       text not null default 'employee', -- 'employee' | 'admin'
  created_at timestamptz default now()
);

-- 2. Daily records (1 per user per day)
create table if not exists public.daily_records (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete cascade not null,
  date          date not null default current_date,
  priority_1    text,
  priority_2    text,
  priority_3    text,
  checkin_at    time,
  checkout_at   time,
  achievement_1 smallint check (achievement_1 between 0 and 5),
  achievement_2 smallint check (achievement_2 between 0 and 5),
  achievement_3 smallint check (achievement_3 between 0 and 5),
  reflection    text,
  improvement   text,
  status        text not null default 'before', -- 'before'|'working'|'done'|'absent'
  score         smallint,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique (user_id, date)
);

-- 3. Row Level Security
alter table public.profiles      enable row level security;
alter table public.daily_records enable row level security;

-- Profiles: users can read/update their own; admins can read all
create policy "profiles_self" on public.profiles
  for all using (auth.uid() = id);

create policy "profiles_admin_read" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Daily records: users manage their own; admins can read all
create policy "records_self" on public.daily_records
  for all using (auth.uid() = user_id);

create policy "records_admin_read" on public.daily_records
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 4. Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
