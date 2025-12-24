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
    _avatar_url shared.url;
    _full_name text;
  begin
    _avatar_url := nullif(new.raw_user_meta_data->>'avatar_url', '');

    _full_name := nullif(new.raw_user_meta_data->>'full_name', '');

    if _full_name is not null then
      _full_name := left(_full_name, 60);
    end if;

    insert into public.profiles (user_id, avatar_url, full_name, username)
    values (
      new.id,
      _avatar_url,
      _full_name,
      replace((new.id)::text, '-', '_')
    );

    return new;
  end;
$$;

--
-- security invoker
--

-- shared.preserve_created_at

create or replace function shared.preserve_created_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
volatile
as $$
begin
  if new.created_at != old.created_at then
    raise exception 'Cannot update created_at in %.%', TG_TABLE_SCHEMA, TG_TABLE_NAME;
  end if;

  return new;
end;
$$;

-- shared.preserve_record

create or replace function shared.preserve_record()
returns trigger
language plpgsql
security invoker
set search_path = ''
volatile
as $$
begin
  raise exception 'Cannot update record in %.%', TG_TABLE_SCHEMA, TG_TABLE_NAME;
end;
$$;
