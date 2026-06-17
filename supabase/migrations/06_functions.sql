--
-- security definer
--

-- public.insert_profile

create or replace function public.insert_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
volatile
as $$
  declare
    _avatar_url public.url;
    _name text;
  begin
    _avatar_url := nullif(trim(new.raw_user_meta_data->>'avatar_url'), '');

    _name := nullif(trim(new.raw_user_meta_data->>'full_name'), '');

    if _name is not null then
      _name := left(_name, 60);
    end if;

    insert into public.profiles (user_id, avatar_url, name, username)
    values (
      new.id,
      _avatar_url,
      _name,
      replace((new.id)::text, '-', '_')
    );

    return new;
  end;
$$;

revoke all on routine public.insert_profile from public;

--
-- security invoker
--

-- public.preserve_created_at

create or replace function public.preserve_created_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
volatile
as $$
  begin
    if new.created_at is distinct from old.created_at then
      new.created_at := old.created_at;
    end if;

    return new;
  end;
$$;

revoke all on routine public.preserve_created_at from public;
