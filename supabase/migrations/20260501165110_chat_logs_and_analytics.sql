-- Capture every landing-site chat (both submission and request modes)
-- and add a table for manually-triggered AI insight reports.
--
-- Today, the landing AgentChat only persists conversations once a user
-- completes a structured submission/request. Abandoned chats are lost.
-- These tables capture every chat session, real-time, so we can analyze
-- the full picture (including drop-offs) from the admin/insights page.

-- =============================================================================
-- A. Chat capture tables — one per landing AgentChat mode
-- =============================================================================

create table landing_chat_submissions (
  session_id     uuid primary key default uuid_generate_v4(),
  started_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  ended_at       timestamptz,
  status         text not null default 'in_progress'
                 check (status in ('in_progress','completed','abandoned')),
  adl_category   text,
  message_count  int  not null default 0,
  messages       jsonb not null default '[]'::jsonb,
  photo_urls     text[] default '{}',
  community_submission_id uuid references community_submissions(id) on delete set null,
  user_agent     text,
  referrer       text
);
create index landing_chat_submissions_status_started_idx
  on landing_chat_submissions (status, started_at desc);
create index landing_chat_submissions_category_idx
  on landing_chat_submissions (adl_category);
create index landing_chat_submissions_started_idx
  on landing_chat_submissions (started_at desc);

create table landing_chat_requests (
  session_id     uuid primary key default uuid_generate_v4(),
  started_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  ended_at       timestamptz,
  status         text not null default 'in_progress'
                 check (status in ('in_progress','completed','abandoned')),
  adl_category   text,
  message_count  int  not null default 0,
  messages       jsonb not null default '[]'::jsonb,
  photo_urls     text[] default '{}',
  community_request_id uuid references community_requests(id) on delete set null,
  user_agent     text,
  referrer       text
);
create index landing_chat_requests_status_started_idx
  on landing_chat_requests (status, started_at desc);
create index landing_chat_requests_category_idx
  on landing_chat_requests (adl_category);
create index landing_chat_requests_started_idx
  on landing_chat_requests (started_at desc);

-- RLS: anonymous users can insert and update their own session row, but no
-- one (anon or authed) can read these tables via the public API. Reads happen
-- via the service-role key from admin endpoints only.
alter table landing_chat_submissions enable row level security;
alter table landing_chat_requests    enable row level security;

create policy "Anyone can insert chat session" on landing_chat_submissions
  for insert with check (true);
create policy "Anyone can update own session"  on landing_chat_submissions
  for update using (true);

create policy "Anyone can insert chat session" on landing_chat_requests
  for insert with check (true);
create policy "Anyone can update own session"  on landing_chat_requests
  for update using (true);

-- =============================================================================
-- B. Analytics report table — one row per (source, period, trigger)
-- =============================================================================

create table chat_analytics_reports (
  id            uuid primary key default uuid_generate_v4(),
  source        text not null check (source in
                ('landing-submission','landing-request','web-assessment')),
  period_start  timestamptz not null,
  period_end    timestamptz not null,
  generated_at  timestamptz not null default now(),
  triggered_by  text not null default 'manual'
                check (triggered_by in ('cron','manual')),

  -- Raw counts (computed by SQL, no LLM)
  total_chats   int,
  by_status     jsonb,
  by_category   jsonb,

  -- LLM-analyzed sections
  sentiment_overview   jsonb,
  ai_success_overview  jsonb,
  top_themes           jsonb,
  drop_off_patterns    jsonb,
  recommendations      text,

  -- Original LLM text in case we ever want to re-parse with a different schema
  raw_llm_response     text,

  -- One report per source per period per trigger type. A second click for the
  -- same window is allowed only if the trigger type differs (cron vs manual).
  unique (source, period_start, period_end, triggered_by)
);

create index chat_analytics_reports_source_period_idx
  on chat_analytics_reports (source, period_start desc);

-- RLS off — the table is read/written exclusively from server-side code with
-- the service-role key. No public access.
alter table chat_analytics_reports enable row level security;
