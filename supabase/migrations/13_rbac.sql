--
-- Tables
--

-- shared.app_permissions

create table shared.app_permissions (
  id uuid primary key default gen_random_uuid(),
  slug shared.slug not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz null
);

comment on table shared.app_permissions is
  'profiles.select, profiles.update, etc.';

alter table shared.app_permissions enable row level security;

-- shared.app_roles

create table shared.app_roles (
  id uuid primary key default gen_random_uuid(),
  slug shared.slug not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz null
);

comment on table shared.app_roles is 'admin, etc.';

alter table shared.app_roles enable row level security;

-- shared.app_permissions_app_roles

create table shared.app_permissions_app_roles (
  app_permission_id uuid not null references shared.app_permissions (id),
  app_role_id uuid not null references shared.app_roles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz null,
  primary key (app_role_id, app_permission_id)
);

comment on table shared.app_permissions_app_roles is 'Join table.';

alter table shared.app_permissions_app_roles enable row level security;

-- public.app_roles_users

create table public.app_roles_users (
  user_id uuid primary key references auth.users (id),
  app_role_id uuid not null references shared.app_roles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz null
);

comment on table public.app_roles_users is 'Join table.';

alter table public.app_roles_users enable row level security;

-- public.audit_logs

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  new_record jsonb null,
  old_record jsonb null,
  operation text not null check (operation in ('INSERT', 'UPDATE', 'DELETE')),
  schema_name text not null,
  table_name text not null,
  user_id uuid null references auth.users (id),
  created_at timestamptz not null default now()
);

comment on table public.audit_logs is 'Audit logs.';

alter table public.audit_logs enable row level security;

--
-- Indexes
--

-- public.audit_logs

create index on public.audit_logs (user_id);

create index on public.audit_logs (created_at desc);

--
-- Functions
--

-- security definer

create or replace function public.insert_audit_log()
returns trigger
language plpgsql
security definer
set search_path = ''
volatile
as $$
begin
  insert into public.audit_logs (
    new_record,
    old_record,
    operation,
    schema_name,
    table_name,
    user_id
  ) values (
    case when TG_OP = 'DELETE' then null else to_jsonb(new) end,
    case when TG_OP = 'INSERT' then null else to_jsonb(old) end,
    TG_OP,
    TG_TABLE_SCHEMA,
    TG_TABLE_NAME,
    auth.uid()
  );

  if TG_OP = 'DELETE' then
    return old;
  else
    return new;
  end if;
end;
$$;

revoke all on routine public.insert_audit_log from public, anon, authenticated;

create or replace function public.is_authorized(
  _app_permissions_slug shared.slug
)
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
      from shared.app_permissions_app_roles apar
      join shared.app_permissions ap on apar.app_permission_id = ap.id
      where apar.app_role_id = _app_role_id and ap.slug = _app_permissions_slug
    );
  end;
$$;

revoke all on routine public.is_authorized from public, anon, authenticated;

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

revoke execute
on routine public.custom_access_token_hook
from public, anon, authenticated;

grant execute on routine public.custom_access_token_hook to supabase_auth_admin;

--
-- RLS policies
--

-- shared.app_permissions

grant select on table shared.app_permissions to authenticated;

create policy "Allow authenticated to select any" on shared.app_permissions
as permissive
for select
to authenticated
using (true);

-- shared.app_permissions_app_roles

grant select on table shared.app_permissions_app_roles to authenticated;

create policy "Allow authorized to select any" on shared.app_permissions_app_roles
as permissive
for select
to authenticated
using (
  (select public.is_authorized('app_permissions_app_roles.select')) is true
);

-- shared.app_roles

grant select on table shared.app_roles to authenticated;

create policy "Allow authorized to select any" on shared.app_roles
as permissive
for select
to authenticated
using ((select public.is_authorized('app_roles.select')) is true);

-- public.app_roles_users

grant select, insert, update, delete
on table public.app_roles_users
to authenticated;

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
  (select auth.uid()) != user_id
  and (select public.is_authorized('app_roles_users.insert')) is true
);

