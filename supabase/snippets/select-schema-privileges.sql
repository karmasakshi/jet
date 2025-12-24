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
      ] as roles_to_check,
      array['supabase_admin'] as roles_to_keep,
      array['USAGE', 'CREATE'] as privileges_to_keep
  ),
  schema_info as (
    select
      n.oid,
      n.nspname as schema_name,
      n.nspowner,
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
      when not cs.has_usage_direct then ' (inherited)'
      else ' (direct)'
    end
  end as usage_priv,
  case
    when cs.has_create_effective then 'CREATE' || case
      when not cs.has_create_direct then ' (inherited)'
      else ' (direct)'
    end
  end as create_priv,
  case
    when cs.role_name = any (
      c.roles_to_keep
    ) then 'Should keep: ' || array_to_string(c.privileges_to_keep, ', ')
    when cs.role_name != all (c.roles_to_keep)
    and (
      cs.has_usage_effective
      or cs.has_create_effective
    ) then '❌ Should revoke all'
    else '✓ No change needed'
  end as desired_action
from
  current_state as cs
  cross join config as c
order by cs.role_name;
