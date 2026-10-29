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
