-- disable pg_graphql

drop extension if exists pg_graphql;

-- enable moddatetime

create extension if not exists moddatetime schema extensions;

-- enable pg_cron

create extension pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;

grant all privileges on all tables in schema cron to postgres;
