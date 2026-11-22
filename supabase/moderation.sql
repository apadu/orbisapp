-- ── Moderation: hide players from the leaderboards ──────────────────────────
-- Run this once in the Supabase SQL editor (safe to run again). It also updates the three
-- leaderboards (per game, weekly, "Don't Say What I Say") so hidden players don't appear.

create table if not exists public.hidden_players (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  hidden_at timestamptz not null default now()
);
alter table public.hidden_players enable row level security;   -- no policies: only the admin functions touch it

-- Admin: hide or show a player on every leaderboard (by username)
create or replace function public.admin_set_player_hidden(p_username text, p_hidden boolean)
returns void
language plpgsql
security definer set search_path = public
as $$
declare uid uuid;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  select id into uid from public.profiles where lower(username) = lower(trim(p_username));
  if uid is null then raise exception 'no_such_player'; end if;
  if p_hidden then
    insert into public.hidden_players (user_id) values (uid) on conflict do nothing;
  else
    delete from public.hidden_players where user_id = uid;
  end if;
end;
$$;
revoke all on function public.admin_set_player_hidden(text, boolean) from public, anon;
grant execute on function public.admin_set_player_hidden(text, boolean) to authenticated;

-- Admin: who is hidden
create or replace function public.admin_hidden_players()
returns table (username text, hidden_at timestamptz)
language plpgsql
stable
security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return query
    select p.username, h.hidden_at
    from public.hidden_players h join public.profiles p on p.id = h.user_id
    order by h.hidden_at desc;
end;
$$;
revoke all on function public.admin_hidden_players() from public, anon;
grant execute on function public.admin_hidden_players() to authenticated;

-- The leaderboards, now without hidden players
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
      and not exists (select 1 from public.hidden_players h where h.user_id = r.user_id)   -- hidden by an admin
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

create or replace function public.get_weekly_board(p_limit integer default 50)
returns table (
  rank       bigint,
  user_id    uuid,
  username   text,
  avatar_url text,
  points     bigint,
  games      bigint
)
language sql
stable
security definer set search_path = public
as $$
  with week as (
    select r.user_id,
           15 * count(*) filter (where r.completed) as points,
           count(*) as games
    from public.game_results r
    where r.played_at >= date_trunc('week', now() at time zone 'utc') at time zone 'utc'
      and r.played_at <= now() + interval '10 minutes'
      and r.total > 0
      and r.flagged = false
      and not exists (select 1 from public.hidden_players h where h.user_id = r.user_id)
      and coalesce((r.details->>'untimed')::boolean, false) = false
    group by r.user_id
  )
  select rank() over (order by w.points desc, w.games asc) as rank,
         w.user_id, p.username, p.avatar_url, w.points, w.games
  from week w
  join public.profiles p on p.id = w.user_id
  where w.points > 0
  order by rank
  limit least(p_limit, 100);
$$;

grant execute on function public.get_weekly_board(integer) to anon, authenticated;

create or replace function public.get_duel_board(p_since timestamptz default null, p_limit integer default 50)
returns table (
  rank       bigint,
  user_id    uuid,
  username   text,
  avatar_url text,
  wins       bigint,
  matches    bigint
)
language sql
stable
security definer set search_path = public
as $$
  with per_day as (
    select r.user_id,
           least(count(*) filter (where coalesce((r.details->>'won')::boolean, false)), 30) as wins,   -- at most 30 a day
           count(*) as matches
    from public.game_results r
    where r.mode = 'duel'
      and r.completed
      and r.flagged = false
      and not exists (select 1 from public.hidden_players h where h.user_id = r.user_id)
      and (p_since is null or r.played_at >= p_since)
      and r.played_at <= now() + interval '10 minutes'
    group by r.user_id, (r.played_at at time zone 'utc')::date
  ), m as (
    select user_id, sum(wins)::bigint as wins, sum(matches)::bigint as matches from per_day group by user_id
  )
  select rank() over (order by m.wins desc, m.matches asc) as rank,
         m.user_id, p.username, p.avatar_url, m.wins, m.matches
  from m
  join public.profiles p on p.id = m.user_id
  where m.wins > 0
  order by rank
  limit least(p_limit, 100);
$$;

grant execute on function public.get_duel_board(timestamptz, integer) to anon, authenticated;
