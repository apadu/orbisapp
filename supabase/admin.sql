-- ── Admin dashboard (/admin) ────────────────────────────────────────────────
-- Run once in the SQL Editor (also appended to schema.sql). Then make yourself admin:
--
--   insert into public.admins (user_id)
--   select id from public.profiles where username = 'YOUR_USERNAME';
--
-- Everything the dashboard shows comes from the functions below. Each one checks
-- is_admin() first, so other players get an error, never data.

create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;   -- no policies: invisible through the API

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

grant execute on function public.is_admin() to authenticated;

-- ── Page views: Orbis's own anonymous counter ───────────────────────────────
-- No cookies, no IP, no fingerprint: a random id per browser tab session
-- (sessionStorage) so "visits" can be told apart from "pages viewed".
create table if not exists public.page_views (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  session_id    text not null check (char_length(session_id) <= 40),
  path          text not null check (char_length(path) <= 200),
  referrer_host text check (char_length(referrer_host) <= 120),
  device        text check (device in ('mobile', 'tablet', 'desktop')),
  lang          text check (char_length(lang) <= 5),
  user_id       uuid references auth.users(id) on delete set null
);
create index if not exists page_views_created_idx on public.page_views (created_at desc);

alter table public.page_views enable row level security;
drop policy if exists "anyone can record a page view" on public.page_views;
create policy "anyone can record a page view" on public.page_views
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
grant insert on public.page_views to anon, authenticated;

-- Errors can be marked as dealt with from the dashboard
alter table public.client_errors add column if not exists resolved_at timestamptz;

-- ── Everything for the dashboard in one call ────────────────────────────────
-- p_days: the period shown (1–365). Also prunes page views older than 180 days.
create or replace function public.admin_overview(p_days integer default 7)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  since timestamptz;
  today date := (now() at time zone 'Europe/Bucharest')::date;
  days  integer := greatest(1, least(coalesce(p_days, 7), 365));
  out   jsonb;
