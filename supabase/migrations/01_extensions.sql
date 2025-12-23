-- Disable pg_graphql

drop extension if exists pg_graphql;

-- Disable pg_net

drop extension if exists pg_net;

-- Enable pg_cron

create extension if not exists pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;

grant all privileges on all tables in schema cron to postgres;

-- Enable moddatetime

create extension if not exists moddatetime with schema extensions;

-- Enable pg_jsonschema

create extension if not exists pg_jsonschema with schema extensions;
