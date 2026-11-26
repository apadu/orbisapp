-- GeoFeverr — usernames keep the capital letters people type ("Alex" stays "Alex").
-- Signing in and the "is this name taken?" check stay case-insensitive.
-- Run once in the Supabase SQL editor, after schema.sql and hardening.sql. Safe to run again.

-- 1. Names are unique regardless of case: "Alex" and "alex" can't both exist.
create unique index if not exists profiles_username_lower_key on public.profiles (lower(username));

-- 2. New accounts keep the case of the name they picked.
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
  base := left(regexp_replace(base, '[^A-Za-z0-9_]', '', 'g'), 18);
  if char_length(base) < 3 then base := 'explorer'; end if;

  candidate := base;
  while exists (select 1 from public.profiles where lower(username) = lower(candidate)) loop
    candidate := base || floor(random() * 10000)::int;
  end loop;

  insert into public.profiles (id, username, avatar_url)
  values (new.id, candidate, public.safe_avatar(new.raw_user_meta_data->>'avatar_url'));
  return new;
end;
$$;

-- 3. Existing accounts: give back the capitals of the name typed at sign-up, when the
--    saved name is that same name in lower case (renamed or auto-numbered names are left alone).
update public.profiles p
set username = left(regexp_replace(u.raw_user_meta_data->>'username', '[^A-Za-z0-9_]', '', 'g'), 18)
from auth.users u
where u.id = p.id
  and u.raw_user_meta_data->>'username' is not null
  and p.username = lower(left(regexp_replace(u.raw_user_meta_data->>'username', '[^A-Za-z0-9_]', '', 'g'), 18))
  and p.username <> left(regexp_replace(u.raw_user_meta_data->>'username', '[^A-Za-z0-9_]', '', 'g'), 18);
