with
  config as (
    select
      'postgres' as db_name,
      array[
        'public',
        'anon',
        'authenticated',
        'supabase_auth_admin',
        'supabase_admin',
        'service_role',
        'postgres'
      ] as roles_to_check,
      array['supabase_admin'] as roles_to_keep,
      array['CONNECT', 'CREATE', 'TEMPORARY'] as privileges_to_keep
  ),
  db_info as (
    select
      d.datname,
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
      db.datname as database_name,
      db.owner_role as database_owner,
      has_database_privilege(
        role_name,
        db.datname,
        'CONNECT'
      ) as has_connect_effective,
      has_database_privilege(
        role_name,
        db.datname,
        'CREATE'
      ) as has_create_effective,
      has_database_privilege(
        role_name,
        db.datname,
        'TEMPORARY'
      ) as has_temp_effective
    from
      config as c
      cross join unnest(c.roles_to_check) as role_name
      cross join db_info as db
  )
select
  cs.role_name,
  cs.database_name,
  cs.database_owner,
  case
    when cs.has_connect_effective then 'CONNECT'
  end as connect_priv,
  case
    when cs.has_create_effective then 'CREATE'
  end as create_priv,
  case
    when cs.has_temp_effective then 'TEMPORARY'
  end as temp_priv,
  case
    when cs.role_name = any (
      c.roles_to_keep
    ) then 'Should keep: ' || array_to_string(c.privileges_to_keep, ', ')
    when cs.role_name != all (c.roles_to_keep)
    and (
      cs.has_connect_effective
      or cs.has_create_effective
      or cs.has_temp_effective
    ) then '❌ Should revoke all'
    else '✓ No change needed'
  end as desired_action
from
  current_state as cs
  cross join config as c
order by cs.role_name;
