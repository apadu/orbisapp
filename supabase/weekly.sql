-- ── Weekly board: everyone's points across all games, reset every Monday 00:00 UTC ──
-- Points: 15 per finished game, the same as the XP in the app (answers themselves earn nothing).
-- Same rules as the other boards: untimed and flagged games don't count.
-- Run this once in the Supabase SQL editor (it is also at the end of schema.sql).
-- Players an admin has hidden from every leaderboard (cheating, offensive names…)
create table if not exists public.hidden_players (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  hidden_at timestamptz not null default now()
);
alter table public.hidden_players enable row level security;   -- no policies: only the admin functions touch it

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
