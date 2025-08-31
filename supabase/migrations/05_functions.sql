-- security definer

create or replace function public.insert_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
volatile
as $$
declare
  avatar_url text;
  full_name text;
begin
  full_name := nullif(new.raw_user_meta_data->>'full_name', '');

  if full_name is not null then
    full_name := left(full_name, 36);
  end if;

  avatar_url := nullif(new.raw_user_meta_data->>'avatar_url', '');

  if avatar_url is not null then
    if length(avatar_url) > 300 then
      avatar_url := null;
    end if;
  end if;

  insert into public.profiles (user_id, avatar_url, full_name, username)
  values (
    new.id,
    avatar_url,
    full_name,
    replace(new.id::text, '-', '_')
  );

  return new;
end;
$$;

-- security invoker

create or replace function public.set_created_at()
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
