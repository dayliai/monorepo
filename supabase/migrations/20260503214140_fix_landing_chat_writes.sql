-- Landing chat capture tables (#13) were unwritable from the browser. Two issues:
-- 1) The original migration's permissive RLS policies were not honoring anon writes.
-- 2) AgentChat uses .upsert() (INSERT ... ON CONFLICT DO UPDATE), which requires
--    SELECT-ability on the table even when WITH CHECK is true — without a SELECT
--    policy, the conflict-resolution path fails RLS.
--
-- Fix: keep RLS on, but provide INSERT/UPDATE/SELECT policies that are open to
-- anon and authenticated. Reads from anon are technically possible until we move
-- the writes behind a SECURITY DEFINER RPC; tracked as a follow-up. service_role
-- bypasses RLS, so the admin /insights endpoints continue to work as before.

alter table landing_chat_submissions enable row level security;
alter table landing_chat_requests    enable row level security;

drop policy if exists "Anyone can insert chat session" on landing_chat_submissions;
drop policy if exists "Anyone can update own session"  on landing_chat_submissions;
drop policy if exists "Anyone can insert chat session" on landing_chat_requests;
drop policy if exists "Anyone can update own session"  on landing_chat_requests;
drop policy if exists chat_subs_insert on landing_chat_submissions;
drop policy if exists chat_subs_update on landing_chat_submissions;
drop policy if exists chat_subs_select on landing_chat_submissions;
drop policy if exists chat_reqs_insert on landing_chat_requests;
drop policy if exists chat_reqs_update on landing_chat_requests;
drop policy if exists chat_reqs_select on landing_chat_requests;

create policy chat_subs_insert on landing_chat_submissions
  for insert to anon, authenticated with check (true);
create policy chat_subs_update on landing_chat_submissions
  for update to anon, authenticated using (true) with check (true);
create policy chat_subs_select on landing_chat_submissions
  for select to anon, authenticated using (true);

create policy chat_reqs_insert on landing_chat_requests
  for insert to anon, authenticated with check (true);
create policy chat_reqs_update on landing_chat_requests
  for update to anon, authenticated using (true) with check (true);
create policy chat_reqs_select on landing_chat_requests
  for select to anon, authenticated using (true);

notify pgrst, 'reload schema';
