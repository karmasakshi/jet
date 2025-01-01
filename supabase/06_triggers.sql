-- auth.users

create or replace trigger profiles_insert
after insert on auth.users for each row
execute function profiles_insert ();

-- public.profiles

create or replace trigger update_updated_at before
update on public.profiles for each row
execute function update_updated_at ();
