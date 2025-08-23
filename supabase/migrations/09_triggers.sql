-- auth.users

create or replace trigger insert_profile
  after insert
  on auth.users
  for each row
  execute function public.insert_profile();

-- public.profiles

create or replace trigger set_timestamps
  before update
  on public.profiles
  for each row
  execute function public.set_timestamps();
