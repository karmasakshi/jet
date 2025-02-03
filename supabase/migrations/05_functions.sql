-- public.*

create or replace function public.update_updated_at()
returns trigger
language plpgsql
security definer
set search_path = '' as
$$
  begin
    new.updated_at = now();
    return new;
  end;
$$;

-- public.profiles

create or replace function public.profiles_insert()
returns trigger
language plpgsql
security definer
set search_path = '' as
$$
  declare
    generated_username text;
  begin
    loop
      generated_username := 'user_' || substring(md5(random()::text) from 1 for 8);
      exit when not exists (select 1 from public.profiles where username = generated_username);
    end loop;
    insert into public.profiles (id, avatar_url, username)
    values (new.id, 'https://avatar.iran.liara.run/public?username=' || generated_username, generated_username);
    return new;
  end;
$$;
