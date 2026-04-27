-- ============================================
-- Auto-save drafts table
-- One draft per post (post_id unique constraint)
-- ============================================

create table if not exists post_drafts (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade unique not null,
  title varchar(255) not null default '',
  content text not null default '',
  excerpt text,
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create trigger update_post_drafts_updated_at
  before update on post_drafts for each row
  execute function update_updated_at_column();

-- RLS
alter table post_drafts enable row level security;

create policy "own_drafts_select"
  on post_drafts for select
  using (auth.uid() = (select author_id from posts where id = post_id));

create policy "own_drafts_insert"
  on post_drafts for insert
  with check (auth.uid() = (select author_id from posts where id = post_id));

create policy "own_drafts_update"
  on post_drafts for update
  using (auth.uid() = (select author_id from posts where id = post_id))
  with check (auth.uid() = (select author_id from posts where id = post_id));

create policy "own_drafts_delete"
  on post_drafts for delete
  using (auth.uid() = (select author_id from posts where id = post_id));
