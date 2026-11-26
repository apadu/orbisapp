-- GeoFeverr — passport stamps (badges for mastering a whole challenge).
--
-- Stamps are awarded HERE, by the database, when a game result arrives, never by the browser:
-- they're meant to be shown to other players, so a value typed into the browser can't grant one.
-- Each stamp has 3 inks: 1 black · 2 blue · 3 red with gold foil.
-- Keep the thresholds in sync with src/utils/stamps.js (that file only displays them).
--
-- Run once in the Supabase SQL editor (after schema.sql). Safe to run again: it also re-checks
-- every result already saved, so players get the stamps they earned before.

-- 1. Who has which stamp ────────────────────────────────────────────────────
create table if not exists public.player_stamps (
  user_id    uuid not null references auth.users(id) on delete cascade,
  stamp      text not null,
  tier       smallint not null check (tier between 1 and 3),
  value      integer not null,            -- best time in ms (Name All) or the count (days, wins)
  earned_at  timestamptz not null,        -- when the current ink was earned
  primary key (user_id, stamp)
);
alter table public.player_stamps enable row level security;
drop policy if exists "stamps are public" on public.player_stamps;
create policy "stamps are public" on public.player_stamps for select using (true);
-- no insert / update / delete policies: only the functions below write here

-- the stamp a premium player shows next to their name (display comes with premium)
alter table public.profiles add column if not exists featured_stamp text;
alter table public.profiles add column if not exists premium boolean not null default false;

-- 2. Give (or upgrade) a stamp: the ink only goes up; the best value is kept ──────────
create or replace function public.give_stamp(p_user uuid, p_stamp text, p_tier smallint, p_value integer, p_at timestamptz, p_lower_is_better boolean)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.player_stamps as s (user_id, stamp, tier, value, earned_at)
  values (p_user, p_stamp, p_tier, p_value, least(p_at, now()))
  on conflict (user_id, stamp) do update set
    earned_at = case when excluded.tier > s.tier then excluded.earned_at else s.earned_at end,
    tier      = greatest(s.tier, excluded.tier),
    value     = case when p_lower_is_better then least(s.value, excluded.value) else greatest(s.value, excluded.value) end;
end;
$$;
revoke all on function public.give_stamp(uuid, text, smallint, integer, timestamptz, boolean) from public, anon, authenticated;

-- 3. Name All: every item found ──────────────────────────────────────────────
--    items = how many there are today; blue / red = time limits for the better inks
create or replace function public.name_all_rule(p_mode text, out items integer, out blue_ms integer, out red_ms integer)
language sql immutable as $$
  select r.items, r.blue_ms, r.red_ms from (values
    ('name-all',             196, 15 * 60000,  8 * 60000),
    ('name-all-caps',        196, 15 * 60000,  8 * 60000),
    ('name-all-currencies',  141, 15 * 60000,  8 * 60000),
    ('name-all-languages',    89, 10 * 60000,  5 * 60000),
    ('mountains',             40,  8 * 60000,  4 * 60000),
    ('name-all-seas',         67, 10 * 60000,  5 * 60000),
    ('name-all-rivers',       68, 10 * 60000,  5 * 60000)
  ) as r(mode, items, blue_ms, red_ms) where r.mode = p_mode
$$;

create or replace function public.check_name_all_stamp(r public.game_results)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  rule   record;
  found  integer;
  tier   smallint;
begin
  select * into rule from public.name_all_rule(r.mode);
  if rule.items is null then return; end if;
  if r.flagged or not r.completed or r.duration_ms is null then return; end if;
  if r.total < rule.items or r.correct <> r.total then return; end if;
  -- the answers themselves: that many different items, all right
  select count(distinct coalesce(a->>'c', a->>'k')) into found
  from jsonb_array_elements(coalesce(r.details->'answers', '[]'::jsonb)) a
  where (a->>'ok')::boolean;
  if found < r.total then return; end if;
  -- a human needs at least ~0.6 s per item
  if r.duration_ms < r.total * 600 then return; end if;

  tier := case when r.duration_ms <= rule.red_ms then 3 when r.duration_ms <= rule.blue_ms then 2 else 1 end;
  perform public.give_stamp(r.user_id, r.mode, tier, r.duration_ms, r.played_at, true);
