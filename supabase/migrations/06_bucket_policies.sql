-- avatars

create policy "Allow authenticated to delete in own folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (select auth.uid()::text) = (storage.foldername(name))[1]
);

create policy "Allow authenticated to insert in own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (select auth.uid()::text) = (storage.foldername(name))[1]
);

create policy "Allow public to select all"
on storage.objects
for select
to public
using (
  bucket_id = 'avatars'
);

create policy "Allow authenticated to update in own folder"
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