create policy "Allow authorized to update others" on public.app_roles_users
as permissive
for update
to authenticated
using ((select public.is_authorized('app_roles_users.update')) is true)
with check ((select auth.uid()) != user_id);

create policy "Allow authorized to delete others" on public.app_roles_users
as permissive
for delete
to authenticated
using (
  (select auth.uid()) != user_id
  and (select public.is_authorized('app_roles_users.delete')) is true
);

create policy "Allow supabase_auth_admin to select any" on public.app_roles_users
as permissive
for select
to supabase_auth_admin
using (true);

-- public.audit_logs

grant select on table public.audit_logs to authenticated;

create policy "Allow authorized to select any" on public.audit_logs
as permissive
for select
to authenticated
using ((select public.is_authorized('audit_logs.select')) is true);

-- public.profiles

drop policy if exists "Allow authenticated to select own" on public.profiles;

create policy "Allow authenticated to select own and authorized to select any" on public.profiles
as permissive
for select
to authenticated
using (
  (select auth.uid()) = user_id
  or (select public.is_authorized('profiles.select')) is true
);

drop policy if exists "Allow authenticated to update own" on public.profiles;

create policy "Allow authenticated to update own and authorized to update any" on public.profiles
as permissive
for update
to authenticated
using (
  (select auth.uid()) = user_id
  or (select public.is_authorized('profiles.update')) is true
)
with check (
  (select auth.uid()) = user_id
  or (select public.is_authorized('profiles.update')) is true
);

--
-- Triggers
--

-- shared.app_permissions

create or replace trigger preserve_created_at
before update on shared.app_permissions
for each row
execute function shared.preserve_created_at();

create or replace trigger update_updated_at
before update on shared.app_permissions
for each row
execute procedure extensions.moddatetime(updated_at);

-- shared.app_permissions_app_roles

create or replace trigger preserve_created_at
before update on shared.app_permissions_app_roles
for each row
execute function shared.preserve_created_at();

create or replace trigger update_updated_at
before update on shared.app_permissions_app_roles
for each row
execute procedure extensions.moddatetime(updated_at);

-- shared.app_roles

create or replace trigger preserve_created_at
before update on shared.app_roles
for each row
execute function shared.preserve_created_at();

create or replace trigger update_updated_at
before update on shared.app_roles
for each row
execute procedure extensions.moddatetime(updated_at);

-- public.app_roles_users

create or replace trigger insert_audit_log
after insert or update or delete on public.app_roles_users
for each row
execute function public.insert_audit_log();

create or replace trigger preserve_created_at
before update on public.app_roles_users
for each row
execute function shared.preserve_created_at();

create or replace trigger update_updated_at
before update on public.app_roles_users
for each row
execute procedure extensions.moddatetime(updated_at);

-- public.audit_logs

create or replace trigger preserve_record
before update or delete on public.audit_logs
for each row
execute function shared.preserve_record();

-- public.profiles

create or replace trigger insert_audit_log
after insert or update or delete on public.profiles
for each row
execute function public.insert_audit_log();

--
-- Crons
--

select
  cron.schedule(
    'delete-old-audit-logs',
    '0 0 * * *', -- every midnight / 12:00 AM UTC
    $$
    delete from public.audit_logs
    where created_at < now() - interval '7 days';
  $$
  );

--
-- Seed
--

-- shared.app_permissions

insert into shared.app_permissions (slug)
values
  ('app_permissions.select'),
  ('app_permissions_app_roles.select'),
  ('app_roles.select'),
  ('app_roles_users.select'),
  ('app_roles_users.insert'),
  ('app_roles_users.update'),
  ('app_roles_users.delete'),
  ('audit_logs.select'),
  ('profiles.select'),
  ('profiles.update');

-- shared.app_roles

insert into shared.app_roles (slug)
values ('admin');

-- shared.app_permissions_app_roles

insert into shared.app_permissions_app_roles (app_role_id, app_permission_id)
select ar.id, ap.id
from
  shared.app_roles as ar
  cross join shared.app_permissions as ap
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
    'audit_logs.select',
    'profiles.select',
    'profiles.update'
  );
