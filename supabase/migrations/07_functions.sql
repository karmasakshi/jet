-- security definer

create or replace function public.insert_profile()
returns trigger
language plpgsql
security definer
set search_path = '' as
$$
begin
  insert into public.profiles (id, avatar_url, username)
  values (
    new.id,
    null,
    replace(new.id::text, '-', '_')
  );

  return new;
end;
$$;

-- security invoker

create or replace function public.update_timestamps()
returns trigger
language plpgsql
security invoker
set search_path = '' as
$$
begin
  new.created_at := old.created_at;
  new.updated_at := now();

  return new;
end;
$$;
