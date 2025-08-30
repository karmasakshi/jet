-- types

create type public.app_role as enum ('admin');

-- tables

-- public.permissions

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  permission text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- public.profiles

alter table public.profiles add column app_role public.app_role;

-- public.app_role_permissions

create table public.app_role_permissions (
  permission_id uuid not null
    references public.permissions(id) on delete cascade,
  app_role public.app_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (app_role, permission_id)
);

-- rls policies

create policy "Allow supabase_auth_admin to select all"
on public.profiles
as permissive
for select
to supabase_auth_admin
using (true);

-- public.permissions

alter table public.permissions enable row level security;

-- public.app_role_permissions

alter table public.app_role_permissions enable row level security;

-- trigger functions

-- security invoker

create or replace function public.set_permission()
returns trigger
language plpgsql
security invoker
set search_path = ''
volatile
as $$
begin
  if new.permission <> old.permission then
    if current_user <> 'postgres' then
      raise exception 'Cannot update % in %.%', 'permission', TG_TABLE_SCHEMA, TG_TABLE_NAME;
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.set_app_role()
returns trigger
language plpgsql
security invoker
set search_path = ''
volatile
as $$
begin
  if new.app_role <> old.app_role then
    if current_user <> 'postgres' then
      raise exception 'Cannot update % in %.%', 'app_role', TG_TABLE_SCHEMA, TG_TABLE_NAME;
    end if;
  end if;

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

create or replace trigger set_app_role
before update
on public.profiles
for each row
execute function public.set_app_role();

-- public.app_role_permissions

create or replace trigger set_created_at
before update
on public.app_role_permissions
for each row
execute function public.set_created_at();

create or replace trigger set_updated_at
before update
on public.app_role_permissions
for each row
execute procedure moddatetime(updated_at);

-- seed

insert into public.permissions (permission)
values ('profiles.select'), ('profiles.update'), ('profiles.delete');

-- auth hook

create or replace function public.custom_access_token(event jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
volatile
as $$
declare
  claims jsonb;
  _app_role public.app_role;
begin
  select app_role into _app_role from public.profiles where user_id = (event->>'user_id')::uuid;
  claims := event->'claims';
  claims := jsonb_set(claims, '{app_metadata,app_role}', coalesce(to_jsonb(_app_role), 'null'::jsonb));
  event := jsonb_set(event, '{claims}', claims);

  return event;
end;
$$;

grant select on table public.profiles to supabase_auth_admin;
