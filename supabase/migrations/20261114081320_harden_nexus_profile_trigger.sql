-- Move the NEXUS Auth profile trigger into a non-exposed schema.
-- The trigger function is SECURITY DEFINER and must not be callable through
-- the public Data API by anon/authenticated clients.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.handle_new_nexus_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, age)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', ''),
    case
      when (new.raw_user_meta_data ->> 'age') ~ '^[0-9]+$'
      then (new.raw_user_meta_data ->> 'age')::integer
      else null
    end
  )
  on conflict (id) do update
  set display_name = excluded.display_name,
      age = excluded.age,
      updated_at = now();
  return new;
end;
$$;

revoke all on function private.handle_new_nexus_user() from public, anon, authenticated;

drop trigger if exists on_nexus_auth_user_created on auth.users;
create trigger on_nexus_auth_user_created
after insert or update of raw_user_meta_data on auth.users
for each row execute procedure private.handle_new_nexus_user();

drop function if exists public.handle_new_nexus_user();
