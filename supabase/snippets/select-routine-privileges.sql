with
  config as (
    select
      'public' as schema_name,
      'custom_access_token_hook' as routine_name,
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
  routine_info as (
    select
      p.oid,
      p.proname as routine_name,
      pg_get_function_identity_arguments(p.oid) as routine_args,
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
      r.routine_name,
      r.routine_args,
      r.owner_role as routine_owner,
      has_function_privilege(
        role_name,
        r.oid,
        'EXECUTE'
      ) as has_execute_effective,
      exists (
        select
          1
        from aclexplode(r.proacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else role_name::regrole::oid
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
  cs.routine_name,
  cs.routine_args,
  cs.routine_owner,
  case
    when cs.has_execute_effective then 'EXECUTE' || case
      when cs.has_execute_direct then ' (direct)'
      else ' (inherited)'
    end
  end as "execute"
from current_state as cs
order by cs.routine_name, cs.routine_args, cs.role_name;
