--
-- types
--

create type public.app_role as enum ('admin');

--
-- tables
--

-- public.profiles

alter table public.profiles add column app_role public.app_role;

-- public.permissions

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  permission text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.permissions enable row level security;

-- public.app_role_permissions

create table public.app_role_permissions (
  permission_id uuid not null
    references public.permissions(id) on delete cascade,
  app_role public.app_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (app_role, permission_id)
);

alter table public.app_role_permissions enable row level security;

--
-- functions
--

-- security definer

create or replace function public.authorize(_permission text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.app_role_permissions arp
    where arp.app_role = (auth.jwt() -> 'app_metadata' ->> 'app_role')::public.app_role
    and arp.permission_id = (
      select id
      from public.permissions
      where permission = _permission
      limit 1
    )
  );
$$;

-- security invoker

create or replace function public.preserve_or_update_permission()
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

create or replace function public.preserve_or_update_app_role()
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

--
-- triggers
--

-- public.profiles

create or replace trigger preserve_or_update_app_role
before update
on public.profiles
for each row
execute function public.preserve_or_update_app_role();

-- public.permissions

create or replace trigger preserve_or_update_permission
before update
on public.permissions
for each row
execute function public.preserve_or_update_permission();

create or replace trigger preserve_created_at
before update
on public.permissions
for each row
execute function public.preserve_created_at();

create or replace trigger update_updated_at
before update
on public.permissions
for each row
execute procedure moddatetime(updated_at);

-- public.app_role_permissions

create or replace trigger preserve_created_at
before update
on public.app_role_permissions
for each row
execute function public.preserve_created_at();

create or replace trigger update_updated_at
before update
on public.app_role_permissions
for each row
execute procedure moddatetime(updated_at);

--
-- custom_access_token_hook
--

create or replace function public.custom_access_token(_event jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
volatile
as $$
declare
  _app_role public.app_role;
  _claims jsonb;
begin
  select app_role
  into _app_role
  from public.profiles
  where user_id = (_event->>'user_id')::uuid;

  _claims := _event->'claims';
  _claims := jsonb_set(_claims, '{app_metadata,app_role}', coalesce(to_jsonb(_app_role), 'null'::jsonb));
  _event := jsonb_set(_event, '{claims}', _claims);

  return _event;
end;
$$;

grant select on table public.profiles to supabase_auth_admin;

create policy "Allow supabase_auth_admin to select all"
on public.profiles
as permissive
for select
to supabase_auth_admin
using (true);

--
-- rbac_rls_policies
--

-- public.profiles

create policy "Allow admins to select"
on public.profiles
as permissive
for select
to authenticated
using (
  public.authorize('profiles.select')
);

create policy "Allow admins to update"
on public.profiles
as permissive
for update
to authenticated
using (
  public.authorize('profiles.update')
);

--
-- seed
--

-- public.permissions

insert into public.permissions (permission)
values ('profiles.select'), ('profiles.update');

-- public.app_role_permissions

insert into public.app_role_permissions (app_role, permission_id)
select 'admin', id
from public.permissions
where permission in ('profiles.select', 'profiles.update');
