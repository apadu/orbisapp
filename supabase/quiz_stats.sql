-- ── Quiz stats & ratings (end-of-quiz panel) ──────────────────────────────
-- Run once in Supabase → SQL Editor (also appended to schema.sql).
--
-- quiz_plays:   one row per FIRST attempt at a quiz, from anyone (guests too), so the
--               results screen can say "that's better than 64% of players". Only the
--               numbers are stored — no user, no IP.
-- quiz_ratings: 1–5 stars per signed-in player per quiz.
-- quiz_stats(): everything the results panel needs in one call.

create table if not exists public.quiz_plays (
  id         bigint generated always as identity primary key,
  mode       text not null check (length(mode) between 1 and 60),
  variant    text not null default '' check (length(variant) <= 60),   -- region / size, so like is compared with like
  correct    integer not null,
  total      integer not null,
  created_at timestamptz not null default now(),
  check (total between 1 and 2000),
  check (correct between 0 and total)
);
create index if not exists quiz_plays_mode_idx on public.quiz_plays (mode, variant);

alter table public.quiz_plays enable row level security;
drop policy if exists "anyone records a play" on public.quiz_plays;
create policy "anyone records a play" on public.quiz_plays
  for insert to anon, authenticated with check (true);
-- no select policy: rows are only read through quiz_stats()

-- Flood guard: at most 600 plays per quiz per minute across everyone
create or replace function public.quiz_plays_guard()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (select count(*) from public.quiz_plays
      where mode = new.mode and created_at > now() - interval '1 minute') >= 600 then
    raise exception 'rate_limited';
  end if;
  return new;
end;
$$;
drop trigger if exists quiz_plays_guard on public.quiz_plays;
create trigger quiz_plays_guard before insert on public.quiz_plays
  for each row execute function public.quiz_plays_guard();

create table if not exists public.quiz_ratings (
  quiz       text not null check (length(quiz) between 1 and 60),
  user_id    uuid not null references auth.users(id) on delete cascade default auth.uid(),
  stars      smallint not null check (stars between 1 and 5),
  updated_at timestamptz not null default now(),
  primary key (quiz, user_id)
);
alter table public.quiz_ratings enable row level security;
drop policy if exists "players read own ratings" on public.quiz_ratings;
drop policy if exists "players rate"             on public.quiz_ratings;
drop policy if exists "players change rating"    on public.quiz_ratings;
drop policy if exists "players remove rating"    on public.quiz_ratings;
create policy "players read own ratings" on public.quiz_ratings for select to authenticated using (user_id = auth.uid());
create policy "players rate"             on public.quiz_ratings for insert to authenticated with check (user_id = auth.uid());
create policy "players change rating"    on public.quiz_ratings for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "players remove rating"    on public.quiz_ratings for delete to authenticated using (user_id = auth.uid());

-- Results panel data. p_correct / p_total: the score just made (compared as a share, so a
-- 20-flag and a 30-flag round can share a variant without being unfair).
create or replace function public.quiz_stats(p_mode text, p_variant text, p_correct integer, p_total integer)
returns json
language sql
stable
security definer set search_path = public
as $$
  select json_build_object(
    'plays',   (select count(*) from public.quiz_plays where mode = p_mode and variant = p_variant),
    'below',   (select count(*) from public.quiz_plays where mode = p_mode and variant = p_variant
                  and correct::numeric / total < p_correct::numeric / greatest(p_total, 1)),
    'avg_pct', (select round(avg(correct::numeric * 100 / total)) from public.quiz_plays where mode = p_mode and variant = p_variant),
    'rating',  (select round(avg(stars)::numeric, 1) from public.quiz_ratings where quiz = p_mode),
    'ratings', (select count(*) from public.quiz_ratings where quiz = p_mode),
    'mine',    (select stars from public.quiz_ratings where quiz = p_mode and user_id = auth.uid())
  );
$$;
grant execute on function public.quiz_stats(text, text, integer, integer) to anon, authenticated;

-- ── Quiz Hub sorting: rating + popularity of every quiz in one call ────────
create or replace function public.quiz_overview()
returns table (quiz text, rating numeric, ratings bigint, plays_week bigint, plays bigint)
language sql
stable
security definer set search_path = public
as $$
  with r as (select q.quiz, avg(q.stars) as avg_stars, count(*) as n from public.quiz_ratings q group by q.quiz),
       p as (select q.mode, count(*) filter (where q.created_at > now() - interval '7 days') as wk, count(*) as n
             from public.quiz_plays q where q.mode <> 'daily-quiz' group by q.mode)
  select coalesce(r.quiz, p.mode), round(r.avg_stars, 2), coalesce(r.n, 0), coalesce(p.wk, 0), coalesce(p.n, 0)
  from r full join p on p.mode = r.quiz;
$$;
grant execute on function public.quiz_overview() to anon, authenticated;

-- ── Admin: how each quiz is rated (stars spread, plays, comments) ─────────
create or replace function public.admin_quiz_ratings()
returns jsonb
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return coalesce((
    select jsonb_agg(row_to_json(x) order by x.avg_stars asc nulls last, x.ratings desc)
    from (
      select q.quiz,
             count(*)                                   as ratings,
             round(avg(q.stars), 2)                     as avg_stars,
             count(*) filter (where q.stars = 1)        as s1,
             count(*) filter (where q.stars = 2)        as s2,
             count(*) filter (where q.stars = 3)        as s3,
             count(*) filter (where q.stars = 4)        as s4,
             count(*) filter (where q.stars = 5)        as s5,
             max(q.updated_at)                          as last_rated,
             (select count(*) from public.quiz_plays p where p.mode = q.quiz)                    as plays,
             (select round(avg(p.correct::numeric * 100 / p.total)) from public.quiz_plays p where p.mode = q.quiz) as avg_pct,
             (select count(*) from public.quiz_comments c where c.quiz = q.quiz and not c.hidden) as comments
      from public.quiz_ratings q
      group by q.quiz
    ) x
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.admin_quiz_ratings() from public, anon;
grant execute on function public.admin_quiz_ratings() to authenticated;
