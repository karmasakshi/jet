-- Disable pg_graphql

drop extension if exists pg_graphql;

-- Disable pg_net

drop extension if exists pg_net;

-- Enable moddatetime

create extension if not exists moddatetime with schema extensions;

-- Enable pg_jsonschema

create extension if not exists pg_jsonschema with schema extensions;