begin
  if not public.is_admin() then
    raise exception 'not_admin';
  end if;
  -- start of the first day of the period, Bucharest midnight
  since := ((today - (days - 1))::timestamp) at time zone 'Europe/Bucharest';

  delete from public.page_views where created_at < now() - interval '180 days';

  select jsonb_build_object(
    'since', since,
    'days',  days,

    'totals', jsonb_build_object(
      'users',          (select count(*) from public.profiles),
      'new_users',      (select count(*) from public.profiles where created_at >= since),
      'games',          (select count(*) from public.game_results where played_at >= since),
      'games_all_time', (select count(*) from public.game_results),
      'active_players', (select count(distinct user_id) from public.game_results where played_at >= since),
      'views',          (select count(*) from public.page_views where created_at >= since),
      'visits',         (select count(distinct session_id) from public.page_views where created_at >= since),
      'errors',         (select count(*) from public.client_errors where created_at >= since),
      'open_errors',    (select count(distinct message) from public.client_errors where resolved_at is null and created_at >= now() - interval '30 days'),
      'flagged',        (select count(*) from public.game_results where flagged and played_at >= since)
    ),

    -- one row per day (Bucharest calendar days), zeros included
    'daily', (
      with d as (
        select gs::date as day
        from generate_series((today - (days - 1))::timestamp, today::timestamp, interval '1 day') gs
      ),
      pv as (select (created_at at time zone 'Europe/Bucharest')::date as day, count(*) as views, count(distinct session_id) as visits
             from public.page_views where created_at >= since group by 1),
      gr as (select (played_at at time zone 'Europe/Bucharest')::date as day, count(*) as games
             from public.game_results where played_at >= since group by 1),
      su as (select (created_at at time zone 'Europe/Bucharest')::date as day, count(*) as signups
             from public.profiles where created_at >= since group by 1),
      er as (select (created_at at time zone 'Europe/Bucharest')::date as day, count(*) as errors
             from public.client_errors where created_at >= since group by 1)
      select coalesce(jsonb_agg(jsonb_build_object(
        'day', to_char(d.day, 'YYYY-MM-DD'),
        'views',   coalesce(pv.views, 0),
        'visits',  coalesce(pv.visits, 0),
        'games',   coalesce(gr.games, 0),
        'signups', coalesce(su.signups, 0),
        'errors',  coalesce(er.errors, 0)
      ) order by d.day), '[]'::jsonb)
      from d
      left join pv on pv.day = d.day
      left join gr on gr.day = d.day
      left join su on su.day = d.day
      left join er on er.day = d.day
    ),

    'top_pages', (
      select coalesce(jsonb_agg(t order by t.views desc), '[]'::jsonb) from (
        select path, count(*) as views, count(distinct session_id) as visits
        from public.page_views where created_at >= since
        group by path order by count(*) desc limit 20
      ) t
    ),

    'top_games', (
      select coalesce(jsonb_agg(t order by t.plays desc), '[]'::jsonb) from (
        select mode, count(*) as plays, count(distinct user_id) as players,
               round(avg(case when total > 0 then correct::numeric / total end) * 100) as avg_accuracy
        from public.game_results where played_at >= since
        group by mode order by count(*) desc limit 25
      ) t
    ),

    'referrers', (
      select coalesce(jsonb_agg(t order by t.visits desc), '[]'::jsonb) from (
        select coalesce(referrer_host, '(direct)') as host, count(distinct session_id) as visits
        from public.page_views where created_at >= since
        group by 1 order by 2 desc limit 10
      ) t
    ),

    'devices', (
      select coalesce(jsonb_agg(t order by t.visits desc), '[]'::jsonb) from (
        select coalesce(device, 'unknown') as device, count(distinct session_id) as visits
        from public.page_views where created_at >= since group by 1
      ) t
    ),

    'langs', (
      select coalesce(jsonb_agg(t order by t.visits desc), '[]'::jsonb) from (
        select coalesce(lang, '?') as lang, count(distinct session_id) as visits
        from public.page_views where created_at >= since group by 1
      ) t
    ),

    'users', (
      select coalesce(jsonb_agg(t order by t.created_at desc), '[]'::jsonb) from (
        select p.username, p.created_at, u.email,
               u.last_sign_in_at,
               (u.raw_app_meta_data->>'provider') as provider,
               (select count(*) from public.game_results g where g.user_id = p.id) as games,
               (select max(played_at) from public.game_results g where g.user_id = p.id) as last_played
        from public.profiles p join auth.users u on u.id = p.id
        order by p.created_at desc limit 50
      ) t
    ),

    'top_players', (
      select coalesce(jsonb_agg(t order by t.games desc), '[]'::jsonb) from (
        select p.username, count(*) as games, max(g.played_at) as last_played
        from public.game_results g join public.profiles p on p.id = g.user_id
        where g.played_at >= since
        group by p.username order by count(*) desc limit 10
      ) t
    ),

    'errors', (
      select coalesce(jsonb_agg(t order by t.last_seen desc), '[]'::jsonb) from (
        select message, kind, count(*) as hits,
               count(distinct coalesce(user_id::text, user_agent)) as people,
               min(created_at) as first_seen, max(created_at) as last_seen,
               (array_agg(path order by created_at desc))[1]            as last_path,
               (array_agg(app_version order by created_at desc))[1]     as last_version,
               (array_agg(user_agent order by created_at desc))[1]      as last_agent,
               (array_agg(stack order by created_at desc))[1]           as stack,
               (array_agg(component_stack order by created_at desc))[1] as component_stack
        from public.client_errors
        where resolved_at is null and created_at >= now() - interval '30 days'
        group by message, kind order by max(created_at) desc limit 50
      ) t
    ),

    'flagged_results', (
      select coalesce(jsonb_agg(t order by t.played_at desc), '[]'::jsonb) from (
        select p.username, g.mode, g.score, g.correct, g.total, g.duration_ms, g.played_at
        from public.game_results g join public.profiles p on p.id = g.user_id
        where g.flagged order by g.played_at desc limit 20
      ) t
    )
  ) into out;

  return out;
end;
$$;

revoke all on function public.admin_overview(integer) from public, anon;
grant execute on function public.admin_overview(integer) to authenticated;

-- Mark every report of one error as resolved (it comes back if it happens again)
create or replace function public.admin_resolve_error(p_message text)
returns integer
language plpgsql
security definer set search_path = public
as $$
declare n integer;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  update public.client_errors set resolved_at = now()
  where message = p_message and resolved_at is null;
  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function public.admin_resolve_error(text) from public, anon;
grant execute on function public.admin_resolve_error(text) to authenticated;
