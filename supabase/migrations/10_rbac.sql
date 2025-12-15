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
  slug text not null unique,
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

create or replace function public.authorize(_slug text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.app_role_permissions arp
    join public.permissions p on p.id = arp.permission_id
    where arp.app_role::text =
      auth.jwt() -> 'app_metadata' ->> 'app_role'
      and p.slug = _slug
  );
$$;

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
-- rls_policies
--

-- public.profiles

drop policy if exists "Allow authenticated to select own"
on public.profiles;

create policy "Allow admins to select and authenticated to select own"
on public.profiles
as permissive
for select
to authenticated
using (
  (select auth.uid()) = user_id
  or public.authorize('profiles.select')
);

drop policy if exists "Allow authenticated to update own"
on public.profiles;

create policy "Allow admins to update and authenticated to update own"
on public.profiles
as permissive
for update
to authenticated
using (
  (select auth.uid()) = user_id
  or public.authorize('profiles.update')
)
with check (
  (select auth.uid()) = user_id
  or public.authorize('profiles.update')
);

--
-- seed
--

-- public.permissions

insert into public.permissions (slug)
values ('profiles.select'), ('profiles.update');

-- public.app_role_permissions

insert into public.app_role_permissions (app_role, permission_id)
select 'admin', id
from public.permissions
where slug in ('profiles.select', 'profiles.update');
