-- public.profiles

create table public.profiles (
  user_id uuid primary key
    references auth.users (id),
  avatar_url text
    check (
      avatar_url is null
      or (
        length(avatar_url) <= 300
        and avatar_url ~* '^https?://[[:print:]]+$'
      )
    ),
  full_name text
    check (
      full_name is null
      or length(full_name) <= 36
    ),
  username text not null unique
    check (
      length(username) between 3 and 36
      and username ~ '^[a-z0-9_]+$'
    ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
