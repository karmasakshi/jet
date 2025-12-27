-- public.profiles

create table public.profiles (
  user_id uuid primary key references auth.users (id),
  avatar_url shared.url null,
  full_name text null check (length(full_name) <= 60),
  username text not null unique check (
    length(username) between 3 and 36
    and username ~ '^[a-z0-9_]+$'
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz null
);

comment on table public.profiles is 'Profiles.';
