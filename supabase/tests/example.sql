begin;

select no_plan();

select has_table('public', 'profiles', 'public.profiles exists');
select columns_are(
  'public',
  'profiles',
  array['avatar_url', 'name', 'user_id', 'username', 'created_at', 'updated_at']
);

select has_table('public', 'app_permissions_app_roles', 'public.app_permissions_app_roles exists');
select columns_are(
  'public',
  'app_permissions_app_roles',
  array['app_permission', 'app_role', 'created_at', 'updated_at']
);

select has_table('public', 'app_roles_users', 'public.app_roles_users exists');
select columns_are(
  'public',
  'app_roles_users',
  array['user_id', 'app_role', 'created_at', 'updated_at']
);

select policies_are(
  'public',
  'profiles',
  array[
    'Allow authenticated to select own and authorized to select any',
    'Allow authenticated to update own and authorized to update any'
  ]
);

select policies_are(
  'public',
  'app_permissions_app_roles',
  array['Allow authorized to select any', 'Allow supabase_auth_admin to select any']
);

select policies_are(
  'public',
  'app_roles_users',
  array['Allow authorized to select any', 'Allow supabase_auth_admin to select any']
);

select policies_are(
  'storage',
  'objects',
  array[
    'profile_avatars: Allow public to select any',
    'profile_avatars: Allow authenticated to CRUD in own folder'
  ]
);

select policy_cmd_is(
  'public',
  'profiles',
  'Allow authenticated to select own and authorized to select any',
  'SELECT',
  'Policy command is SELECT'
);
select policy_roles_are(
  'public',
  'profiles',
  'Allow authenticated to select own and authorized to select any',
  array['authenticated']
);

select policy_cmd_is(
  'public',
  'profiles',
  'Allow authenticated to update own and authorized to update any',
  'UPDATE',
  'Policy command is UPDATE'
);
select policy_roles_are(
  'public',
  'profiles',
  'Allow authenticated to update own and authorized to update any',
  array['authenticated']
);

select policy_cmd_is(
  'public',
  'app_permissions_app_roles',
  'Allow authorized to select any',
  'SELECT',
  'Policy command is SELECT'
);
select policy_roles_are(
  'public',
  'app_permissions_app_roles',
  'Allow authorized to select any',
  array['authenticated']
);

select policy_cmd_is(
  'public',
  'app_permissions_app_roles',
  'Allow supabase_auth_admin to select any',
  'SELECT',
  'Policy command is SELECT'
);
select policy_roles_are(
  'public',
  'app_permissions_app_roles',
  'Allow supabase_auth_admin to select any',
  array['supabase_auth_admin']
);

select policy_cmd_is(
  'public',
  'app_roles_users',
  'Allow authorized to select any',
  'SELECT',
  'Policy command is SELECT'
);
select policy_roles_are(
  'public',
  'app_roles_users',
  'Allow authorized to select any',
  array['authenticated']
);

select policy_cmd_is(
  'public',
  'app_roles_users',
  'Allow supabase_auth_admin to select any',
  'SELECT',
  'Policy command is SELECT'
);
select policy_roles_are(
  'public',
  'app_roles_users',
  'Allow supabase_auth_admin to select any',
  array['supabase_auth_admin']
);

select policy_cmd_is(
  'storage',
  'objects',
  'profile_avatars: Allow public to select any',
  'SELECT',
  'Policy command is SELECT'
);
select ok(
  (
    select roles = array['public']::name[]
    from pg_policies
    where
      schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'profile_avatars: Allow public to select any'
  ),
  'The avatar read policy applies to PUBLIC'
);

select policy_cmd_is(
  'storage',
  'objects',
  'profile_avatars: Allow authenticated to CRUD in own folder',
  'ALL',
  'Policy command is ALL'
);
select policy_roles_are(
  'storage',
  'objects',
  'profile_avatars: Allow authenticated to CRUD in own folder',
  array['authenticated']
);

select ok(
  (
    select count(*) = 4
    from pg_class
    where
      oid in (
        'public.profiles'::regclass,
        'public.app_permissions_app_roles'::regclass,
        'public.app_roles_users'::regclass,
        'storage.objects'::regclass
      )
      and relrowsecurity
  ),
  'Row-level security is enabled on all four policy tables'
);

select * from finish();

rollback;
