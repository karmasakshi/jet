-- types

create type public.role as enum ('admin');

-- tables, indexes and rls policies

-- public.permissions

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.permissions enable row level security;

-- public.profiles

alter table public.profiles add column role public.role;

-- public.role_permissions

create table public.role_permissions (
  permission_id uuid not null
    references public.permissions(id) on delete cascade,
  role public.role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (role, permission_id)
);

alter table public.role_permissions enable row level security;

-- trigger functions

-- security definer

create or replace function public.set_name()
returns trigger
language plpgsql
security definer
set search_path = '' as
$$
declare
  xrole public.role;
begin
  select role
  into xrole
  from public.profiles
  where user_id = auth.uid();

  if auth.uid() is null or xrole = 'admin' then
    return new;
  end if;

  raise warning 'Cannot modify % in %.%', 'name', TG_TABLE_SCHEMA, TG_TABLE_NAME;
  new.name := old.name;

  return new;
end;
$$;

create or replace function public.set_role()
returns trigger
language plpgsql
security definer
set search_path = '' as
$$
declare
  xrole public.role;
begin
  select role
  into xrole
  from public.profiles
  where user_id = auth.uid();

  if auth.uid() is null or xrole = 'admin' then
    return new;
  end if;

  raise warning 'Cannot modify % in %.%', 'role', TG_TABLE_SCHEMA, TG_TABLE_NAME;
  new.role := old.role;

  return new;
end;
$$;

-- triggers

-- public.permissions

create or replace trigger set_name
before update
on public.permissions
for each row
execute function public.set_name();

create or replace trigger set_created_at
before update
on public.permissions
for each row
execute function public.set_created_at();

create or replace trigger set_updated_at
before update
on public.permissions
for each row
execute procedure moddatetime(updated_at);

-- public.profiles

create or replace trigger set_role
before update
on public.profiles
for each row
execute function public.set_role();

-- public.role_permissions

create or replace trigger set_created_at
before update
on public.role_permissions
for each row
execute function public.set_created_at();

create or replace trigger set_updated_at
before update
on public.role_permissions
for each row
execute procedure moddatetime(updated_at);

-- seed

insert into public.permissions (name)
values ('profiles.delete'), ('profiles.select'), ('profiles.update');

-- auth hook

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = '' as
$$
declare
  -- Insert variables here
begin
  -- Insert logic here
  return event;
end;
$$;

grant execute on function public.custom_access_token_hook to supabase_auth_admin;

revoke execute on function public.custom_access_token_hook from authenticated, anon, public;
