-- ============================================
-- Supabase Blog Database Schema
-- ============================================

-- Posts table
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references auth.users(id) on delete cascade not null,
  title varchar(255) not null,
  slug varchar(255) unique not null,
  content text not null,
  excerpt text,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Post likes table
create table if not exists post_likes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

-- Post comments table
create table if not exists post_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  author_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_posts_author_id on posts(author_id);
create index idx_posts_published on posts(published);
create index idx_posts_slug on posts(slug);
create index idx_post_likes_post_id on post_likes(post_id);
create index idx_post_comments_post_id on post_comments(post_id);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Posts RLS
alter table posts enable row level security;

create policy "published_posts_select"
  on posts for select using (published = true);

create policy "own_posts_select"
  on posts for select using (auth.uid() = author_id);

create policy "authenticated_create_post"
  on posts for insert with check (auth.uid() = author_id);

create policy "own_posts_update"
  on posts for update using (auth.uid() = author_id);

create policy "own_posts_delete"
  on posts for delete using (auth.uid() = author_id);

-- Post Likes RLS
alter table post_likes enable row level security;

create policy "likes_select"
  on post_likes for select using (true);

create policy "authenticated_like"
  on post_likes for insert with check (auth.uid() = user_id);

create policy "own_like_delete"
  on post_likes for delete using (auth.uid() = user_id);

-- Post Comments RLS
alter table post_comments enable row level security;

create policy "comments_select"
  on post_comments for select using (true);

create policy "authenticated_comment"
  on post_comments for insert with check (auth.uid() = author_id);

create policy "own_comment_update"
  on post_comments for update using (auth.uid() = author_id);

create policy "own_comment_delete"
  on post_comments for delete using (auth.uid() = author_id);

-- ============================================
-- Auto-update updated_at trigger
-- ============================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_posts_updated_at
  before update on posts for each row
  execute function update_updated_at_column();

create trigger update_comments_updated_at
  before update on post_comments for each row
  execute function update_updated_at_column();
