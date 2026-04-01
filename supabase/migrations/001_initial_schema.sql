-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Internal solutions (curated by Dayli team)
create table internal_solutions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  detailed_description text,
  source_type text not null check (source_type in ('web', 'youtube', 'community')),
  source_url text,
  cover_image_url text,
  adl_category text not null,
  disability_tags text[] default '{}',
  match_percentage integer,
  match_reason text,
  person_name text,
  time_ago text,
  price_tier text check (price_tier in ('free', '$', '$$', '$$$$')),
  is_diy boolean default false,
  what_made_it_work text,
  created_at timestamptz default now()
);

-- Diagnostic prompts (step questions)
create table diagnostic_prompts (
  id uuid primary key default uuid_generate_v4(),
  step integer not null,
  question text not null,
  subtitle text,
  options jsonb not null default '[]',
  condition_field text,
  condition_value text
);

-- Diagnostic paths (branching sub-steps)
create table diagnostic_paths (
  id uuid primary key default uuid_generate_v4(),
  parent_step integer not null,
  parent_value text not null,
  step integer not null,
  question text not null,
  options jsonb not null default '[]',
  is_multi_select boolean default false
);

-- Filter options for results page
create table filter_options (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  label text not null,
  value text not null,
  sort_order integer default 0
);

-- Solution feedback (thumbs up/down, available to all users)
create table solution_feedback (
  id uuid primary key default uuid_generate_v4(),
  solution_id uuid not null references internal_solutions(id) on delete cascade,
  user_id uuid,
  session_id text not null,
  is_helpful boolean not null,
  created_at timestamptz default now()
);

-- User liked solutions (heart, requires auth)
create table user_liked_solutions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  solution_id uuid not null references internal_solutions(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, solution_id)
);

-- User collections
create table user_collections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  name text not null,
  created_at timestamptz default now()
);

-- Collection items
create table collection_items (
  id uuid primary key default uuid_generate_v4(),
  collection_id uuid not null references user_collections(id) on delete cascade,
  solution_id uuid not null references internal_solutions(id) on delete cascade,
  created_at timestamptz default now(),
  unique(collection_id, solution_id)
);

-- Community submissions (solutions shared by users)
create table community_submissions (
  id uuid primary key default uuid_generate_v4(),
  adl_category text not null,
  title text not null,
  description text not null,
  what_made_it_work text,
  person_name text not null,
  email text,
  notify_on_publish boolean default false,
  conversation_log jsonb default '[]',
  created_at timestamptz default now()
);

-- Community requests (problems needing solutions)
create table community_requests (
  id uuid primary key default uuid_generate_v4(),
  adl_category text not null,
  challenge_description text not null,
  what_tried text,
  person_name text not null,
  email text,
  notify_on_solution boolean default false,
  conversation_log jsonb default '[]',
  created_at timestamptz default now()
);

-- Contacts (for notification opt-ins)
create table contacts (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  name text,
  source text not null check (source in ('submission', 'request', 'contact_form')),
  created_at timestamptz default now()
);

-- Enable RLS on all tables
alter table internal_solutions enable row level security;
alter table diagnostic_prompts enable row level security;
alter table diagnostic_paths enable row level security;
alter table filter_options enable row level security;
alter table solution_feedback enable row level security;
alter table user_liked_solutions enable row level security;
alter table user_collections enable row level security;
alter table collection_items enable row level security;
alter table community_submissions enable row level security;
alter table community_requests enable row level security;
alter table contacts enable row level security;

-- Public read policies
create policy "Anyone can read solutions" on internal_solutions for select using (true);
create policy "Anyone can read prompts" on diagnostic_prompts for select using (true);
create policy "Anyone can read paths" on diagnostic_paths for select using (true);
create policy "Anyone can read filters" on filter_options for select using (true);

-- Feedback: anyone can insert, read own
create policy "Anyone can submit feedback" on solution_feedback for insert with check (true);
create policy "Anyone can read feedback" on solution_feedback for select using (true);

-- Liked solutions: auth required
create policy "Auth users can like" on user_liked_solutions for insert with check (auth.uid() = user_id);
create policy "Auth users can read own likes" on user_liked_solutions for select using (auth.uid() = user_id);
create policy "Auth users can unlike" on user_liked_solutions for delete using (auth.uid() = user_id);

-- Collections: auth required
create policy "Auth users can create collections" on user_collections for insert with check (auth.uid() = user_id);
create policy "Auth users can read own collections" on user_collections for select using (auth.uid() = user_id);
create policy "Auth users can delete own collections" on user_collections for delete using (auth.uid() = user_id);

create policy "Auth users can add to collections" on collection_items for insert with check (
  exists (select 1 from user_collections where id = collection_id and user_id = auth.uid())
);
create policy "Auth users can read own collection items" on collection_items for select using (
  exists (select 1 from user_collections where id = collection_id and user_id = auth.uid())
);
create policy "Auth users can remove from collections" on collection_items for delete using (
  exists (select 1 from user_collections where id = collection_id and user_id = auth.uid())
);

-- Community: anyone can submit
create policy "Anyone can submit solutions" on community_submissions for insert with check (true);
create policy "Anyone can submit requests" on community_requests for insert with check (true);

-- Contacts: insert/upsert
create policy "Anyone can add contact" on contacts for insert with check (true);
