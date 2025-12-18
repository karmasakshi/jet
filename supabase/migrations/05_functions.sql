-- security definer

create or replace function public.insert_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
volatile
as $$
declare
  _avatar_url text;
  _full_name text;
begin
  _full_name := nullif(new.raw_user_meta_data->>'full_name', '');

  if _full_name is not null then
    _full_name := left(_full_name, 36);
  end if;

  _avatar_url := nullif(new.raw_user_meta_data->>'avatar_url', '');

  if _avatar_url is not null then
    if length(_avatar_url) > 300 then
      _avatar_url := null;
    end if;
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

-- security invoker

create or replace function public.preserve_created_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
volatile
as $$
begin
  if new.created_at <> old.created_at then
    raise exception 'Cannot update % in %.%', 'created_at', TG_TABLE_SCHEMA, TG_TABLE_NAME;
  end if;

  return new;
end;
$$;
