-- Night Shift OS guestbook. Run once in Supabase → SQL Editor, then paste the
-- project URL and anon (public) key into `guestbook` in js/data.js.
create table if not exists public.guestbook (
  id bigint generated always as identity primary key,
  name text not null default 'anon' check (char_length(name) between 1 and 24),
  msg text not null check (char_length(msg) between 1 and 140),
  created_at timestamptz not null default now()
);

alter table public.guestbook enable row level security;

-- anyone can read and add a line; nobody can edit or delete through the public key
create policy "guestbook read" on public.guestbook for select to anon using (true);
create policy "guestbook sign" on public.guestbook for insert to anon with check (true);
