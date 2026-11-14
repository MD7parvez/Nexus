-- NEXUS account profiles and per-user workspace persistence.
-- Supabase Auth stores password hashes; this schema never stores plaintext passwords.
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '',
 age integer check (age between 13 and 120),
 organization text not null default 'NEXUS Research Workspace',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create or replace function public.handle_new_nexus_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
 insert into public.profiles (id, display_name, age)
 values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''),
 case when (new.raw_user_meta_data ->> 'age') ~ '^[0-9]+$' then (new.raw_user_meta_data ->> 'age')::integer else null end)
 on conflict (id) do update set display_name = excluded.display_name, age = excluded.age, updated_at = now();
 return new;
end;
$$;
drop trigger if exists on_nexus_auth_user_created on auth.users;
create trigger on_nexus_auth_user_created after insert or update of raw_user_meta_data on auth.users for each row execute procedure public.handle_new_nexus_user();
create table if not exists public.workspace_records (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null default '{"cases":[],"sources":[],"claims":[],"media":[],"responses":[],"scenarios":[]}'::jsonb,
 updated_at timestamptz not null default now()
);
alter table public.workspace_records enable row level security;
drop policy if exists "Users can read own workspace" on public.workspace_records;
create policy "Users can read own workspace" on public.workspace_records for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users can insert own workspace" on public.workspace_records;
create policy "Users can insert own workspace" on public.workspace_records for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users can update own workspace" on public.workspace_records;
create policy "Users can update own workspace" on public.workspace_records for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
insert into public.profiles (id, display_name, age)
select id, coalesce(raw_user_meta_data ->> 'display_name', ''),
case when (raw_user_meta_data ->> 'age') ~ '^[0-9]+$' then (raw_user_meta_data ->> 'age')::integer else null end
from auth.users on conflict (id) do nothing;