end;
$$;

-- 4. Daily Fever streak: 30 · 100 · 365 days in a row ─────────────────────────────
create or replace function public.check_daily_stamp(p_user uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  best integer;
  tier smallint;
begin
  with days as (
    select distinct (played_at at time zone 'utc')::date as d
    from public.game_results
    where user_id = p_user and mode = 'daily-quiz' and completed and not flagged and played_at <= now() + interval '10 minutes'
  ), runs as (
    select d - (row_number() over (order by d))::integer as grp from days
  )
  select coalesce(max(n), 0) into best from (select count(*) as n from runs group by grp) x;

  tier := case when best >= 365 then 3 when best >= 100 then 2 when best >= 30 then 1 else 0 end;
  if tier > 0 then perform public.give_stamp(p_user, 'daily-streak', tier, best, now(), false); end if;
end;
$$;

-- 5. Don't Say What I Say: 25 · 100 · 300 wins (at most 30 a day count, as on the board) ─────
create or replace function public.check_duel_stamp(p_user uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  wins integer;
  tier smallint;
begin
  select coalesce(sum(w), 0) into wins from (
    select least(count(*) filter (where coalesce((details->>'won')::boolean, false)), 30) as w
    from public.game_results
    where user_id = p_user and mode = 'duel' and completed and not flagged and played_at <= now() + interval '10 minutes'
    group by (played_at at time zone 'utc')::date
  ) x;

  tier := case when wins >= 300 then 3 when wins >= 100 then 2 when wins >= 25 then 1 else 0 end;
  if tier > 0 then perform public.give_stamp(p_user, 'duel-wins', tier, wins, now(), false); end if;
end;
$$;

-- 6. Check every new result ──────────────────────────────────────────────────
create or replace function public.award_stamps()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.flagged then return null; end if;
  if new.mode = 'daily-quiz' then perform public.check_daily_stamp(new.user_id);
  elsif new.mode = 'duel' then perform public.check_duel_stamp(new.user_id);
  else perform public.check_name_all_stamp(new);
  end if;
  return null;
exception when others then
  return null;   -- a stamp problem must never lose the game result itself
end;
$$;

drop trigger if exists game_results_stamps on public.game_results;
create trigger game_results_stamps
  after insert on public.game_results
  for each row execute function public.award_stamps();

revoke all on function public.check_name_all_stamp(public.game_results) from public, anon, authenticated;
revoke all on function public.check_daily_stamp(uuid) from public, anon, authenticated;
revoke all on function public.check_duel_stamp(uuid) from public, anon, authenticated;

-- 7. Pick the stamp shown next to your name (premium) ──────────────────────────────
create or replace function public.set_featured_stamp(p_stamp text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if p_stamp is not null then
    if not (select premium from public.profiles where id = auth.uid()) then raise exception 'premium_only'; end if;
    if not exists (select 1 from public.player_stamps where user_id = auth.uid() and stamp = p_stamp) then raise exception 'no_such_stamp'; end if;
  end if;
  update public.profiles set featured_stamp = p_stamp where id = auth.uid();
end;
$$;
revoke all on function public.set_featured_stamp(text) from public, anon;
grant execute on function public.set_featured_stamp(text) to authenticated;

-- 8. Results saved before this script: award what was already earned ─────────────────
do $$
declare r public.game_results; u uuid;
begin
  for r in select * from public.game_results g
           where g.mode in ('name-all', 'name-all-caps', 'name-all-currencies', 'name-all-languages', 'mountains', 'name-all-seas', 'name-all-rivers')
             and g.completed and not g.flagged and g.correct = g.total
  loop
    perform public.check_name_all_stamp(r);
  end loop;
  for u in select distinct user_id from public.game_results where mode = 'daily-quiz' loop
    perform public.check_daily_stamp(u);
  end loop;
  for u in select distinct user_id from public.game_results where mode = 'duel' loop
    perform public.check_duel_stamp(u);
  end loop;
end $$;
