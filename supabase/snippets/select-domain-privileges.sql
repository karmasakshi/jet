with
  config as (
    select
      'shared' as schema_name,
      'url' as domain_name,
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
      array['USAGE'] as privileges_to_keep
  ),
  domain_info as (
    select
      t.oid,
      t.typname as domain_name,
      t.typacl,
      t.typowner,
      r.rolname as owner_role
    from
      pg_type as t
      join pg_namespace as n on n.oid = t.typnamespace
      join pg_roles as r on r.oid = t.typowner
      cross join config as c
    where
      n.nspname = c.schema_name
      and t.typname = c.domain_name
      and t.typtype = 'd' -- domains only
  ),
  current_state as (
    select
      role_name,
      t.domain_name,
      t.owner_role as domain_owner,
      has_type_privilege(role_name, t.oid, 'USAGE') as has_usage_effective,
      exists (
        select
          1
        from aclexplode(t.typacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else role_name::regrole::oid
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
  cs.domain_name,
  cs.domain_owner,
  case
    when cs.has_usage_effective then 'USAGE' || case
      when not cs.has_usage_direct then ' (inherited)'
      else ' (direct)'
    end
  end as usage_priv,
  case
    when cs.role_name = any (
      c.roles_to_keep
    ) then 'Should keep: ' || array_to_string(c.privileges_to_keep, ', ')
    when cs.role_name != all (c.roles_to_keep)
    and cs.has_usage_effective then '❌ Should revoke all'
    else '✓ No change needed'
  end as desired_action
from
  current_state as cs
  cross join config as c
order by cs.role_name;
