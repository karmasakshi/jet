with
  config as (
    select
      'public' as schema_name,
      'my_view' as view_name,
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
  view_info as (
    select
      c.oid,
      c.relacl,
      r.rolname as owner_role
    from
      pg_class as c
      join pg_namespace as n on n.oid = c.relnamespace
      join pg_roles as r on r.oid = c.relowner
      cross join config as cfg
    where
      n.nspname = cfg.schema_name
      and c.relname = cfg.view_name
      and c.relkind = 'v'
  ),
  current_state as (
    select
      role_name,
      v.owner_role as view_owner,
      has_table_privilege(role_name, v.oid, 'SELECT') as has_select_effective,
      has_table_privilege(role_name, v.oid, 'INSERT') as has_insert_effective,
      has_table_privilege(role_name, v.oid, 'UPDATE') as has_update_effective,
      has_table_privilege(role_name, v.oid, 'DELETE') as has_delete_effective,
      has_table_privilege(
        role_name,
        v.oid,
        'TRUNCATE'
      ) as has_truncate_effective,
      has_table_privilege(
        role_name,
        v.oid,
        'REFERENCES'
      ) as has_references_effective,
      has_table_privilege(role_name, v.oid, 'TRIGGER') as has_trigger_effective,
      exists (
        select 1
        from aclexplode(v.relacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else to_regrole(role_name)
          end
          and acl.privilege_type = 'SELECT'
      ) as has_select_direct,
      exists (
        select 1
        from aclexplode(v.relacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else to_regrole(role_name)
          end
          and acl.privilege_type = 'INSERT'
      ) as has_insert_direct,
      exists (
        select 1
        from aclexplode(v.relacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else to_regrole(role_name)
          end
          and acl.privilege_type = 'UPDATE'
      ) as has_update_direct,
      exists (
        select 1
        from aclexplode(v.relacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else to_regrole(role_name)
          end
          and acl.privilege_type = 'DELETE'
      ) as has_delete_direct,
      exists (
        select 1
        from aclexplode(v.relacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else to_regrole(role_name)
          end
          and acl.privilege_type = 'TRUNCATE'
      ) as has_truncate_direct,
      exists (
        select 1
        from aclexplode(v.relacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else to_regrole(role_name)
          end
          and acl.privilege_type = 'REFERENCES'
      ) as has_references_direct,
      exists (
        select 1
        from aclexplode(v.relacl) as acl
        where
          acl.grantee = case
            when role_name = 'public' then 0
            else to_regrole(role_name)
          end
          and acl.privilege_type = 'TRIGGER'
      ) as has_trigger_direct
    from
      config as c
      cross join unnest(c.roles_to_check) as role_name
      cross join view_info as v
  )
select
  cs.role_name,
  cs.view_owner,
  case
    when cs.has_select_effective then 'SELECT' || case
      when cs.has_select_direct then ' (direct)'
      else ' (inherited)'
    end
  end as "select",
  case
    when cs.has_insert_effective then 'INSERT' || case
      when cs.has_insert_direct then ' (direct)'
      else ' (inherited)'
    end
  end as "insert",
  case
    when cs.has_update_effective then 'UPDATE' || case
      when cs.has_update_direct then ' (direct)'
      else ' (inherited)'
    end
  end as "update",
  case
    when cs.has_delete_effective then 'DELETE' || case
      when cs.has_delete_direct then ' (direct)'
      else ' (inherited)'
    end
  end as "delete",
  case
    when cs.has_truncate_effective then 'TRUNCATE' || case
      when cs.has_truncate_direct then ' (direct)'
      else ' (inherited)'
    end
  end as "truncate",
  case
    when cs.has_references_effective then 'REFERENCES' || case
      when cs.has_references_direct then ' (direct)'
      else ' (inherited)'
    end
  end as "references",
  case
    when cs.has_trigger_effective then 'TRIGGER' || case
      when cs.has_trigger_direct then ' (direct)'
      else ' (inherited)'
    end
  end as "trigger"
from current_state as cs
order by cs.role_name;
