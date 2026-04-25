-- Add ip column to post_likes for unauthenticated likes
alter table post_likes add column if not exists ip varchar(45);

-- Make user_id nullable (for anonymous likes)
alter table post_likes alter column user_id drop not null;

-- Add unique constraint on (post_id, ip) for anonymous likes
alter table post_likes add constraint post_likes_post_ip_unique unique(post_id, ip);

-- Add index for IP lookups
create index if not exists idx_post_likes_ip on post_likes(ip);

-- Drop existing policies and recreate to allow anonymous likes
drop policy if exists "authenticated_like" on post_likes;
drop policy if exists "own_like_delete" on post_likes;

-- Authenticated users: track by user_id
create policy "authenticated_like"
  on post_likes for insert with check (
    auth.role() = 'authenticated' and auth.uid() = user_id
  );

create policy "authenticated_unlike"
  on post_likes for delete using (
    auth.role() = 'authenticated' and auth.uid() = user_id
  );

-- Anonymous users: track by IP (rate limited per post per IP)
create policy "anonymous_like"
  on post_likes for insert with check (
    auth.role() = 'anon' and ip is not null
  );

create policy "anonymous_unlike"
  on post_likes for delete using (
    auth.role() = 'anon' and ip is not null
  );
