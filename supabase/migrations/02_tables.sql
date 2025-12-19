-- public.profiles

create table public.profiles (
  user_id uuid primary key references auth.users (id),
  avatar_url text null check (
    length(avatar_url) <= 300
    and avatar_url ~ '^https?://.+'
  ),
  full_name text null check (length(full_name) <= 36),
  username text not null unique check (
    length(username) between 3 and 36
    and username ~ '^[a-z0-9_]+$'
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'User profiles.';

alter table public.profiles enable row level security;
