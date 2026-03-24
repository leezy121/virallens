-- ViralLens Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ==========================================
-- PROFILES TABLE (extends auth.users)
-- ==========================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'pro', 'credits')),
  credits integer default 15,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ==========================================
-- ANALYSES TABLE
-- ==========================================
create table if not exists public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  type text check (type in ('decode', 'diagnose')),
  viral_link text,
  viral_script text,
  user_link text,
  user_script text,
  ai_result jsonb,
  credits_used integer default 2,
  created_at timestamp with time zone default now()
);

alter table public.analyses enable row level security;

create policy "Users can view own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

-- ==========================================
-- COACH MESSAGES TABLE
-- ==========================================
create table if not exists public.coach_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  conversation_id uuid default gen_random_uuid(),
  role text check (role in ('user', 'assistant')),
  content text,
  credits_used integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.coach_messages enable row level security;

create policy "Users can view own messages"
  on public.coach_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own messages"
  on public.coach_messages for insert
  with check (auth.uid() = user_id);

-- ==========================================
-- CREDIT TRANSACTIONS TABLE
-- ==========================================
create table if not exists public.credit_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  amount integer,
  type text check (type in ('purchase', 'usage', 'bonus')),
  description text,
  created_at timestamp with time zone default now()
);

alter table public.credit_transactions enable row level security;

create policy "Users can view own transactions"
  on public.credit_transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.credit_transactions for insert
  with check (auth.uid() = user_id);

-- ==========================================
-- AUTO-CREATE PROFILE ON SIGNUP (TRIGGER)
-- ==========================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, credits)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    15
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop if exists (for re-running)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
