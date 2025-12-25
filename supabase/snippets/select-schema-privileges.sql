with
  config as (
    select
      'shared' as schema_name,
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
  schema_info as (
    select
      n.oid,
      n.nspname as schema_name,
      r.rolname as owner_role,
      n.nspacl
    from
      pg_namespace as n
      join pg_roles as r on r.oid = n.nspowner
      cross join config as c
    where n.nspname = c.schema_name
  ),
  current_state as (
    select
      role_name,
      s.schema_name,
      s.owner_role as schema_owner,
      has_schema_privilege(role_name, s.oid, 'USAGE') as has_usage_effective,
      has_schema_privilege(role_name, s.oid, 'CREATE') as has_create_effective,
      exists (
        select
          1
        from aclexplode(s.nspacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else role_name::regrole::oid
          end
          and acl.privilege_type = 'USAGE'
      ) as has_usage_direct,
      exists (
        select
          1
        from aclexplode(s.nspacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else role_name::regrole::oid
          end
          and acl.privilege_type = 'CREATE'
      ) as has_create_direct
    from
      config as c
      cross join unnest(c.roles_to_check) as role_name
      cross join schema_info as s
  )
select
  cs.role_name,
  cs.schema_name,
  cs.schema_owner,
  case
    when cs.has_usage_effective then 'USAGE' || case
      when cs.has_usage_direct then ' (direct)'
      else ' (inherited)'
    end
  end as "usage",
  case
    when cs.has_create_effective then 'CREATE' || case
      when cs.has_create_direct then ' (direct)'
      else ' (inherited)'
    end
  end as "create"
from current_state as cs
order by cs.role_name;
