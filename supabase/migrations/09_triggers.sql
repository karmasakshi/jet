-- auth.users

create or replace trigger insert_profile
after insert
on auth.users
for each row
execute function public.insert_profile();

-- public.profiles

create or replace trigger set_created_at
before update
on public.profiles
for each row
execute function public.set_created_at();

create or replace trigger set_updated_at
before update
on public.profiles
for each row
execute procedure moddatetime(updated_at);
