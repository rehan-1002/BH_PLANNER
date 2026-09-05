-- ==============================================================================
-- BH PLANNER — CANONICAL SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor:
-- Project: https://bybbtulfskobkknhihrl.supabase.co
-- ==============================================================================

-- 1. PROFILES (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  college_start_time text default '09:00',
  college_end_time text default '16:30',
  commute_minutes integer default 60,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
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

-- 2. PLANS (Stores Canonical Timetable Metadata)
create table if not exists public.plans (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  generated_provider text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_active boolean default true not null
);

alter table public.plans enable row level security;

create policy "Users can manage own plans"
  on public.plans for all
  using (auth.uid() = user_id);

-- 3. SCHEDULE BLOCKS (Canonical Schedule Blocks)
create table if not exists public.schedule_blocks (
  id text primary key,
  plan_id text references public.plans on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  date text not null, -- YYYY-MM-DD
  day_of_week text not null,
  start_time text not null, -- HH:MM
  end_time text not null, -- HH:MM
  type text not null check (type in ('college', 'commute', 'study', 'buffer')),
  title text not null,
  subject text,
  status text not null default 'pending' check (status in ('pending', 'done', 'partial', 'missed')),
  is_locked boolean not null default false,
  recovered_from_id text, -- ID of missed block if this was allocated via Tier-1 spillover
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_schedule_blocks_user_date on public.schedule_blocks (user_id, date);
create index if not exists idx_schedule_blocks_plan on public.schedule_blocks (plan_id);

alter table public.schedule_blocks enable row level security;

create policy "Users can manage own schedule blocks"
  on public.schedule_blocks for all
  using (auth.uid() = user_id);

-- 4. SYLLABUS TOPICS
create table if not exists public.syllabus_topics (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  subject text not null,
  title text not null,
  weightage integer default 3 check (weightage between 1 and 5),
  completed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.syllabus_topics enable row level security;

create policy "Users can manage own syllabus topics"
  on public.syllabus_topics for all
  using (auth.uid() = user_id);

-- 5. EXAM MILESTONES
create table if not exists public.exam_milestones (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  subject text not null,
  title text not null,
  exam_date text not null, -- YYYY-MM-DD
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.exam_milestones enable row level security;

create policy "Users can manage own exam milestones"
  on public.exam_milestones for all
  using (auth.uid() = user_id);
