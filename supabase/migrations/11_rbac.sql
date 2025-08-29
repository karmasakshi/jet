-- types

create type public.role as enum ('admin');

-- tables and rls policies

-- public.permissions

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  permission text not null unique,
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

-- security invoker

create or replace function public.set_permission()
returns trigger
language plpgsql
security invoker
set search_path = '' as
$$
declare
  _role public.role;
begin
  select role
  into _role
  from public.profiles
  where user_id = auth.uid();

  if auth.uid() is null or _role = 'admin' then
    return new;
  end if;

  raise warning 'Cannot modify % in %.%', 'permission', TG_TABLE_SCHEMA, TG_TABLE_NAME;
  new.permission := old.permission;

  return new;
end;
$$;

create or replace function public.set_role()
returns trigger
language plpgsql
security invoker
set search_path = '' as
$$
declare
  _role public.role;
begin
  select role
  into _role
  from public.profiles
  where user_id = auth.uid();

  if auth.uid() is null or _role = 'admin' then
    return new;
  end if;

  raise warning 'Cannot modify % in %.%', 'role', TG_TABLE_SCHEMA, TG_TABLE_NAME;
  new.role := old.role;

  return new;
end;
$$;

-- triggers

-- public.permissions

create or replace trigger set_permission
before update
on public.permissions
for each row
execute function public.set_permission();

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

insert into public.permissions (permission)
values ('profiles.select'), ('profiles.update'), ('profiles.delete');

-- auth hook

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = '' as
$$
declare
  claims jsonb;
  _role public.role;
begin
  select role into _role from public.profiles where user_id = (event->>'user_id')::uuid;

  claims := event->'claims';

  if jsonb_typeof(claims->'app_metadata') is null then
    claims := jsonb_set(claims, '{app_metadata}', '{}');
  end if;

  claims := jsonb_set(claims, '{app_metadata, role}', _role);

  event := jsonb_set(event, '{claims}', claims);

  return event;
end;
$$;

grant all on table public.profiles to supabase_auth_admin;

revoke all on table public.profiles from authenticated, anon, public;
