-- ── Hardening before launch ──────────────────────────────────────────────────
-- Run this once in the Supabase SQL editor (safe to run again). It is also at the end of schema.sql.

-- 1. Avatars: only Google profile pictures.
--    A sign-up through the API could otherwise put any image URL in its metadata, and avatars
--    are shown to everyone on the leaderboards and in the comments.
create or replace function public.safe_avatar(u text)
returns text language sql immutable as $$
  select case when u ~ '^https://[a-z0-9-]+\.googleusercontent\.com/[^\s"''<>]*$' then u end
$$;

update public.profiles set avatar_url = public.safe_avatar(avatar_url)
where avatar_url is not null and avatar_url is distinct from public.safe_avatar(avatar_url);

alter table public.profiles drop constraint if exists profiles_avatar_google;
alter table public.profiles add constraint profiles_avatar_google
  check (avatar_url is null or avatar_url = public.safe_avatar(avatar_url));

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
  values (new.id, candidate, public.safe_avatar(new.raw_user_meta_data->>'avatar_url'));
  return new;
end;
$$;

-- 2. Flood guards on the tables anyone can write to (no account needed).
--    Extra rows beyond the limits are dropped silently, so a script can't fill the database.
create index if not exists page_views_session_idx on public.page_views (session_id, created_at desc);

create or replace function public.page_views_guard()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (select count(*) from public.page_views where created_at > now() - interval '1 minute') >= 1000
     or (select count(*) from public.page_views where session_id = new.session_id and created_at > now() - interval '1 minute') >= 30 then
    return null;
  end if;
  return new;
end;
$$;
drop trigger if exists page_views_guard on public.page_views;
create trigger page_views_guard before insert on public.page_views
  for each row execute function public.page_views_guard();

create or replace function public.client_errors_guard()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (select count(*) from public.client_errors where created_at > now() - interval '1 minute') >= 120 then
    return null;
  end if;
  return new;
end;
$$;
drop trigger if exists client_errors_guard on public.client_errors;
create trigger client_errors_guard before insert on public.client_errors
  for each row execute function public.client_errors_guard();

-- 3. Comments: editing is rate-limited too (posting already is: 3 a minute, 60 a day)
create or replace function public.quiz_comment_edit()
returns trigger
language plpgsql
as $$
begin
  if current_user in ('authenticated', 'anon') and not public.is_admin() then
    new.quiz := old.quiz; new.user_id := old.user_id; new.parent_id := old.parent_id;
    new.created_at := old.created_at; new.like_count := old.like_count; new.hidden := old.hidden;
    if new.body is distinct from old.body and old.edited_at is not null and old.edited_at > now() - interval '10 seconds' then
      raise exception 'rate_limited';
    end if;
  end if;
  if new.body is distinct from old.body then new.edited_at := now(); new.body := btrim(new.body); end if;
  return new;
end;
$$;
