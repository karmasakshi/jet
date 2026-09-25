-- profile_avatars: public select any; authenticated CRUD in own folder

create policy "profile_avatars: Allow public to select any" on storage.objects
for select
to public
using (bucket_id = 'profile_avatars');

create policy "profile_avatars: Allow authenticated to CRUD in own folder" on storage.objects
for all
to authenticated
using (bucket_id = 'profile_avatars' and (select auth.uid())::text = (storage.foldername(name))[1])
with check (
  bucket_id = 'profile_avatars'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);
