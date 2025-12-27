-- public

alter default privileges
for role postgres
in schema public
revoke all on tables from anon, authenticated;

-- shared

create schema if not exists shared;

grant usage on schema shared to anon, authenticated, service_role;

alter default privileges
for role postgres
in schema shared
grant all on routines to service_role;

alter default privileges
for role postgres
in schema shared
grant all on sequences to service_role;

alter default privileges
for role postgres
in schema shared
grant all on tables to service_role;
