-- public.profiles

create table public.profiles (
  user_id uuid primary key references auth.users (id),
  avatar_url public.url null,
  name public.name null,
  username public.username not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz null
);

comment on table public.profiles is 'Profiles.';
