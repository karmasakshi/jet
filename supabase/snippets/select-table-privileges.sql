with
  config as (
    select
      'public' as schema_name,
      'app_roles_users' as table_name,
      array[
        'public',
        'anon',
        'authenticated',
        'supabase_auth_admin'
      ] as roles_to_check,
      array['authenticated', 'supabase_auth_admin'] as roles_to_keep,
      array['SELECT'] as privileges_to_keep
  ),
  table_info as (
    select
      c.oid,
      c.relname as table_name,
      c.relacl,
      c.relowner,
      r.rolname as owner_role
    from
      pg_class as c
      join pg_namespace as n on n.oid = c.relnamespace
      join pg_roles as r on r.oid = c.relowner
      cross join config as cfg
    where
      n.nspname = cfg.schema_name
      and c.relname = cfg.table_name
      and c.relkind = 'r'
  ),
  current_state as (
    select
      role_name,
      t.table_name,
      t.owner_role,
      has_table_privilege(role_name, t.oid, 'SELECT') as has_select_effective,
      has_table_privilege(role_name, t.oid, 'INSERT') as has_insert_effective,
      has_table_privilege(role_name, t.oid, 'UPDATE') as has_update_effective,
      has_table_privilege(role_name, t.oid, 'DELETE') as has_delete_effective,
      has_table_privilege(
        role_name,
        t.oid,
        'TRUNCATE'
      ) as has_truncate_effective,
      has_table_privilege(
        role_name,
        t.oid,
        'REFERENCES'
      ) as has_references_effective,
      has_table_privilege(role_name, t.oid, 'TRIGGER') as has_trigger_effective,
      exists (
        select
          1
        from aclexplode(t.relacl) as acl
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
        from aclexplode(t.relacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else role_name::regrole::oid
          end
          and acl.privilege_type = 'INSERT'
      ) as has_insert_direct,
      exists (
        select
          1
        from aclexplode(t.relacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else role_name::regrole::oid
          end
          and acl.privilege_type = 'UPDATE'
      ) as has_update_direct,
      exists (
        select
          1
        from aclexplode(t.relacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else role_name::regrole::oid
          end
          and acl.privilege_type = 'DELETE'
      ) as has_delete_direct,
      exists (
        select
          1
        from aclexplode(t.relacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else role_name::regrole::oid
          end
          and acl.privilege_type = 'TRUNCATE'
      ) as has_truncate_direct,
      exists (
        select
          1
        from aclexplode(t.relacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else role_name::regrole::oid
          end
          and acl.privilege_type = 'REFERENCES'
      ) as has_references_direct,
      exists (
        select
          1
        from aclexplode(t.relacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else role_name::regrole::oid
          end
          and acl.privilege_type = 'TRIGGER'
      ) as has_trigger_direct
    from
      config as c
      cross join unnest(c.roles_to_check) as role_name
      cross join table_info as t
  )
select
  cs.role_name,
  cs.table_name,
  cs.owner_role as table_owner,
  case
    when cs.has_select_effective then 'SELECT' || case
      when not cs.has_select_direct then ' (inherited)'
      else ' (direct)'
    end
  end as select_priv,
  case
    when cs.has_insert_effective then 'INSERT' || case
      when not cs.has_insert_direct then ' (inherited)'
      else ' (direct)'
    end
  end as insert_priv,
  case
    when cs.has_update_effective then 'UPDATE' || case
      when not cs.has_update_direct then ' (inherited)'
      else ' (direct)'
    end
  end as update_priv,
  case
    when cs.has_delete_effective then 'DELETE' || case
      when not cs.has_delete_direct then ' (inherited)'
      else ' (direct)'
    end
  end as delete_priv,
  case
    when cs.has_truncate_effective then 'TRUNCATE' || case
      when not cs.has_truncate_direct then ' (inherited)'
      else ' (direct)'
    end
  end as truncate_priv,
  case
    when cs.has_references_effective then 'REFERENCES' || case
      when not cs.has_references_direct then ' (inherited)'
      else ' (direct)'
    end
  end as references_priv,
  case
    when cs.has_trigger_effective then 'TRIGGER' || case
      when not cs.has_trigger_direct then ' (inherited)'
      else ' (direct)'
    end
  end as trigger_priv,
  case
    when cs.role_name = any (
      c.roles_to_keep
    ) then 'Should keep: ' || array_to_string(c.privileges_to_keep, ', ')
    when cs.role_name != all (c.roles_to_keep)
    and (
      cs.has_select_effective
      or cs.has_insert_effective
      or cs.has_update_effective
      or cs.has_delete_effective
      or cs.has_truncate_effective
      or cs.has_references_effective
      or cs.has_trigger_effective
    ) then '❌ Should revoke all'
    else '✓ No change needed'
  end as desired_action
from
  current_state as cs
  cross join config as c
order by cs.role_name;
