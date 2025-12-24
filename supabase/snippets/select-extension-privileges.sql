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
      ] as roles_to_check,
      array['supabase_admin'] as roles_to_keep
  ),
  extension_info as (
    select
      e.oid,
      e.extname as extension_name,
      e.extowner,
      r.rolname as owner_role
    from
      pg_extension as e
      join pg_roles as r on r.oid = e.extowner
      cross join config as c
  ),
  current_state as (
    select
      role_name,
      e.extension_name,
      e.owner_role as extension_owner
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
    when cs.role_name = cs.extension_owner then 'Owner'
    else null
  end as privilege_status,
  case
    when cs.role_name = any (c.roles_to_keep) then 'Should keep'
    when cs.role_name != all (c.roles_to_keep)
    and cs.role_name = cs.extension_owner then '❌ Owner — consider changing'
    else '✓ No change needed'
  end as desired_action
from
  current_state as cs
  cross join config as c
order by cs.role_name;
