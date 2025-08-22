-- public.profiles

create table public.profiles (
  id uuid primary key
    references auth.users (id),
  avatar_url text
    check (
      avatar_url is null
      or (
        length(avatar_url) between 10 and 300
        and avatar_url ~* '^https?://.+$'
      )
    ),
  username text not null
    check (
      length(username) between 3 and 36
      and username ~ '^[a-z0-9_]+$'
    )
    unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
