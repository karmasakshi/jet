with
  config as (
    select
      array[
        'public',
        'anon',
        'authenticated',
        'supabase_auth_admin',
        'supabase_admin',
        'service_role',
        'postgres'
      ] as roles_to_check
  ),
  extension_info as (
    select
      e.oid,
      e.extname as extension_name,
      r.rolname as owner_role
    from
      pg_extension as e
      join pg_roles as r on r.oid = e.extowner
  ),
  current_state as (
    select
      role_name,
      e.extension_name,
      e.owner_role as extension_owner,
      role_name = e.owner_role as is_owner
    from
      config as c
      cross join unnest(c.roles_to_check) as role_name
      cross join extension_info as e
  )
select
  cs.role_name,
  cs.extension_name,
  cs.extension_owner,
  case
    when cs.is_owner then 'OWNER'
  end as "owner"
from current_state as cs
order by cs.extension_name, cs.role_name;
