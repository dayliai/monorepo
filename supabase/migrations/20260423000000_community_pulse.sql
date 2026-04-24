-- ============================================================
-- Community Pulse: anonymous daily mood check-ins
-- Auth-optional: user_id is nullable for anonymous votes
-- ============================================================

create table if not exists community_pulse (
  id uuid primary key default uuid_generate_v4(),
  mood text not null check (mood in ('calm', 'hopeful', 'anxious', 'tired', 'grateful')),
  user_id uuid references auth.users(id) on delete set null,
  -- client_id is a localStorage-generated UUID that prevents anonymous
  -- users from voting multiple times in a day without requiring auth
  client_id text,
  pulse_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- Prevent duplicate votes per day per client (anonymous or signed-in)
create unique index if not exists community_pulse_client_daily_uniq
  on community_pulse (client_id, pulse_date)
  where client_id is not null;

create unique index if not exists community_pulse_user_daily_uniq
  on community_pulse (user_id, pulse_date)
  where user_id is not null;

-- Index for fast daily aggregates
create index if not exists community_pulse_date_mood_idx
  on community_pulse (pulse_date, mood);

-- ============================================================
-- RLS: anyone can insert/read (anonymous-friendly)
-- ============================================================

alter table community_pulse enable row level security;

create policy "Anyone can submit pulse"
  on community_pulse for insert
  with check (true);

create policy "Anyone can read pulse"
  on community_pulse for select
  using (true);

-- ============================================================
-- Aggregated view: recent mood breakdown
--
-- NOTE: During the first ~6 months while we're building volume,
-- this shows ALL check-ins so the pulse always feels alive.
-- Once daily traffic is steady, tighten the window by uncommenting
-- the WHERE clause below (e.g. to a rolling 30-day window).
-- ============================================================

create or replace view community_pulse_recent as
select
  mood,
  count(*)::int as count
from community_pulse
-- where pulse_date >= current_date - interval '30 days'
group by mood;
