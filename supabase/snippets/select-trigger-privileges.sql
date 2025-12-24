with
  config as (
    select
      array[
        'public',
        'anon',
        'authenticated',
        'supabase_auth_admin'
      ] as roles_to_check,
      array['supabase_auth_admin'] as roles_to_keep
  ),
  trigger_info as (
    select
      et.oid,
      et.event_object_table,
      et.tgname as trigger_name,
      et.tgenabled,
      et.tgowner,
      r.rolname as owner_role
    from
      pg_event_trigger as et
      join pg_roles as r on r.oid = et.tgowner
      cross join config as c
  ),
  current_state as (
    select
      role_name,
      t.trigger_name,
      t.event_object_table,
      t.owner_role as trigger_owner,
      t.tgenabled
    from
      config as c
      cross join unnest(c.roles_to_check) as role_name
      cross join trigger_info as t
  )
select
  cs.role_name,
  cs.trigger_name,
  cs.event_object_table,
  cs.trigger_owner,
  cs.tgenabled as enabled_status,
  case
    when cs.role_name = cs.trigger_owner then 'Owner'
    else null
  end as privilege_status,
  case
    when cs.role_name = any (c.roles_to_keep) then 'Should keep'
    when cs.role_name != all (c.roles_to_keep)
    and cs.role_name = cs.trigger_owner then '❌ Owner — consider changing'
    else '✓ No change needed'
  end as desired_action
from
  current_state as cs
  cross join config as c
order by cs.role_name;
