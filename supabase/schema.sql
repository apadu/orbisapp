-- ═══════════════════════════════════════════════════════════════════════════
-- Orbis — Supabase schema
-- Run this once in: Supabase Dashboard → SQL Editor → New query → Run
-- Safe to re-run (idempotent).
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null check (char_length(username) between 3 and 24),
  avatar_url  text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are public"      on public.profiles;
drop policy if exists "users update own profile" on public.profiles;
create policy "profiles are public"      on public.profiles for select using (true);
-- Usernames are permanent: no update policy (profiles are only written by the signup trigger).

-- Auto-create a profile when a user signs up (Google or email)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base text;
  candidate text;
begin
  base := coalesce(
    new.raw_user_meta_data->>'username',
    split_part(coalesce(new.raw_user_meta_data->>'full_name', new.email), '@', 1),
    'explorer'
  );
  base := left(regexp_replace(lower(base), '[^a-z0-9_]', '', 'g'), 18);
  if char_length(base) < 3 then base := 'explorer'; end if;

  candidate := base;
  while exists (select 1 from public.profiles where username = candidate) loop
    candidate := base || floor(random() * 10000)::int;
  end loop;

  insert into public.profiles (id, username, avatar_url)
  values (new.id, candidate, new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Game results: one row per finished game session ─────────────────────────
create table if not exists public.game_results (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  client_id    text not null,              -- generated in the browser; dedupes guest-merge uploads
  mode         text not null,              -- e.g. 'flag', 'endonyms', 'name-all'
  score        integer not null default 0,
  correct      integer not null default 0,
  total        integer not null default 0,
  duration_ms  integer,
  completed    boolean not null default true,
  details      jsonb not null default '{}'::jsonb,  -- { answers: [{c:'France', ok:true}], ... }
  played_at    timestamptz not null default now(),
  unique (user_id, client_id)
);

create index if not exists game_results_user_idx  on public.game_results (user_id, played_at desc);
create index if not exists game_results_board_idx on public.game_results (mode, score desc);

alter table public.game_results enable row level security;

drop policy if exists "read own results"   on public.game_results;
drop policy if exists "insert own results" on public.game_results;
create policy "read own results"   on public.game_results for select using (auth.uid() = user_id);
create policy "insert own results" on public.game_results for insert with check (auth.uid() = user_id);

-- ── Fair play: flag implausible results so they never reach the leaderboards ──
-- Scores are sent from the browser, so a determined player could send anything.
-- Instead of rejecting (which would make the app retry forever), suspicious rows are
-- stored with flagged = true and simply ignored by get_leaderboard().
alter table public.game_results add column if not exists flagged boolean not null default false;

create or replace function public.check_game_result()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  max_score integer := case new.mode
    when 'capital-drop'   then 10000
    when 'landmark-drop'  then 10000
    when 'antipodes'      then 8000
    when 'distance'       then 8000
    when 'silhouette'     then 300
    when 'higher-lower'   then 1000
    when 'true-false'     then 300
    when 'country-wordle' then 6
    when 'time-zones'     then 10
    when 'line-up'        then 60
    else 100000
  end;
  recent integer;
begin
  new.flagged := false;
  if new.user_id is distinct from auth.uid() then
    raise exception 'not_your_result';
  end if;
  -- impossible numbers
  if new.correct < 0 or new.total < 0 or new.correct > new.total or new.total > 2000
     or new.score < 0 or new.score > max_score then
    new.flagged := true;
  end if;
  -- inhumanly fast: more than ~4 correct answers per second
  if new.duration_ms is not null and new.correct >= 5 and new.duration_ms < new.correct * 250 then
    new.flagged := true;
  end if;
  -- from the future
  if new.played_at > now() + interval '10 minutes' then
    new.flagged := true;
  end if;
  -- flood: more than 20 freshly played games in one minute (old guest games merged at sign-in don't count)
  if new.played_at > now() - interval '1 minute' then
    select count(*) into recent from public.game_results
    where user_id = new.user_id and played_at > now() - interval '1 minute';
    if recent >= 20 then new.flagged := true; end if;
  end if;
  return new;
end;
$$;

drop trigger if exists game_results_check on public.game_results;
create trigger game_results_check
  before insert on public.game_results
  for each row execute function public.check_game_result();

-- ── Leaderboard: best score per user for a mode, optionally since a date ────
create or replace function public.get_leaderboard(
  p_mode  text,
  p_since timestamptz default null,
  p_limit integer default 50
)
returns table (
  rank        bigint,
  user_id     uuid,
  username    text,
  avatar_url  text,
  score       integer,
  correct     integer,
  total       integer,
  duration_ms integer,
  played_at   timestamptz
)
language sql
stable
security definer set search_path = public
as $$
  with best as (
    select distinct on (r.user_id)
      r.user_id, r.score, r.correct, r.total, r.duration_ms, r.played_at
    from public.game_results r
    where r.mode = p_mode
      and r.total > 0
      and coalesce((r.details->>'untimed')::boolean, false) = false   -- untimed games don't rank
      and r.flagged = false                                             -- implausible results don't rank
      and (p_since is null or r.played_at >= p_since)
    order by r.user_id, r.score desc, r.duration_ms asc nulls last, r.played_at asc
  )
  select
    rank() over (order by b.score desc, b.duration_ms asc nulls last) as rank,
    b.user_id, p.username, p.avatar_url,
    b.score, b.correct, b.total, b.duration_ms, b.played_at
  from best b
  join public.profiles p on p.id = b.user_id
  order by rank
  limit least(p_limit, 100);
$$;

grant execute on function public.get_leaderboard(text, timestamptz, integer) to anon, authenticated;

-- ── Sign in with username ───────────────────────────────────────────────────
-- Supabase Auth only knows emails. This function turns a username into the account's
-- email — but ONLY when the password is correct, so nobody can look up other people's
-- emails. Failed attempts are throttled (8 per 15 minutes per username) because calls
-- to this function don't go through Supabase Auth's own rate limiting.
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.login_attempts (
  login        text primary key,
  fails        integer not null default 0,
  window_start timestamptz not null default now()
);
alter table public.login_attempts enable row level security;   -- no policies: not readable by anyone

create or replace function public.email_for_login(p_login text, p_password text)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  k       text := lower(trim(p_login));
  v_email text;
  v_hash  text;
  att     public.login_attempts%rowtype;
begin
  select * into att from public.login_attempts where login = k;
  if found and att.window_start > now() - interval '15 minutes' and att.fails >= 8 then
    raise exception 'too_many_attempts';
  end if;

  select u.email, u.encrypted_password into v_email, v_hash
  from public.profiles p
  join auth.users u on u.id = p.id
  where lower(p.username) = k
  limit 1;

  if v_hash is not null and extensions.crypt(p_password, v_hash) = v_hash then
    delete from public.login_attempts where login = k;
    return v_email;
  end if;

  insert into public.login_attempts (login, fails, window_start) values (k, 1, now())
  on conflict (login) do update set
    fails        = case when public.login_attempts.window_start < now() - interval '15 minutes' then 1 else public.login_attempts.fails + 1 end,
    window_start = case when public.login_attempts.window_start < now() - interval '15 minutes' then now() else public.login_attempts.window_start end;
  return null;
end;
$$;

revoke all on function public.email_for_login(text, text) from public;
grant execute on function public.email_for_login(text, text) to anon, authenticated;


-- ── Delete my account ───────────────────────────────────────────────────────
-- Deletes the signed-in user. profiles and game_results go with it (ON DELETE CASCADE).
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid   uuid := auth.uid();
  uname text;
begin
  if uid is null then
    raise exception 'not_signed_in';
  end if;
  select lower(username) into uname from public.profiles where id = uid;
  delete from public.login_attempts where login = uname;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;


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
-- ── Quiz comments ───────────────────────────────────────────────────────────
-- Comments under each quiz: one level of replies, likes, reports, admin moderation.
-- Run once in the SQL Editor (after admin.sql: it uses is_admin()). Also appended to schema.sql.
--
-- Anyone may read (except hidden comments); only signed-in players write. A player edits or
-- deletes only their own comments; deleting the account deletes them (ON DELETE CASCADE).

create table if not exists public.quiz_comments (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  edited_at   timestamptz,
  quiz        text not null check (quiz ~ '^[a-z0-9-]{1,60}$'),
  user_id     uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  parent_id   bigint references public.quiz_comments(id) on delete cascade,
  body        text not null check (char_length(btrim(body)) between 1 and 500),
  like_count  integer not null default 0,
  hidden      boolean not null default false
);
create index if not exists quiz_comments_quiz_idx on public.quiz_comments (quiz, created_at desc);
create index if not exists quiz_comments_parent_idx on public.quiz_comments (parent_id);
create index if not exists quiz_comments_user_idx on public.quiz_comments (user_id, created_at desc);

create table if not exists public.comment_likes (
  comment_id  bigint not null references public.quiz_comments(id) on delete cascade,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create table if not exists public.comment_reports (
  comment_id  bigint not null references public.quiz_comments(id) on delete cascade,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (comment_id, user_id)
);

-- Replies: only to a top-level comment of the same quiz. Rate limit: 3 a minute, 60 a day.
create or replace function public.quiz_comment_check()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare p public.quiz_comments;
begin
  if new.parent_id is not null then
    select * into p from public.quiz_comments where id = new.parent_id;
    if p.id is null or p.parent_id is not null or p.quiz <> new.quiz then
      raise exception 'bad_parent';
    end if;
  end if;
  if (select count(*) from public.quiz_comments where user_id = new.user_id and created_at > now() - interval '1 minute') >= 3
     or (select count(*) from public.quiz_comments where user_id = new.user_id and created_at > now() - interval '1 day') >= 60 then
    raise exception 'rate_limited';
  end if;
  new.body := btrim(new.body);
  new.like_count := 0;
  new.hidden := false;
  return new;
end;
$$;
drop trigger if exists quiz_comment_check on public.quiz_comments;
create trigger quiz_comment_check before insert on public.quiz_comments
  for each row execute function public.quiz_comment_check();

-- Editing: only the text changes, and it's marked as edited. Direct API updates (role
-- authenticated) can't touch anything else; our own security-definer functions (like counts,
-- admin hide) run as the owner and may.
create or replace function public.quiz_comment_edit()
returns trigger
language plpgsql
as $$
begin
  if current_user in ('authenticated', 'anon') and not public.is_admin() then
    new.quiz := old.quiz; new.user_id := old.user_id; new.parent_id := old.parent_id;
    new.created_at := old.created_at; new.like_count := old.like_count; new.hidden := old.hidden;
  end if;
  if new.body is distinct from old.body then new.edited_at := now(); new.body := btrim(new.body); end if;
  return new;
end;
$$;
drop trigger if exists quiz_comment_edit on public.quiz_comments;
create trigger quiz_comment_edit before update on public.quiz_comments
  for each row execute function public.quiz_comment_edit();

-- Keep like_count in step with comment_likes
create or replace function public.comment_like_count()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.quiz_comments set like_count = like_count + 1 where id = new.comment_id;
  else
    update public.quiz_comments set like_count = greatest(like_count - 1, 0) where id = old.comment_id;
  end if;
  return null;
end;
$$;
drop trigger if exists comment_like_count on public.comment_likes;
create trigger comment_like_count after insert or delete on public.comment_likes
  for each row execute function public.comment_like_count();

-- ── Row level security ──────────────────────────────────────────────────────
alter table public.quiz_comments   enable row level security;
alter table public.comment_likes   enable row level security;
alter table public.comment_reports enable row level security;

drop policy if exists "comments are public"          on public.quiz_comments;
drop policy if exists "players write own comments"   on public.quiz_comments;
drop policy if exists "players edit own comments"    on public.quiz_comments;
drop policy if exists "players delete own comments"  on public.quiz_comments;
create policy "comments are public" on public.quiz_comments
  for select using (not hidden or user_id = auth.uid() or public.is_admin());
create policy "players write own comments" on public.quiz_comments
  for insert to authenticated with check (user_id = auth.uid());
create policy "players edit own comments" on public.quiz_comments
  for update to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "players delete own comments" on public.quiz_comments
  for delete to authenticated using (user_id = auth.uid() or public.is_admin());
grant select on public.quiz_comments to anon, authenticated;
grant insert (quiz, parent_id, body) on public.quiz_comments to authenticated;
grant update (body, hidden) on public.quiz_comments to authenticated;   -- hidden: admins only (trigger)
grant delete on public.quiz_comments to authenticated;

drop policy if exists "likes are public"      on public.comment_likes;
drop policy if exists "players like"          on public.comment_likes;
drop policy if exists "players unlike"        on public.comment_likes;
create policy "likes are public" on public.comment_likes for select using (true);
create policy "players like"     on public.comment_likes for insert to authenticated with check (user_id = auth.uid());
create policy "players unlike"   on public.comment_likes for delete to authenticated using (user_id = auth.uid());
grant select on public.comment_likes to anon, authenticated;
grant insert (comment_id), delete on public.comment_likes to authenticated;

drop policy if exists "players report" on public.comment_reports;
create policy "players report" on public.comment_reports for insert to authenticated with check (user_id = auth.uid());
grant insert (comment_id) on public.comment_reports to authenticated;   -- nobody reads reports through the API

-- ── Admin: moderation list and hide / show ──────────────────────────────────
-- p_filter: 'reported' (default) · 'latest' · 'hidden'
create or replace function public.admin_comments(p_filter text default 'reported', p_limit integer default 100)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return coalesce((
    select jsonb_agg(row_to_json(x) order by x.reports desc, x.created_at desc)
    from (
      select c.id, c.created_at, c.quiz, c.body, c.hidden, c.like_count, c.parent_id,
             p.username, (select count(*) from public.comment_reports r where r.comment_id = c.id) as reports
      from public.quiz_comments c join public.profiles p on p.id = c.user_id
      where case coalesce(p_filter, 'reported')
              when 'hidden' then c.hidden
              when 'latest' then true
              else exists (select 1 from public.comment_reports r where r.comment_id = c.id) and not c.hidden
            end
      order by c.created_at desc
      limit greatest(1, least(coalesce(p_limit, 100), 500))
    ) x
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.admin_comments(text, integer) from public, anon;
grant execute on function public.admin_comments(text, integer) to authenticated;

create or replace function public.admin_set_comment_hidden(p_id bigint, p_hidden boolean)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  update public.quiz_comments set hidden = p_hidden where id = p_id;
  if not p_hidden then delete from public.comment_reports where comment_id = p_id; end if;  -- cleared
end;
$$;
revoke all on function public.admin_set_comment_hidden(bigint, boolean) from public, anon;
grant execute on function public.admin_set_comment_hidden(bigint, boolean) to authenticated;
