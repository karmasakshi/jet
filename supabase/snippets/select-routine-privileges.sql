with
  config as (
    select
      'shared' as schema_name,
      'insert_profile' as routine_name,
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
  routine_info as (
    select
      p.oid,
      p.proacl,
      r.rolname as owner_role
    from
      pg_proc as p
      join pg_namespace as n on n.oid = p.pronamespace
      join pg_roles as r on r.oid = p.proowner
      cross join config as c
    where n.nspname = c.schema_name and p.proname = c.routine_name
  ),
  current_state as (
    select
      role_name,
      r.owner_role as routine_owner,
      has_function_privilege(
        role_name,
        r.oid,
        'EXECUTE'
      ) as has_execute_effective,
      exists (
        select 1
        from aclexplode(r.proacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else to_regrole(role_name)
          end
          and acl.privilege_type = 'EXECUTE'
      ) as has_execute_direct
    from
      config as c
      cross join unnest(c.roles_to_check) as role_name
      cross join routine_info as r
  )
select
  cs.role_name,
  cs.routine_owner,
  case
    when cs.has_execute_effective then 'EXECUTE' || case
      when cs.has_execute_direct then ' (direct)'
      else ' (inherited)'
    end
  end as "execute"
from current_state as cs
order by cs.role_name;
