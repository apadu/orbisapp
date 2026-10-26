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
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);

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
