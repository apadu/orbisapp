-- ── "Don't Say What I Say" board: matches won, per player ──
-- A won match is a game_results row with mode 'duel', completed and details.won = true
-- (saved by every player's own browser at the end of the match). Flagged rows don't count.
-- p_since: only matches since then (null = all time). At most 30 wins a day count, since results
-- are saved by the players' browsers and can't be fully checked by the server.
-- Run this once in the Supabase SQL editor.
-- Players an admin has hidden from every leaderboard (cheating, offensive names…)
create table if not exists public.hidden_players (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  hidden_at timestamptz not null default now()
);
alter table public.hidden_players enable row level security;   -- no policies: only the admin functions touch it

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
