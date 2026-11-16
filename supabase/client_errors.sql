-- ── Client error reports ────────────────────────────────────────────────────
-- Crashes and uncaught errors from players' browsers (see src/utils/errorReporter.js).
-- Anyone may INSERT (guests too), nobody may read through the API: you look at them
-- in the Supabase dashboard (Table Editor, or the client_errors_summary view below).
-- Run this once in the SQL Editor. It's also appended to schema.sql for fresh setups.

create table if not exists public.client_errors (
  id              bigint generated always as identity primary key,
  created_at      timestamptz not null default now(),
  user_id         uuid references auth.users(id) on delete set null,
  kind            text not null check (kind in ('render', 'error', 'promise', 'chunk')),
  message         text not null check (char_length(message) <= 500),
  stack           text check (char_length(stack) <= 4000),
  component_stack text check (char_length(component_stack) <= 4000),
  path            text check (char_length(path) <= 300),
  user_agent      text check (char_length(user_agent) <= 300),
  app_version     text check (char_length(app_version) <= 64)
);
create index if not exists client_errors_created_idx on public.client_errors (created_at desc);

alter table public.client_errors enable row level security;

drop policy if exists "anyone can report errors" on public.client_errors;
create policy "anyone can report errors" on public.client_errors
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
-- (no select/update/delete policies: reports are write-only from the app)

grant insert on public.client_errors to anon, authenticated;

-- Grouped view for the dashboard: what breaks most, where, and since when
create or replace view public.client_errors_summary
with (security_invoker = true) as
select
  message,
  kind,
  count(*)                      as hits,
  count(distinct user_id)       as signed_in_users,
  min(created_at)               as first_seen,
  max(created_at)               as last_seen,
  (array_agg(path order by created_at desc))[1]        as last_path,
  (array_agg(app_version order by created_at desc))[1] as last_version
from public.client_errors
where created_at > now() - interval '30 days'
group by message, kind
order by last_seen desc;

revoke all on public.client_errors_summary from anon, authenticated;
