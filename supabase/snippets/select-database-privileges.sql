with
  config as (
    select
      'postgres' as db_name,
      array[
        'public',
        'anon',
        'authenticated',
        'authenticator',
        'dashboard_user',
        'postgres',
        'service_role',
        'supabase_admin',
        'supabase_auth_admin',
        'supabase_functions_admin',
        'supabase_storage_admin'
      ] as roles_to_check
  ),
  db_info as (
    select
      d.datname as database_name,
      r.rolname as owner_role
    from
      pg_database as d
      join pg_roles as r on r.oid = d.datdba
      cross join config as c
    where d.datname = c.db_name
  ),
  current_state as (
    select
      role_name,
      db.owner_role as database_owner,
      has_database_privilege(
        role_name,
        db.database_name,
        'CONNECT'
      ) as has_connect,
      has_database_privilege(
        role_name,
        db.database_name,
        'CREATE'
      ) as has_create,
      has_database_privilege(
        role_name,
        db.database_name,
        'TEMPORARY'
      ) as has_temporary
    from
      config as c
      cross join unnest(c.roles_to_check) as role_name
      cross join db_info as db
  )
select
  cs.role_name,
  cs.database_owner,
  case
    when cs.has_connect then 'CONNECT'
  end as "connect",
  case
    when cs.has_create then 'CREATE'
  end as "create",
  case
    when cs.has_temporary then 'TEMPORARY'
  end as "temporary"
from current_state as cs
order by cs.role_name;
