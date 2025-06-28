-- public.profiles

create table public.profiles (
  id uuid not null,
  avatar_url text null,
  username text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign key (id) references auth.users (id),
  constraint profiles_avatar_url_check check (
    (
      (length(avatar_url) >= 10)
      and (length(avatar_url) <= 300)
      and (avatar_url ~* '^https?://.+$'::text)
    )
  ),
  constraint profiles_username_check check (
    (
      (length(username) >= 3)
      and (length(username) <= 36)
      and (username ~ '^[a-z0-9_]+$'::text)
    )
  ),
  constraint profiles_username_key unique (username)
) TABLESPACE pg_default;
