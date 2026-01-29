with
  config as (
    select
      'shared' as schema_name,
      'amount' as domain_name,
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
  domain_info as (
    select
      t.oid,
      t.typname as domain_name,
      t.typacl,
      r.rolname as owner_role
    from
      pg_type as t
      join pg_namespace as n on n.oid = t.typnamespace
      join pg_roles as r on r.oid = t.typowner
      cross join config as c
    where
      n.nspname = c.schema_name
      and t.typname = c.domain_name
      and t.typtype = 'd'
  ),
  current_state as (
    select
      role_name,
      t.owner_role as domain_owner,
      has_type_privilege(role_name, t.oid, 'USAGE') as has_usage_effective,
      exists (
        select 1
        from aclexplode(t.typacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else to_regrole(role_name)
          end
          and acl.privilege_type = 'USAGE'
      ) as has_usage_direct
    from
      config as c
      cross join unnest(c.roles_to_check) as role_name
      cross join domain_info as t
  )
select
  cs.role_name,
  cs.domain_owner,
  case
    when cs.has_usage_effective then 'USAGE' || case
      when cs.has_usage_direct then ' (direct)'
      else ' (inherited)'
    end
  end as "usage"
from current_state as cs
order by cs.role_name;
