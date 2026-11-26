-- GeoFeverr — player avatars (DiceBear "Adventurer", drawn in the browser from a seed).
-- profiles.avatar_url now also accepts 'adv:<seed>'. Players change it only through
-- set_my_avatar(), which checks the value. Run once in the Supabase SQL editor. Safe to run again.

-- 1. Allowed values: an avatar seed, or an old Google picture (kept for existing accounts).
create or replace function public.safe_avatar(u text)
returns text language sql immutable as $$
  select case
    when u ~ '^adv:[A-Za-z0-9_-]{1,32}$' then u
    when u ~ '^https://[a-z0-9-]+\.googleusercontent\.com/[^\s"''<>]*$' then u
  end
$$;

-- 2. The only way to change your avatar (profiles has no update policy).
create or replace function public.set_my_avatar(p_avatar text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not_signed_in';
  end if;
  if p_avatar is not null and p_avatar !~ '^adv:[A-Za-z0-9_-]{1,32}$' then
    raise exception 'bad_avatar';
  end if;
  update public.profiles set avatar_url = p_avatar where id = auth.uid();
end;
$$;

revoke all on function public.set_my_avatar(text) from public, anon;
grant execute on function public.set_my_avatar(text) to authenticated;
