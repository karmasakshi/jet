-- public.profiles

alter table public.profiles enable row level security;

create policy "Allow authenticated to select own profiles"
on public.profiles
as permissive
for select
to authenticated
using (
  (select auth.uid()) = id
);

create policy "Allow authenticated to update own profiles"
on public.profiles
as permissive
for update
to authenticated
using (
  (select auth.uid()) = id
)
with check (
  (select auth.uid()) = id
);

-- storage.objects

create policy "Allow authenticated to delete avatars in own folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (select auth.uid()::text) = (storage.foldername(name))[1]
);

create policy "Allow authenticated to insert avatars in own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (select auth.uid()::text) = (storage.foldername(name))[1]
);

create policy "Allow public to select all avatars"
on storage.objects
for select
to public
using (
  bucket_id = 'avatars'
);

create policy "Allow authenticated to update avatars in own folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (select auth.uid()::text) = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'avatars'
  and (select auth.uid()::text) = (storage.foldername(name))[1]
);
