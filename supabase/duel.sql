-- ── "Don't Say What I Say" board: matches won, per player ──
-- A won match is a game_results row with mode 'duel', completed and details.won = true
-- (saved by every player's own browser at the end of the match). Flagged rows don't count.
-- p_since: only matches since then (null = all time).
-- Run this once in the Supabase SQL editor.
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
  with m as (
    select r.user_id,
           count(*) filter (where coalesce((r.details->>'won')::boolean, false)) as wins,
           count(*) as matches
    from public.game_results r
    where r.mode = 'duel'
      and r.completed
      and r.flagged = false
      and (p_since is null or r.played_at >= p_since)
      and r.played_at <= now() + interval '10 minutes'
    group by r.user_id
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
