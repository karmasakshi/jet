-- auth.users

create or replace trigger insert_profile
after insert on auth.users
for each row
execute function public.insert_profile();

-- public.profiles

create or replace trigger preserve_created_at
before update on public.profiles
for each row
execute function shared.preserve_created_at();

create or replace trigger update_updated_at
before update on public.profiles
for each row
execute procedure extensions.moddatetime(updated_at);
