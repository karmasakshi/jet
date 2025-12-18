--
-- tables
--

-- public.app_permissions

create table public.app_permissions (
  id uuid primary key default gen_random_uuid (),
  slug text not null unique
    check (
      length(slug) between 3 and 36
      and slug ~ '^[a-z0-9_.]+$'
    ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.app_permissions is 'profiles.delete, profiles.insert, etc.';

alter table public.app_permissions enable row level security;

-- public.app_roles

create table public.app_roles (
  id uuid primary key default gen_random_uuid (),
  name text not null unique
    check (
      length(name) between 3 and 36
    ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.app_roles is 'admin, manager, etc.';

alter table public.app_roles enable row level security;

-- public.app_permissions_app_roles

create table public.app_permissions_app_roles (
  app_permission_id uuid not null
    references public.app_permissions (id),
  app_role_id uuid not null
    references public.app_roles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (app_role_id, app_permission_id)
);

comment on table public.app_permissions_app_roles is 'Join table.';

alter table public.app_permissions_app_roles enable row level security;

-- public.app_roles_users

create table public.app_roles_users (
  user_id uuid primary key
    references auth.users (id),
  app_role_id uuid not null
    references public.app_roles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.app_roles_users is 'Join table.';

alter table public.app_roles_users enable row level security;

--
-- functions
--

-- security definer

create or replace function public.is_authorized(_slug text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.app_permissions_app_roles apar
    join public.app_permissions ap on ap.id = apar.app_permission_id
    where apar.app_role_id =
      nullif(auth.jwt()->'app_metadata'->>'app_role_id', '')::uuid
    and ap.slug = _slug
  );
$$;

-- security invoker

create or replace function public.custom_access_token(_event jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
volatile
as $$
declare
  _app_role_id uuid;
  _claims jsonb;
begin
  select app_role_id
  into _app_role_id
  from public.app_roles_users
  where user_id = (_event->>'user_id')::uuid;

  _claims := _event->'claims';

  _claims := jsonb_set(_claims, '{app_metadata,app_role_id}', coalesce(to_jsonb(_app_role_id), 'null'::jsonb));

  _event := jsonb_set(_event, '{claims}', _claims);

  return _event;
end;
$$;

grant select on table public.app_roles_users to supabase_auth_admin;

create policy "Allow supabase_auth_admin to select any"
on public.app_roles_users
as permissive
for select
to supabase_auth_admin
using (true);

--
-- triggers
--

-- public.app_permissions

create or replace trigger preserve_created_at
before update
on public.app_permissions
for each row
execute function public.preserve_created_at();

create or replace trigger update_updated_at
before update
on public.app_permissions
for each row
execute procedure moddatetime(updated_at);

-- public.app_permissions_app_roles

create or replace trigger preserve_created_at
before update
on public.app_permissions_app_roles
for each row
execute function public.preserve_created_at();

create or replace trigger update_updated_at
before update
on public.app_permissions_app_roles
for each row
execute procedure moddatetime(updated_at);

-- public.app_roles

create or replace trigger preserve_created_at
before update
on public.app_roles
for each row
execute function public.preserve_created_at();

create or replace trigger update_updated_at
before update
on public.app_roles
for each row
execute procedure moddatetime(updated_at);

-- public.app_roles_users

create or replace trigger preserve_created_at
before update
on public.app_roles_users
for each row
execute function public.preserve_created_at();

create or replace trigger update_updated_at
before update
on public.app_roles_users
for each row
execute procedure moddatetime(updated_at);

--
-- rls_policies
--

-- public.app_permissions

create policy "Allow authenticated to select any"
on public.app_permissions
as permissive
for select
to authenticated
using (true);

-- public.app_permissions_app_roles

create policy "Allow authorized to delete any"
on public.app_permissions_app_roles
as permissive
for delete
to authenticated
using (
  public.is_authorized('app_permissions_app_roles.delete')
);

create policy "Allow authorized to insert any"
on public.app_permissions_app_roles
as permissive
for insert
to authenticated
with check (
  public.is_authorized('app_permissions_app_roles.insert')
);

create policy "Allow authorized to select any"
on public.app_permissions_app_roles
as permissive
for select
to authenticated
using (
  public.is_authorized('app_permissions_app_roles.select')
);

create policy "Allow authorized to update any"
on public.app_permissions_app_roles
as permissive
for update
to authenticated
using (
  public.is_authorized('app_permissions_app_roles.update')
)
with check (true);

-- public.app_roles

create policy "Allow authorized to delete any"
on public.app_roles
as permissive
for delete
to authenticated
using (
  public.is_authorized('app_roles.delete')
);

create policy "Allow authorized to insert any"
on public.app_roles
as permissive
for insert
to authenticated
with check (
  public.is_authorized('app_roles.insert')
);

create policy "Allow authorized to select any"
on public.app_roles
as permissive
for select
to authenticated
using (
  public.is_authorized('app_roles.select')
);

create policy "Allow authorized to update any"
on public.app_roles
as permissive
for update
to authenticated
using (
  public.is_authorized('app_roles.update')
)
with check (true);

-- public.app_roles_users

create policy "Allow authorized to delete others"
on public.app_roles_users
as permissive
for delete
to authenticated
using (
  (select auth.uid()) <> user_id
  and public.is_authorized('app_roles_users.delete')
);

create policy "Allow authorized to insert others"
on public.app_roles_users
as permissive
for insert
to authenticated
with check (
  (select auth.uid()) <> user_id
  and public.is_authorized('app_roles_users.insert')
);

create policy "Allow authorized to select any"
on public.app_roles_users
as permissive
for select
to authenticated
using (
  public.is_authorized('app_roles_users.select')
);

create policy "Allow authorized to update others"
on public.app_roles_users
as permissive
for update
to authenticated
using (
  public.is_authorized('app_roles_users.update')
)
with check (
  (select auth.uid()) <> user_id
);

-- public.profiles

drop policy if exists "Allow authenticated to select own"
on public.profiles;

create policy "Allow authenticated to select own and authorized to select any"
on public.profiles
as permissive
for select
to authenticated
using (
  (select auth.uid()) = user_id
  or public.is_authorized('profiles.select')
);

drop policy if exists "Allow authenticated to update own"
on public.profiles;

create policy "Allow authenticated to update own and authorized to update any"
on public.profiles
as permissive
for update
to authenticated
using (
  (select auth.uid()) = user_id
  or public.is_authorized('profiles.update')
)
with check (
  (select auth.uid()) = user_id
  or public.is_authorized('profiles.update')
);

--
-- seed
--

-- public.app_permissions

insert into public.app_permissions (slug)
values
  ('app_permissions_app_roles.delete'),
  ('app_permissions_app_roles.insert'),
  ('app_permissions_app_roles.select'),
  ('app_permissions_app_roles.update'),
  ('app_roles.delete'),
  ('app_roles.insert'),
  ('app_roles.select'),
  ('app_roles.update'),
  ('app_roles_users.delete'),
  ('app_roles_users.insert'),
  ('app_roles_users.select'),
  ('app_roles_users.update'),
  ('profiles.select'),
  ('profiles.update');

-- public.app_roles

insert into public.app_roles (name)
values ('Admin');

-- public.app_permissions_app_roles

insert into public.app_permissions_app_roles (app_role_id, app_permission_id)
select ar.id, ap.id
from public.app_roles ar
cross join public.app_permissions ap
where ar.name = 'Admin'
and ap.slug in (
  'app_permissions_app_roles.delete',
  'app_permissions_app_roles.insert',
  'app_permissions_app_roles.select',
  'app_permissions_app_roles.update',
  'app_roles.delete',
  'app_roles.insert',
  'app_roles.select',
  'app_roles.update',
  'app_roles_users.delete',
  'app_roles_users.insert',
  'app_roles_users.select',
  'app_roles_users.update',
  'profiles.select',
  'profiles.update'
);
