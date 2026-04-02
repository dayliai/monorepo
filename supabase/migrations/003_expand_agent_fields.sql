-- Expand community_submissions with richer solution data + review status
alter table community_submissions
  add column status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  add column website_url text,
  add column pricing text,
  add column contact_name text,
  add column contact_email text,
  add column contact_phone text,
  add column photos text[] default '{}',
  add column tags text[] default '{}';

-- Expand community_requests with richer problem data + review status
alter table community_requests
  add column status text not null default 'pending' check (status in ('pending', 'reviewed', 'matched')),
  add column condition_context text,
  add column daily_impact text,
  add column environment text,
  add column contact_name text,
  add column contact_email text,
  add column contact_phone text,
  add column photos text[] default '{}',
  add column urgency text;

-- Create storage bucket for agent uploads (photos)
insert into storage.buckets (id, name, public)
values ('agent-uploads', 'agent-uploads', true)
on conflict (id) do nothing;

-- Allow public uploads and reads for agent-uploads bucket
create policy "Anyone can upload agent files"
  on storage.objects for insert
  with check (bucket_id = 'agent-uploads');

create policy "Anyone can read agent files"
  on storage.objects for select
  using (bucket_id = 'agent-uploads');
