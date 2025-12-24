with
  config as (
    select
      'public' as schema_name,
      'my_sequence' as sequence_name,
      array[
        'public',
        'anon',
        'authenticated',
        'supabase_auth_admin'
      ] as roles_to_check,
      array['supabase_auth_admin'] as roles_to_keep,
      array['USAGE', 'SELECT', 'UPDATE'] as privileges_to_keep
  ),
  sequence_info as (
    select
      s.oid,
      s.relname as sequence_name,
      s.relacl,
      s.relowner,
      r.rolname as owner_role
    from
      pg_class as s
      join pg_namespace as n on n.oid = s.relnamespace
      join pg_roles as r on r.oid = s.relowner
      cross join config as c
    where
      n.nspname = c.schema_name
      and s.relname = c.sequence_name
      and s.relkind = 'S'
  ),
  current_state as (
    select
      role_name,
      seq.sequence_name,
      seq.owner_role as sequence_owner,
      has_table_privilege(role_name, seq.oid, 'USAGE') as has_usage_effective,
      has_table_privilege(role_name, seq.oid, 'SELECT') as has_select_effective,
      has_table_privilege(role_name, seq.oid, 'UPDATE') as has_update_effective,
      exists (
        select
          1
        from aclexplode(seq.relacl) as acl
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
        from aclexplode(seq.relacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else role_name::regrole::oid
          end
          and acl.privilege_type = 'SELECT'
      ) as has_select_direct,
      exists (
        select
          1
        from aclexplode(seq.relacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else role_name::regrole::oid
          end
          and acl.privilege_type = 'UPDATE'
      ) as has_update_direct
    from
      config as c
      cross join unnest(c.roles_to_check) as role_name
      cross join sequence_info as seq
  )
select
  cs.role_name,
  cs.sequence_name,
  cs.sequence_owner,
  case
    when cs.has_usage_effective then 'USAGE' || case
      when not cs.has_usage_direct then ' (inherited)'
      else ' (direct)'
    end
  end as usage_priv,
  case
    when cs.has_select_effective then 'SELECT' || case
      when not cs.has_select_direct then ' (inherited)'
      else ' (direct)'
    end
  end as select_priv,
  case
    when cs.has_update_effective then 'UPDATE' || case
      when not cs.has_update_direct then ' (inherited)'
      else ' (direct)'
    end
  end as update_priv,
  case
    when cs.role_name = any (
      c.roles_to_keep
    ) then 'Should keep: ' || array_to_string(c.privileges_to_keep, ', ')
    when cs.role_name != all (c.roles_to_keep)
    and (
      cs.has_usage_effective
      or cs.has_select_effective
      or cs.has_update_effective
    ) then '❌ Should revoke all'
    else '✓ No change needed'
  end as desired_action
from
  current_state as cs
  cross join config as c
order by cs.role_name;
