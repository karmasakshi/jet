-- public.profiles

alter table public.profiles enable row level security;

create policy "Allow authenticated to select own"
on public.profiles
as permissive
for select
to authenticated
using (
  (select auth.uid()) = id
);

create policy "Allow authenticated to update own"
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
