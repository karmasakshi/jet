-- auth.users

create or replace trigger insert_profile
after insert on auth.users for each row
execute function insert_profile();

-- public.profiles

create or replace trigger update_timestamps
before update on public.profiles for each row
execute function update_timestamps();
