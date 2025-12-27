--
-- public
--

-- public.profiles

alter table public.profiles enable row level security;

grant select, update on table public.profiles to authenticated;

create policy "Allow authenticated to select own" on public.profiles
as permissive
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Allow authenticated to update own" on public.profiles
as permissive
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
