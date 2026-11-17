-- ── Quiz comments ───────────────────────────────────────────────────────────
-- Comments under each quiz: one level of replies, likes, reports, admin moderation.
-- Run once in the SQL Editor (after admin.sql: it uses is_admin()). Also appended to schema.sql.
--
-- Anyone may read (except hidden comments); only signed-in players write. A player edits or
-- deletes only their own comments; deleting the account deletes them (ON DELETE CASCADE).

create table if not exists public.quiz_comments (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  edited_at   timestamptz,
  quiz        text not null check (quiz ~ '^[a-z0-9-]{1,60}$'),
  user_id     uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  parent_id   bigint references public.quiz_comments(id) on delete cascade,
  body        text not null check (char_length(btrim(body)) between 1 and 500),
  like_count  integer not null default 0,
  hidden      boolean not null default false
);
create index if not exists quiz_comments_quiz_idx on public.quiz_comments (quiz, created_at desc);
create index if not exists quiz_comments_parent_idx on public.quiz_comments (parent_id);
create index if not exists quiz_comments_user_idx on public.quiz_comments (user_id, created_at desc);

create table if not exists public.comment_likes (
  comment_id  bigint not null references public.quiz_comments(id) on delete cascade,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create table if not exists public.comment_reports (
  comment_id  bigint not null references public.quiz_comments(id) on delete cascade,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (comment_id, user_id)
);

-- Replies: only to a top-level comment of the same quiz. Rate limit: 3 a minute, 60 a day.
create or replace function public.quiz_comment_check()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare p public.quiz_comments;
begin
  if new.parent_id is not null then
    select * into p from public.quiz_comments where id = new.parent_id;
    if p.id is null or p.parent_id is not null or p.quiz <> new.quiz then
      raise exception 'bad_parent';
    end if;
  end if;
  if (select count(*) from public.quiz_comments where user_id = new.user_id and created_at > now() - interval '1 minute') >= 3
     or (select count(*) from public.quiz_comments where user_id = new.user_id and created_at > now() - interval '1 day') >= 60 then
    raise exception 'rate_limited';
  end if;
  new.body := btrim(new.body);
  new.like_count := 0;
  new.hidden := false;
  return new;
end;
$$;
drop trigger if exists quiz_comment_check on public.quiz_comments;
create trigger quiz_comment_check before insert on public.quiz_comments
  for each row execute function public.quiz_comment_check();

-- Editing: only the text changes, and it's marked as edited. Direct API updates (role
-- authenticated) can't touch anything else; our own security-definer functions (like counts,
-- admin hide) run as the owner and may.
create or replace function public.quiz_comment_edit()
returns trigger
language plpgsql
as $$
begin
  if current_user in ('authenticated', 'anon') and not public.is_admin() then
    new.quiz := old.quiz; new.user_id := old.user_id; new.parent_id := old.parent_id;
    new.created_at := old.created_at; new.like_count := old.like_count; new.hidden := old.hidden;
  end if;
  if new.body is distinct from old.body then new.edited_at := now(); new.body := btrim(new.body); end if;
  return new;
end;
$$;
drop trigger if exists quiz_comment_edit on public.quiz_comments;
create trigger quiz_comment_edit before update on public.quiz_comments
  for each row execute function public.quiz_comment_edit();

-- Keep like_count in step with comment_likes
create or replace function public.comment_like_count()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.quiz_comments set like_count = like_count + 1 where id = new.comment_id;
  else
    update public.quiz_comments set like_count = greatest(like_count - 1, 0) where id = old.comment_id;
  end if;
  return null;
end;
$$;
drop trigger if exists comment_like_count on public.comment_likes;
create trigger comment_like_count after insert or delete on public.comment_likes
  for each row execute function public.comment_like_count();

-- ── Row level security ──────────────────────────────────────────────────────
alter table public.quiz_comments   enable row level security;
alter table public.comment_likes   enable row level security;
alter table public.comment_reports enable row level security;

drop policy if exists "comments are public"          on public.quiz_comments;
drop policy if exists "players write own comments"   on public.quiz_comments;
drop policy if exists "players edit own comments"    on public.quiz_comments;
drop policy if exists "players delete own comments"  on public.quiz_comments;
create policy "comments are public" on public.quiz_comments
  for select using (not hidden or user_id = auth.uid() or public.is_admin());
create policy "players write own comments" on public.quiz_comments
  for insert to authenticated with check (user_id = auth.uid());
create policy "players edit own comments" on public.quiz_comments
  for update to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "players delete own comments" on public.quiz_comments
  for delete to authenticated using (user_id = auth.uid() or public.is_admin());
grant select on public.quiz_comments to anon, authenticated;
grant insert (quiz, parent_id, body) on public.quiz_comments to authenticated;
grant update (body, hidden) on public.quiz_comments to authenticated;   -- hidden: admins only (trigger)
grant delete on public.quiz_comments to authenticated;

drop policy if exists "likes are public"      on public.comment_likes;
drop policy if exists "players like"          on public.comment_likes;
drop policy if exists "players unlike"        on public.comment_likes;
create policy "likes are public" on public.comment_likes for select using (true);
create policy "players like"     on public.comment_likes for insert to authenticated with check (user_id = auth.uid());
create policy "players unlike"   on public.comment_likes for delete to authenticated using (user_id = auth.uid());
grant select on public.comment_likes to anon, authenticated;
grant insert (comment_id), delete on public.comment_likes to authenticated;

drop policy if exists "players report" on public.comment_reports;
create policy "players report" on public.comment_reports for insert to authenticated with check (user_id = auth.uid());
grant insert (comment_id) on public.comment_reports to authenticated;   -- nobody reads reports through the API

-- ── Admin: moderation list and hide / show ──────────────────────────────────
-- p_filter: 'reported' (default) · 'latest' · 'hidden'
create or replace function public.admin_comments(p_filter text default 'reported', p_limit integer default 100)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return coalesce((
    select jsonb_agg(row_to_json(x) order by x.reports desc, x.created_at desc)
    from (
      select c.id, c.created_at, c.quiz, c.body, c.hidden, c.like_count, c.parent_id,
             p.username, (select count(*) from public.comment_reports r where r.comment_id = c.id) as reports
      from public.quiz_comments c join public.profiles p on p.id = c.user_id
      where case coalesce(p_filter, 'reported')
              when 'hidden' then c.hidden
              when 'latest' then true
              else exists (select 1 from public.comment_reports r where r.comment_id = c.id) and not c.hidden
            end
      order by c.created_at desc
      limit greatest(1, least(coalesce(p_limit, 100), 500))
    ) x
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.admin_comments(text, integer) from public, anon;
grant execute on function public.is_admin() to anon;   -- the read policy calls it for guests too (false)
grant execute on function public.admin_comments(text, integer) to authenticated;

create or replace function public.admin_set_comment_hidden(p_id bigint, p_hidden boolean)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  update public.quiz_comments set hidden = p_hidden where id = p_id;
  if not p_hidden then delete from public.comment_reports where comment_id = p_id; end if;  -- cleared
end;
$$;
revoke all on function public.admin_set_comment_hidden(bigint, boolean) from public, anon;
grant execute on function public.admin_set_comment_hidden(bigint, boolean) to authenticated;
