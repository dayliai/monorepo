-- Landing chat capture tables (#13) were unwritable from the browser:
-- the RLS insert policy existed but anon writes still returned 42501. To unblock
-- capture without exposing chats publicly, switch from RLS-with-policies to
-- privilege-based gating: revoke read/delete from anon+authenticated, keep
-- insert/update, and turn RLS off so the grants are the only gate. Reads still
-- happen exclusively via the service-role key from /admin endpoints.

revoke select, delete on landing_chat_submissions from anon, authenticated;
revoke select, delete on landing_chat_requests    from anon, authenticated;

grant insert, update on landing_chat_submissions to anon, authenticated;
grant insert, update on landing_chat_requests    to anon, authenticated;

alter table landing_chat_submissions disable row level security;
alter table landing_chat_requests    disable row level security;
