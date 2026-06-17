--
-- Types
--

-- public.app_permission

create type public.app_permission as enum (
  'app_permissions_app_roles.select',
  'app_roles_users.select',
  'profiles.select',
  'profiles.update'
);

-- public.app_role

create type public.app_role as enum ('admin');

--
-- Tables
--

-- public.app_permissions_app_roles

create table public.app_permissions_app_roles (
  app_permission public.app_permission not null,
  app_role public.app_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz null,
  primary key (app_role, app_permission)
);

comment on table public.app_permissions_app_roles is 'Join table.';

-- public.app_roles_users

create table public.app_roles_users (
  user_id uuid primary key references auth.users (id),
  app_role public.app_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz null
);

comment on table public.app_roles_users is 'Join table.';

--
-- Functions: security definer
--

-- public.is_authorized

create or replace function public.is_authorized(_app_permission public.app_permission)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select
    exists (
      select 1
      from
        public.app_roles_users as aru
        join public.app_permissions_app_roles as apar on apar.app_role = aru.app_role
      where aru.user_id = auth.uid() and apar.app_permission = _app_permission
    );
$$;

revoke all on routine public.is_authorized from public;

grant all on routine public.is_authorized to authenticated;

--
-- Functions: security invoker
--

-- public.custom_access_token_hook

create or replace function public.custom_access_token_hook(_event jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
stable
as $$
  declare
    _app_role public.app_role;
    _app_permissions public.app_permission[];
    _claims jsonb;
  begin
    select aru.app_role
    into _app_role
    from public.app_roles_users aru
    where aru.user_id = (_event->>'user_id')::uuid;

    select array_agg(apar.app_permission order by apar.app_permission)
    into _app_permissions
    from public.app_permissions_app_roles apar
    where apar.app_role = _app_role;

    _claims := _event->'claims';

    _claims := jsonb_set(
      _claims,
      '{app_metadata}',
      coalesce(_claims->'app_metadata', '{}'),
      true
    );

    _claims := jsonb_set(
      _claims,
      '{app_metadata,app_role}',
      coalesce(to_jsonb(_app_role), 'null'::jsonb)
    );

    _claims := jsonb_set(
      _claims,
      '{app_metadata,permissions}',
      coalesce(to_jsonb(_app_permissions), '[]'::jsonb)
    );

    _event := jsonb_set(_event, '{claims}', _claims);

    return _event;
  end;
$$;

revoke all on routine public.custom_access_token_hook from public;

grant all on routine public.custom_access_token_hook to supabase_auth_admin;

--
-- Triggers
--

-- public.app_permissions_app_roles

create or replace trigger preserve_created_at
before update on public.app_permissions_app_roles
for each row
execute function public.preserve_created_at();

create or replace trigger update_updated_at
before update on public.app_permissions_app_roles
for each row
execute procedure extensions.moddatetime(updated_at);

-- public.app_roles_users

create or replace trigger preserve_created_at
before update on public.app_roles_users
for each row
execute function public.preserve_created_at();

create or replace trigger update_updated_at
before update on public.app_roles_users
for each row
execute procedure extensions.moddatetime(updated_at);

--
-- RLS policies
--

-- public.app_permissions_app_roles

grant select on table public.app_permissions_app_roles to authenticated, supabase_auth_admin;

alter table public.app_permissions_app_roles enable row level security;

create policy "Allow authorized to select any" on public.app_permissions_app_roles
as permissive
for select
to authenticated
using ((select public.is_authorized('app_permissions_app_roles.select')) is true);

create policy "Allow supabase_auth_admin to select any" on public.app_permissions_app_roles
as permissive
for select
to supabase_auth_admin
using (true);

-- public.app_roles_users

grant select on table public.app_roles_users to authenticated, supabase_auth_admin;

alter table public.app_roles_users enable row level security;

create policy "Allow authorized to select any" on public.app_roles_users
as permissive
for select
to authenticated
using ((select public.is_authorized('app_roles_users.select')) is true);

create policy "Allow supabase_auth_admin to select any" on public.app_roles_users
as permissive
for select
to supabase_auth_admin
using (true);

-- public.profiles

drop policy if exists "Allow authenticated to select own" on public.profiles;

create policy "Allow authenticated to select own and authorized to select any" on public.profiles
as permissive
for select
to authenticated
using ((select auth.uid()) = user_id or (select public.is_authorized('profiles.select')) is true);

drop policy if exists "Allow authenticated to update own" on public.profiles;

create policy "Allow authenticated to update own and authorized to update any" on public.profiles
as permissive
for update
to authenticated
using ((select auth.uid()) = user_id or (select public.is_authorized('profiles.update')) is true)
with check (
  (select auth.uid()) = user_id
  or (select public.is_authorized('profiles.update')) is true
);

--
-- Seed
--

-- public.app_permissions_app_roles

insert into public.app_permissions_app_roles
  (app_role, app_permission)
values
  ('admin', 'app_permissions_app_roles.select'),
  ('admin', 'app_roles_users.select'),
  ('admin', 'profiles.select'),
  ('admin', 'profiles.update');
