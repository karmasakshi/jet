-- public.profiles

create policy "Allow authenticated users to select their own profiles"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Allow authenticated users to update their own profiles"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- storage.objects

create policy "Allow anon, authenticated users to select all avatars"
on storage.objects
for select
to authenticated, anon
using (bucket_id = 'avatars');

create policy "Allow authenticated users to upload their own avatars"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'avatars' and (select auth.uid()) = owner_id::uuid);

create policy "Allow authenticated users to delete their own avatars"
on storage.objects
for delete
to authenticated
using (bucket_id = 'avatars' and (select auth.uid()) = owner_id::uuid);

create policy "Ensure authenticated users insert avatars in their own folder"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'avatars' and path_tokens[1]::uuid = (select auth.uid()));
