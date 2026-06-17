--
-- Tables
--

-- public.app_permissions

create table public.app_permissions (
  id uuid primary key default gen_random_uuid(),
  slug public.slug not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz null
);

comment on table public.app_permissions is 'profiles.select, profiles.update, etc.';

-- public.app_roles

create table public.app_roles (
  id uuid primary key default gen_random_uuid(),
  slug public.slug not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz null
);

comment on table public.app_roles is 'admin, etc.';

-- public.app_permissions_app_roles

create table public.app_permissions_app_roles (
  app_permission_id uuid not null references public.app_permissions (id),
  app_role_id uuid not null references public.app_roles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz null,
  primary key (app_role_id, app_permission_id)
);

comment on table public.app_permissions_app_roles is 'Join table.';

-- public.app_roles_users

create table public.app_roles_users (
  user_id uuid primary key references auth.users (id),
  app_role_id uuid not null references public.app_roles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz null
);

comment on table public.app_roles_users is 'Join table.';

--
-- Functions
--

-- security definer

create or replace function public.is_authorized(_app_permissions_slug public.slug)
returns boolean
language plpgsql
security definer
set search_path = ''
stable
as $$
  declare
    _app_role_id uuid;
  begin
    _app_role_id := nullif((select auth.jwt())->'app_metadata'->>'app_role_id', '')::uuid;

    if _app_role_id is null then
      return false;
    end if;

    return exists (
      select 1
      from public.app_permissions_app_roles apar
      join public.app_permissions ap on apar.app_permission_id = ap.id
      where apar.app_role_id = _app_role_id and ap.slug = _app_permissions_slug
    );
  end;
$$;

revoke all on routine public.is_authorized from public;

grant execute on routine public.is_authorized to authenticated;

-- security invoker

create or replace function public.custom_access_token_hook(_event jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
stable
as $$
  declare
    _app_role_id uuid;
    _claims jsonb;
  begin
    select app_role_id into _app_role_id from public.app_roles_users where user_id = (_event->>'user_id')::uuid;

    _claims := _event->'claims';

    _claims := jsonb_set(_claims, '{app_metadata,app_role_id}', coalesce(to_jsonb(_app_role_id), 'null'::jsonb));

    _event := jsonb_set(_event, '{claims}', _claims);

    return _event;
  end;
$$;

revoke all on routine public.custom_access_token_hook from public;

grant execute on routine public.custom_access_token_hook to supabase_auth_admin;

--
-- RLS policies
--

-- public.app_permissions

grant select on table public.app_permissions to authenticated;

alter table public.app_permissions enable row level security;

create policy "Allow authenticated to select any" on public.app_permissions
as permissive
for select
to authenticated
using (true);

-- public.app_permissions_app_roles

grant select on table public.app_permissions_app_roles to authenticated;

alter table public.app_permissions_app_roles enable row level security;

create policy "Allow authorized to select any" on public.app_permissions_app_roles
as permissive
for select
to authenticated
using ((select public.is_authorized('app_permissions_app_roles.select')) is true);

-- public.app_roles

grant select on table public.app_roles to authenticated;

alter table public.app_roles enable row level security;

create policy "Allow authorized to select any" on public.app_roles
as permissive
for select
to authenticated
using ((select public.is_authorized('app_roles.select')) is true);

-- public.app_roles_users

grant select, insert, update, delete
on table public.app_roles_users
to authenticated;

alter table public.app_roles_users enable row level security;

grant all on table public.app_roles_users to supabase_auth_admin;

create policy "Allow authorized to select any" on public.app_roles_users
as permissive
for select
to authenticated
using ((select public.is_authorized('app_roles_users.select')) is true);

create policy "Allow authorized to insert others" on public.app_roles_users
as permissive
for insert
to authenticated
with check (
  (select auth.uid()) is distinct from user_id
  and (select public.is_authorized('app_roles_users.insert')) is true
);

create policy "Allow authorized to update others" on public.app_roles_users
as permissive
for update
to authenticated
using ((select public.is_authorized('app_roles_users.update')) is true)
with check ((select auth.uid()) is distinct from user_id);

create policy "Allow authorized to delete others" on public.app_roles_users
as permissive
for delete
to authenticated
using (
  (select auth.uid()) is distinct from user_id
  and (select public.is_authorized('app_roles_users.delete')) is true
);

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
-- Triggers
--

-- public.app_permissions

create or replace trigger preserve_created_at
before update on public.app_permissions
for each row
execute function public.preserve_created_at();

create or replace trigger update_updated_at
before update on public.app_permissions
for each row
execute procedure extensions.moddatetime(updated_at);

-- public.app_permissions_app_roles

create or replace trigger preserve_created_at
before update on public.app_permissions_app_roles
for each row
execute function public.preserve_created_at();

create or replace trigger update_updated_at
before update on public.app_permissions_app_roles
for each row
execute procedure extensions.moddatetime(updated_at);

-- public.app_roles

create or replace trigger preserve_created_at
before update on public.app_roles
for each row
execute function public.preserve_created_at();

create or replace trigger update_updated_at
before update on public.app_roles
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
-- Seed
--

-- public.app_permissions

insert into public.app_permissions (slug)
values
  ('app_permissions.select'),
  ('app_permissions_app_roles.select'),
  ('app_roles.select'),
  ('app_roles_users.select'),
  ('app_roles_users.insert'),
  ('app_roles_users.update'),
  ('app_roles_users.delete'),
  ('profiles.select'),
  ('profiles.update');

-- public.app_roles

insert into public.app_roles (slug)
values ('admin');

-- public.app_permissions_app_roles

insert into public.app_permissions_app_roles (app_role_id, app_permission_id)
select ar.id, ap.id
from
  public.app_roles as ar
  cross join public.app_permissions as ap
where
  ar.slug = 'admin'
  and ap.slug in (
    'app_permissions.select',
    'app_permissions_app_roles.select',
    'app_roles.select',
    'app_roles_users.select',
    'app_roles_users.insert',
    'app_roles_users.update',
    'app_roles_users.delete',
    'profiles.select',
    'profiles.update'
  );
